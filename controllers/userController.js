const { User, sequelize, Planting } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getProFileUser = async (req, res, next) => {
    try {
        const profile = await User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'status', 'gender', 'birthDate',
                'nationalId', 'phone', 'startDate', 'endDate', 'role', 'approvedBy', 'imgPath']
        });
        res.status(200).json({ profile });
    } catch (err) {
        next(err);
    }
};

exports.getGardenerProFile = async (req, res, next) => {
    try {
        const gardener = await User.findAll({
            where: {
                [Op.and]: [
                    { role: 'gardener' },
                    { status: 'active' }
                ]
            }
        })
        res.status(200).json({ gardener });
    } catch (err) {
        next(err);
    }
};

exports.getAllProFileUser = async (req, res, next) => {
    try {
        const { status } = req.params;
        let profileAll;
        if (status === 'all') {
            profileAll = await User.findAll({
                where: { role: ['sales', 'gardener'] },
                attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'status', 'gender', 'birthDate',
                    'nationalId', 'phone', 'startDate', 'endDate', 'role', 'approvedBy', 'imgPath']
            });
        } else {
            profileAll = await User.findAll({
                where: {
                    [Op.and]: [
                        { role: ['sales', 'gardener'] },
                        { status }
                    ]
                },
                attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'status', 'gender', 'birthDate',
                    'nationalId', 'phone', 'startDate', 'endDate', 'role', 'approvedBy', 'imgPath']
            });
        }
        res.status(200).json({ profileAll });
    } catch (err) {
        next(err);
    }
};

exports.getSearchProFileUser = async (req, res, next) => {
    try {
        const { search } = req.query;
        if (search === 'admin') return res.status(400).json({ message: ' Can\'t find this role.' });
        const profileSearch = await User.findAll({
            where: {
                [Op.or]: [
                    { firstName: search },
                    { lastName: search },
                    { role: search },
                    { nationalId: search }
                ]
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'status', 'gender', 'birthDate',
                'nationalId', 'phone', 'startDate', 'endDate', 'role', 'approvedBy', 'imgPath']
        });
        if (!profileSearch) return res.status(400).json({ message: 'Employee not found.' });
        res.status(200).json({ profileSearch });
    } catch (err) {
        next(err);
    }
}

const checkNationalID = (nationalId) => {
    let num = 0;
    for (let index = 0; index < nationalId.length - 1; index++) {
        num += ((+nationalId[index]) * (13 - index));
    }
    let digit = (11 - (num % 11)).toString().slice(-1);
    return digit;
}

exports.register = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const {
            username, firstName, lastName, email, password, confirmPassword, address, status, gender,
            birthDate, nationalId, phone, startDate, role, imgPath, endorsee
        } = req.body;
        if (username === undefined) return res.status(400).json({ message: 'Username is required.' });
        if (firstName === undefined) return res.status(400).json({ message: 'FirstName is required.' });
        if (lastName === undefined) return res.status(400).json({ message: 'LastName is required.' });
        if (address === undefined) return res.status(400).json({ message: 'Address is required.' });
        if (status === undefined) return res.status(400).json({ message: 'Status is required.' });
        if (status !== 'active' && status !== 'break' && status !== 'quited')
            return res.status(400).json({ message: 'Status not found.' });
        if (gender === undefined) return res.status(400).json({ message: 'Gender is required.' });
        if (gender !== 'male' && gender !== 'female') return res.status(400).json({ message: 'Gender not found.' });
        if (birthDate === undefined) return res.status(400).json({ message: 'BirthDate is required.' });
        if (phone === undefined) return res.status(400).json({ message: 'Phone is required.' });
        if (startDate === undefined) return res.status(400).json({ message: 'Start date is required.' });
        if (role === undefined) return res.status(400).json({ message: 'Role is required.' });
        if (role !== 'admin' && role !== 'sales' && role !== 'gardener')
            return res.status(400).json({ message: 'Role not found.' });
        if (email === undefined) return res.status(400).json({ message: 'Email is required.' });
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            return res.status(400).json({ message: 'Invalid email address.' })
        };
        if (password === undefined) return res.status(400).json({ message: 'password is required' });
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password))) {
            return res.status(400).json({ message: 'Password must contain at least eight but not more than fifteen characters, Which contain at least one uppercase letters, lowercase letters, numbers, and special characters.' })
        }
        if (confirmPassword === undefined) return res.status(400).json({ message: 'confirmPassword is required' });
        if (password !== confirmPassword) return res.status(400).json({ message: 'password did not match' });
        if (nationalId === undefined) return res.status(400).json({ message: 'National id is required.' });
        if (nationalId.length !== 13) return res.status(400).json({ message: 'National id must have 13 digits.' });
        const digit = checkNationalID(nationalId);
        if (nationalId.slice(-1) !== digit) return res.status(400).json({ message: 'National id is Invalid.' });
        let approved;
        if (role !== 'admin') {
            approved = await User.findOne({
                where: { id: req.user.id }
            });
            approved = `${approved.firstName} ${approved.lastName}`
        } else {
            approved = endorsee;
        }

        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT)
        const user = await User.create({
            imgPath, username, firstName, lastName,
            email, password: hashedPassword, address, status, gender, birthDate: new Date(birthDate), nationalId,
            phone, startDate: new Date(startDate), approvedBy: approved, role
        }, { transaction: trans });
        const payload = { id: user.id, username, email, firstName, lastName, role };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: +process.env.JWT_EXPIRES_IN });
        await trans.commit();
        res.status(201).json({ token, role });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (username === undefined) return res.status(400).json({ message: 'username is required' });
        if (password === undefined) return res.status(400).json({ message: 'password is required' });
        const user = await User.findOne({
            where: { username }
        });
        if (!user) {
            return res.status(400).json({ message: 'username and password incorrect' })
        }
        const isPasswordMath = await bcrypt.compare(password, user.password);
        if (!isPasswordMath) {
            return res.status(400).json({ message: 'username and password incorrect' })
        }

        const payload = {
            id: user.id, firstName: user.firstName, lastName: user.lastName,
            username: user.username, role: user.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: +process.env.JWT_EXPIRES_IN })
        res.status(200).json({ token, role: user.role, message: 'login successfully' });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { oldPassword, newPassword, newConfirmPassword } = req.body;
        if (oldPassword === undefined) return res.status(400).json({ message: 'Old password is required' });
        if (newPassword === undefined) return res.status(400).json({ message: 'New password is required' });
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(newPassword))) {
            return res.status(400).json({ message: 'Password must contain at least eight but not more than fifteen characters, Which contain at least one uppercase letters, lowercase letters, numbers, and special characters.' })
        }
        if (newConfirmPassword === undefined) return res.status(400).json({ message: 'New confirm password is required' });
        if (newPassword !== newConfirmPassword) return res.status(400).json({ message: 'New password did not match' });
        const user = await User.findOne({
            where: { id: req.user.id }
        }, { transaction: trans });
        if (!user) {
            return res.status(400).json({ message: 'Old password incorrect' });
        };
        const isOldPasswordMath = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordMath) {
            return res.status(400).json({ message: 'Old password incorrect' });
        };
        const hashedNewPassword = await bcrypt.hash(newPassword, +process.env.BCRYPT_SALT);
        await User.update({ password: hashedNewPassword },
            { where: { id: req.user.id } },
            { transaction: trans });
        await trans.commit();
        res.status(200).json({ message: 'Change password successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.editProFileUser = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        let { firstName, lastName, email, address, gender, birthDate, nationalId, phone,
            startDate, endDate, role, imgPath, status } = req.body;
        if (imgPath === undefined) {
            imgPath = await User.findOne({
                where: { id },
                attributes: ['imgPath']
            });
            imgPath = imgPath.imgPath;
        };
        if (firstName === undefined) {
            first = await User.findOne({
                where: { id },
                attributes: ['firstName']
            });
            firstName = first.firstName;
        };
        if (lastName === undefined) {
            last = await User.findOne({
                where: { id },
                attributes: ['lastName']
            });
            lastName = last.lastName;
        };
        if (address === undefined) {
            address = await User.findOne({
                where: { id },
                attributes: ['address']
            });
            address = address.dataValues.address;
        };
        if (gender === undefined) {
            gender = await User.findOne({
                where: { id },
                attributes: ['gender']
            });
            gender = gender.gender
        };
        if (gender !== 'male' && gender !== 'female') return res.status(400).json({ message: 'Gender not found.' });
        if (status === undefined) {
            status = await User.findOne({
                where: { id },
                attributes: ['status']
            });
            status = status.status;
        };
        if (status !== 'active' && status !== 'break' && status !== 'quited')
            return res.status(400).json({ message: 'Status not found.' });
        if (birthDate === undefined) {
            birthDate = await User.findOne({
                where: { id },
                attributes: ['birthDate']
            });
            birthDate = birthDate.birthDate;
        };
        if (phone === undefined) {
            phone = await User.findOne({
                where: { id },
                attributes: ['phone']
            });
            phone = phone.phone;
        };
        if (startDate === undefined) {
            startDate = await User.findOne({
                where: { id },
                attributes: ['startDate']
            });
            startDate = startDate.startDate;
        };
        if (role === undefined) {
            role = await User.findOne({
                where: { id },
                attributes: ['role']
            });
            role = role.role;
        };
        if (role !== 'admin' && role !== 'sales' && role !== 'gardener')
            return res.status(400).json({ message: 'Role not found.' });
        if (email === undefined) {
            mail = await User.findOne({
                where: { id },
                attributes: ['email']
            });
            email = mail.email;
        };

        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            return res.status(400).json({ message: 'Invalid email address.' })
        };
        const approvedBy = await User.findOne({
            where: { id: req.user.id }
        });
        if (nationalId === undefined) return res.status(400).json({ message: 'National id is required.' });
        if (nationalId.length !== 13) return res.status(400).json({ message: 'National id must have 13 digits.' });
        const digit = checkNationalID(nationalId);
        if (nationalId.slice(-1) !== digit) return res.status(400).json({ message: 'National id is Invalid.' });
        await User.update({
            imgPath, firstName, lastName, email, address, gender, birthDate: new Date(birthDate),
            nationalId, phone, startDate, endDate, approvedBy: `${approvedBy.firstName} ${approvedBy.lastName}`, role, status
        }, { where: { id } },
            { transaction: trans });
        await trans.commit();
        res.status(200).json({ message: 'Edit successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (status === undefined) return res.status(400).json({ message: 'Status is required.' });
        if (status !== 'active' && status !== 'break' && status !== 'quited')
            return res.status(400).json({ message: 'Status not found.' });
        await User.update({
            status
        }, { where: { id } }, { transaction: trans })
        await trans.commit();
        res.status(200).json({ message: 'Update successfully' });
    } catch (err) {
        await trans.rollback();
        next(err)
    }
}







