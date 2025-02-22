"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Doctor {
  name: string;
  // Add other doctor properties as needed
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

export function AppointmentModal({ isOpen, onClose, doctor }: AppointmentModalProps) {
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    reason: "",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setAppointmentData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Here you would handle the appointment booking process
    console.log("Booking appointment:", { doctor, ...appointmentData })
    onClose()
  }

  if (!doctor) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule your appointment with {doctor.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={appointmentData.date}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={appointmentData.time}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={appointmentData.reason}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
            >
              Book Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

