const jwt = require('jsonwebtoken');

/**
 * @desc    Authenticate Admin via Secret Access Key
 * @route   POST /api/admin/login
 * @access  Public
 */
exports.loginWithKey = async (req, res) => {
    try {
        const { accessKey } = req.body;
        const SECRET_KEY = process.env.ADMIN_ACCESS_KEY || 'dapnix_master_2026';

        if (accessKey === SECRET_KEY) {
            // Generate Admin-Scoped JWT
            const token = jwt.sign(
                { role: 'admin', type: 'vault_access' },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '12h' }
            );

            res.status(200).json({
                success: true,
                message: 'Admin Access Granted',
                token
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid Access Key'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
