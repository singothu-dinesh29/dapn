const Booking = require('../models/Booking');

/**
 * @desc    Create a new project booking
 * @route   POST /api/booking/create-booking
 * @access  Public
 */
exports.createBooking = async (req, res) => {
    try {
        const { name, email, phone, date, timeSlot, requirements, amount } = req.body;

        // 1. Basic validation
        if (!name || !email || !date || !timeSlot) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // 2. Prevent Double Booking
        // Check if a confirmed booking already exists for the same date and slot
        const existingBooking = await Booking.findOne({
            date: new Date(date),
            timeSlot: timeSlot,
            status: 'confirmed'
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked for the selected date. Please choose another slot.'
            });
        }

        // 3. Save Booking
        const booking = await Booking.create({
            name,
            email,
            phone,
            date,
            timeSlot,
            requirements,
            amount
        });

        res.status(201).json({
            success: true,
            message: 'Booking request created successfully',
            data: booking
        });

    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not process booking',
            error: error.message
        });
    }
};

/**
 * @desc    Get all bookings (Admin only - theoretical)
 */
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort('-createdAt');
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Could not fetch bookings'
        });
    }
};
