const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const { authentication } = require("../middlewares/auth");

router.get("/", PostController.searchPost);
router.get("/all", PostController.getAllPost);
router.get("/:id", PostController.getByIDPost);

//like and unlike
router.post("/:id/like", PostController.like);
router.post("/:id/unlike", PostController.unlike);

//comments
router.post("/:id/comments", PostController.comment);
router.get("/:id/comments", PostController.getComment )
router.delete("/:id/comments/:commentId", PostController.deleteComment)

router.use(authentication);
router.post("/", uploadMiddleware.single("file"), PostController.createPost);

module.exports = router;
