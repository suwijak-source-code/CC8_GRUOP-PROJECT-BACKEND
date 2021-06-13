const { User, sequelize, Seed, Planting } = require('../models');
const { Op } = require('sequelize');


exports.getSeed = async (req, res, next) => {
    try {
        const seed = await Seed.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });
        res.status(200).json({ seed });
    } catch (err) {
        next(err);
    }
};

exports.searchSeed = async (req, res, next) => {
    try {
        const { search } = req.query;
        const seed = await Seed.findAll({
            where: {
                [Op.or]: [
                    { name: search }
                ]
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        })
        res.status(200).json({ seed });
    } catch (err) {
        next(err);
    }
}

exports.createSeed = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { seedName, seedCost, seedRemark, seedApprovedFName, seedApprovedLName, plantingTime } = req.body;
        console.log(typeof (plantingTime));
        if (seedName === undefined) return res.status(400).json({ message: 'Seed name is required.' });
        if (plantingTime === undefined) return res.status(400).json({ message: 'Planting time is required.' });
        if (seedCost === undefined) return res.status(400).json({ message: 'Seed name is required.' });
        if (isNaN(+seedCost) || seedCost === null) return res.status(400).json({ message: 'Seed cost must be a number.' });
        if (seedApprovedFName === undefined) return res.status(400).json({ message: 'First name of approver is required.' });
        if (seedApprovedLName === undefined) return res.status(400).json({ message: 'Last name of approver is required.' });
        const approved = await User.findOne({
            where: {
                [Op.and]: [
                    { firstName: seedApprovedFName },
                    { lastName: seedApprovedLName }
                ]
            }
        });
        if (!approved) return res.status(400).json({ message: 'Approve name not found.' });
        const seed = await Seed.create({
            name: seedName, cost: seedCost, remark: seedRemark, approvedBy: approved.id, plantingTime
        }, { transaction: trans });
        await trans.commit();
        res.status(201).json({ message: 'Create seed successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.editSeed = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        let { seedName, seedCost, seedRemark, seedApprovedFName, seedApprovedLName, plantingTime } = req.body;
        if (seedName === undefined) {
            seedName = await Seed.findOne({
                where: { id },
                attributes: ['seedName']
            });
            seedName = seedName.seedName;
        };
        if (plantingTime === undefined) {
            plantingTime = await Seed.findOne({
                where: { id },
                attributes: ['plantingTime']
            });
            plantingTime = plantingTime.plantingTime;
        };
        if (seedCost === undefined) {
            seedCost = await Seed.findOne({
                where: { id },
                attributes: ['seedCost']
            });
            seedCost = seedCost.seedCost;
        };
        if (isNaN(+seedCost) || seedCost === null) return res.status(400).json({ message: 'Seed cost must be a number.' });
        if (seedApprovedFName === undefined) return res.status(400).json({ message: 'First name of approver is required.' });
        if (seedApprovedLName === undefined) return res.status(400).json({ message: 'Last name of approver is required.' });
        const approved = await User.findOne({
            where: {
                [Op.and]: [
                    { firstName: seedApprovedFName },
                    { lastName: seedApprovedLName }
                ]
            }
        });
        if (!approved) return res.status(400).json({ message: 'Approve name not found.' });
        const oldPlantingTime = await Seed.findOne({
            where: { id },
            attributes: ['plantingTime']
        })
        if (plantingTime === oldPlantingTime.plantingTime) {
            await Seed.update({
                name: seedName, remark: seedRemark, approvedBy: approved.id, cost: seedCost, plantingTime
            }, { where: { id } },
                { transaction: trans });
            await trans.commit();
            res.status(200).json({ message: 'Edit seed successfully' });
        } else {
            const checkUseSeed = await Planting.findAll({
                where: { seedId: id }
            });
            if (checkUseSeed) {
                await Seed.update({
                    name: seedName, remark: seedRemark, approvedBy: approved.id, cost: seedCost, plantingTime
                }, { where: { id } },
                    { transaction: trans });
                await trans.commit();
                req.plantingTime = plantingTime;
                next();
            } else if (!checkUseSeed) {
                await Seed.update({
                    name: seedName, remark: seedRemark, approvedBy: approved.id, cost: seedCost, plantingTime
                }, { where: { id } },
                    { transaction: trans });
                await trans.commit();
                res.status(200).json({ message: 'Edit seed successfully' });
            }
        }
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.deleteSeed = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Seed.destroy({ where: { id } });
        res.status(200).json({ message: 'Delete seed successfully' });
    } catch (err) {
        next(err);
    }
};