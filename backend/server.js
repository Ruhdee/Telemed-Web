import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import socketHandler from "./socket.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import apiRoutes from "./routes/api.js";
import { sequelize } from "./models/index.js";
import { createDatabaseIfNotExists } from "./config/database.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

/* Middleware */
app.use(cors());
app.use(express.json()); // Enable JSON body parsing for tabular data

/* API Routes */
app.use("/api/predict", predictionRoutes);
app.use("/api", apiRoutes);

/* Root Check */
app.get("/", (req, res) => {
    res.send("Telemedicine Backend is Running");
});

/* Socket.IO */
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev; restrict in prod
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
