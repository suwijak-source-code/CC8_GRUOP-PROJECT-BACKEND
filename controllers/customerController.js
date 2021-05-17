const { Customer, CustomerAddress } = require("../models");

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      include: { model: CustomerAddress, where: { main: 1 } },
    });
    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
};
