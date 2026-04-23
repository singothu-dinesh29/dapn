const Booking = require('../models/Booking');

// @desc    Create new booking
exports.createBooking = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            if (!global.VIRTUAL_BOOKINGS) global.VIRTUAL_BOOKINGS = [];
            const newDemoBooking = { 
                ...req.body, 
                _id: `demo-${Date.now()}`,
                creatorId: req.user._id.toString(),
                status: 'Pending',
                paymentStatus: 'Pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            global.VIRTUAL_BOOKINGS.unshift(newDemoBooking);
            if (global.io) global.io.emit('newBooking', newDemoBooking);
            
            return res.status(201).json({
                success: true,
                message: 'SLOT BOOKED!!!',
                data: newDemoBooking
            });
        }

        const bookingData = {
            ...req.body,
            creatorId: req.user._id
        };

        const booking = await Booking.create(bookingData);
        
        // Notify admin in real-time
        if (global.io) {
            global.io.emit('newBooking', booking);
        }

        res.status(201).json({ success: true, message: 'SLOT BOOKED!!!', data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
exports.getBookings = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
            const userBookings = (global.VIRTUAL_BOOKINGS || []).filter(b => b.creatorId === req.user._id.toString());
            return res.status(200).json({ success: true, count: userBookings.length, data: userBookings });
        }
        const query = req.user.role === 'admin' ? {} : { creatorId: req.user._id };
        const bookings = await Booking.find(query).sort('-createdAt');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
             return res.status(200).json({ success: true, message: 'Status updated (Demo Mode)' });
        }
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true }
        );
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (global.io) global.io.emit('bookingUpdated', booking);
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
             return res.status(200).json({ success: true, message: 'Payment marked as Paid (Demo Mode)' });
        }
        const booking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { paymentStatus: 'Paid' }, 
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (global.io) global.io.emit('bookingUpdated', booking);
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        if (global.DB_STATUS !== 'connected') {
             return res.status(200).json({ success: true, message: 'Booking deleted (Demo Mode)' });
        }
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ success: true, message: 'Booking removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
