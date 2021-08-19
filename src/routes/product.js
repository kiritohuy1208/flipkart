const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductsBySlug,
  getDetailProduct,
  deleteProductById,
} = require("../controllers/product");
const {
  verifyAdminMiddleware,
  requiredSignin,
  uploadAzure,
} = require("../middlewares");

router
  .route("/product/create")
  .post(
    requiredSignin,
    verifyAdminMiddleware,
    uploadAzure.array("productPicture"),
    addProduct
  );
router
  .route("/product/getProducts")
  .get(requiredSignin, verifyAdminMiddleware, getProducts);
router.route("/products/:slug").get(getProductsBySlug);
router.route("/product/:id").get(getDetailProduct);
router
  .route("/product/deleteProductById")
  .delete(requiredSignin, verifyAdminMiddleware, deleteProductById);
module.exports = router;
