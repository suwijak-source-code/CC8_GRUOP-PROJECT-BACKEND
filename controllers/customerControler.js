const { Customer, sequelize } = require("../models");
require("dotenv").config();

const addCustomer = async (req, res, next) => {
  try {
    const { fullname } = req.body;
    const newCustomer = await Customer.create({
      fullname,
    });
    res.status(201).json({ message: "Add Customer completed.", newCustomer });
  } catch (err) {
    next(err);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const allCustomer = await Customer.findAll();
    res.status(200).json({ message: "Customer", allCustomer });
  } catch (err) {
    next(err);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { fullname } = req.body;
    await Customer.update({ fullname }, { where: { id: req.customer.id } });
    res.status(200).json({ message: "Your customer has updated." });
  } catch (err) {
    next(err);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ where: { id } });
    if (!customer) {
      return res.status(400).json({ message: "cannot found customer" });
    }
    await customer.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

module.exports = { addCustomer, getCustomer, updateCustomer, deleteCustomer };
