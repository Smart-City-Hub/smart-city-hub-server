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
        const token = signToken({
          id: findUser._id,
          role: findUser.role,
          email: findUser.email,
          username: findUser.username,
        });

        res.cookie("token", token).json({
          status: "success",
          message: "Successfully Login",
          data: findUser,
        });
      } else {
        return res.status(400).json("wrong password");
      }
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },

  logout: async (req, res) => {
    res.cookie("token", "").status(200).json({
      status: "success",
      messagse: "Successfully Logout",
    });
  },

  getUser: async (req, res) => {
    try {
      const { email } = req.loggedUser;

      const foundUser = await User.find({ email: email });

      res.status(200).json({
        status: "success",
        messagse: "Successfully get user",
        data: foundUser,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving with server." });
    }
  },
};
