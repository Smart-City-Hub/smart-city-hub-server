const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const { authentication } = require("../middlewares/auth");

router.get("/search", PostController.searchPost);
router.get("/all", PostController.getAllPost);
router.get("/:id", PostController.getByIDPost);

router.get('/:id/like-count', PostController.getLikeCount);

router.get('/:id/comments', PostController.getComments);

router.use(authentication);
router.get("/", PostController.getByUser);
router.post("/", uploadMiddleware.single("file"), PostController.createPost);
router.put("/", uploadMiddleware.single("file"), PostController.updatePost);
router.delete("/:id", PostController.deleteProduct);

//like
router.post("/:id/like", PostController.toggleLike);

//comments
router.post('/:id/comments', PostController.addComment);
router.delete('/:id/comments/:commentId', PostController.deleteComment);


module.exports = router;
