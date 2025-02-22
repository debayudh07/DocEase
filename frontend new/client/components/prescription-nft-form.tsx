"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function PrescriptionNFTForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
    price: "",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Here you would handle the NFT creation process
    console.log("Creating Prescription NFT:", formData)
    // Reset form after submission
    setFormData({
      patientName: "",
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: "",
      price: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="patientName">Patient Name</Label>
        <Input id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="medication">Medication</Label>
        <Input id="medication" name="medication" value={formData.medication} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="dosage">Dosage</Label>
        <Input id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Input id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
      >
        Create Prescription NFT
      </Button>
    </form>
  )
}

