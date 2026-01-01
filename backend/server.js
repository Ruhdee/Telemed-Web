require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
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
// NOTE: { force: false } ensures we don't drop tables on restart.
// Change to true only if you want to reset DB (data loss).
sequelize.sync({ force: false }).then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
