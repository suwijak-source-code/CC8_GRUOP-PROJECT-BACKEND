const { Product } = require("../models");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
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
