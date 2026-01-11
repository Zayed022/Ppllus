import Mute from "../models/mute.models.js";

export const muteUser = async (req, res) => {
  await Mute.create({
    user: req.user.sub,
    mutedUser: req.params.userId,
  });

  res.json({ message: "User muted" });
};

export const unmuteUser = async (req, res) => {
  await Mute.deleteOne({
    user: req.user.sub,
    mutedUser: req.params.userId,
  });

  res.json({ message: "User unmuted" });
};
