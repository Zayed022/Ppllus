import Report from "../models/report.models.js";
import Reel from "../models/reel.models.js";

export const processReports = async () => {
  const reports = await Report.find()
    .sort({ createdAt: 1 })
    .limit(100);

  for (const report of reports) {
    if (report.entityType === "REEL") {
      await Reel.findByIdAndUpdate(report.entityId, {
        "moderation.status": "UNDER_REVIEW",
      });
    }
  }
};
