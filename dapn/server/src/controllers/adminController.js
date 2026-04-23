const Booking = require('../models/Booking');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            console.warn('[DEMO-MODE-ACTIVE] Database offline. Returning Virtual Store bookings.');
            return res.json({ 
                success: true, 
                count: (global.VIRTUAL_BOOKINGS || []).length, 
                data: global.VIRTUAL_BOOKINGS || [] 
            });
        }
        const bookings = await Booking.find({}).populate('creatorId', 'name email mobile').sort('-createdAt');
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('creatorId', 'name email');
        
        if (booking) {
            const oldStatus = booking.status;
            booking.status = status || booking.status;
            const updatedBooking = await booking.save();
            
            if (global.io) global.io.emit('bookingUpdated', updatedBooking);

            // Send Email Notifications
            if (oldStatus !== status) {
                const emailRecipient = booking.emailOrMobile.includes('@') ? booking.emailOrMobile : booking.creatorId.email;
                
                if (status === 'Confirmed') {
                    await sendEmail({
                        email: emailRecipient,
                        subject: 'Dapnix | Booking Confirmed! 🚀',
                        message: `
                            <div style="font-family: sans-serif; padding: 20px; color: #000;">
                                <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Booking Confirmed</h1>
                                <p>Hi ${booking.name},</p>
                                <p>Your creative project for <b>${booking.projectType}</b> has been confirmed by our team.</p>
                                <p>Our artisans are now preparing to bring your vision to life.</p>
                                <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                                    <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Dapnix.creators | Premium Digital Artisan Ecosystem</p>
                                </div>
                            </div>
                        `
                    });
                } else if (status === 'Completed') {
                    await sendEmail({
                        email: emailRecipient,
                        subject: 'Dapnix | Work Completed! ✨',
                        message: `
                            <div style="font-family: sans-serif; padding: 20px; color: #000;">
                                <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Work Completed</h1>
                                <p>Hi ${booking.name},</p>
                                <p>Great news! Your project <b>${booking.projectType}</b> is now complete.</p>
                                <p>You can view the final delivery in your dashboard or check the project link provided earlier.</p>
                                <p>Thank you for choosing Dapnix.</p>
                                <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                                    <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Dapnix.creators | Premium Digital Artisan Ecosystem</p>
                                </div>
                            </div>
                        `
                    });
                }
            }

            res.json({ success: true, data: updatedBooking });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Email error:', error);
        // We still return success for the update even if email fails, but log it
        res.status(500).json({ message: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.paymentStatus = paymentStatus || booking.paymentStatus;
            const updatedBooking = await booking.save();
            if (global.io) global.io.emit('bookingUpdated', updatedBooking);
            res.json({ success: true, data: updatedBooking });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            return res.json({ success: true, data: global.DEMO_USERS || [] });
        }
        const users = await User.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAnalytics = async (req, res) => {
    try {
        let bookings = [];
        if (global.DB_STATUS !== 'connected') {
            bookings = global.VIRTUAL_BOOKINGS || [];
        } else {
            bookings = await Booking.find({});
        }
        
        const totalBookings = bookings.length;
        const pendingCount = bookings.filter(b => b.status === 'Pending').length;
        const completedCount = bookings.filter(b => b.status === 'Completed').length;
        
        // Calculate Revenue (Assuming fixed price for simplicity, or using actual project values if available)
        // Let's assume a default value of 2500 per paid booking
        const totalRevenue = bookings.filter(b => b.paymentStatus === 'Paid').length * 2500;

        // Daily Stats (Last 7 days)
        const dailyStats = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            
            const dayBookings = bookings.filter(b => 
                new Date(b.createdAt).toDateString() === date.toDateString()
            );
            
            dailyStats.push({
                date: dateString,
                bookings: dayBookings.length,
                revenue: dayBookings.filter(b => b.paymentStatus === 'Paid').length * 2500
            });
        }

        res.json({
            success: true,
            data: {
                totalBookings,
                totalRevenue,
                pendingCount,
                completedCount,
                dailyStats
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { deleteBooking } = require('./bookingController');

module.exports = {
    getBookings,
    updateStatus,
    updatePaymentStatus,
    getUsers,
    deleteBooking,
    getAnalytics
};
