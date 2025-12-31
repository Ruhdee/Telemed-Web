
export default (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit("user-connected", socket.id);
        });

        socket.on("offer", (payload) => {
            // payload: { target: socketId, sdp: sessionDescription }
            io.to(payload.target).emit("offer", {
                sdp: payload.sdp,
                caller: socket.id
            });
        });

        socket.on("answer", (payload) => {
            // payload: { target: socketId, sdp: sessionDescription }
            io.to(payload.target).emit("answer", {
                sdp: payload.sdp,
                caller: socket.id
            });
        });

        socket.on("ice-candidate", (payload) => {
            // payload: { target: socketId, candidate: candidate }
            io.to(payload.target).emit("ice-candidate", {
                candidate: payload.candidate,
                caller: socket.id
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
