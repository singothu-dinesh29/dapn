const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    instagramId: {
        type: String,
        required: [true, 'Please add an Instagram ID']
    },
    whatsappNumber: {
        type: String,
        required: [true, 'Please add a WhatsApp number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    profileImage: {
        type: String,
        required: [true, 'Please add a profile image URL']
    }
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('Founder', founderSchema);
