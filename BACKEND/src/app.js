const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const swaggerDocs = require('./docs/swagger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const { apiLimiter } = require('./middlewares/rateLimitMiddleware');

const app = express();

// Security and utility middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger UI Documentation
swaggerDocs(app);

// Base health check route with versioning
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TMS Backend is running' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const devoteeRoutes = require('./routes/devoteeRoutes');
const donationRoutes = require('./routes/donationRoutes');
const poojaRoutes = require('./routes/pujaRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const staffRoutes = require('./routes/staffRoutes');
const configRoutes = require('./routes/configRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const systemRoutes = require('./routes/systemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const templeRoutes = require('./routes/templeRoutes');
const ticketCategoryRoutes = require('./routes/ticketCategoryRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const accountingRoutes = require('./routes/accountingRoutes');
const shiftRoutes = require('./routes/shiftRoutes');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/devotees', devoteeRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/poojas', poojaRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/temple', templeRoutes);
app.use('/api/v1/ticket-categories', ticketCategoryRoutes);
app.use('/api/v1/accounting', accountingRoutes);
app.use('/api/v1/shifts', shiftRoutes);

// Global Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
