import User from "../models/User.js";

export async function followUser (req, res) {
    try {
      const { id } = req.params; // user to follow
      const meId = req.userId;
  
      if (id === meId) return res.status(400).json({ error: "Cannot follow yourself" });
  
      const userToFollow = await User.findById(id);
      const me = await User.findById(meId);
  
      if (!userToFollow || !me) return res.status(404).json({ error: "User not found" });
  
      // Avoid duplicates
      if (!userToFollow.followers.includes(meId)) {
        userToFollow.followers.push(meId);
        await userToFollow.save();
      }
  
      if (!me.following.includes(id)) {
        me.following.push(id);
        await me.save();
      }
  
      res.json({ message: "Followed successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export async function unfollowUser (req, res) {
    try {
      const { id } = req.params; // user to unfollow
      const meId = req.userId;
  
      if (id === meId) return res.status(400).json({ error: "Cannot unfollow yourself" });
  
      const userToUnfollow = await User.findById(id);
      const me = await User.findById(meId);
  
      if (!userToUnfollow || !me) return res.status(404).json({ error: "User not found" });
  
      userToUnfollow.followers = userToUnfollow.followers.filter(f => f.toString() !== meId);
      await userToUnfollow.save();
  
      me.following = me.following.filter(f => f.toString() !== id);
      await me.save();
  
      res.json({ message: "Unfollowed successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  import mongoose from "mongoose";
 
  
  export async function getUserById(req, res) {
    try {
      const { id } = req.params;
      console.log("👉 getUserById called with id:", id);
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("❌ Invalid ObjectId format");
        return res.status(400).json({ error: "Invalid user ID format" });
      }
  
      const user = await User.findById(id)
        .select("-password")
        .populate("followers", "username avatar")
        .populate("following", "username avatar");
  
      if (!user) {
        console.log("❌ User not found in DB");
        return res.status(404).json({ error: "User not found" });
      }
  
      console.log("✅ User found:", user.username);
      res.json(user);
    } catch (err) {
      console.error("🔥 getUserById error:", err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
  
  
  
  
  