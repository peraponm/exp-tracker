require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Import database (this will initialize it)
require('./database/db');

// Import helpers
const helpers = require('./utils/helpers');

// Import routes
const expenseRoutes = require('./routes/expenses');
const categoryRoutes = require('./routes/categories');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make helper functions available in all views
app.locals.formatDate = helpers.formatDate;
app.locals.formatCurrency = helpers.formatCurrency;
app.locals.getThaiMonthName = helpers.getThaiMonthName;
app.locals.getCurrentDate = helpers.getCurrentDate;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', expenseRoutes);
app.use('/', categoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).send('ไม่พบหน้าที่คุณต้องการ');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   💰 Expense Tracker is running!     ║
║   🌐 http://localhost:${PORT}          ║
╚═══════════════════════════════════════╝
  `);
});
