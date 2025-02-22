"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Availability {
  day: string;
  start_time: string;
  end_time: string;
  recurring: boolean;
  date: string | null;
}

interface DoctorKYCData {
  specialty: string[];
  qualifications: string[];
  experience: number;
  availability: Availability[];
  hospital_affiliation: string;
  consultation_fee: number;
  registrationNumber: string;
  profileImage: string;
}

const DoctorKYCForm = () => {
  const [formData, setFormData] = useState<DoctorKYCData>({
    specialty: [],
    qualifications: [],
    experience: 0,
    availability: [],
    hospital_affiliation: '',
    consultation_fee: 0,
    registrationNumber: '',
    profileImage: ''
  });

  const [specialtyInput, setSpecialtyInput] = useState('');
  const [qualificationInput, setQualificationInput] = useState('');
  const [availabilityInput, setAvailabilityInput] = useState<Availability>({
    day: 'Monday',
    start_time: '',
    end_time: '',
    recurring: true,
    date: null
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleAddSpecialty = () => {
    if (specialtyInput.trim()) {
      setFormData({
        ...formData,
        specialty: [...formData.specialty, specialtyInput.trim()]
      });
      setSpecialtyInput('');
    }
  };

  const handleAddQualification = () => {
    if (qualificationInput.trim()) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, qualificationInput.trim()]
      });
      setQualificationInput('');
    }
  };

  const handleAddAvailability = () => {
    if (availabilityInput.start_time && availabilityInput.end_time) {
      setFormData({
        ...formData,
        availability: [...formData.availability, availabilityInput]
      });
      setAvailabilityInput({
        day: 'Monday',
        start_time: '',
        end_time: '',
        recurring: true,
        date: null
      });
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setFormData({
      ...formData,
      specialty: formData.specialty.filter((_, i) => i !== index)
    });
  };

  const handleRemoveQualification = (index: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index)
    });
  };

  const handleRemoveAvailability = (index: number) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-800">Complete Your Doctor KYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="profileImage" className="text-green-700">Profile Image</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, profileImage: e.target.files?.[0]?.name || '' })}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="registrationNumber" className="text-green-700">Medical Registration Number</Label>
              <Input
                id="registrationNumber"
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-green-700">Specialties</Label>
              <div className="flex gap-2">
                <Input
                  id="specialty"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  placeholder="Add specialty"
                  className="flex-1 border-green-200 focus:ring-green-500 focus:border-green-500"
                />
                <Button 
                  type="button" 
                  onClick={handleAddSpecialty}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.specialty.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialty.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(index)}
                        className="text-green-800 hover:text-green-900 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <Label htmlFor="qualifications" className="text-green-700">Qualifications</Label>
              <div className="flex gap-2">
                <Input
                  id="qualifications"
                  value={qualificationInput}
                  onChange={(e) => setQualificationInput(e.target.value)}
                  placeholder="Add qualification"
                  className="flex-1 border-green-200 focus:ring-green-500 focus:border-green-500"
                />
                <Button 
                  type="button" 
                  onClick={handleAddQualification}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.qualifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.qualifications.map((qualification, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {qualification}
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(index)}
                        className="text-green-800 hover:text-green-900 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-green-700">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Hospital Affiliation */}
            <div className="space-y-2">
              <Label htmlFor="hospital_affiliation" className="text-green-700">Hospital Affiliation</Label>
              <Input
                id="hospital_affiliation"
                type="text"
                value={formData.hospital_affiliation}
                onChange={(e) => setFormData({ ...formData, hospital_affiliation: e.target.value })}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Consultation Fee */}
            <div className="space-y-2">
              <Label htmlFor="consultation_fee" className="text-green-700">Consultation Fee</Label>
              <Input
                id="consultation_fee"
                type="number"
                min="0"
                value={formData.consultation_fee}
                onChange={(e) => setFormData({ ...formData, consultation_fee: parseInt(e.target.value) || 0 })}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label className="text-green-700">Availability</Label>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    value={availabilityInput.day}
                    onValueChange={(value) => setAvailabilityInput({ ...availabilityInput, day: value })}
                  >
                    <SelectTrigger className="border-green-200 focus:ring-green-500 focus:border-green-500">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={availabilityInput.start_time}
                      onChange={(e) => setAvailabilityInput({ ...availabilityInput, start_time: e.target.value })}
                      className="flex-1 border-green-200 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="time"
                      value={availabilityInput.end_time}
                      onChange={(e) => setAvailabilityInput({ ...availabilityInput, end_time: e.target.value })}
                      className="flex-1 border-green-200 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddAvailability}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Add Availability
                </Button>
              </div>
              {formData.availability.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.availability.map((slot, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-green-50 p-3 rounded-lg"
                    >
                      <span className="text-green-800">
                        {slot.day}: {slot.start_time} - {slot.end_time}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAvailability(index)}
                        className="text-green-800 hover:text-green-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Submit KYC Information
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorKYCForm;