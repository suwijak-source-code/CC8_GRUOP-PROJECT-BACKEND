const { Seed, Planting } = require("../models");

exports.getAllSeed = async (req, res, next) => {
  try {
    const seeds = await Seed.findAll();
    res.status(200).json({ seeds });
  } catch (err) {
    next(err);
  }
};
exports.getSeedById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seed = await Seed.findOne({ where: { id } });
    res.status(200).json({ seed });
  } catch (err) {
    next(err);
  }
};
exports.createSeed = async (req, res, next) => {
  try {
    // if (!req.user) req.user = {}; // for test without user, remove when merge
    const { name, cost, remark } = req.body;
    if (!name && !name.trim())
      return res.status(400).json({ message: "name is required" });
    if (!+cost || +cost < 0)
      return res
        .status(400)
        .json({ message: "cost must be numeric and not less than zero" });
    const seed = await Seed.create({
      name,
      cost,
      remark,
      approvedBy: req.user.id,
    });
    res.status(200).json({ seed });
  } catch (err) {
    next(err);
  }
};
exports.editSeed = async (req, res, next) => {
  try {
    // if (!req.user) req.user = {}; // for test without user, remove when merge
    const { id } = req.params;
    const { name, cost, remark } = req.body;
    if (!name && !name.trim())
      return res.status(400).json({ message: "name is required" });
    if (!+cost || +cost < 0)
      return res
        .status(400)
        .json({ message: "cost must be numeric and not less than zero" });
    const seed = await Seed.update(
      {
        name,
        cost,
        remark,
        approvedBy: req.user.id,
      },
      { where: { id } }
    );
    res.status(200).json({
      seed: {
        name,
        cost,
        remark,
        approvedBy: req.user.id,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteSeed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hasSeedEverBeUsed = await Planting.findOne({
      where: { seedId: id },
    });
    if (hasSeedEverBeUsed)
      return res
        .status(400)
        .json({ message: "You cannot delete seed that has ever been used" });
    await Seed.destroy({ where: { id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
