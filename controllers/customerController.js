const {
  Customer,
  CustomerAddress,
  Order,
  OrderItem,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      include: [
        { model: CustomerAddress, where: { main: 1 } },
        { model: Order, include: OrderItem },
      ],
    });
    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
};
exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({
      where: { id },
      include: [
        { model: CustomerAddress },
        { model: Order, include: OrderItem },
      ],
    });
    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};
exports.createCustomer = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { fullName, VatId, address, phone, email } = req.body;
    const customer = await Customer.create(
      {
        fullName,
        VatId,
      },
      { transaction: t }
    );
    const customerAddress = await CustomerAddress.create(
      {
        address,
        phone,
        email,
        customerId: customer.id,
        main: true,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ customer });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.createNewAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { customerId, address, phone, email } = req.body;
    const newAddress = await CustomerAddress.create(
      {
        customerId,
        address,
        phone,
        email,
        main: true,
      },
      { transaction: t }
    );
    await CustomerAddress.update(
      { main: false },
      { where: { customerId, id: { [Op.not]: newAddress.id } }, transaction: t }
    );
    res.status(200).json({ newAddress });
    t.commit();
  } catch (err) {
    t.rollback();
    next(err);
  }
};

exports.editCustomer = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id, fullName, VatId, addressId } = req.body;
    await Customer.update(
      { fullName, VatId },
      { where: { id }, transaction: t }
    );
    await CustomerAddress.update(
      { main: true },
      { where: { id: addressId }, transaction: t }
    );
    await CustomerAddress.update(
      { main: false },
      { where: { customerId: id, id: { [Op.not]: addressId } }, transaction: t }
    );
    t.commit();
    res.status(200).json({ message: "customer is edited" });
  } catch (err) {
    t.rollback();
    next(err);
  }
};
