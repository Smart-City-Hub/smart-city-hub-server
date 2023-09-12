const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../helpers/jwt");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const findUser = await User.findOne({ email: email });

      if (findUser) {
        return res.status(400).json("User already exist");
      }

      if (!username || !email || !password) {
        return res.status(400).json("All field required");
      }

      let hashPassword = bcrypt.hashSync(password, 8);

      const createUser = await User.create({
        username,
        email,
        password: hashPassword,
      });

      res.status(200).json({
        status: "success",
        message: "Successfully register",
        data: createUser,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json("All field required");
      }

      const findUser = await User.findOne({ email: email }).select(
        "_id username email role password"
      );
      if (!findUser) {
        return res.status(404).json("user not found");
      }

      const comparePassword = bcrypt.compareSync(password, findUser.password);
      if (comparePassword) {
        signToken(
          {
            id: findUser._id,
            role: findUser.role,
            username: findUser.username,
          },
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json({
              id: findUser._id,
              role: findUser.role,
              username: findUser.username,
            });
          }
        );
      } else {
        return res.status(400).json("wrong password");
      }

      res.status(200).json({
        status: "success",
        message: "Successfully login",
        data: token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  logout: async (req, res) => {
    res.cookie("token", "").json("ok");
  },

  getUser: async (req, res) => {
    try {
      const { token } = req.cookies;

      console.log(token.length);

      if (token.length > 0) {
        verifyToken(token, (err, info) => {
          if (err) throw err;
          res.json(info);
        });
      } else {
        return res.status(401).json("you must login");
      }

      res.json(req.cookies);
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },
};
