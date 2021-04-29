// const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'you are unauthorized' });
        } else {
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ where: { id: payload.id } });
            if (!user) {
                return res.status(401).json({ message: 'user not found' });
            } else {
                req.user = user;
                next();
            }
        }
    } catch (err) {
        next(err);
    }
};

exports.checkAdminRole = async (req, res, next) => {
    try {
        const { role } = req.user;
        if (role === 'ADMIN') {
            next();
        } else {
            res.status(403).json({ message: 'You are not allowed.' })
        }
    } catch (err) {
        next(err);
    }
};