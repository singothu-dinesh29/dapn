const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 2000, // Fail fast (2 seconds)
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        global.DB_STATUS = 'connected';
    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error.message}`);
        global.DB_STATUS = 'disconnected';
        mongoose.set('bufferCommands', false); // Disable buffering globally on failure
        console.warn('Warning: Proceeding without database connectivity. Demo Mode active.');
    }
};

module.exports = connectDB;
