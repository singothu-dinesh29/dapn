const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Helper to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    console.log('[STABLE-LOG] Registration trigger:', req.body);
    const { name, email, password, mobile } = req.body;

    try {
        if (global.DB_STATUS !== 'connected') {
            console.warn('[DEMO-MODE-ACTIVE] Database offline. Using Global Virtual Store.');
            
            // Sync with global store
            if (!global.DEMO_USERS) global.DEMO_USERS = [];
            
            const exists = global.DEMO_USERS.find(u => u.email === email);
            if (exists) return res.status(400).json({ message: 'User already exists (Demo Store)' });

            const newUser = { 
                _id: Date.now().toString(), 
                name, 
                email, 
                mobile, 
                role: 'admin', // DEFAULT TO ADMIN FOR DEMO ACCESS
                password // store for demo auth
            };
            
            global.DEMO_USERS.push(newUser);
            
            return res.status(201).json({
                ...newUser,
                token: generateToken(newUser._id),
                message: 'Account Created (Demo Session Mode)'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, mobile });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('[ERROR] Register Controller:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
exports.authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (global.DB_STATUS !== 'connected') {
            const user = (global.DEMO_USERS || []).find(u => u.email === email);
            if (user) {
                return res.json({
                    ...user,
                    token: generateToken(user._id),
                    message: 'Logged In (Demo Session Mode)'
                });
            }
            return res.status(401).json({ message: 'Invalid credentials in Demo Store' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Other simplified controllers...
exports.forgotPassword = async (req, res) => res.json({ message: 'Simulated reset.' });
exports.resetPassword = async (req, res) => res.json({ success: true });
exports.mobileLogin = async (req, res) => res.json({ success: true, message: 'OTP: 123456' });
exports.verifyOtp = async (req, res) => res.json({ _id: 'dm123', name: 'Demo', token: generateToken('dm123') });
