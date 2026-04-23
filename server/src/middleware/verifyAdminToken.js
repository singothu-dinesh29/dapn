const jwt = require('jsonwebtoken');

/**
 * @desc    High-Security Admin Token Verification
 */
const verifyAdminToken = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

            if (decoded.role === 'admin') {
                req.admin = decoded;
                next();
            } else {
                res.status(403).json({ success: false, message: 'Access Denied: Insufficient Privileges' });
            }
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { verifyAdminToken };
