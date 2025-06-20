require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});