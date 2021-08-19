const Order = require("./../../models/order");

exports.updateOrder = (req, res) => {
  Order.updateOne(
    {
      _id: req.body.orderId,
      "orderStatus.type": req.body.type, // find particular orderStatus.type
    },
    {
      $set: {
        "orderStatus.$": [
          {
            type: req.body.type,
            date: new Date(),
            isCompleted: true,
          },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) return res.status(201).json({ order });
  });
};
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({ path: "user", select: "firstName lastName" })
      .populate({ path: "items.productId", select: "name" })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
