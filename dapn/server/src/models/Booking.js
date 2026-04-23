const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    emailOrMobile: {
        type: String,
        required: [true, 'Please add an email or mobile number']
    },
    submissionDate: {
        type: Date,
        required: [true, 'Please add a submission date']
    },
    handoverDate: {
        type: Date,
        required: [true, 'Please add a handover date']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Please specify a payment method'],
        enum: ['UPI', 'Stripe']
    },
    projectType: {
        type: String,
        required: [true, 'Please specify a project type'],
        enum: ['Photo editing', 'Video editing', 'PPT designing', 'Website building', 'App creation']
    },
    description: {
        type: String,
        required: [true, 'Please add a project description']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String,
        default: ''
    }
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('Booking', bookingSchema);
