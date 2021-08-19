const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
//   const generateJwtToken = (_id, role) => {
//     return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//   };
exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(password);
      if (isPassword) {
        // const token = generateJwtToken(user._id, user.role);
        const token = generateJwtToken(user._id);
        res.cookie("token", token, { expiresIn: "1d" });
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(200).json({
          message: "Sign in successfully",
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
          token,
        });
      } else {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({
        message: "User not found in db",
      });
    }
  });
};
exports.signup = async (req, res, next) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      console.log(error);
    }
    if (user)
      return res.status(400).json({
        error: "User already registered",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });
    _user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Somethinng went wrong",
        });
      }
      if (user) {
        const token = generateJwtToken(user._id);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};
exports.signout = (req, res) => {
  // req.user = null
  res.clearCookie("token");

  res.status(200).json({
    message: "Signout Successfully...!!",
  });
};
