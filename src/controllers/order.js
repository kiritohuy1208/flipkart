const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Address = require("../models/address");
exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = new Order(req.body);
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          req.body.items.forEach(async (item) => {
            const product = await Product.findById({ _id: item.productId });
            product.quantity = product.quantity - item.purchasedQty;
            await product.save();
          });

          return res.status(201).json({ order });
        }
      });
    }
  });
};
// get order of customer
exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus items orderStatus")
    .populate("items.productId", "_id name productPictures")
    .sort({ createdAt: -1 })
    .lean() // convert document mongoose to  plain javascript object
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) return res.status(200).json({ orders });
    });
};
exports.getOrder = (req, res) => {
  Order.findById({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          if (address) {
            // find address which user used
            // so address is array of userAddress
            order.address = address.address.find(
              (adr) => adr._id.toString() == order.addressId.toString()
            );
            return res.status(200).json({ order });
          }
        });
      }
    });
};
