// DoctorDashboard.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Activity, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Heart, 
  Stethoscope,
  BadgeCheck,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FloatingPaper } from "@/components/common/floating-paper"
import Navbar from "@/components/common/navbar"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

interface Appointment {
  name: string;
  time: string;
  date: string;
  type: string;
  location: string;
  phone: string;
  status: string;
  notes: string;
  lastVisit: string;

}

export default function DoctorDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Week")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  
  const appointments: Appointment[] = [
    {
      name: "Sankhadeep Chowdhury",
      time: "09:00 AM",
      date: "Feb 9, 2025",
      type: "Check-up",
      location: "Room 101",
      phone: "4567",
      status: "Confirmed",
      notes: "Regular annual check-up, patient has history of hypertension",
      lastVisit: "Jan 9, 2025",
     
    },
    {
      name: "rajarshi",
      time: "11:30 PM",
      date: "Feb 24, 2025",
      type: "Consultation",
      location: "Room 105",
      phone: "7980564387",
      status: "Confirmed",
      notes: "Initial consultation for knee pain",
      lastVisit: "N/A",
    },
    {
      name: "Alice Brown",
      time: "03:30 PM",
      date: "Feb 9, 2025",
      type: "Review",
      location: "Room 102",
      phone: "+1 (555) 456-7890",
      status: "Confirmed",
      notes: "Monthly review of chronic condition",
      lastVisit: "Jan 15, 2025",
     
    }
  ]

  const recentActivity = [
    { icon: Users, text: "New patient registered", time: "2 mins ago", color: "bg-blue-100" },
    { icon: Calendar, text: "Appointment rescheduled", time: "1 hour ago", color: "bg-emerald-100" },
    { icon: Heart, text: "Updated patient records", time: "3 hours ago", color: "bg-red-100" },
    { icon: DollarSign, text: "Payment received", time: "5 hours ago", color: "bg-yellow-100" },
  ]

  const quickStats = [
    { label: "Completion Rate", value: "98%", color: "bg-green-100" },
    { label: "Patient Satisfaction", value: "4.8/5", color: "bg-blue-100" },
    { label: "Average Wait Time", value: "12 mins", color: "bg-purple-100" }
  ]

  const handleAppointmentAction = (action: 'accept' | 'reject' | 'delay') => {
    if (!selectedAppointment) return;
    
    const actionMessages = {
      accept: {
        title: 'Appointment Confirmed',
        description: `Appointment with ${selectedAppointment.name} has been confirmed for ${selectedAppointment.date} at ${selectedAppointment.time}`,
        type: toast.success
      },
      reject: {
        title: 'Appointment Rejected',
        description: `Appointment with ${selectedAppointment.name} has been rejected`,
        type: toast.error
      },
      delay: {
        title: 'Appointment Delayed',
        description: 'Please select a new time slot',
        type: toast.warning
      }
    }

    const message = actionMessages[action]
    message.type(message.title, {
      description: message.description
    })
    
    setSelectedAppointment(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Toaster />
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={8} />
      </div>
      <Navbar />
      
      <div className="relative backdrop-blur-sm bg-white/20">
        {/* Header Section */}
        <header className="border-b border-white/20 backdrop-blur-md bg-white/30">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-900">Medical Dashboard</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/60">
                  {selectedTimeRange} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/80 backdrop-blur-md">
                <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedTimeRange("Today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeRange("This Week")}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeRange("This Month")}>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            {/* Stats Cards */}
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Patients", value: "1,234", change: "+10% from last month", icon: Users, color: "from-blue-500/20 to-blue-600/20" },
                { title: "Appointments", value: "42", change: "This week", icon: Calendar, color: "from-emerald-500/20 to-emerald-600/20" },
                { title: "Total Hours", value: "38.5", change: "This week", icon: Clock, color: "from-purple-500/20 to-purple-600/20" },
                { title: "Revenue", value: "$4,320", change: "This month", icon: DollarSign, color: "from-amber-500/20 to-amber-600/20" }
              ].map((stat, index) => (
                <Card key={index} className="backdrop-blur-md bg-gradient-to-br border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold text-emerald-900">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-emerald-700" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-900">{stat.value}</div>
                    <p className="text-sm text-emerald-600">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Activity Feed */}
            <Card className="col-span-full md:col-span-3 lg:col-span-4 backdrop-blur-md bg-white/40 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-900 flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg hover:bg-white/30 transition-colors">
                      <div className={`p-2 rounded-lg ${item.color} mr-3`}>
                        <item.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-emerald-900">{item.text}</p>
                        <p className="text-sm text-emerald-600">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="col-span-full md:col-span-3 lg:col-span-4 backdrop-blur-md bg-white/40 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-900 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5" /> Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base text-emerald-900">{stat.label}</span>
                        <span className="text-base text-emerald-600 font-semibold">{stat.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-emerald-100/30">
                        <div className={`h-full rounded-full ${stat.color} w-[98%]`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appointments Grid */}
            <Card className="col-span-full backdrop-blur-md bg-white/40 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointments.map((appointment, index) => (
                    <Card 
                      key={index} 
                      className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-emerald-900">{appointment.name}</h3>
                            <p className="text-sm text-emerald-600">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                            <span className="text-emerald-900">{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                            <span className="text-emerald-900">{appointment.location}</span>
                          </div>
                          <div className="mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === "Confirmed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Appointment Details Modal */}
        <Dialog open={selectedAppointment !== null} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-2xl bg-white backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
                <Calendar className="h-6 w-6" /> Appointment Details
              </DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-6 p-4">
                {/* Patient Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-emerald-100">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-900">{selectedAppointment.name}</h3>
                    <p className="text-emerald-600">{selectedAppointment.type}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAppointment.status === "Confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-900 mb-2">Schedule</h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm text-emerald-800">{selectedAppointment.date} at {selectedAppointment.time}</p>
                      </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-900 mb-2">Contact</h4>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm text-emerald-800">{selectedAppointment.phone}</p>
                      </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-900 mb-2">Location</h4>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm text-emerald-800">{selectedAppointment.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-900 mb-2">Insurance</h4>
                      <div className="space-y-2">
                       
                      </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-900 mb-2">Last Visit</h4>
                      <p className="text-sm text-emerald-800">{selectedAppointment.lastVisit}</p>
                    </div>

                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-900 mb-2">Notes</h4>
                      <p className="text-sm text-emerald-800">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <Button 
                    onClick={() => handleAppointmentAction('accept')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button 
                    onClick={() => handleAppointmentAction('reject')}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleAppointmentAction('delay')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center justify-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Delay
                  </Button>
                </div>

                {/* Close Button */}
                <Button 
                  onClick={() => setSelectedAppointment(null)}
                  className="w-full bg-white hover:bg-white/90 text-emerald-600 border border-emerald-200"
                >
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}