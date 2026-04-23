const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * @desc    Get High-Level Dashboard Overview
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Only count revenue from confirmed bookings
        const revenueData = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const recentBookings = await Booking.find({})
            .sort('-createdAt')
            .limit(5)
            .select('name productType status amount createdAt');

        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                totalRevenue: revenueData[0]?.total || 0,
                totalUsers,
                recentBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get Detailed Revenue Analytics
 * @route   GET /api/admin/revenue
 * @access  Private/Admin
 */
exports.getRevenueStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { status: 'confirmed' };

        if (startDate && endDate) {
            query.createdAt = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }

        // Aggregate for Daily/Monthly stats
        const dailyRevenue = await Booking.aggregate([
            { $match: query },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$amount" }
            }},
            { $sort: { _id: 1 } }
        ]);

        const totalRevenue = dailyRevenue.reduce((acc, curr) => acc + curr.total, 0);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                dailyRevenue,
                queryRange: { startDate, endDate }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get All Users (Secure)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
    try {
        // Explicitly selecting only safe fields
        const users = await User.find({}).select('name email createdAt role');
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
