const { Op } = require("sequelize");
const { Order, OrderItem } = require("../models");

exports.getAllOrderItem = async (req, res, next) => {
  try {
    const {
      orderId = "",
      start = "1/1/2021",
      end = "12/31/2099",
      productId = "",
    } = req.query;
    console.log(orderId);
    // if (!orderId) orderId = "";
    // if (!productId) productId = "";
    const orderItems = await OrderItem.findAll({
      where: {
        // [Op.or]: [
        productId: { [Op.like]: "%" + productId + "%" },
        orderId: { [Op.like]: "%" + orderId + "%" },
        // ],
      },
      include: {
        model: Order,
        where: { date: { [Op.between]: [start, end] } },
      },
    });
    // console.log(orderItems);
    res.status(200).json({ orderItems });
  } catch (err) {
    next(err);
  }
};
exports.getAllOrderItemByOrderId = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.createOrderItem = async (req, res, next) => {
  try {
    const { orderItems } = req.body;
    // const isProductExistInOrder = await Order.findOne({
    //   where: { orderId, productId },
    // });
    // if (isProductExistInOrder)
    //   return res.status(400).json({ message: "You have this product already" });
    for ({ productId, quantity, price } of orderItems) {
      const orderItem = await OrderItem.create(
        {
          productId,
          quantity,
          price,
          orderId: req.order.id,
        },
        { transaction: req.t }
      );
      console.log(orderItem.id);
    }
    // throw new Error();
    await req.t.commit();
    res.status(201).json({ order: req.order });
  } catch (err) {
    await req.t.rollback();
    console.log("rollback");
    next(err);
  }
};
// exports.createOrderItem = async (req, res, next) => {
//   try {
//     const { orderId, productId, quantitie, price } = req.body;
//     const isProductExistInOrder = await Order.findOne({
//       where: { orderId, productId },
//     });
//     if (isProductExistInOrder)
//       return res.status(400).json({ message: "You have this product already" });
//     const orderItem = await Order.create({
//       orderId,
//       productId,
//       quantity,
//       price,
//     });
//     res.status(200).json({ orderItem });
//   } catch (err) {
//     next(err);
//   }
// };
exports.editOrderItem = async (req, res, next) => {
  try {
    const { orderId, productId, quantity, price } = req.body;
    const isProductExistInOrder = await Order.findOne({
      where: { orderId, productId },
    });
    if (!isProductExistInOrder)
      return res.status(400).json({ message: "Bad request" });
    const orderItem = await OrderItem.update(
      { orderId, productId, quantity, price },
      { where: { orderId, productId } }
    );
    res.status(200).json({ orderItem });
  } catch (err) {
    next(err);
  }
};
exports.deleteOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await OrderItem.destroy({ where: { id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
