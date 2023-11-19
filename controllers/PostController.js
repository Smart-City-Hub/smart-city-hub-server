const Post = require("../models/Post");
const fs = require("fs");
const FuzzySearch = require("fuzzy-search");
const mongoose = require("mongoose");
const Comment = require("../models/Comment")

module.exports = {
  createPost: async (req, res) => {
    try {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);

      const { username } = req.loggedUser;
      console.log(req.loggedUser, 'logged')

      const { title, summary, content } = req.body;

      const newPost = await Post.create({
        title,
        summary,
        content,
        author: username,
        cover: newPath,
        // likes,
        // comments
      });

      res.status(201).json({
        status: "success",
        message: "Successfully create data",
        data: newPost,
      });
    } catch (error) {
      console.log(error)
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
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  getByUser: async (req, res) => {
    try {
      const { username } = req.loggedUser;

      const foundPost = await Post.find({ author: username }).select(
        "_id author title summary content cover createdAt likes comments"
      );

      res.status(200).json({
        status: "success",
        messagse: "Successfully get user",
        data: foundPost,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const foundPost = await Post.find().select(
        "_id author title summary content cover createdAt likes comments "
      );

      res.status(200).json({
        status: "success",
        messagse: "Successfully get user",
        data: foundPost,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  getByIDPost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id).select(
        "_id author title summary content cover createdAt likes comments"
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

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { username } = req.loggedUser;

      const findById = await Post.findById(id);

      if (findById.author != username) {
        return res.status(401).json("you are not the author");
      }

      const deletedPost = await Post.findByIdAndDelete(id);

      res.status(200).json({
        status: "success",
        message: "Successfully delete data",
        data: deletedPost,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  searchPost: async (req, res) => {
    try {
      const data = await Post.find({}).select(
        "_id author title summary content cover createdAt likes comments"
      );

      const searcher = new FuzzySearch(data, ["title"], {
        caseSensitive: false,
      });

      const result = searcher.search(req.query.key)

      res.status(200).json({
        status: "success",
        messagse: "Successfully get post",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  toggleLike: async (req, res) => {
    const postId = req.params.id;
    const { username } = req.loggedUser; 
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const likedIndex = post.likes.indexOf(username);
  
      if (likedIndex === -1) {
        post.likes.push(username);
        await post.save();
        res.json({ message: 'Post liked successfully' });
      } else {
        post.likes.splice(likedIndex, 1);
        await post.save();
        res.json({ message: 'Post unliked successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while toggling the like' });
    }
  },

  getLikeCount: async (req, res) => {
    const postId = req.params.id;
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const likeCount = post.likes.length;
  
      res.json({ likeCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving the like count' });
    }
  },

  addComment: async (req, res) => {
    const postId = req.params.id;
    const { username } = req.loggedUser; 
    const { text } = req.body;
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const commentId = new mongoose.Types.ObjectId().toString();
      const comment = new Comment({ commentId, text, author: username });
  
      post.comments.push(comment);
      await Promise.all([comment.save(), post.save()]);

      // await comment.save();
      // await Blog.findOneAndUpdate({_id:req.body._id}, {$push: {comment});
  
      res.json({ message: 'Comment added successfully', commentId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while adding a comment' });
    }
  },

  deleteComment: async (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { username } = req.loggedUser;
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const comment = post.comments.id(commentId);
  
      // if (!comment) {
      //   return res.status(404).json({ error: 'Comment not found' });
      // }

      const commentIndex = post.comments.findIndex(comment => comment._id.equals(commentId));

      if (commentIndex === -1) {
        return res.status(404).json({ error: 'Comment not found' });
      }
        
      if (comment.author.toString() !== username.toString()) {
        return res.status(403).json({ error: 'Unauthorized to delete this comment' });
      }
      
      // comment.remove();
      post.comments.splice(commentIndex, 1);
      await Comment.findByIdAndDelete(commentId);
      await post.save();
  
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the comment' });
    }
  },
  

  getComments: async (req, res) => {
    const postId = req.params.id;
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const comments = post.comments;
  
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving comments' });
    }
  }
};
