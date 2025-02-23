"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Video, Send, CheckCircle } from "lucide-react";
import { PrescriptionCard } from "@/components/PrescriptionCard";

export default function DoctorChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "doctor" }[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage("");
      // Simulate a doctor's reply after 1 second
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Thank you for your message. How can I assist you?", sender: "doctor" }]);
      }, 1000);
    }
  };

  const handleMintNFT = async () => {
    setIsMinting(true);
    // Simulate NFT minting process
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Chat Section */}
        <Card className="md:col-span-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">Chat with Dr. Richard James</CardTitle>
            <CardDescription className="text-green-600">General Physician</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white bg-opacity-50 border border-green-200"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar with Video Call and Mint NFT */}
        <div className="space-y-8">
          {/* Video Call Section */}
          <Card className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-800">Video Call</CardTitle>
              <CardDescription className="text-green-600">
                Start a video consultation with your doctor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Video className="mr-2 h-4 w-4" />
                Start Video Call
              </Button>
            </CardContent>
          </Card>

          {/* Mint NFT Section */}
          <Card className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-800">Mint Consultation NFT</CardTitle>
              <CardDescription className="text-green-600">
                Mint an NFT to store your consultation summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionCard />
            </CardContent>
          </Card>

          {/* Doctor Profile Section */}
          <Card className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-800">Doctor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/doctor-avatar.jpg" alt="Dr. Richard James" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-green-800">Dr. Richard James</h3>
                  <p className="text-sm text-green-600">General Physician</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}