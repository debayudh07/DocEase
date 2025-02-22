// "use client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Loader2 } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar"; // Import React Big Calendar
// import moment from "moment"; // Import moment for date handling
// import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the CSS

// // Initialize the localizer with moment
// const localizer = momentLocalizer(moment);

// export default function AppointmentPage() {
//   const [date, setDate] = useState<Date | null>(null);
//   const [time, setTime] = useState<string>();
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
//   const [error, setError] = useState<string>("");

//   const handlePayment = async () => {
//     if (!window.ethereum) {
//       setError("Please install MetaMask to make a payment");
//       return;
//     }

//     setIsLoading(true);
//     setPaymentStatus("loading");
//     setError("");

//     try {
//       // Request account access
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       // Prepare the transaction
//       const transaction = {
//         from: accounts[0],
//         to: "0xB32acD0dBF357bf2Cb57316b6e4294aFb2c3e205",
//         value: "0x2386F26FC10000", // 0.0001 ETH in wei (hex)
//         chainId: "0xaa36a7", // Sepolia chain ID
//       };

//       // Send transaction
//       const txHash = await window.ethereum.request({
//         method: "eth_sendTransaction",
//         params: [transaction],
//       });

//       setPaymentStatus("success");
//       console.log("Payment successful:", txHash);
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Payment failed");
//       setPaymentStatus("error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const availableTimes = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"];

//   const relatedDoctors = [
//     {
//       name: "Dr. Sarah Miller",
//       specialty: "General Physician",
//       image: "/placeholder.svg?height=100&width=100",
//     },
//     {
//       name: "Dr. James Wilson",
//       specialty: "General Physician",
//       image: "/placeholder.svg?height=100&width=100",
//     },
//     {
//       name: "Dr. Emily Parker",
//       specialty: "General Physician",
//       image: "/placeholder.svg?height=100&width=100",
//     },
//   ];

//   // Get the date range for the calendar
//   const today = new Date();
//   const futureDate = new Date();
//   futureDate.setDate(today.getDate() + 14);

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Handle date selection in React Big Calendar
//   const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
//     setDate(slotInfo.start);
//   };

//   return (
//     <div className="min-h-screen bg-green-50">
//       <div className="container mx-auto py-8 px-4">
//         <Card className="mb-8">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="w-full md:w-1/4">
//                 <Image
//                   src="/placeholder.svg?height=200&width=200"
//                   alt="Doctor profile"
//                   width={200}
//                   height={200}
//                   className="rounded-lg"
//                 />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <h2 className="text-2xl font-bold">Dr. Richard James</h2>
//                   <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
//                 </div>
//                 <p className="text-gray-600 mb-4">MBBS - General Physician • 5 years exp</p>
//                 <p className="text-gray-600 mb-4">
//                   Specialized in providing comprehensive healthcare solutions, focusing on preventive medicine and
//                   effective treatment strategies.
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">Appointment Fee:</span>
//                   <span className="text-green-700">0.0001 Sepolia ETH</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid md:grid-cols-2 gap-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Select Date & Time</CardTitle>
//               <CardDescription>Choose your preferred appointment slot</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <label className="font-medium">Select Date</label>
//                   <div className="h-[400px]">
//                     <Calendar
//                       localizer={localizer}
//                       events={[]} // No events for now
//                       startAccessor="start"
//                       endAccessor="end"
//                       defaultView="week" // Default view (week, month, day, agenda)
//                       selectable // Allow selecting slots
//                       onSelectSlot={handleSelectSlot} // Handle date selection
//                       min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0)} // Min time (9 AM)
//                       max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0)} // Max time (5 PM)
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="font-medium">Available Time Slots</label>
//                   <Select onValueChange={setTime}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select time" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {availableTimes.map((t) => (
//                         <SelectItem key={t} value={t}>
//                           {t}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Button
//                   className="w-full bg-green-600 hover:bg-green-700"
//                   disabled={!date || !time}
//                   onClick={() => setIsPaymentModalOpen(true)}
//                 >
//                   Book Appointment
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Related Doctors</CardTitle>
//               <CardDescription>Similar specialists you might be interested in</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {relatedDoctors.map((doctor, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors"
//                   >
//                     <Avatar className="h-12 w-12">
//                       <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} width={48} height={48} />
//                     </Avatar>
//                     <div>
//                       <h3 className="font-medium">{doctor.name}</h3>
//                       <p className="text-sm text-gray-600">{doctor.specialty}</p>
//                     </div>
//                     <Button variant="outline" className="ml-auto">
//                       View Profile
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Confirm Appointment</DialogTitle>
//               <DialogDescription>
//                 Please confirm your appointment with Dr. Richard James
//                 <div className="mt-4 space-y-2">
//                   <p>Date: {date ? formatDate(date) : ""}</p>
//                   <p>Time: {time}</p>
//                   <p className="font-semibold">Amount: 0.0001 Sepolia ETH</p>
//                 </div>
//               </DialogDescription>
//             </DialogHeader>

//             {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

//             {paymentStatus === "success" && (
//               <div className="text-green-600 text-sm mt-2">
//                 Payment successful! Your appointment has been booked.
//               </div>
//             )}

//             <DialogFooter className="flex space-x-2">
//               <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)} disabled={isLoading}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handlePayment}
//                 disabled={isLoading || paymentStatus === "success"}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing
//                   </>
//                 ) : (
//                   "Confirm & Pay"
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }