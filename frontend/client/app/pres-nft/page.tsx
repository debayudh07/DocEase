/* eslint-disable */
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

import axios from "axios"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { contractabi } from "@/contract/contractABI"

export default function PrescriptionForm() {
  const { address, isConnected } = useAccount()
  const [form, setForm] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    prescriptionImage: null,
  })

  const handleChange = (e: { target: { files?: any; name?: any; value?: any } }) => {
    const { name, value } = e.target
    const files = e.target.files
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    })
  }

  const uploadImageToPinata = async () => {
    const formData = new FormData()
    if (form.prescriptionImage) {
      formData.append("file", form.prescriptionImage)
    } else {
      throw new Error("No prescription image file selected")
    }
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "pinata_api_key": process.env.NEXT_PUBLIC_PINATA_API_KEY,
          "pinata_secret_api_key": process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      })
      return res.data.IpfsHash
    } catch (error) {
      console.error("Error uploading prescription image to IPFS:", error)
      return null
    }
  }

  const uploadMetadataToPinata = async (imageHash: any) => {
    const metadata = {
      patientName: form.patientName,
      medication: form.medication,
      dosage: form.dosage,
      prescriptionImage: `ipfs://${imageHash}`,
    }
    
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
        headers: {
          "pinata_api_key": process.env.NEXT_PUBLIC_PINATA_API_KEY,
          "pinata_secret_api_key": process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      })
      return `ipfs://${res.data.IpfsHash}`
    } catch (error) {
      console.error("Error uploading prescription metadata to IPFS:", error)
      return null
    }
  }

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS1 as `0x${string}`

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createPrescription = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!isConnected) {
      alert("Please connect your wallet first!")
      return
    }

    try {
      // Step 1: Upload the prescription image file
      const imageHash = await uploadImageToPinata()
      if (!imageHash) {
        alert("Prescription image upload failed.")
        return
      }
      
      // Step 2: Upload the metadata (including patient name, medication, dosage, and image reference)
      const tokenURI = await uploadMetadataToPinata(imageHash)
      if (!tokenURI) {
        alert("Prescription metadata upload failed.")
        return
      }

      // Step 3: Call the contract to create the prescription
      writeContract({
        address: contractAddress,
        abi: contractabi,
        functionName: "createToken",
        args: [tokenURI, parseEther("400")], // Assuming no price for prescriptions
      })
    } catch (error) {
      console.error("Error creating prescription:", error)
      alert("An error occurred while creating the prescription.")
    }
  }

  return (
    <div>
      
      <div className="min-h-screen bg-white text-green-700 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 gap-8 rounded-xl overflow-hidden backdrop-blur-xl bg-white bg-opacity-90 shadow-2xl border border-green-500/20">
          {/* Form Section */}
          <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold">Create Prescription</h1>
                <p className="mt-2 text-sm text-green-600">Fill in the details below to create a new prescription</p>
              </div>
              <form onSubmit={createPrescription} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patient-name" className="text-green-700">Patient Name</Label>
                    <Input
                      id="patient-name"
                      name="patientName"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="mt-1 bg-white border-green-500/50 text-green-700 placeholder-green-400"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medication" className="text-green-700">Medication</Label>
                    <Input
                      id="medication"
                      name="medication"
                      type="text"
                      placeholder="Medication Name"
                      required
                      className="mt-1 bg-white border-green-500/50 text-green-700 placeholder-green-400"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosage" className="text-green-700">Dosage</Label>
                    <Input
                      id="dosage"
                      name="dosage"
                      type="text"
                      placeholder="500mg"
                      required
                      className="mt-1 bg-white border-green-500/50 text-green-700 placeholder-green-400"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prescription-image" className="text-green-700">Upload Prescription Image</Label>
                    <Input
                      id="prescription-image"
                      name="prescriptionImage"
                      type="file"
                      accept="image/*"
                      required
                      className="mt-1 bg-white border-green-500/50 text-green-700 file:bg-green-100 file:text-green-700 file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-green-200"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {!isConnected ? (
                  <Button onClick={() => alert("Connect your wallet first!")} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">Connect Wallet</Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                    disabled={isTransactionLoading}
                  >
                    {isTransactionLoading ? "Creating Prescription..." : "Create Prescription"}
                  </Button>
                )}
              </form>
              {isSuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                  Successfully created prescription! Transaction hash: {hash}
                </div>
              )}
            </div>
          </div>

          {/* Animated Background Section */}
          <div className="relative h-full w-full overflow-hidden bg-green-50 flex flex-col items-center justify-center">
            <div className="absolute inset-0 w-full h-full bg-green-50 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            
            <h1 className={cn("md:text-4xl text-xl text-green-700 relative z-20")}>
              Create Your Prescription
            </h1>
            <p className="text-center mt-2 text-green-600 relative z-20 px-4">
              Securely store and manage your prescriptions on the blockchain
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}