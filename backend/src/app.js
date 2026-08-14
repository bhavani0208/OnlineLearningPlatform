const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// HTTP logging with morgan + winston
app.use(morgan('dev', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online Learning Platform API is running',
    version: '1.0.0',
    docs: 'http://localhost:5000/api/docs',
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
