import { verifyToken } from "../utils/tokens.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token, process.env.JWT_ACCESS_SECRET);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  req.userId = payload.userId;
  next();
}
