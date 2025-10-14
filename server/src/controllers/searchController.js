// controllers/searchController.js
import Post from "../models/Post.js";
import User from "../models/User.js";

export async function search(req, res) {
  try {
    const q = req.query.q;

    if (!q) return res.json({ users: [], posts: [] });

    // 1. Search users by username/fullName
    const users = await User.find({
      $or: [
        { username: new RegExp(q, "i") },
        { fullName: new RegExp(q, "i") },
      ],
    }).select("username fullName avatar");

    // 2. Search posts by caption (using text index)
    const posts = await Post.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("user", "username avatar");

    res.json({ users, posts });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: err.message });
  }

}
