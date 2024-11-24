// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set mongoose strictQuery option
mongoose.set('strictQuery', false);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const accountRoutes = require('./routes/accountRoutes');

// Use routes
app.use('/api/accounts', accountRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Banking App API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server with port availability check
const PORT = process.env.PORT || 5000;

const startServer = () => {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}`);
            server.close();
            app.listen(PORT + 1, () => {
                console.log(`Server is running on port ${PORT + 1}`);
            });
        } else {
            console.error('Server error:', error);
        }
    });
};

startServer();
