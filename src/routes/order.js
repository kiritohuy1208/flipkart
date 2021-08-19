const express = require("express");
const router = express.Router();
const { addOrder, getOrders, getOrder } = require("../controllers/order");
const { verifyUserMiddleware, requiredSignin } = require("../middlewares");

router.route("/addOrder").post(requiredSignin, verifyUserMiddleware, addOrder);
router.route("/getOrders").get(requiredSignin, verifyUserMiddleware, getOrders);
router.route("/getOrder").post(requiredSignin, verifyUserMiddleware, getOrder);

module.exports = router;
