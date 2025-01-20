import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
  },
  { timestamps: true, collection: "user" }
);

export const User = mongoose.model("User", userSchema);
