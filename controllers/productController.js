const {
  Product,
  ProductMovement,
  Planting,
  OrderItem,
  Farm,
  Order,
} = require("../models");
const { Op } = require("sequelize");

exports.getAllProduct = async (req, res, next) => {
  try {
    const { orderId = "", productId = "" } = req.query;
    const products = await Product.findAll({
      where: { id: { [Op.like]: "%" + productId + "%" } },
      include: {
        model: ProductMovement,
        include: [
          { model: Planting, include: Farm },
          {
            model: OrderItem,
            include: {
              model: Order,
              where: { id: { [Op.like]: "%" + orderId + "%" } },
            },
          },
        ],
      },
      order: [
        ["id", "asc"],
        [ProductMovement, "id", "desc"],
      ],
    });
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: {
        model: ProductMovement,
        include: [
          { model: Planting, include: Farm },
          { model: OrderItem, include: Order },
        ],
      },
    });
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const product = await Product.create({ name, price });
    res.status(200).json({
      product: {
        name,
        price,
      },
    });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const product = await Product.update({ name, price }, { where: { id } });
    res.status(200).json({
      product: {
        name,
        price,
      },
    });
  } catch (err) {
    next(err);
  }
};
