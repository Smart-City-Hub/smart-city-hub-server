const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const { authentication } = require("../middlewares/auth");

router.get("/search", PostController.searchPost);
router.get("/all", PostController.getAllPost);
router.get("/:id", PostController.getByIDPost);

router.use(authentication);
router.get("/", PostController.getByUser);
router.post("/", uploadMiddleware.single("file"), PostController.createPost);
router.put("/", uploadMiddleware.single("file"), PostController.updatePost);
router.delete("/:id", PostController.deleteProduct);

module.exports = router;
