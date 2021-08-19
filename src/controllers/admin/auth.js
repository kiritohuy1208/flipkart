const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signin = (role) => {
  return (req, res, next) => {
    try {
      const { email, password } = req.body;
      User.findOne({ email: email }).exec(async (error, user) => {
        if (error) return res.status(400).json({ error });
        if (user) {
          const isPassword = await user.authenticate(password);
          if (isPassword && user.role === role) {
            // const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{
            //     expiresIn: "7d"
            // })
            const token = jwt.sign(
              { _id: user._id, role: user.role },
              process.env.JWT_SECRET,
              { expiresIn: "1d" }
            );
            const { _id, firstName, lastName, email, role, fullName } = user;
            res.cookie("token", token, { expiresIn: "7d" });
            return res.status(200).json({
              message: "Sign in Admin successfully",
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
              message: "Invalid password or user is not authenticate to access",
            });
          }
        } else {
          return res.status(400).json({
            message: "User not found in db",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
// sign Up with admin:
exports.signup = (role) => {
  return async (req, res, next) => {
    // find user admin
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
      // if( error ) {
      //     return res.status(404).json({ message: "User not found in db" })
      // }
      // if exist user admin in db
      if (user) {
        return res.status(400).json({
          message: " User Admin already registered with this email ",
        });
      }

      const { firstName, lastName, email, password } = req.body;

      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        role: role,
      });
      _user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            message: "Failure to save to mongodb...!",
          });
        }
        if (user) {
          // const { _id, firstName, lastName, email, role, fullname } = user
          return res.status(201).json({
            message: "User Admin created successfully...!!",
            // user: {
            //     _id, firstName, lastName, email, role, fullname
            // },
          });
        }
      });
    });
  };
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout Successfully...!!",
  });
};
