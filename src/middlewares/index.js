const jwt = require("jsonwebtoken");
const User = require("../models/user");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
var MulterAzureStorage = require("multer-azure-storage");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
exports.upload = multer({ storage });

exports.uploadAzure = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString:
      "DefaultEndpointsProtocol=https;AccountName=doannodejs;AccountKey=XupsRCQJ/RZ977E13xL6evFUekCc5OigR0Jki7Is04a9nWpLmvpWYhQH/oDlBKX83UxXGlwMkD+HZHn5QTj5HQ==;EndpointSuffix=core.windows.net",
    containerName: "flipkartclone",
    containerSecurity: "blob",
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  }),
});

exports.requiredSignin = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      // get token from headers.authorization
      const token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, process.env.JWT_SECRET);
      try {
        var user = await User.findById(verify._id);
        req.user = user;
      } catch (err) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } else {
      return res.status(400).json({
        message: "Authorization is required",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
  // if (req.headers.authorization) {
  //     const token = req.headers.authorization.split(" ")[1];
  //     const user = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = user;
  //   } else {
  //     return res.status(400).json({ message: "Authorization required" });
  //   }
  next();
};
exports.verifyUserMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status("400").json({
      message: "Role User access denied",
    });
  }
  next();
};
exports.verifyAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    if (req.user.role !== "super-admin") {
      return res.status("400").json({
        message: "Role Admin access denied",
      });
    }
  }

  next();
};
exports.verifySuperAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "super-admin") {
    return res.status("400").json({
      message: "Role Super-Admin access denied",
    });
  }
  next();
};
