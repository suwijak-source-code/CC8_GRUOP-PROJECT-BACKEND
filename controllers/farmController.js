const { User, sequelize, Farm } = require('../models');
const { Op } = require('sequelize');


exports.getFarm = async (req, res, next) => {
    try {
        const { status } = req.params;
        let farm;
        if (status === 'all') {
            farm = await Farm.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            });
        } else {
            farm = await Farm.findAll({
                where: { status },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            });
        }
        res.status(200).json({ farm });
    } catch (err) {
        next(err);
    }
};

exports.searchFarm = async (req, res, next) => {
    try {
        const { search } = req.query;
        const farm = await Farm.findAll({
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
        });
        res.status(200).json({ farm });
    } catch (err) {
        next(err);
    }
}

exports.createFarm = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { farmName, status, farmRemark, farmApprovedFName, farmApprovedLName } = req.body;
        if (farmName === undefined) return res.status(400).json({ message: 'Farm name is required.' });
        if (status === undefined) return res.status(400).json({ message: 'Status is required.' });
        if (status !== 'active' && status !== 'idle') return res.status(400).json({ message: 'Status not found.' });
        if (farmApprovedFName === undefined) return res.status(400).json({ message: 'First name of approver is required.' });
        if (farmApprovedLName === undefined) return res.status(400).json({ message: 'Last name of approver is required.' });
        const approved = await User.findOne({
            where: {
                [Op.and]: [
                    { firstName: farmApprovedFName },
                    { lastName: farmApprovedLName }
                ]
            }
        });
        if (!approved) return res.status(400).json({ message: 'Approve name not found.' });
        const farm = await Farm.create({
            name: farmName, status, remark: farmRemark, approvedBy: approved.id
        }, { transaction: trans });
        await trans.commit();
        res.status(201).json({ message: 'Create farm successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.editFarm = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        let { farmName, status, farmRemark, farmApprovedFName, farmApprovedLName } = req.body;
        if (farmName === undefined) {
            farmName = await Farm.findOne({
                where: { id },
                attributes: ['farmName']
            });
            farmName = farmName.farmName;
        };
        if (status === undefined) {
            status = await Farm.findOne({
                where: { id },
                attributes: ['status']
            });
            status = status.status;
        };
        if (status !== 'active' && status !== 'idle') return res.status(400).json({ message: 'Status not found.' });
        if (farmApprovedFName === undefined) return res.status(400).json({ message: 'First name of approver is required.' });
        if (farmApprovedLName === undefined) return res.status(400).json({ message: 'Last name of approver is required.' });
        const approved = await User.findOne({
            where: {
                [Op.and]: [
                    { firstName: farmApprovedFName },
                    { lastName: farmApprovedLName }
                ]
            }
        });
        if (!approved) return res.status(400).json({ message: 'Approve name not found.' });
        await Farm.update({
            name: farmName, status, remark: farmRemark, approvedBy: approved.id
        }, { where: { id } },
            { transaction: trans });
        await trans.commit();
        res.status(200).json({ message: 'Edit farm successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const updateStatusFarm = req.updateStatusFarm;
        const planting = req.planting;
        const prePlantingEdit = req.prePlantingEdit;
        const plantingEdit = req.plantingEdit;
        const plantingCancel = req.plantingCancel;
        if (updateStatusFarm) {
            await Farm.update({
                status: 'idle'
            }, { where: { id: updateStatusFarm.farmId } },
                { transaction: trans });
            await trans.commit();
            res.status(200).json({ message: 'Update status successfully' });
        } else if (planting) {
            await Farm.update({
                status: 'active'
            }, { where: { id: planting.farmId } },
                { transaction: trans });
            await trans.commit();
            res.status(201).json({ message: 'Create planting successfully' });
        } else if (prePlantingEdit && plantingEdit) {
            await Farm.update({
                status: 'idle'
            }, { where: { id: prePlantingEdit.farmId } },
                { transaction: trans });
            await Farm.update({
                status: 'active'
            }, { where: { id: plantingEdit.farmId } },
                { transaction: trans });
            await trans.commit();
            res.status(200).json({ message: 'Edit planting successfully' });
        } else if (plantingCancel) {
            await Farm.update({
                status: 'idle'
            }, { where: { id: plantingCancel.farmId } },
                { transaction: trans });
            await trans.commit();
            res.status(200).json({ message: 'Cancel planting successfully' });
        }
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.deleteFarm = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Farm.destroy({ where: { id } });
        res.status(200).json({ message: 'Delete farm successfully' });
    } catch (err) {
        next(err);
    }
};
