import jwt from "jsonwebtoken";

export const authMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = payload.sub;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
