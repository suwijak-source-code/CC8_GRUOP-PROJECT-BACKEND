const { Farm, Planting } = require("../models/");

exports.getAllFarms = async (req, res, next) => {
  try {
    const farms = await Farm.findAll();
    res.status(200).json({ farms });
  } catch (err) {
    next(err);
  }
};
exports.getFarmById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findOne({ where: { id } });
    res.status(200).json({ farm });
  } catch (err) {
    next(err);
  }
};
exports.createFarm = async (req, res, next) => {
  try {
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "You are unauthorized" });
    if (!req.user) req.user = {}; // for test without user
    const { name, remark } = req.body;
    const farm = await Farm.create({
      name,
      remark,
      status: "idle",
      approvedBy: req.user.id,
    });
    res.status(200).json({ farm });
  } catch (err) {
    next(err);
  }
};
exports.editFarm = async (req, res, next) => {
  try {
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "You are unauthorized" });
    if (!req.user) req.user = {}; // for test without user
    const { id } = req.params;
    const { name, remark } = req.body;
    const farm = await Farm.update(
      { name, remark, approvedBy: req.user.id },
      { where: { id } }
    );
    res.status(200).json({ farm: { name, remark, approvedBy: req.user.id } });
  } catch (err) {
    next(err);
  }
};
exports.deleteFarm = async (req, res, next) => {
  try {
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "You are unauthorized" });
    const { id } = req.params;
    const hasFarmEverBePlanted = await Planting.findOne({
      where: { farmId: id },
    });
    if (hasFarmEverBePlanted)
      return res
        .status(400)
        .json({ message: "You cannot delete farm that has ever been planted" });
    await Farm.destroy({ where: { id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
