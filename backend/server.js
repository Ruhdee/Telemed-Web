import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketHandler from "./socket.js";
import predictionRoutes from "./routes/predictionRoutes.js";

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON body parsing for tabular data

// Setup routes
app.use("/api/predict", predictionRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"],
    },
});

// Initialize socket handlers
socketHandler(io);

const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
