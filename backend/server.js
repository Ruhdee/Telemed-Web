const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const socketHandler = require("./socket");

const app = express();
app.use(cors());

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
    console.log(`Signaling server running on port ${PORT}`);
});
