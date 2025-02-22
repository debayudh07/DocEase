"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import type { Doctor } from "@/components/doctor-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Activity, Pill, Clock } from "lucide-react";
import { PrescriptionNFTForm } from "@/components/prescription-nft-form";
import { DoctorsList } from "@/components/doctor-list";
import { AppointmentModal } from "@/components/appointment-modal";
import { FloatingPaper } from "@/components/common/floating-paper";

import Navbar2 from "@/components/common/navbar2";

export default function UserHealthDashboard() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const router = useRouter(); // Initialize useRouter

  const openAppointmentModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsAppointmentModalOpen(true);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    // Redirect to the /appointment page
    router.push(`/appointment`); // Pass doctor ID as a query parameter
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <Navbar2 />
      <FloatingPaper count={8} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento grid layout */}
          <GlassCard className="md:col-span-2 row-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">Prescription NFT</CardTitle>
            </CardHeader>
            <CardContent>
              <PrescriptionNFTForm />
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">3</div>
              <p className="text-sm text-green-600">Next: Dr. Smith on 18th May</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Active Prescriptions</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">2</div>
              <p className="text-sm text-green-600">Last updated: 2 days ago</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Health Score</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">85/100</div>
              <p className="text-sm text-green-600">Improved by 5 points</p>
            </CardContent>
          </GlassCard>

          <GlassCard className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">Book an Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pass handleBookAppointment as the onBookAppointment prop */}
              <DoctorsList onBookAppointment={handleBookAppointment} />
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Medication Reminder</CardTitle>
              <Pill className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600">Next dose in 2 hours</div>
              <div className="mt-2 text-xs text-green-500">Aspirin - 1 tablet</div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Next Check-up</CardTitle>
              <Clock className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600">Annual physical</div>
              <div className="mt-2 text-xs text-green-500">In 3 weeks</div>
            </CardContent>
          </GlassCard>
        </div>
      </div>

      {selectedDoctor && (
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Card
      className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-xl ${className}`}
    >
      {children}
    </Card>
  );
}