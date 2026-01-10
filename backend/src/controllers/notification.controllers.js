import Notification from "../models/notification.models.js";

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

