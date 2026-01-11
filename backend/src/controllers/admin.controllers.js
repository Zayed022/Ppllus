import Report from "../models/report.models.js";
import Reel from "../models/reel.models.js";

export const getPendingReports = async (req, res) => {
  const reports = await Report.find()
    .populate("reporter", "username")
    .limit(50);

  res.json(reports);
};

export const moderateReel = async (req, res) => {
  const { reelId, action, reason } = req.body;

  await Reel.findByIdAndUpdate(reelId, {
    "moderation.status": action,
    "moderation.reason": reason,
    "moderation.reviewedAt": new Date(),
    "moderation.reviewedBy": req.user.sub,
  });

  res.json({ message: "Moderation applied" });
};
