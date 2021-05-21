const { User, sequelize, Job, Planting, Farm, Seed } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');


exports.getJobByUser = async (req, res, next) => {
    try {
        const { status } = req.params;
        let job;
        if (status === 'all') {
            job = await Job.findAll({
                where: {
                    [Op.and]: [
                        { staffId: req.user.id },
                        { status: ['assign', 'in progress', 'checking', 'finish'] }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'Staff',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: User,
                        as: 'Assignor',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: User,
                        as: 'Examiner',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: User,
                        as: 'Canceler',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: Planting,
                        include: [
                            {
                                model: Farm,
                                attributes: ['id', 'name']
                            },
                            {
                                model: Seed,
                                attributes: ['id', 'name']
                            },
                        ],
                        attributes: ['id', 'status']
                    },
                ]
            });
        } else {
            job = await Job.findAll({
                where: {
                    [Op.and]: [
                        { staffId: req.user.id },
                        { status }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'Staff',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: User,
                        as: 'Assignor',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: User,
                        as: 'Examiner',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: User,
                        as: 'Canceler',
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: Planting,
                        include: [
                            {
                                model: Farm,
                                attributes: ['id', 'name']
                            },
                            {
                                model: Seed,
                                attributes: ['id', 'name']
                            },
                        ],
                        attributes: ['id', 'status']
                    },
                ]
            });
        }
        res.status(200).json({ job });
    } catch (err) {
        next(err);
    }
}

exports.getJob = async (req, res, next) => {
    try {
        const job = await Job.findAll({
            include: [
                {
                    model: User,
                    as: 'Staff',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: User,
                    as: 'Assignor',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: User,
                    as: 'Examiner',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: User,
                    as: 'Canceler',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Planting,
                    attributes: ['id', 'status']
                },
            ]
        });
        res.status(200).json({ job });
    } catch (err) {
        next(err);
    };
};

exports.getJobAssign = async (req, res, next) => {
    try {
        const { status } = req.params;
        const date = moment().format("YYYY-MM-DD");
        const jobAssign = await Job.findAll({
            where: {
                [Op.and]: [
                    { status },
                    { assignDate: date }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'Staff',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: User,
                    as: 'Assignor',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: User,
                    as: 'Examiner',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: User,
                    as: 'Canceler',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Planting,
                    include: [
                        {
                            model: Farm,
                            attributes: ['id', 'name']
                        },
                        {
                            model: Seed,
                            attributes: ['id', 'name']
                        },
                    ],
                    attributes: ['id', 'status', 'assignStatus']
                },
            ]
        });
        res.status(200).json({ jobAssign });
    } catch (err) {
        next(err);
    }
};

exports.createJob = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { staffId, plantingId, mission, status } = req.body;
        if (staffId === undefined) return res.status(400).json({ message: 'Staff id is required.' });
        if (plantingId === undefined) return res.status(400).json({ message: 'Planting id is required.' });
        if (mission === undefined) return res.status(400).json({ message: 'Mission is required.' });
        if (mission !== 'gardening' && mission !== 'harvest')
            return res.status(400).json({ message: 'Mission not found.' });
        if (status === undefined) return res.status(400).json({ message: 'Status is required.' });
        if (status !== 'assign' && status !== 'in progress' && status !== 'finish' && status !== 'cancel')
            return res.status(400).json({ message: 'Status not found.' });
        await Job.create({
            staffId, plantingId, mission, status, assignor: req.user.id, assignDate: new Date()
        }, { transaction: trans })
        await trans.commit();
        res.status(201).json({ message: 'Create job successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    };
};

exports.editAssignJob = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { staffId } = req.body;
        if (staffId === undefined) return res.status(400).json({ message: 'Staff id is required.' });
        await Job.update({
            staffId, assignor: req.user.id
        }, { where: { id } }, { transaction: trans });
        res.status(201).json({ message: 'Edit job successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    };
};

exports.updateStatus = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (status === undefined) return res.status(400).json({ message: 'Status is required.' });
        if (status !== 'assign' && status !== 'in progress' && status !== 'checking' && status !== 'finish' && status !== 'cancel')
            return res.status(400).json({ message: 'Status not found.' });
        const oldMission = await Job.findOne({
            where: { id }
        });
        if (oldMission.mission === 'gardening') {
            if (status === 'in progress') {
                await Job.update({
                    status
                }, { where: { id } }, { transaction: trans });
                await trans.commit();
                res.status(200).json({ message: 'Update status successfully' });
            } else if (status === 'checking') {
                await Job.update({
                    status
                }, { where: { id } }, { transaction: trans });
                await trans.commit();
                res.status(200).json({ message: 'Update status successfully' });
            } else if (status === 'finish') {
                await Job.update({
                    status, examiner: req.user.id
                }, { where: { id } }, { transaction: trans });
                await trans.commit();
                res.status(200).json({ message: 'Update status successfully' });
            };
        } else if (oldMission.mission === 'harvest') {
            if (status === 'in progress') {
                await Job.update({
                    status
                }, { where: { id } }, { transaction: trans });
                await trans.commit();
                res.status(200).json({ message: 'Update status successfully' });
            } else if (status === 'checking') {
                await Job.update({
                    status
                }, { where: { id } }, { transaction: trans });
                await trans.commit();
                res.status(200).json({ message: 'Update status successfully' });
            } else if (status === 'finish') {
                await Job.update({
                    status, examiner: req.user.id
                }, { where: { id } }, { transaction: trans });
                const updateStatusPlanting = await Job.findOne({
                    where: { id }
                }, { transaction: trans })
                await trans.commit();
                req.updateStatusPlanting = updateStatusPlanting;
                next();
            };
        };
    } catch (err) {
        await trans.rollback();
        next(err);
    };
};

exports.cancelJob = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        const cancelJob = await Job.findOne({
            where: { id }
        });
        await Job.update({
            status: 'cancel', canceler: req.user.id
        }, { where: { id } }, { transaction: trans });
        await trans.commit();
        req.cancelJob = cancelJob;
        next();
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};