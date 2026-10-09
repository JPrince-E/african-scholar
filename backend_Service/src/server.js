const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const awardRoutes = require('./routes/awardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const refereeRoutes = require('./routes/refereeRoutes');
const juryRoutes = require('./routes/juryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup supporting both user and admin portals and subdomains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://admin.localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.USER_CLIENT_URL,
  process.env.ADMIN_CLIENT_URL,
  process.env.ADMIN_SUBDOMAIN_URL,
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed)) || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder fallback
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'African Scholar API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/referees', refereeRoutes);
app.use('/api/jury', juryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to ${sequelize.getDialect()} database.`);

    // Sync database schema (alter ensures columns and tables are created without dropping)
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 African Scholar API running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start backend server:', error);
    process.exit(1);
  }
};

startServer();
