"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "@/app/_context/Doctorcontext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Label } from "@/components/ui/label";

const DoctorProfilePage = () => {
  const router = useRouter();
  const { doctor: initialDoctor, access_token, user_id, logoutDoctor } = useDoctorAuth();
  const [doctor, setDoctor] = useState(initialDoctor);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctor data on mount
  useEffect(() => {
    if (!access_token || !user_id) {
      router.push("/doctor/login");
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/doctors/${user_id}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        setDoctor(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setError("Failed to fetch doctor data. Please try again.");
        logoutDoctor(); // Clear invalid tokens
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [access_token, user_id, router, logoutDoctor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
            <Button
              onClick={() => router.push("/doctor/login")}
              className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-800">Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Full Name</Label>
              <p className="text-gray-900">{doctor?.name}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Phone Number</Label>
              <p className="text-gray-900">{doctor?.contact_info?.phone}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Medical Registration Number</Label>
              <p className="text-gray-900">{doctor?.registrationNumber}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Years of Experience</Label>
              <p className="text-gray-900">{doctor?.experience}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Hospital Affiliation</Label>
              <p className="text-gray-900">{doctor?.hospital_affiliation}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Consultation Fee</Label>
              <p className="text-gray-900">{doctor?.consultation_fee}</p>
            </div>
          </div>
          <Button
            onClick={logoutDoctor}
            className="w-full bg-green-600 text-white hover:bg-green-700"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfilePage;