const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

            // Check if DB is connected
            if (global.DB_STATUS === 'connected') {
                req.user = await User.findById(decoded.id).select('-password');
            } else {
                // Check Global Demo Store
                const demoUser = (global.DEMO_USERS || []).find(u => u._id === decoded.id);
                req.user = demoUser || { _id: decoded.id, role: 'admin', name: 'Demo Admin' }; 
            }

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const creator = (req, res, next) => {
    if (req.user && (req.user.role === 'creator' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a creator' });
    }
};

module.exports = { protect, admin, creator };
