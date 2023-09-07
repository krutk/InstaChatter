import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true },
    pic: {
      type: "string",
      required: true,
      default: "https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userModel);
