// src/controllers/postController.js
import Post from "../models/Post.js";
import Comment from "../models/Comment.js"; // or wherever your Comment model is
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

export async function createPost(req, res) {
  try {
    const { caption } = req.body;

    if (!req.file) return res.status(400).json({ error: "Image is required" });

    // 1️⃣ Save the uploaded file temporarily
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir); // ensure temp folder exists
    const tempPath = path.join(tempDir, req.file.originalname);
    fs.writeFileSync(tempPath, req.file.buffer);

    // 2️⃣ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "snapora_posts",
    });

    // 3️⃣ Delete the temporary file
    fs.unlinkSync(tempPath);

    // 4️⃣ Save post to DB
    const post = await Post.create({
      user: req.userId,
      caption,
      image: { publicId: result.public_id, url: result.secure_url },
    });

    console.log("New post created:", post);
    res.status(201).json(post);
  } catch (err) {
    console.error("CreatePost Error:", err);
    res.status(400).json({ error: err.message, details: err });
  }
}

export async function getFeed(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username fullName avatar")
      .populate({
        path: "comments",
        select: "text user",
        populate: { path: "user", select: "username avatar" },
        options: { lean: true },
      })
      .lean();

    const userId = req.userId?.toString(); // from your auth middleware

    const transformed = posts.map(post => ({
      ...post,
      likeCount: post.likes?.length || 0,
      likedByUser: userId ? post.likes?.some(id => id.toString() === userId) : false,
      commentCount: post.comments?.length || 0, // ✅ comment count added
    }));

    res.json(transformed);
  } catch (err) {
    console.error("getFeed Error:", err);
    res.status(500).json({ error: err.message });
  }
}



// Like / Unlike a post
export async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.userId;

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Add a comment
// export async function addComment(req, res) {
//   try {
//     const { text } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     const comment = { user: req.userId, text };
//     post.comments.push(comment);
//     await post.save();

//     await post.populate({
//       path: "comments.user",
//       select: "username avatar",
//     });

//     res.json(post.comments[post.comments.length - 1]); // return the new comment
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// Update Post (caption or replace image)
export async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // only owner can edit
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // update caption if provided
    if (req.body.caption) {
      post.caption = req.body.caption;
    }

    // replace image if provided
    if (req.file) {
      // delete old image from cloudinary
      if (post.image.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
      }
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "snapora_posts",
      });
      post.image = { publicId: uploaded.public_id, url: uploaded.secure_url };
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete Post
export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // only owner can delete
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // delete image from cloudinary
    if (post.image.publicId) {
      await cloudinary.uploader.destroy(post.image.publicId);
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get posts of a specific user (for profile page)
export async function getUserPosts(req, res) {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get single post by ID
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "user",
      "username fullName avatar"
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Example controller
export const likeAPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.userId; // ✅ use req.userId, not req.user._id

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export async function unlikeAPost(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.userId;

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "You haven’t liked this post" });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();

    res.json({
      count: post.likes.length,
      users: post.likes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function likeCount(req,res){
  try {
    const post = await Post.findById(req.params.postId).populate("likes", "username profilePic");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({ count: post.likes.length, users: post.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}