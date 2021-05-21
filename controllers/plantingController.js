const {
  User,
  sequelize,
  Farm,
  Seed,
  Customer,
  Planting,
  PlantingTransaction,
} = require("../models");
const moment = require("moment");
const cron = require("node-cron");
const { Op } = require("sequelize");

cron.schedule("0 0 * * *", async function () {
  try {
    const currentTime = moment().format("YYYY-MM-DD");
    const harvested = await Planting.findAll({
      where: {
        [Op.and]: [
          { harvestDate: currentTime },
          {
            status: {
              [Op.ne]: ["cancel"],
            },
          },
        ],
      },
    });
    harvested.map(
      async (item) =>
        await Planting.update(
          {
            status: "harvested",
            assignStatus: "notAssign",
          },
          { where: { id: item.id } }
        )
    );
    console.log("test schedule");
  } catch (err) {
    next(err);
  }
});

exports.getPlantingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const planting = await Planting.findOne({
      where: { id },
      include: [
        Farm,
        Seed,
        Customer,
        { model: User, as: "PlantingApproved" },
        { model: User, as: "PlantingCanceler" },
        PlantingTransaction,
      ],
    });
    res.status(200).json({ planting });
  } catch (err) {
    next(err);
  }
};

exports.getPlanting = async (req, res, next) => {
  try {
    const { status } = req.params;
    let planting;
    if (status === "all") {
      planting = await Planting.findAll({
        include: [
          {
            model: Farm,
            attributes: ["id", "name"],
          },
          {
            model: Seed,
            attributes: ["id", "name"],
          },
          {
            model: Customer,
            attributes: ["id", "fullName"],
          },
          {
            model: User,
            as: "PlantingApproved",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: User,
            as: "PlantingCanceler",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
    } else {
      planting = await Planting.findAll({
        where: { status },
        include: [
          {
            model: Farm,
            attributes: ["id", "name"],
          },
          {
            model: Seed,
            attributes: ["id", "name"],
          },
          {
            model: Customer,
            attributes: ["id", "fullName"],
          },
          {
            model: User,
            as: "PlantingApproved",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: User,
            as: "PlantingCanceler",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
    }
    res.status(200).json({ planting });
  } catch (err) {
    next(err);
  }
};

exports.searchPlanting = async (req, res, next) => {
  try {
    const { search } = req.query;
    const planting = await Planting.findAll({
      include: [
        {
          model: Farm,
          where: { name: search },
          attributes: ["id", "name"],
        },
        {
          model: Seed,
          attributes: ["id", "name"],
        },
        {
          model: Customer,
          attributes: ["id", "fullName"],
        },
        {
          model: User,
          as: "PlantingApproved",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: User,
          as: "PlantingCanceler",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    res.status(200).json({ planting });
  } catch (err) {
    next(err);
  }
};

exports.getWorkPlanting = async (req, res, next) => {
  try {
    const { status } = req.params;
    const date = moment().format("YYYY-MM-DD");
    let planting;
    if (status === "all") {
      planting = await Planting.findAll({
        where: {
          [Op.and]: [
            {
              status: {
                [Op.or]: ["started", "harvested", "finished"],
              },
            },
            {
              [Op.or]: [{ startDate: date }, { harvestDate: date }],
            },
          ],
        },
        include: [
          {
            model: Farm,
            attributes: ["id", "name"],
          },
          {
            model: Seed,
            attributes: ["id", "name"],
          },
          {
            model: Customer,
            attributes: ["id", "fullName"],
          },
          {
            model: User,
            as: "PlantingApproved",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: User,
            as: "PlantingCanceler",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
    } else {
      planting = await Planting.findAll({
        where: {
          [Op.and]: [
            {
              status: {
                [Op.or]: ["started", "harvested", "finished"],
              },
            },
            {
              [Op.or]: [{ startDate: date }, { harvestDate: date }],
            },
            {
              assignStatus: status,
            },
          ],
        },
        include: [
          {
            model: Farm,
            attributes: ["id", "name"],
          },
          {
            model: Seed,
            attributes: ["id", "name"],
          },
          {
            model: Customer,
            attributes: ["id", "fullName"],
          },
          {
            model: User,
            as: "PlantingApproved",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: User,
            as: "PlantingCanceler",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
    }
    res.status(200).json({ planting });
  } catch (err) {
    next(err);
  }
};

exports.createPlanting = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const {
      farmName,
      seedName,
      startDate,
      status,
      customerName,
      plantingRemark,
      plantedAmount,
      plantingApprovedFName,
      plantingApprovedLName,
      fertilizerPrice,
      maintenanceCost,
      miscellaneousExpenses,
    } = req.body;
    if (fertilizerPrice === undefined)
      return res.status(400).json({ message: "Fertilizer price is required." });
    if (isNaN(+fertilizerPrice) || fertilizerPrice === null)
      return res
        .status(400)
        .json({ message: "Fertilizer price must be a number." });
    if (maintenanceCost === undefined)
      return res.status(400).json({ message: "Maintenance cost is required." });
    if (isNaN(+maintenanceCost) || maintenanceCost === null)
      return res
        .status(400)
        .json({ message: "Maintenance cost must be a number." });
    if (miscellaneousExpenses === undefined)
      return res
        .status(400)
        .json({ message: "Miscellaneous expenses is required." });
    if (isNaN(+miscellaneousExpenses) || miscellaneousExpenses === null)
      return res
        .status(400)
        .json({ message: "Miscellaneous expenses must be a number." });
    if (farmName === undefined)
      return res.status(400).json({ message: "Farm name is required." });
    const farm = await Farm.findOne({ where: { name: farmName } });
    if (!farm) return res.status(400).json({ message: "Farm name not found." });
    if (seedName === undefined)
      return res.status(400).json({ message: "Seed name is required." });
    const seed = await Seed.findOne({ where: { name: seedName } });
    if (!seed) return res.status(400).json({ message: "Seed name not found." });
    if (startDate === undefined)
      return res.status(400).json({ message: "Start date is required." });
    let customer;
    if (customerName) {
      customer = await Customer.findOne({ where: { fullName: customerName } });
      if (!customer)
        return res.status(400).json({ message: "Customer not found." });
      customer = customer.id;
    }
    if (plantingApprovedFName === undefined)
      return res
        .status(400)
        .json({ message: "First name of approver is required." });
    if (plantingApprovedLName === undefined)
      return res
        .status(400)
        .json({ message: "Last name of approver is required." });
    const plantingApproved = await User.findOne({
      where: {
        [Op.and]: [
          { firstName: plantingApprovedFName },
          { lastName: plantingApprovedLName },
        ],
      },
    });
    if (!plantingApproved)
      return res.status(400).json({ message: "Approve name not found." });
    if (status === undefined)
      return res.status(400).json({ message: "Status date is required." });
    if (
      status !== "started" &&
      status !== "harvested" &&
      status !== "finished" &&
      status !== "cancel"
    )
      return res.status(400).json({ message: "Status not found." });
    let date = moment(startDate, "YYYY/MM/DD");
    const harvestDate = moment(date).add(seed.plantingTime, "days");
    if (plantedAmount === undefined)
      return res.status(400).json({ message: "Planted amount is required." });
    if (isNaN(+plantedAmount) || plantedAmount === null)
      return res
        .status(400)
        .json({ message: "Planted amount must be a number." });
    const planting = await Planting.create(
      {
        farmId: farm.id,
        seedId: seed.id,
        startDate,
        status,
        reservedCustomer: customer,
        remark: plantingRemark,
        plantingApprovedBy: plantingApproved.id,
        harvestDate,
        plantedAmount,
        assignStatus: "notAssign",
        fertilizerPrice,
        maintenanceCost,
        miscellaneousExpenses,
      },
      { transaction: trans }
    );
    await trans.commit();
    req.planting = planting;
    next();
  } catch (err) {
    await trans.rollback();
    next(err);
  }
};

exports.startPlanting = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      farmId,
      reservedCustomer,
      seedId,
      remark,
      startDate,
      harvestDate,
      plantedAmount,
      harvertedAmount,
      plantingApprovedBy,
      fertilizerPrice,
      maintenanceCost,
      miscellaneous_expenses,
      status,
    } = req.body;
    const planting = await Planting.create(
      {
        farmId,
        reservedCustomer,
        seedId,
        remark,
        startDate,
        harvestDate,
        plantedAmount,
        harvertedAmount,
        plantingApprovedBy,
        fertilizerPrice,
        maintenanceCost,
        miscellaneous_expenses,
        status,
      },
      { transaction: t }
    );
    await Farm.update(
      { status: "active" },
      { where: { id: farmId }, transaction: t }
    );
    await t.commit();
    res.status(200).json({ message: "Start Planting" });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.editPlanting = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const { id } = req.params;
    let {
      farmName,
      seedName,
      startDate,
      customerName,
      plantingRemark,
      plantedAmount,
      plantingApprovedFName,
      plantingApprovedLName,
      fertilizerPrice,
      maintenanceCost,
      miscellaneousExpenses,
    } = req.body;
    const prePlantingEdit = await Planting.findOne({ where: { id } });
    let status;
    if (prePlantingEdit.startDate !== startDate) {
      if (prePlantingEdit.status === "harvested") {
        status = "started";
      }
    }
    let farm;
    if (seedName === undefined) {
      farm = await Planting.findOne({
        where: { id },
        attributes: ["farmId"],
      });
      farm = farm.farmId;
    } else {
      farm = await Farm.findOne({ where: { name: farmName } });
      if (!farm)
        return res.status(400).json({ message: "Farm name not found." });
      farm = farm.id;
    }
    if (startDate === undefined) {
      startDate = await Planting.findOne({
        where: { id },
        attributes: ["startDate"],
      });
      startDate = startDate.startDate;
    }
    let seed;
    let harvestDate;
    if (seedName === undefined) {
      seed = await Planting.findOne({
        where: { id },
        attributes: ["seedId"],
      });
      seed = await Seed.findOne({ where: { id: seed.seedId } });
      if (!seed)
        return res.status(400).json({ message: "Seed name not found." });
      let date = moment(startDate, "YYYY/MM/DD");
      harvestDate = moment(date).add(seed.plantingTime, "days");
      seed = seed.id;
    } else {
      seed = await Seed.findOne({ where: { name: seedName } });
      if (!seed)
        return res.status(400).json({ message: "Seed name not found." });
      let date = moment(startDate, "YYYY/MM/DD");
      harvestDate = moment(date).add(seed.plantingTime, "days");
      seed = seed.id;
    }
    let customer;
    if (customerName) {
      customer = await Customer.findOne({ where: { fullName: customerName } });
      if (!customer)
        return res.status(400).json({ message: "Customer not found." });
      customer = customer.id;
    } else {
      customer = await Planting.findOne({
        where: { id },
        attributes: ["reservedCustomer"],
      });
      customer = customer.reservedCustomer;
    }
    if (plantingApprovedFName === undefined)
      return res
        .status(400)
        .json({ message: "First name of approver is required." });
    if (plantingApprovedLName === undefined)
      return res
        .status(400)
        .json({ message: "Last name of approver is required." });
    const plantingApproved = await User.findOne({
      where: {
        [Op.and]: [
          { firstName: plantingApprovedFName },
          { lastName: plantingApprovedLName },
        ],
      },
    });
    if (!plantingApproved)
      return res.status(400).json({ message: "Approve name not found." });
    if (plantedAmount === undefined) {
      plantedAmount = await Planting.findOne({
        where: { id },
        attributes: ["plantedAmount"],
      });
      plantedAmount = plantedAmount.plantedAmount;
    }
    if (isNaN(+plantedAmount) || plantedAmount === null)
      return res
        .status(400)
        .json({ message: "Planted amount must be a number." });
    if (fertilizerPrice === undefined) {
      fertilizerPrice = await Planting.findOne({
        where: { id },
        attributes: ["fertilizerPrice"],
      });
      fertilizerPrice = fertilizerPrice.fertilizerPrice;
    }
    if (isNaN(+fertilizerPrice) || fertilizerPrice === null)
      return res
        .status(400)
        .json({ message: "Fertilizer price must be a number." });
    if (maintenanceCost === undefined) {
      maintenanceCost = await Planting.findOne({
        where: { id },
        attributes: ["maintenanceCost"],
      });
      maintenanceCost = maintenanceCost.maintenanceCost;
    }
    if (isNaN(+maintenanceCost) || maintenanceCost === null)
      return res
        .status(400)
        .json({ message: "Maintenance cost must be a number." });
    if (miscellaneousExpenses === undefined) {
      miscellaneousExpenses = await Planting.findOne({
        where: { id },
        attributes: ["miscellaneousExpenses"],
      });
      miscellaneousExpenses = miscellaneousExpenses.miscellaneousExpenses;
    }
    if (isNaN(+miscellaneousExpenses) || miscellaneousExpenses === null)
      return res
        .status(400)
        .json({ message: "Miscellaneous expenses must be a number." });

    await Planting.update(
      {
        farmId: farm,
        seedId: seed,
        startDate,
        status,
        reservedCustomer: customer,
        remark: plantingRemark,
        plantingApprovedBy: plantingApproved.id,
        harvestDate,
        plantedAmount,
        fertilizerPrice,
        maintenanceCost,
        miscellaneousExpenses,
      },
      { where: { id } },
      { transaction: trans }
    );
    const plantingEdit = await Planting.findOne({ where: { id } });
    await trans.commit();
    req.prePlantingEdit = prePlantingEdit;
    req.plantingEdit = plantingEdit;
    next();
  } catch (err) {
    await trans.rollback();
    next(err);
  }
};

exports.updateDate = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const plantingTime = req.plantingTime;
    const cancelJob = req.cancelJob;
    if (plantingTime) {
      const { id } = req.params;
      const startDatePlanting = await Planting.findAll({
        where: {
          [Op.and]: [
            { seedId: id },
            {
              status: {
                [Op.or]: ["started", "harvested"],
              },
            },
          ],
        },
        attributes: ["startDate"],
      });
      startDatePlanting.map(async (item) => {
        let date = moment(item.startDate, "YYYY/MM/DD");
        let harvestDate = moment(date).add(plantingTime, "days");
        await Planting.update(
          {
            harvestDate,
          },
          { where: { seedId: id } },
          { transaction: trans }
        );
      });
      await trans.commit();
      res.status(200).json({ message: "Update seed successfully" });
    } else if (cancelJob) {
      if (cancelJob.mission === "gardening") {
        const datePlanting = await Planting.findOne({
          where: { id: cancelJob.plantingId },
          attributes: ["startDate", "harvestDate"],
        });
        const newStartDate = moment(datePlanting.startDate, "YYYY/MM/DD").add(
          1,
          "days"
        );
        const newHarvestDate = moment(
          datePlanting.harvestDate,
          "YYYY/MM/DD"
        ).add(1, "days");
        await Planting.update(
          {
            startDate: newStartDate,
            harvestDate: newHarvestDate,
            assignStatus: "notAssign",
          },
          { where: { id: cancelJob.plantingId } },
          { transaction: trans }
        );
        await trans.commit();
        res.status(200).json({ message: "Cancel job successfully" });
      } else if (cancelJob.mission === "harvest") {
        const harvestDatePlanting = await Planting.findOne({
          where: { id: cancelJob.plantingId },
          attributes: ["harvestDate"],
        });
        const newHarvestDate = moment(
          harvestDatePlanting.harvestDate,
          "YYYY/MM/DD"
        ).add(1, "days");
        await Planting.update(
          {
            harvestDate: newHarvestDate,
            assignStatus: "notAssign",
            status: "started",
          },
          { where: { id: cancelJob.plantingId } },
          { transaction: trans }
        );
        await trans.commit();
        res.status(200).json({ message: "Cancel job successfully" });
      }
    } else {
      const { id } = req.params;
      const cancelJob = await Planting.findOne({
        where: { id },
      });
      if (cancelJob.status === "started") {
        const newStartDate = moment(cancelJob.startDate, "YYYY/MM/DD").add(
          1,
          "days"
        );
        const newHarvestDate = moment(cancelJob.harvestDate, "YYYY/MM/DD").add(
          1,
          "days"
        );
        await Planting.update(
          {
            startDate: newStartDate,
            harvestDate: newHarvestDate,
          },
          { where: { id } },
          { transaction: trans }
        );
        await trans.commit();
        res.status(200).json({ message: "Cancel job successfully" });
      } else if (cancelJob.status === "harvested") {
        const newHarvestDate = moment(cancelJob.harvestDate, "YYYY/MM/DD").add(
          1,
          "days"
        );
        await Planting.update(
          {
            harvestDate: newHarvestDate,
          },
          { where: { id } },
          { transaction: trans }
        );
        await trans.commit();
        res.status(200).json({ message: "Cancel job successfully" });
      }
    }
  } catch (err) {
    await trans.rollback();
    next(err);
  }
};

exports.updateHarvestedAmount = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const updateStatusPlanting = req.updateStatusPlanting;
    const { harvestedAmount } = req.body;
    if (updateStatusPlanting) {
      if (harvestedAmount === undefined)
        return res
          .status(400)
          .json({ message: "Harvested amount is required." });
      if (isNaN(+harvestedAmount) || harvestedAmount === null)
        return res
          .status(400)
          .json({ message: "Harvested amount must be a number." });
      await Planting.update(
        {
          harvestedAmount,
        },
        { where: { id: updateStatusPlanting.plantingId } },
        { transaction: trans }
      );
      await trans.commit();
      next();
    } else {
      const { id } = req.params;
      if (harvestedAmount === undefined)
        return res
          .status(400)
          .json({ message: "Harvested amount is required." });
      if (isNaN(+harvestedAmount) || harvestedAmount === null)
        return res
          .status(400)
          .json({ message: "Harvested amount must be a number." });
      await Planting.update(
        {
          harvestedAmount,
        },
        { where: { id } },
        { transaction: trans }
      );
      await trans.commit();
      res.status(200).json({ message: "Update harvested amount successfully" });
    }
  } catch (err) {
    await trans.rollback();
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const updateStatusPlanting = req.updateStatusPlanting;
    const { id } = req.params;
    const { status } = req.body;
    if (updateStatusPlanting) {
      await Planting.update(
        {
          status: "finished",
        },
        { where: { id: updateStatusPlanting.plantingId } },
        { transaction: trans }
      );
      const updateStatusFarm = await Planting.findOne(
        {
          where: { id: updateStatusPlanting.plantingId },
        },
        { transaction: trans }
      );
      await trans.commit();
      req.updateStatusFarm = updateStatusFarm;
      next();
    } else {
      if (status === undefined)
        return res.status(400).json({ message: "Status date is required." });
      if (
        status !== "started" &&
        status !== "harvested" &&
        status !== "finished" &&
        status !== "cancel"
      )
        return res.status(400).json({ message: "Status not found." });
      if (status === "cancel") {
        await Planting.update(
          {
            status,
            canceler: req.user.id,
          },
          { where: { id } },
          { transaction: trans }
        );
        const plantingCancel = await Planting.findOne(
          { where: { id } },
          { transaction: trans }
        );
        await trans.commit();
        req.plantingCancel = plantingCancel;
        next();
      }
    }
  } catch (err) {
    await trans.rollback();
    next(err);
  }
};

exports.updateAssignStatus = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    const { assignStatus, plantingId } = req.body;
    await Planting.update(
      {
        assignStatus,
      },
      { where: { id: plantingId } },
      { transaction: trans }
    );
    await trans.commit();
    next();
  } catch (err) {
    await trans.rollback();
    next(err);
  }
};
