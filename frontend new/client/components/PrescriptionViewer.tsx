'use client'

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { contractabi } from '@/contract/contractABI'
import { ethers } from 'ethers'
import { Loader2 } from 'lucide-react'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS1 as `0x${string}`

interface PrescriptionMetadata {
  tokenId: string;
  patientName: string;
  medication: string;
  dosage: string;
  image: string;
}

interface ListedPrescription {
  tokenId: bigint;
  price: bigint;
}

interface PrescriptionWithPrice extends PrescriptionMetadata {
  price: string;
}

// Utility function to convert IPFS URL to HTTP URL
const convertIpfsToHttp = (url: string) => {
  if (!url) return ''
  return url.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
    : url
}

export default function PrescriptionViewer() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWithPrice | null>(null)
  const [sellingPrescription, setSellingPrescription] = useState<PrescriptionWithPrice | null>(null)
  const [sellPrice, setSellPrice] = useState('')
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  // Initialize provider, signer, and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractabi, signer)
        setProvider(provider)
        setSigner(signer)
        setContract(contract)
      }
    }
    init()
  }, [])

  // Get listed prescriptions
  useEffect(() => {
    const fetchListedPrescriptions = async () => {
      if (!contract) return

      try {
        setLoading(true)
        setError(null)

        const listedPrescriptions = await contract.getAllListedNFTs()
        const prescriptionsData = await Promise.all(
          listedPrescriptions.map(async (prescription: ListedPrescription) => {
            const tokenURI = await contract.tokenURI(prescription.tokenId)
            if (!tokenURI) throw new Error(`No URI found for token ${prescription.tokenId}`)

            const metadata = await fetchPrescriptionMetadata(prescription.tokenId, tokenURI)
            return {
              ...metadata,
              price: ethers.formatEther(prescription.price) + ' ETH',
            }
          })
        )

        setPrescriptions(prescriptionsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching prescriptions')
        console.error('Error fetching prescription details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListedPrescriptions()
  }, [contract])

  // Fetch metadata for a prescription
  const fetchPrescriptionMetadata = async (tokenId: bigint, tokenURI: string) => {
    const httpUrl = convertIpfsToHttp(tokenURI);
    console.log("Fetching metadata from:", httpUrl);

    try {
      const response = await fetch(httpUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      let metadata;
      if (contentType?.includes("application/json")) {
        metadata = await response.json();
        console.log("Metadata:", metadata);
      } else {
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const imageUrl = convertIpfsToHttp(metadata.prescriptionImage);
      console.log("Image URL:", imageUrl);

      return {
        tokenId: tokenId.toString(),
        patientName: metadata.patientName || `Prescription ${tokenId}`,
        medication: metadata.medication || '',
        dosage: metadata.dosage || '',
        image: imageUrl,
      };
    } catch (error) {
      console.error(`Error fetching metadata for token ${tokenId}:`, error);
      throw error;
    }
  };

  // Handle selling a prescription
  const handleSell = async () => {
    if (!sellingPrescription || !sellPrice || !contract) return

    try {
      const tx = await contract.executeSale(
        BigInt(sellingPrescription.tokenId),
        { value: ethers.parseEther(sellPrice) }
      )
      await tx.wait()
      setSellingPrescription(null)
      setSellPrice('')
    } catch (error) {
      console.error("Error executing sale:", error)
      setError("Failed to execute sale. Please try again.")
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 text-green-400 animate-spin" />
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-green-700">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          Prescription Gallery
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prescriptions.map((prescription) => (
            <motion.div
              key={prescription.tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-500/[0.2] hover:shadow-2xl hover:shadow-green-500/[0.1] transition-all duration-300 w-full">
                <div className="flex flex-row gap-4">
                  <div 
                    className="w-1/2 flex-shrink-0 cursor-pointer"
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    <div className="aspect-[3/4] w-full relative overflow-hidden rounded-xl">
                      <img
                        src={prescription.image}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        alt={prescription.patientName}
                      />
                    </div>
                  </div>
                  <div className="w-1/2 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 h-14 overflow-hidden">
                      {prescription.patientName}
                    </h3>
                    <div className="mt-2">
                      <p className="text-green-500 font-semibold">Medication:</p>
                      <p className="text-green-600">{prescription.medication}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-green-500 font-semibold">Dosage:</p>
                      <p className="text-green-600">{prescription.dosage}</p>
                    </div>
                    <p className="text-green-500 font-semibold mt-2">
                      Price: {prescription.price}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 space-x-4">
                  <Button
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold flex-1 transition-colors duration-300"
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    View Details
                  </Button>
                  <Button
                    className="px-4 py-2 rounded-xl bg-white text-green-700 text-sm font-bold flex-1 transition-colors duration-300 hover:bg-green-50"
                    onClick={() => {
                      setSellingPrescription(prescription)
                      setSellPrice('')
                    }}
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dialog for Prescription Details */}
        <AnimatePresence>
          {selectedPrescription && (
            <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
              <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-green-50 to-green-100 text-green-700 border border-green-500/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                    {selectedPrescription.patientName}
                  </DialogTitle>
                  <DialogDescription className="text-green-600">
                    Prescription Details
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <img 
                    src={selectedPrescription.image} 
                    alt={selectedPrescription.patientName} 
                    className="w-full h-64 object-cover rounded-lg mb-4 shadow-lg shadow-green-500/20" 
                  />
                  <div className="mb-4">
                    <h3 className="text-green-700 font-semibold mb-1">Medication:</h3>
                    <p className="text-green-600">{selectedPrescription.medication}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-green-700 font-semibold mb-1">Dosage:</h3>
                    <p className="text-green-600">{selectedPrescription.dosage}</p>
                  </div>
                  <p className="text-green-500 font-semibold">Price: {selectedPrescription.price}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => setSelectedPrescription(null)} 
                    variant="secondary" 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Dialog for Selling Prescription */}
        <AnimatePresence>
          {sellingPrescription && (
            <Dialog open={!!sellingPrescription} onOpenChange={() => setSellingPrescription(null)}>
              <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-green-50 to-green-100 text-green-700 border border-green-500/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                    Sell Prescription
                  </DialogTitle>
                  <DialogDescription className="text-green-600">
                    Set your prescription price
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <img 
                    src={sellingPrescription.image} 
                    alt={sellingPrescription.patientName} 
                    className="w-full h-64 object-cover rounded-lg mb-4 shadow-lg shadow-green-500/20" 
                  />
                  <Label htmlFor="price" className="text-green-700">Price (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    placeholder="Enter price in ETH"
                    className="bg-white text-green-700 border-green-500/50 mt-2"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    onClick={() => setSellingPrescription(null)} 
                    variant="secondary" 
                    className="bg-green-100 hover:bg-green-200 text-green-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSell}
                    disabled={!sellPrice}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    List for Sale
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}