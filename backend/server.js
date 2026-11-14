require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
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

// CORS — allow all origins in production (Vercel handles security at the edge),
// or restrict to localhost in development
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : null;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // In production without explicit allowlist — allow any vercel.app or custom domain
    if (process.env.NODE_ENV === 'production') {
      if (!allowedOrigins || allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }
    }
    // In development allow localhost
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    callback(null, true); // permissive fallback — tighten if needed
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);

// AI-heavy routes — rate limited to protect Gemini API quota
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,         // 1-minute window
  max: 10,                      // max 10 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again in a minute.' },
});
const resumeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,                       // resume uploads are expensive — stricter
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many resume uploads, please wait before retrying.' },
});

app.use('/api/resume', resumeLimiter, resumeRoutes);
app.use('/api/interview', aiLimiter, interviewRoutes);
app.use('/api/roadmap', aiLimiter, roadmapRoutes);
app.use('/api/coding', aiLimiter, codingRoutes);
app.use('/api/tracker', trackerRoutes);
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

