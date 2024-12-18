const express = require('express');
const cors = require('cors');
require('dotenv').config();
const client = require('./config/whatsapp');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize WhatsApp client
client.initialize()
    .then(() => {
        console.log('WhatsApp client initialization started');
    })
    .catch(err => {
        console.error('Error initializing WhatsApp client:', err);
    });

// Routes
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'WhatsApp API is running'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});