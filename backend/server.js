// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration - FIRST
app.use(cors());

// Body parsing middleware - SECOND
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route - BEFORE other middleware
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Other middleware
// Only use helmet in production
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }
app.use(morgan('dev'));

// Import routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const userRoutes = require('./routes/user');
const fourMRoutes = require('./routes/fourM');
const yamazumiRoutes = require('./routes/yamazumi');

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fourm', fourMRoutes);
app.use('/api/yamazumi', yamazumiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
