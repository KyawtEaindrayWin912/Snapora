import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.userId;

    if (!text) return res.status(400).json({ message: "Comment text required" });

    const comment = await Comment.create({
      user: userId,
      post: postId,
      text,
    });

    // Push comment into Post.comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    const populatedComment = await comment.populate("user", "username avatar");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
