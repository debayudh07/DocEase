"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "@/app/_context/Doctorcontext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Availability {
  day: string;
  start_time: string;
  end_time: string;
  recurring: boolean;
  date: string | null;
}

interface DoctorKYCData {
  name: string;
  phone: string;
  specialty: string[];
  qualifications: string[];
  experience: number;
  availability: Availability[];
  hospital_affiliation: string;
  consultation_fee: number;
  registrationNumber: string;
}

const DoctorKYCForm = () => {
  const router = useRouter();
  const { doctor, access_token, user_id, isLoading: authLoading } = useDoctorAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<DoctorKYCData>({
    name: "",
    phone: "",
    specialty: [],
    qualifications: [],
    experience: 0,
    availability: [],
    hospital_affiliation: "",
    consultation_fee: 0,
    registrationNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!access_token || !user_id) {
      router.push("/doctor/login");
      return;
    }

    if (doctor) {
      setFormData({
        name: doctor.name || "",
        phone: doctor.contact_info?.phone || "",
        specialty: doctor.specialty || [],
        qualifications: doctor.qualifications || [],
        experience: doctor.experience || 0,
        availability: doctor.availability || [],
        hospital_affiliation: doctor.hospital_affiliation || "",
        consultation_fee: doctor.consultation_fee || 0,
        registrationNumber: doctor.registrationNumber || "",
      });
      setLoading(false);
    } else {
      const fetchDoctorData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/doctors/update/${user_id}`, {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching doctor data:", error);
          setError("Failed to fetch doctor data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchDoctorData();
    }
  }, [doctor, user_id, access_token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!access_token || !user_id) return;

    // Basic validation
    if (!formData.name || !formData.phone || !formData.registrationNumber) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `http://localhost:8000/api/v1/doctors/update/${user_id}`,
        formData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (response.data) {
        setSuccess("KYC Information Updated Successfully!");
        setTimeout(() => {
          router.push("/dashboard/doctor");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error("Error updating KYC:", error);
      setError("Failed to update KYC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-800">Complete Your Doctor KYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Medical Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital_affiliation">Hospital Affiliation</Label>
              <Input
                id="hospital_affiliation"
                value={formData.hospital_affiliation}
                onChange={(e) => setFormData({ ...formData, hospital_affiliation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultation_fee">Consultation Fee</Label>
              <Input
                id="consultation_fee"
                type="number"
                value={formData.consultation_fee}
                onChange={(e) => setFormData({ ...formData, consultation_fee: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 text-white" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit KYC Information"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorKYCForm;