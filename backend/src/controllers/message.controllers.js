import Message from "../models/message.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (add to your env variables)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;
    let image;

    // Handle image upload
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
    }

    if (!text && !image) {
        throw new apiError(400, "Message must contain text or image");
    }

    const message = await Message.create({
        senderId,
        receiverId,
        text,
        image,
    });

    res.status(201).json(new apiResponse(201, message, "Message sent successfully"));
});

const getConversation = asyncHandler(async (req, res) => {
    const { recipientId } = req.params;
    const userId = req.user._id;
  
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: recipientId },
        { sender: recipientId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });
  
    // Convert ObjectIds to strings
    const formattedMessages = messages.map(msg => ({
      ...msg.toObject(),
      sender: msg.sender.toString(),
      receiver: msg.receiver.toString()
    }));
  
    res.status(200).json(new apiResponse(200, formattedMessages, "Conversation retrieved"));
  });

export { getConversation, sendMessage };