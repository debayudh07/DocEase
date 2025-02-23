"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Stethoscope, Copy } from "lucide-react"

export default function CreateRoomPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomLink, setRoomLink] = useState('')

  const handleCreateRoom = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-room', { method: 'POST' })
      const data = await response.json()

      if (response.ok) {
        setRoomLink(`${window.location.origin}/room/${data.name}`)
      } else {
        setError('Failed to create consultation room.')
      }
    } catch {
      setError('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink)
      .then(() => {
        console.log('Link copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-emerald-400 via-emerald-300 to-white">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-emerald-700 bg-opacity-90">
        <Link className="flex items-center justify-center" href="/">
          <Stethoscope className="h-6 w-6 text-white" />
          <span className="ml-2 text-lg font-semibold text-white">Mediconnect</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg border border-emerald-100">
          <h1 className="text-3xl font-bold text-center text-emerald-800">Start a Video Consultation</h1>
          <Button 
            onClick={handleCreateRoom} 
            disabled={loading}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
          >
            {loading ? 'Creating Session...' : 'Start Consultation'}
          </Button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {roomLink && (
            <div className="space-y-4">
              <p className="text-center text-emerald-800">Session Ready! Share this secure link with your patient:</p>
              <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-900 p-2 rounded border border-emerald-100">
                <Input 
                  value={roomLink} 
                  readOnly 
                  className="flex-1 bg-transparent border-none focus:ring-0" 
                />
                <Button
                  onClick={copyToClipboard}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
              <Button 
                asChild 
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
              >
                <Link href={roomLink}>Enter Consultation Room</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-emerald-800 bg-white bg-opacity-80">
        <p>© 2024 MediMeet. Secure Medical Consultations.</p>
      </footer>
    </div>
  )
}