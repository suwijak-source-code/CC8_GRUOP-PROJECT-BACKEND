const { Op } = require("sequelize");
const { Order, OrderItem, ProductMovement } = require("../models");

exports.getAllOrderItem = async (req, res, next) => {
  try {
    const {
      orderId = "",
      start = "1/1/2021",
      end = "12/31/2099",
      productId = "",
    } = req.query;
    console.log(orderId);
    console.log(+productId);
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
      order: [["id", "desc"]],
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
      const movement = await ProductMovement.create(
        {
          type: "sales",
          quantity: -quantity,
          price,
          orderItem: orderItem.id,
          productId,
        },
        { transaction: req.t }
      );
    }
    await req.t.commit();
    res.status(201).json({ order: req.order });
  } catch (err) {
    await req.t.rollback();
    console.log("rollback");
    next(err);
  }
};
exports.editOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      editOrderItems = [],
      createOrderItems = [],
      deleteOrderItems = [],
    } = req.body;
    for ({ productId, quantity, price } of editOrderItems) {
      const orderItem = await OrderItem.findOne({
        where: { productId, orderId: id },
      });
      console.log(orderItem.id);
      const movement = await ProductMovement.update(
        {
          type: "sales",
          quantity: -quantity,
          price,
          orderItem: orderItem.id,
          productId,
        },
        { where: { productId, orderItem: orderItem.id }, transaction: req.t }
      );
      await OrderItem.update(
        { productId, quantity, price },
        { where: { productId, orderId: id }, transaction: req.t }
      );
    }
    for ({ productId, quantity, price } of createOrderItems) {
      const orderItem = await OrderItem.create(
        { productId, quantity, price, orderId: id },
        { transaction: req.t }
      );
      const movement = await ProductMovement.create(
        {
          type: "sales",
          quantity: -quantity,
          price,
          orderItem: orderItem.id,
          productId,
        },
        { transaction: req.t }
      );
    }
    for ({ productId } of deleteOrderItems) {
      const orderItem = await OrderItem.findOne({
        where: { productId, orderId: id },
      });
      const movement = await ProductMovement.destroy({
        where: { productId, OrderItem: orderItem.id },
        transaction: req.t,
      });
      await OrderItem.destroy({
        where: { productId, orderId: id },
        transaction: req.t,
      });
    }
    await req.t.commit();
    res.status(200).json({ message: "Invoice is edited" });
  } catch (err) {
    await req.t.rollback();
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
