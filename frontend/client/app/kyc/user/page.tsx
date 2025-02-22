"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const KYCForm = () => {
  const [formData, setFormData] = useState({
    emergency_contact: '',
    profileImage: '',
    medical_certificates: [] as string[],
    blood_group: '',
    allergies: [] as string[],
    gender: '',
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [fileUpload, setFileUpload] = useState(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genders = ["male", "female", "other"];

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()]
      });
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    const newAllergies = formData.allergies.filter((_, i) => i !== index);
    setFormData({ ...formData, allergies: newAllergies });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        medical_certificates: [...formData.medical_certificates, file.name]
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-800">Complete Your KYC Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label htmlFor="emergency_contact" className="text-green-700">Emergency Contact Number</Label>
              <Input
                id="emergency_contact"
                type="tel"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="Emergency contact number"
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="profileImage" className="text-green-700">Profile Image</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, profileImage: e.target.files?.[0]?.name || '' })}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Medical Certificates */}
            <div className="space-y-2">
              <Label htmlFor="medical_certificates" className="text-green-700">Medical Certificates</Label>
              <Input
                id="medical_certificates"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full border-green-200 focus:ring-green-500 focus:border-green-500"
                multiple
              />
              {formData.medical_certificates.length > 0 && (
                <div className="mt-2 bg-green-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-green-700">Uploaded certificates:</p>
                  <ul className="list-disc pl-5">
                    {formData.medical_certificates.map((cert, index) => (
                      <li key={index} className="text-sm text-green-600">{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="blood_group" className="text-green-700">Blood Group</Label>
              <Select 
                onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
                value={formData.blood_group}
              >
                <SelectTrigger className="w-full border-green-200 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-green-700">Allergies</Label>
              <div className="flex gap-2">
                <Input
                  id="allergies"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Add allergy"
                  className="flex-1 border-green-200 focus:ring-green-500 focus:border-green-500"
                />
                <Button 
                  type="button" 
                  onClick={handleAddAllergy}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(index)}
                        className="text-green-800 hover:text-green-900 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-green-700">Gender</Label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                value={formData.gender}
              >
                <SelectTrigger className="w-full border-green-200 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default KYCForm;