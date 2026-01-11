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
  const notifications = await Notification.find({
    user: req.user.sub,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user.sub, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ success: true });
};

