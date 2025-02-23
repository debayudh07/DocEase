"use client"

import { useEffect, useRef, useState } from 'react'
import DailyIframe, { DailyCall } from '@daily-co/daily-js'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, Settings, PhoneOff, Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function RoomPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<DailyCall | null>(null)
  const { roomName } = useParams()
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [participantCount, setParticipantCount] = useState(1)
  const [chatMessage, setChatMessage] = useState('')

  const sendChatMessage = () => {
    if (callFrameRef.current && chatMessage.trim()) {
      callFrameRef.current.sendAppMessage({ message: chatMessage }, '*');
      setChatMessage('');
    }
  }

  const toggleAudio = () => {
    if (callFrameRef.current) {
      const audio = callFrameRef.current.participants().local.audio;
      callFrameRef.current.setLocalAudio(!audio);
      setIsMuted(!audio);
    }
  }

  const toggleVideo = () => {
    if (callFrameRef.current) {
      const video = callFrameRef.current.participants().local.video;
      callFrameRef.current.setLocalVideo(!video);
      setIsVideoOff(!video);
    }
  }

  const handleParticipantJoined = () => {
    setParticipantCount(prev => prev + 1)
  }

  const handleParticipantLeft = () => {
    setParticipantCount(prev => prev - 1)
  }

  const leaveCall = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave().then(() => {
        window.location.href = '/'
      })
    }
  }

  useEffect(() => {
    if (!roomName || !containerRef.current) {
      console.error('Room name or container ref is not available')
      return
    }

    const roomURL = `https://debayudhbasu.daily.co/${roomName}`

    if (callFrameRef.current) {
      callFrameRef.current.destroy()
      callFrameRef.current = null
    }

    try {
      const callFrame = DailyIframe.createFrame(containerRef.current, {
        url: roomURL,
        showLeaveButton: false,
        theme: {
          colors: {
            accent: "#059669",
            background: "#ffffff",
            mainAreaBg: "#f0fdf4"
          }
        }
      })

      callFrameRef.current = callFrame

      callFrame.on('participant-joined', handleParticipantJoined)
      callFrame.on('participant-left', handleParticipantLeft)

      callFrame.join().then(() => {
        console.log('Successfully joined the consultation')
      }).catch((err) => {
        console.error('Failed to join consultation:', err)
        setError(`Failed to join the session: ${err.message}`)
      })
    } catch (err) {
      console.error('Error creating Daily iframe:', err)
      setError(`Failed to create the consultation: ${err instanceof Error ? err.message : String(err)}`)
    }

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy()
        callFrameRef.current = null
      }
    }
  }, [roomName])

  // ... keep the existing handler functions unchanged ...

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-emerald-100 via-emerald-50 to-white">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-emerald-700 bg-opacity-90">
        <Link className="flex items-center justify-center" href="/">
          <Stethoscope className="h-6 w-6 text-white" />
          <span className="ml-2 text-lg font-semibold text-white">Mediconnect</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-white bg-opacity-90 shadow-xl border-emerald-100">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-emerald-800">
              Consultation Room: {roomName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={containerRef} className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-emerald-100" />
            {error && (
              <div className="text-red-500 text-center mb-4">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Button onClick={toggleAudio} variant={isMuted ? "destructive" : "default"} className="bg-emerald-600 text-white hover:bg-emerald-700">
                {isMuted ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Button onClick={toggleVideo} variant={isVideoOff ? "destructive" : "default"} className="bg-emerald-600 text-white hover:bg-emerald-700">
                {isVideoOff ? <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Video className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button onClick={leaveCall} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
              <Label htmlFor="chat-input" className="sr-only">Secure message</Label>
              <Input
                id="chat-input"
                placeholder="Type a secure message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="bg-emerald-50 text-emerald-900 placeholder-emerald-400 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <Button onClick={sendChatMessage} className="bg-emerald-600 text-white hover:bg-emerald-700 w-full sm:w-auto">
                Send
              </Button>
            </div>
            <div className="text-sm text-center text-emerald-700">
              Participants in session: {participantCount}
            </div>
          </CardFooter>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-emerald-800 bg-white bg-opacity-80">
        <p>© 2024 MediMeet. HIPAA-compliant video consultations.</p>
      </footer>
    </div>
  )
}