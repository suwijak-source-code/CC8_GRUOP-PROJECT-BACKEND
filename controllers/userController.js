const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');



const checkNationalId = (nationalId) => {
    let sum = 0;
    for (let i = 0; i < nationalId.length - 1; i++) {
        sum += (+nationalId[i] * (13 - i));
    }
    return (11 - (sum % 11)).toString().slice(-1);
}

exports.register = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const {
            username, firstName, lastName,
            email, password, confirmPassword, addressUser,
            phone, status, gender, birthDate, nationalId, startDate, endDate, approved, role
        } = req.body;
        if (username === undefined) return res.status(400).json({ message: 'Username is required.' });
        if (firstName === undefined) return res.status(400).json({ message: 'FirstName is required.' });
        if (lastName === undefined) return res.status(400).json({ message: 'LastName is required.' });
        if (addressUser === undefined) return res.status(400).json({ message: 'AddressUser is required.' });
        if (phone === undefined) return res.status(400).json({ message: 'Phone is required.' });
        if (status === undefined) return res.status(400).json({ message: 'Status is required.' });
        if (gender === undefined) return res.status(400).json({ message: 'Gender is required.' });
        if (birthDate === undefined) return res.status(400).json({ message: 'BirthDate is required.' });
        if (startDate === undefined) return res.status(400).json({ message: 'Start date is required.' });
        if (approved === undefined) return res.status(400).json({ message: 'Approved is required.' });
        if (role === undefined) return res.status(400).json({ message: 'Role is required.' });
        if (role !== 'ADMIN' && role !== 'SALES' && role !== 'GARDENER') return res.status(400).json({ message: 'Role not found.' });
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
        const checkDigit = checkNationalId(nationalId);
        if (nationalId.slice(-1) !== checkDigit) return res.status(400).json({ message: 'National id is invalid.' });

        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
        let user;
        if (req.file) {
            const secure_url = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
                if (err) return next(err);

                fs.unlinkSync(req.file.path);
                return result.secure_url
            });
            user = await User.create({
                pictureProfileUser: secure_url.secure_url, username, firstName, lastName,
                email, password: hashedPassword, addressUser, phone, status, gender, birthDate,
                nationalId, startDate, endDate, approved, role
            }, { transaction: trans });
        } else if (!req.file) {
            user = await User.create({
                username, firstName, lastName,
                email, password: hashedPassword, addressUser,
                phone, status, gender, birthDate,
                nationalId, startDate, endDate, approved, role
            }, { transaction: trans });
        }
        const payload = { id: user.id, username, email, firstName, lastName, role };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
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
        })
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
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
        res.status(200).json({ token, role: user.role, message: 'login successfully' });
    } catch (err) {
        next(err);
    }
};
