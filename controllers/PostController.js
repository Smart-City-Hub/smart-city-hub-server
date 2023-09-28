const Post = require("../models/Post");

module.exports = {
  searchPost: async (req, res) => {
    try {
      const data = await Post.find({
        $or: [
          { title: { $regex: req.query.key, $options: "i" } },
        ],
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

}