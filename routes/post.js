const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const { authentication } = require("../middlewares/auth");

router.get("/", PostController.searchPost);
router.get("/all", PostController.getAllPost);
router.get("/:id", PostController.getByIDPost);

router.use(authentication);
router.post("/", uploadMiddleware.single("file"), PostController.createPost);
router.put("/", uploadMiddleware.single("file"), PostController.updatePost);

module.exports = router;
