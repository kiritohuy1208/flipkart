const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
} = require("../controllers/category");
const {
  verifyAdminMiddleware,
  requiredSignin,
  uploadAzure,
} = require("../middlewares");

router
  .route("/create")
  .post(
    requiredSignin,
    verifyAdminMiddleware,
    uploadAzure.single("categoryImage"),
    addCategory
  );
router.route("/getcategory").get(getCategories);
router
  .route("/update")
  .post(uploadAzure.array("categoryImage"), updateCategories);
router.route("/delete").post(deleteCategories);

module.exports = router;
