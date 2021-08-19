const express = require("express");
const router = express.Router();
const {
  requiredSignin,
  verifyAdminMiddleware,
} = require("../../middlewares/index");
const {
  updateOrder,
  getCustomerOrders,
} = require("../../controllers/admin/order.admin");

router
  .route("/order/update")
  .post(requiredSignin, verifyAdminMiddleware, updateOrder);
router
  .route("/order/getCustomerOrders")
  .get(requiredSignin, verifyAdminMiddleware, getCustomerOrders);
module.exports = router;
