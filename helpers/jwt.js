const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = {
  signToken: (payload, token) => {
    return jwt.sign(payload, secretKey, token);
  },
  verifyToken: (token, info) => {
    return jwt.verify(token, secretKey, info);
  },
};
