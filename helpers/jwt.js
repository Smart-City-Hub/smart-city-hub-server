const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = {
  signToken: (payload) => {
    const token = jwt.sign(payload, secretKey);
    return token;
  },
  verifyToken: (token) => {
    return jwt.verify(token, secretKey);
  },
};
