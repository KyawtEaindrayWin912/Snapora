import bcrypt from "bcrypt";
import User from "../models/User.js";
import { registerSchema, loginSchema } from "../validation/auth.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/tokens.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export async function register(req, res) {
  try {
    const { username, email, fullName, password } = registerSchema.parse(req.body);

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, fullName, passwordHash });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ accessToken, user: { id: user._id, username, email, fullName } });
  } catch (err) {
    res.status(400).json({ error: err.errors?.[0]?.message || err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ accessToken, user: { id: user._id, username: user.username, email, fullName: user.fullName } });
  } catch (err) {
    res.status(400).json({ error: err.errors?.[0]?.message || err.message });
  }
}

export async function logout(req, res) {
  res.clearCookie("refreshToken", cookieOptions).json({ message: "Logged out" });
}

export async function me(req, res) {
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No token" });

  const payload = verifyToken(token, process.env.JWT_REFRESH_SECRET);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  const accessToken = signAccessToken(payload.userId);
  res.json({ accessToken });
}

export async function updateProfile(req, res) {
  console.log("REQ.BODY:", req.body);
  console.log("REQ.FILE:", req.file);

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { fullName, bio } = req.body;

    // Handle avatar upload
    if (req.file) {
      // Delete previous avatar if exists
      if (user.avatar?.publicId) {
        await cloudinary.uploader.destroy(user.avatar.publicId);
      }

      // Wrap Cloudinary upload in a Promise (same as CreatePost)
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "snapora_avatars" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      user.avatar = { publicId: result.public_id, url: result.secure_url };
    }

    // Update fullName & bio
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error("UpdateProfile Error:", err);
    res.status(400).json({ error: err.message });
  }
}
