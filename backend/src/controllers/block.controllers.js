import Block from "../models/block.models.js";

export const blockUser = async (req, res) => {
  await Block.create({
    blocker: req.user.sub,
    blocked: req.params.userId,
  });

  res.json({ message: "User blocked" });
};

export const unblockUser = async (req, res) => {
  await Block.deleteOne({
    blocker: req.user.sub,
    blocked: req.params.userId,
  });

  res.json({ message: "User unblocked" });
};
