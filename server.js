require('dotenv').config();

console.log('🚀 Starting Nirvana...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not configured.');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not configured.');
    process.exit(1);
}

console.log('🌐 Environment:', NODE_ENV);
console.log('🔌 Port:', PORT);

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || true,
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/rewards', require('./routes/rewards'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Nirvana API is running 🌿'
    });
});

// Frontend pages
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/dashboard.html'));
});

app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/schedule.html'));
});

app.get('/rewards', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/rewards.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/admin.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/register.html'));
});

// Frontend fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start application
async function startServer() {
    try {
        console.log('🔄 Connecting to MongoDB Atlas...');

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('✅ MongoDB connected successfully');

        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🌿 Nirvana server running on http://localhost:${PORT}`);
        });

        server.on('error', (error) => {
            console.error('❌ Server error:', error.message);
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

startServer();