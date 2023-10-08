const Post = require("../models/Post");
const fs = require("fs");

module.exports = {
  createPost: async (req, res) => {
    try {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);

      const { username } = req.loggedUser;

      const { title, summary, content } = req.body;

      const newPost = await Post.create({
        title,
        summary,
        content,
        author: username,
        cover: newPath,
      });

      res.status(201).json({
        status: "success",
        message: "Successfully create data",
        data: newPost,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving with server" });
    }
  },

  updatePost: async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath);
      }

      const { id, title, summary, content } = req.body;
      const { username } = req.loggedUser;

      const findPost = await Post.findById(id);

      if (findPost.author != username) {
        return res.status(401).json("you are not the author");
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          title,
          summary,
          content,
          cover: newPath ? newPath : findPost.cover,
          author: username,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        status: "success",
        message: "Successfully update data",
        data: updatedPost,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getAllPost: async (req, res) => {
    try {
      const posts = await Post.find().select(
        "_id author title summary cover createdAt"
      );

      res.status(200).json({
        status: "success",
        message: "Successfully get data",
        data: posts,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  getByIDPost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id).select(
        "_id author title summary content cover createdAt"
      );

      if (!post) {
        return res.status(404).json("Post not found");
      }

      res.status(200).json({
        status: "success",
        message: "Successfully get data",
        data: post,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  searchPost: async (req, res) => {
    try {
      const data = await Post.find({
        $or: [{ title: { $regex: req.query.key, $options: "i" } }],
      });

      res.status(200).json({
        status: "success",
        messagse: "Successfully get post",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },
};
