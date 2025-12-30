require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { createDatabaseIfNotExists } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Telemedicine Backend is Running');
});

// Database Sync and Server Start
// NOTE: { alter: true } updates the schema without dropping tables.
// Change to { force: true } only if you want to reset DB (data loss).
const startServer = async () => {
    try {
        await createDatabaseIfNotExists();
        await sequelize.sync({ alter: true });
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

startServer();
