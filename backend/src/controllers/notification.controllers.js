import Notification from "../models/notification.models.js";
import DeviceToken from "../models/deviceToken.models.js";

export const registerDeviceToken = async (req, res) => {
  const { token, platform } = req.body;

  await DeviceToken.updateOne(
    { token },
    {
      user: req.user.sub,
      platform,
      lastActiveAt: new Date(),
    },
    { upsert: true }
  );

  res.json({ success: true });
};

export const getNotifications = async (req, res) => {
  const userId = req.user.sub;
  const { cursor, limit = 20 } = req.query;

  const query = { user: userId };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const notifications = await Notification.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit))
    .populate("actor", "username profileImage")
    .lean();

  res.json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.sub;

  await Notification.updateOne(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } }
  );

  res.json({ status: "READ" });
};

export const markAllNotificationsRead = async (req, res) => {
  const userId = req.user.sub;

  await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ status: "ALL_READ" });
};




