const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/account', require('./routes/accountRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/loan', require('./routes/loanRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
