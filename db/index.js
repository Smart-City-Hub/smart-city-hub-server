const mongoose = require("mongoose");
const { urlDb } = require("../config/index");

mongoose.connect(urlDb);

const db = mongoose.connection;

module.exports = db;
