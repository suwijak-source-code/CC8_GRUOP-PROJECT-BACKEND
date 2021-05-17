const { Op } = require("sequelize");
const {
  Order,
  OrderItem,
  Product,
  Customer,
  CustomerAddress,
  sequelize,
} = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: {
          model: Product,
        },
      },
      order: [["id", "desc"]],
    });
    // for (order of orders) {
    //   order.total = order.OrderItems.reduce((acc, orderItem, index) => {
    //     acc += orderItem.price * orderItem.quantity;
    //     return acc;
    //   }, 0);
    // }
    // console.log(orders[0].total);
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          include: {
            model: Product,
          },
        },
        {
          model: Customer,
          include: {
            model: CustomerAddress,
            where: { main: true },
          },
        },
      ],
    });
    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};
exports.createOrder = async (req, res, next) => {
  req.t = await sequelize.transaction();
  try {
    const { invNo, customerId, date, name, address, phone } = req.body;
    const isInvNoExist = await Order.findOne({ where: { invNo } });
    if (isInvNoExist)
      return res
        .status(400)
        .json({ message: "This Invoce No. has already used." });
    const order = await Order.create(
      {
        invNo,
        customerId,
        date,
        name,
        address,
        phone,
        status: "waiting for payment",
      },
      { transaction: req.t }
    );
    req.order = order;
    // req.order = order; //for create orderitems in OrderItemController
    // next(); //for create orderitems in OrderItemController
    // res.status(201).json({ order });
    next();
  } catch (err) {
    await req.t.rollback();
    next(err);
  }
};
exports.editOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { invNo, customerId, date, name, address, phone, status } = req.body;
    const isInvNoExist = await Order.findOne({ where: { invNo } });
    console.log(isInvNoExist.id);
    if (isInvNoExist.id !== +id && isInvNoExist)
      return res
        .status(400)
        .json({ message: "This Invoce No. has already used." });
    const order = await Order.update(
      {
        invNo,
        customerId,
        date,
        name,
        address,
        phone,
        status,
      },
      { where: { id } }
    );
    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isInvExist = Order.findOne({ where: { id } });
    if (!isInvExist)
      return res.status(400).json({ message: "this invoice is not exist" });
    isInvExist.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
