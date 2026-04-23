const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// INITIALIZE GLOBAL ECOSYSTEM
global.DB_STATUS = 'initializing';
global.DEMO_USERS = []; 

dotenv.config();
require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH']
    }
});

// Expose io globally
global.io = io;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true
}));

// DIAGNOSTIC LOGGER
app.use((req, res, next) => {
    console.log(`[STABLE-LOG-V4] ${req.method} ${req.url} | DB: ${global.DB_STATUS}`);
    next();
});

// START DB
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const founderRoutes = require('./routes/founderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking', require('./routes/bookingRoutes')); // New Clean Booking API
app.use('/api/founders', founderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
    console.log(`[REAL-TIME] New link established: ${socket.id}`);
    
    // User joins their own private room for targeted messages
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`[REAL-TIME] User ${userId} joined their private channel.`);
    });

    socket.on('disconnect', () => {
        console.log(`[REAL-TIME] Link severed: ${socket.id}`);
    });
});

app.get('/', (req, res) => {
  res.json({ message: 'Dapnix API Stable v4.0 (Real-Time Admin Active)' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`REAL-TIME SERVER UP: http://0.0.0.0:${PORT}`);
});
