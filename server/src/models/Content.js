const mongoose = require('mongoose');

/**
 * @desc    Content Model (Portfolio & Admin Assets)
 */
const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a content title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    type: {
        type: String,
        required: [true, 'Please specify content type'],
        enum: {
            values: ['image', 'video', 'ppt', 'website'],
            message: '{VALUE} is not a supported content type'
        }
    },
    fileUrl: {
        type: String,
        required: [true, 'Please add a file URL or External Link']
    },
    externalLink: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { 
    timestamps: true 
});

// Optimization: Indexing for fast retrieval by type and date
contentSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);
