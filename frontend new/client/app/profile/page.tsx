"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "@/app/_context/Doctorcontext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";

const DoctorProfilePage = () => {
  const router = useRouter();
  const { doctor, access_token, user_id, isLoading: authLoading } = useDoctorAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialty: [] as string[],
    qualifications: [] as string[],
    experience: 0,
    hospital_affiliation: "",
    consultation_fee: 0,
    registrationNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!access_token) {
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
        hospital_affiliation: doctor.hospital_affiliation || "",
        consultation_fee: doctor.consultation_fee || 0,
        registrationNumber: doctor.registrationNumber || "",
      });
      setLoading(false);
    }
  }, [doctor, user_id, access_token, router]);

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Switch back to view mode
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone || !formData.registrationNumber) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Prepare the data to be sent to the backend
      const updateData = {
        name: formData.name,
        specialty: formData.specialty,
        qualifications: formData.qualifications,
        experience: formData.experience,
        contact_info: {
          phone: formData.phone,
        },
        hospital_affiliation: formData.hospital_affiliation,
        consultation_fee: formData.consultation_fee,
        registrationNumber: formData.registrationNumber,
      };

      // Send the update request to the backend
      const response = await axios.put(
        `http://localhost:8000/api/v1/doctors/update/${user_id}`,
        updateData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (response.data) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false); // Switch back to view mode after successful update
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
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

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Doctor data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-800">
            {isEditing ? "Edit Doctor Profile" : "Doctor Profile"}
          </CardTitle>
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

          {isEditing ? (
            // Edit Mode Form
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
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={formData.specialty.join(", ")}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value.split(", ") })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={formData.qualifications.join(", ")}
                  onChange={(e) =>
                    setFormData({ ...formData, qualifications: e.target.value.split(", ") })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital_affiliation">Hospital Affiliation</Label>
                <Input
                  id="hospital_affiliation"
                  value={formData.hospital_affiliation}
                  onChange={(e) =>
                    setFormData({ ...formData, hospital_affiliation: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation_fee">Consultation Fee</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  value={formData.consultation_fee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultation_fee: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Medical Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-green-600 text-white" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-gray-500 text-white"
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <p className="text-gray-700">{doctor.name}</p>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <p className="text-gray-700">{doctor.contact_info?.phone}</p>
              </div>

              <div className="space-y-2">
                <Label>Specialty</Label>
                <p className="text-gray-700">{doctor.specialty?.join(", ")}</p>
              </div>

              <div className="space-y-2">
                <Label>Qualifications</Label>
                <p className="text-gray-700">{doctor.qualifications?.join(", ")}</p>
              </div>

              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <p className="text-gray-700">{doctor.experience}</p>
              </div>

              <div className="space-y-2">
                <Label>Hospital Affiliation</Label>
                <p className="text-gray-700">{doctor.hospital_affiliation}</p>
              </div>

              <div className="space-y-2">
                <Label>Consultation Fee</Label>
                <p className="text-gray-700">{doctor.consultation_fee}</p>
              </div>

              <div className="space-y-2">
                <Label>Medical Registration Number</Label>
                <p className="text-gray-700">{doctor.registrationNumber}</p>
              </div>

              <Button
                onClick={handleEditClick}
                className="w-full bg-green-600 text-white"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfilePage;