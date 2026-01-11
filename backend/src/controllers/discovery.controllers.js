import Follow from "../models/follow.models.js";
import User from "../models/users.models.js";

export const getSuggestedUsers = async (req, res) => {
  const userId = req.user.sub;

  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const followingIds = following.map(f => f.following);

  const suggestions = await Follow.aggregate([
    { $match: { follower: { $in: followingIds } } },
    { $group: { _id: "$following", score: { $sum: 1 } } },
    { $sort: { score: -1 } },
    { $limit: 20 },
  ]);

  const ids = suggestions.map(s => s._id);

  const users = await User.find(
    {
      _id: { $in: ids },
      status: "ACTIVE",
    },
    { username: 1, profileImage: 1 }
  ).lean();

  res.json(users);
};
