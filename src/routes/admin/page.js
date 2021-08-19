const express = require("express");
const router = express.Router();
const {
  verifyAdminMiddleware,
  requiredSignin,
  uploadAzure,
} = require("../../middlewares/index");
const { createPage, getPage } = require("../../controllers/admin/page");
const { upload } = require("../../middlewares");

router.route("/page/create").post(
  requiredSignin,
  verifyAdminMiddleware,
  uploadAzure.fields([
    // upload.fields to upload from different fields
    { name: "banners" },
    { name: "products" },
  ]),
  createPage
);
router.route("/page/:category/:type").get(getPage);

module.exports = router;
