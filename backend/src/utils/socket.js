import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import app from "../app.js";
import Message from "../models/message.models.js";
import { v2 as cloudinary } from 'cloudinary';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const userSockets = new Map();

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  const userType = String(socket.handshake.query.userType).charAt(0).toUpperCase() 
                + String(socket.handshake.query.userType).slice(1).toLowerCase();
               // 'User' or 'Doctor'

               if (!['User', 'Doctor'].includes(userType)) {
                socket.disconnect();
                return;
              }
  // Store connection with type
  userSockets.set(userId, { 
    socketId: socket.id,
    userType 
  });

  socket.on('private_message', async (data) => {
    try {
      // Convert to ObjectIds
      const senderObjectId = new mongoose.Types.ObjectId(userId);
      const receiverObjectId = new mongoose.Types.ObjectId(data.recipientId);
  
      // Create message with correct schema fields
      const message = await Message.create({
        sender: senderObjectId,
        senderType: userType,
        receiver: receiverObjectId,
        receiverType: data.recipientType,
        text: data.text,
        image: data.image
      });
  
      // Convert to plain object and stringify IDs
      const messageData = message.toObject({
        transform: (doc, ret) => {
          ret.sender = ret.sender.toString();
          ret.receiver = ret.receiver.toString();
          return ret;
        }
      });
  
      // Inside 'private_message' handler:
      const recipientType = String(data.recipientType).charAt(0).toUpperCase() 
                          + String(data.recipientType).slice(1).toLowerCase();

      const recipientEntry = Array.from(userSockets.entries()).find(
        ([id, info]) => id === data.recipientId && info.userType === recipientType
      );
  
      if (recipientEntry) {
        io.to(recipientEntry[1].socketId).emit('receive_message', messageData);
      }
  
      // Confirm to sender
      socket.emit('message_sent', messageData);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('message_error', error.message);
    }
  });

  socket.on('disconnect', () => {
    userSockets.delete(userId);
  });
});

export { io, server, app };