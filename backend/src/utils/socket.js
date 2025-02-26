import { Server } from "socket.io";
import http from "http";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

// Store user socket connections
const userSockets = new Map();

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);
    
    // Store user connection
    userSockets.set(userId, socket.id);

    // Handle private messages
    socket.on('private_message', (data) => {
        const { recipientId, message } = data;
        console.log(`Message from ${userId} to ${recipientId}:, message`);

        // Get recipient socket ID
        const recipientSocketId = userSockets.get(recipientId);

        if (recipientSocketId) {
            // Send directly to recipient
            io.to(recipientSocketId).emit('private_message', {
                ...message,
                senderId: userId,
                recipientId
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        userSockets.delete(userId);
    });
});

export { io, server, app };