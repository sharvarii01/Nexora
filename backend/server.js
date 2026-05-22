require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const codingRoutes = require('./routes/coding');
const trackerRoutes = require('./routes/tracker');
const roadmapRoutes = require('./routes/roadmap');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://nexora.app' : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nexora API is running', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Nexora Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}\n`);
  });
}

module.exports = app;

