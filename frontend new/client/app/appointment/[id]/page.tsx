"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ethers } from "ethers";
import { contractaddress2, contractaddress_amoy } from "@/contract/contractABI2";
import { contractABI2 } from "@/contract/contractABI2";
import { useAuth } from "@/app/_context/Authcontext"; // Import AuthContext
import { toast } from 'sonner'; // For toast notifications

export default function AppointmentPage({ params }: { params: { doctorId: string } }) {
  const { user } = useAuth(); // Get the logged-in user from AuthContext
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  // Token contract details
  const tokenAddress = contractaddress2; // Replace with your token contract address
  const tokenABI = contractABI2;
  console.log(params.doctorId);
  const handlePayment = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to make a payment");
      return;
    }
  
    setIsLoading(true);
    setPaymentStatus("loading");
    setError("");
  
    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Connect to the token contract
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

      // Define the payment amount in tokens (e.g., 100 tokens)
      const amount = ethers.parseUnits("10", 18); // Adjust decimals if needed

      // Check user's token balance
      const balance = await tokenContract.balanceOf(userAddress);

      // Compare balance with amount using BigInt
      if (balance < amount) {
        throw new Error("Insufficient token balance");
      }

      // Send tokens to the recipient
      const tx = await tokenContract.transfer("0xB32acD0dBF357bf2Cb57316b6e4294aFb2c3e205", amount);
    const receipt = await tx.wait();
    
    // Verify transaction was successful
    if (receipt.status === 1) {
      // Only call bookAppointment after confirmed payment
      await bookAppointment();
      setPaymentStatus("success");
      console.log("Payment and booking successful:", tx.hash);
    } else {
      throw new Error("Transaction failed");
    }
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Payment failed");
    setPaymentStatus("error");
  } finally {
    setIsLoading(false);
  }
};

// Update bookAppointment to throw errors
const bookAppointment = async () => {

  if (!user?._id || !date || !time) {
    console.log(user?._id, date, time);
    console.error("ebaba");
  }

  if (!user) {
    throw new Error("User must be logged in to book an appointment");
  }

  const response = await fetch("http://localhost:8000/api/v1/patients/book/appointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      docId: params.doctorId,
      slotDate: date ? date.toISOString().split("T")[0] : '',
      slotTime: time,
      amount: 100
    }),
  });

  // First read the response data
  const data = await response.json();

  // Then check response status
  if (!response.ok) {
    throw new Error(data.message || "Failed to book appointment");
  }

  // Show success toast with message
  toast.success(data.message);
};

  const availableTimes = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"];

  const relatedDoctors = [
    {
      name: "Dr. Sarah Miller",
      specialty: "General Physician",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Dr. James Wilson",
      specialty: "General Physician",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Dr. Emily Parker",
      specialty: "General Physician",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  // Get the current date and the next 14 days
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 14);

  // Generate an array of dates for the next 14 days
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Format the date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Doctor profile"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Dr. Richard James</h2>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                </div>
                <p className="text-gray-600 mb-4">MBBS - General Physician • 5 years exp</p>
                <p className="text-gray-600 mb-4">
                  Specialized in providing comprehensive healthcare solutions, focusing on preventive medicine and
                  effective treatment strategies.
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Appointment Fee:</span>
                  <span className="text-green-700">100 DocTokens</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose your preferred appointment slot</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-medium">Select Date</label>
                  <div className="grid grid-cols-7 gap-2">
                    {getDates().map((dateObj, index) => (
                      <button
                        key={index}
                        onClick={() => setDate(dateObj)}
                        className={`p-2 rounded-lg text-center ${
                          date?.toDateString() === dateObj.toDateString()
                            ? "bg-green-600 text-white"
                            : "bg-green-100 hover:bg-green-200"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="text-lg font-bold">
                          {dateObj.toLocaleDateString("en-US", { day: "numeric" })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Available Time Slots</label>
                  <Select onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!date || !time}
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Doctors</CardTitle>
              <CardDescription>Similar specialists you might be interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} width={48} height={48} />
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Appointment</DialogTitle>
              <DialogDescription>
                Please confirm your appointment with Dr. Richard James
                <div className="mt-4 space-y-2">
                  <p>Date: {date ? formatDate(date) : ""}</p>
                  <p>Time: {time}</p>
                  <p className="font-semibold">Amount: 100 DocTokens</p>
                </div>
              </DialogDescription>
            </DialogHeader>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            {paymentStatus === "success" && (
              <div className="text-green-600 text-sm mt-2">
                Payment successful! Your appointment has been booked.
              </div>
            )}

            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading || paymentStatus === "success"}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );


}