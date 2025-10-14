import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 20},
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    avatar: { publicId: String, url: String },
    bio: { type: String, default: "" },
    followers: [
      { type: Schema.Types.ObjectId, ref: "User" }
    ],
    following: [
      { type: Schema.Types.ObjectId, ref: "User" }
    ],
  },
  { timestamps: true }
);

UserSchema.index({ username: "text", fullName: "text" });

export default model("User", UserSchema);
