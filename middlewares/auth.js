const { verifyToken } = require("../helpers/jwt");
const User = require("../models/User.js");

module.exports = {
  authentication: async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthenticated please login." });
      }

      

      const data = verifyToken(token || authorization);

      const { email } = data;

      const foundUser = await User.findOne({ email: email });

      if (!foundUser) {
        return res.status(404).json({ message: "User not found." });
      } else {
        req.loggedUser = {
          _id: foundUser._id,
          email: foundUser.email,
          username: foundUser.username,
          role: foundUser.role,
        };
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving server." });
    }
  },
};
