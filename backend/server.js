require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { sequelize } = require("./models");
const { createDatabaseIfNotExists } = require("./config/database");
const apiRoutes = require("./routes/api");
const ocrRoutes = require("./routes/ocr");
const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* API Routes */
app.use("/api", apiRoutes);
app.use("/api", ocrRoutes); // FIX: OCR routes mounted

/* Health Check */
app.get("/", (req, res) => {
    res.send("Telemedicine Backend is Running");
});

/* Socket.IO */
const io = new Server(server, {
    cors: {
        origin: "*", // dev only
        methods: ["GET", "POST"],
    },
});

socketHandler(io);

/* DB + Server Start */
const startServer = async () => {
    try {
        await createDatabaseIfNotExists();
        await sequelize.sync({ alter: true });
        console.log("Database connected and synced");

        server.listen(PORT, () => {
            console.log(`Server running (API + Socket) on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server startup failed:", err);
    }
};

startServer();
