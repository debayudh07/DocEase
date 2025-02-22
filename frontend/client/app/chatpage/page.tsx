"use client"
import ChatInterface from '@/components/chat/chat-interface';
import { useSearchParams } from 'next/navigation';

const ChatPage = () => {
  const searchParams = useSearchParams();
  
  // Get IDs from URL parameters
  const userId = searchParams.get('userId') || "defaultUser";
  const recipientId = searchParams.get('recipientId') || "defaultRecipient";

  return (
    <div className="min-h-screen bg-gray-100">
      <ChatInterface 
        userId={userId} 
        recipientId={recipientId} 
      />
    </div>
  );
};

export default ChatPage;