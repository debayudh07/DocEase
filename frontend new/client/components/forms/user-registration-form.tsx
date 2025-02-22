"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface UserRegistrationFormProps {
  isOpen: boolean
  onClose: () => void
}

export function UserRegistrationForm({ isOpen, onClose }: UserRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    password: "",
    emergencyContact: "",
    bloodGroup: "",
  })

  const [passwordStrength, setPasswordStrength] = useState("")
  const [emailError, setEmailError] = useState("")

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto bg-gradient-to-r from-green-50 via-white/80 to-green-50 border border-green-100/20 shadow-[0_8px_30px_rgba(52,211,153,0.2)] rounded-2xl">
        <DialogHeader className="bg-white/40  rounded-t-2xl border-b border-green-100/20 p-6">
          <DialogTitle className="text-2xl font-bold text-green-700">Patient Registration</DialogTitle>
          <DialogDescription className="text-green-600/80">
            Join MediConnect to access quality healthcare services.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-green-700 font-medium">Full Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-green-700 font-medium">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.email} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
              placeholder="your.email@example.com"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-green-700 font-medium">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={formData.password} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
              placeholder="Create a strong password"
            />
            <p className={`text-sm mt-1 ${
              passwordStrength === "Weak" ? "text-red-500" :
              passwordStrength === "Moderate" ? "text-orange-500" :
              "text-green-500"
            }`}>
              {passwordStrength && `Password Strength: ${passwordStrength}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-green-700 font-medium">Date of Birth</Label>
            <Input 
              id="dateOfBirth" 
              type="date" 
              required 
              value={formData.dateOfBirth} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-green-700 font-medium">Gender</Label>
            <select 
              id="gender" 
              required 
              value={formData.gender} 
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full p-2 rounded-md bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200 text-green-700"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-green-700 font-medium">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              required 
              value={formData.phone} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-green-700 font-medium">Address</Label>
            <Input 
              id="address" 
              required 
              value={formData.address} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
              placeholder="Enter your address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact" className="text-green-700 font-medium">Emergency Contact</Label>
            <Input 
              id="emergencyContact" 
              required 
              value={formData.emergencyContact} 
              onChange={handleChange}
              className="bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200"
              placeholder="Emergency contact number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGroup" className="text-green-700 font-medium">Blood Group</Label>
            <select 
              id="bloodGroup" 
              required 
              value={formData.bloodGroup} 
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full p-2 rounded-md bg-white/50  border border-green-100 focus:border-green-300 focus:ring-green-200 transition-all duration-200 text-green-700"
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600/90 hover:bg-green-700 text-white transition-all duration-200 shadow-lg shadow-green-100 hover:shadow-green-200 mt-6"
          >
            Complete Registration
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}