const {
  PlantingTransaction,
  ProductMovement,
  Planting,
  sequelize,
  Farm,
} = require("../models");

exports.createTransactionOnPlantingId = async (req, res, next) => {
  try {
    const { plantingId } = req.params;
    let {
      date,
      description,
      type,
      vendorCustomerName,
      quantity,
      unit,
      amount,
      remark,
    } = req.body;
    if (type === "cost") amount = -Math.abs(amount);
    if (type === "income") amount = Math.abs(amount);
    const transaction = await PlantingTransaction.create({
      date,
      type,
      description,
      vendorCustomerName,
      quantity,
      unit,
      amount,
      remark,
      plantingId,
    });
    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
};

exports.harvest = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { plantingId } = req.params;
    const {
      date,
      description,
      vendorCustomerName,
      quantity,
      unit,
      amount,
      remark,
      productId,
      farmId,
    } = req.body;
    const transaction = await PlantingTransaction.create(
      {
        date,
        description,
        vendorCustomerName,
        quantity,
        unit,
        amount: Math.abs(amount),
        remark,
        plantingId,
        type: "income",
      },
      { transaction: t }
    );
    const movement = await ProductMovement.create(
      {
        type: "add",
        quantity: Math.abs(quantity),
        price: Math.abs(amount),
        plantingId,
        productId,
      },
      { transaction: t }
    );
    const planting = await Planting.update(
      { status: "finished" },
      { where: { id: plantingId }, transaction: t }
    );
    const farm = await Farm.update(
      { status: "idle" },
      { where: { id: farmId } }
    );

    t.commit();
    res.status(201).json({ message: "harvest success" });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
