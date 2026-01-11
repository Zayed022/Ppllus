import Report from "../models/report.models.js";

export const reportEntity = async (req, res) => {
  const { entityType, entityId, reason } = req.body;

  await Report.create({
    reporter: req.user.sub,
    entityType,
    entityId,
    reason,
  });

  res.json({ message: "Report submitted" });
};
