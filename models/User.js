const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    username: {
      type: String,
      required: [true, "Required"],
    },
    email: {
      type: String,
      required: [true, "Required"],
    },
    password: {
      type: String,
      required: [true, "Required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true, unique: true }
);

module.exports = mongoose.model("User", userSchema);
