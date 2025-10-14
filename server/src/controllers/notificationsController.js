import { Notification } from "../models/Notification.js";

export async function createNotification({ actorId, recipientId, type, postId }) {
  try {
    const notification = await Notification.create({
      actor: actorId,
      recipient: recipientId,
      type,
      postId,
    });

    // ✅ Emit socket event to recipient
    const io = req.app.get("io");
    io.to(recipientId.toString()).emit("notification", notification);

    return notification;
  } catch (err) {
    console.error("createNotification Error:", err);
    throw err;
  }
}

export async function getNotifications(req, res) {
  try {
    const userId = req.userId; // assuming auth middleware sets req.userId

    const notifications = await Notification.find({ recipient: userId })
      .populate("actor", "username fullName avatar") // show actor info
      .populate("postId", "caption image")           // show post info if applicable
      .sort({ createdAt: -1 });                      // newest first

    res.json(notifications);
  } catch (err) {
    console.error("getNotifications Error:", err);
    res.status(500).json({ error: err.message });
  }
}

// controllers/notifications.js
export async function markAsRead(req, res) {
    try {
      const userId = req.userId; // from auth middleware
      const { id } = req.params; // notification ID
  
      // only update if the notification belongs to the logged-in user
      const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: userId },
        { readAt: new Date() },
        { new: true }
      );
  
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
  
      res.json(notification);
    } catch (err) {
      console.error("markNotificationRead Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
  