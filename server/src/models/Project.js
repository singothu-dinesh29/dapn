const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Photo Editing',
            'Video Editing',
            'PPT Designing',
            'Website Creation',
            'App Building'
        ]
    },
    thumbnail: {
        type: String,
        required: [true, 'Please add a thumbnail URL']
    },
    media: [{
        type: {
            type: String,
            enum: ['image', 'video'],
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    externalLink: {
        type: String,
        description: 'For live website or app store links'
    },
    description: {
        type: String,
    },
    tags: [String],
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('Project', projectSchema);
