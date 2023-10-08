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
    likes: [{
      type: ObjectId,
      ref: "User"
    },],
    Comments: [{
      id: {type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId},
      text: String,
      author: { type: ObjectId, ref: "User"}
    }]
  },
  { timestamps: true, unique: true }
);

module.exports = mongoose.model("Post", postSchema);
