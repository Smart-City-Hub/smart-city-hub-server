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

  getByIDPost: async(req, res) => {

    try {
      const { id } = req.params

      const post = await Post.findById(id).select(
        "_id author title summary content cover createdAt")
      
      res.status(200).json({
        status: "success",
        message: "Successfully get data",
        data: post,
      });


    } catch (error) {
      
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
