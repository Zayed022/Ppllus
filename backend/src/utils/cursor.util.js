import mongoose from "mongoose";

export const encodeCursor = (doc) => {
  return Buffer.from(
    JSON.stringify({
      id: doc._id,
      createdAt: doc.createdAt,
    })
  ).toString("base64");
};

export const decodeCursor = (cursor) => {
  if (!cursor) return null;
  return JSON.parse(Buffer.from(cursor, "base64").toString());
};

export const buildCursorQuery = (cursor) => {
  if (!cursor) return {};
  return {
    $or: [
      { createdAt: { $lt: new Date(cursor.createdAt) } },
      {
        createdAt: new Date(cursor.createdAt),
        _id: { $lt: new mongoose.Types.ObjectId(cursor.id) },
      },
    ],
  };
};
