const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Contact number is required']
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    timeSlot: {
        type: String,
        required: [true, 'Time slot is required'],
        enum: ['09:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 06:00 PM', '06:00 PM - 09:00 PM']
    },
    requirements: {
        type: String,
        required: [true, 'Project requirements are required']
    },
    amount: {
        type: Number,
        required: [true, 'Booking amount is required']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentId: {
        type: String,
        default: ''
    },
    orderId: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Optimization: Indexing date and timeSlot for faster double-booking checks
bookingSchema.index({ date: 1, timeSlot: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
