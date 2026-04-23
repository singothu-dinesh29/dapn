const Founder = require('../models/Founder');

const MOCK_FOUNDERS = [
    { name: 'Singothu Dinesh', instagram: '@dinesh.creators', whatsapp: '+91 9959259761', email: 'dinesh123@gmail.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400' },
    { name: 'Pem pal', instagram: '@pempal_dapn', whatsapp: '+91 1234567890', email: 'pempal@dapnix.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
    { name: 'Ali Ahammad', instagram: '@ali_ahammad', whatsapp: '+91 9876543210', email: 'ali@dapnix.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' },
    { name: 'Nithin', instagram: '@nithin_creative', whatsapp: '+91 9988776655', email: 'nithin@dapnix.com', avatar: 'https://images.unsplash.com/photo-1492691232151-50e50e8534b4?w=400' }
];

// @desc    Get all founders
exports.getFounders = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            return res.status(200).json({ success: true, count: MOCK_FOUNDERS.length, data: MOCK_FOUNDERS });
        }
        const founders = await Founder.find();
        res.status(200).json({ success: true, count: founders.length, data: founders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addFounder = async (req, res) => {
    res.status(201).json({ success: true, message: 'Founder added (Demo Mode)' });
};
