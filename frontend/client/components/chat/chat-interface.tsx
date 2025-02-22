"use client"
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userId: string;
  recipientId: string;
}

const SOCKET_URL = 'http://localhost:8000';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      query: { userId }
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    socketRef.current.on('private_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: newMessage,
      senderId: userId,
      timestamp: new Date()
    };

    socketRef.current.emit('private_message', {
      recipientId,
      message
    });

    // Add message to local state immediately
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className={`mb-4 p-2 rounded-lg text-center ${
        isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === userId ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.senderId === userId
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;