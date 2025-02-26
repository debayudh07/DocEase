"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  contact_info: {
    email?: string;
    phone?: string;
  };
  experience?: number;
  hospital_affiliation?: string;
  consultation_fee?: number;
  registrationNumber?: string;
  avatar?: string;
}

export function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!searchTerm.trim()) {
        setDoctors([]); // Clear the list if the search term is empty
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Sending search term:', { name: searchTerm }); // Debugging

        const response = await axios.post(
          'http://localhost:8000/api/v1/doctors/PostDoc',
          { name: searchTerm },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch doctors');
        }
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to fetch doctors' : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle routing to the doctor's booking page
  const handleBookAppointment = (doctorId: string) => {
    console.log('Booking appointment with doctor:', doctorId); // Debugging
    router.push(`/appointment/${doctorId}`); // Navigate to the doctor's booking page
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading && <p className="text-center text-green-600">Loading doctors...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {doctors.length === 0 && !loading && (
        <p className="text-center text-gray-500">No doctors found</p>
      )}

      {doctors.map((doctor) => (
        <div key={doctor._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
            </div>
          </div>
          <Button
            onClick={() => handleBookAppointment(doctor._id)} // Pass the doctor's ID
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Book Appointment
          </Button>
        </div>
      ))}
    </div>
  );
}