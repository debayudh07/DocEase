"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X, Plus } from "lucide-react"

interface DoctorRegistrationFormProps {
  isOpen: boolean
  onClose: () => void
}

export function DoctorRegistrationForm({ isOpen, onClose }: DoctorRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    qualifications: "",
    experience: "",
    email: "",
    phone: "",
    hospital: "",
    fee: "",
    password: "",
  })

  const [passwordStrength, setPasswordStrength] = useState("")
  const [emailError, setEmailError] = useState("")
  const [availabilities, setAvailabilities] = useState([{ day: "", start_time: "", end_time: "" }])

  const addAvailability = () => {
    setAvailabilities([...availabilities, { day: "", start_time: "", end_time: "" }])
  }

  const removeAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailError(emailRegex.test(email) ? "" : "Invalid email format")
  }

  const validatePasswordStrength = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength("Weak")
    } else if (password.length < 8) {
      setPasswordStrength("Moderate")
    } else if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /\W/.test(password)) {
      setPasswordStrength("Strong")
    } else {
      setPasswordStrength("Moderate")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })

    if (id === "email") validateEmail(value)
    if (id === "password") validatePasswordStrength(value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (emailError || passwordStrength === "Weak") {
      alert("Please correct the errors before submitting")
      return
    }

    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">Doctor Registration</DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill out this form to register as a doctor on MediConnect.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="specialty">Specialty</Label>
            <Input id="specialty" required value={formData.specialty} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="qualifications">Qualifications</Label>
            <Textarea id="qualifications" required value={formData.qualifications} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input id="experience" type="number" required value={formData.experience} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input id="email" type="email" required value={formData.email} onChange={handleChange} />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
            <p
              className={`text-sm ${
                passwordStrength === "Weak"
                  ? "text-red-500"
                  : passwordStrength === "Moderate"
                  ? "text-orange-500"
                  : "text-green-500"
              }`}
            >
              {passwordStrength && `Password Strength: ${passwordStrength}`}
            </p>
          </div>
          <div>
            <Label>Availability</Label>
            {availabilities.map((_, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="time" />
                <Input type="time" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAvailability(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addAvailability}>
              <Plus className="h-4 w-4 mr-2" /> Add Availability
            </Button>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="hospital">Hospital Affiliation</Label>
            <Input id="hospital" required value={formData.hospital} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="fee">Consultation Fee</Label>
            <Input id="fee" type="number" required value={formData.fee} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700">
            Register
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
