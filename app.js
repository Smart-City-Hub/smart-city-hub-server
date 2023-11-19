require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postRouter = require("./routes/post");

const app = express();

app.use(logger("dev"));
app.use(cors({ credentials: true, origin: "https://comforting-strudel-ba9e8c.netlify.app" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/post", postRouter);

module.exports = app;

