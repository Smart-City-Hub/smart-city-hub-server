const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    author: {
      type: String,
      required: [true, "Required"],
    },
    title: {
      type: String,
      required: [true, "Required"],
    },
    summary: {
      type: String,
      required: [true, "Required"],
    },
    content: {
      type: String,
      required: [true, "Required"],
    },
    cover: {
      type: String,
      required: [false, "Required"],
    },
  },
  { timestamps: true, unique: true }
);

module.exports = mongoose.model("Post", postSchema);
