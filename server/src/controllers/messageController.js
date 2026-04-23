const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user._id;

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // Populate sender info for real-time update
        const populatedMessage = await newMessage.populate('senderId', 'name email');

        // Emit via Socket.IO
        if (global.io) {
            // Emit to a specific "room" based on receiverId
            global.io.to(receiverId.toString()).emit('newMessage', populatedMessage);
        }

        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get chat history between two users
// @route   GET /api/messages/:receiverId
// @access  Private
exports.getChatHistory = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
        .sort('createdAt')
        .populate('senderId', 'name email')
        .populate('receiverId', 'name email');

        res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
