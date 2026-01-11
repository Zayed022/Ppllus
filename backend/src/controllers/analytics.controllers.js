import CreatorAnalytics from "../models/creatorAnalytics.models.js";

export const getCreatorInsights = async (req, res) => {
  const data = await CreatorAnalytics.find({
    creator: req.user.sub,
  })
    .sort({ date: -1 })
    .limit(30);

  res.json(data);
};
