import jwt from "jsonwebtoken";

export function signAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}
