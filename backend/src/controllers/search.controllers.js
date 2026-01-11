import User from "../models/users.models.js";

export const searchUsers = async (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) return res.json([]);

  const users = await User.find(
    {
      username: { $regex: `^${q}`, $options: "i" },
      status: "ACTIVE",
    },
    {
      username: 1,
      profileImage: 1,
    }
  )
    .limit(20)
    .lean();

  res.json(users);
};
