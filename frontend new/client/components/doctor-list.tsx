import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
}

const doctors: Doctor[] = [
  { id: 1, name: "Dr. John Smith", specialty: "Cardiologist", avatar: "/placeholder.svg" },
  { id: 2, name: "Dr. Sarah Johnson", specialty: "Dermatologist", avatar: "/placeholder.svg" },
  { id: 3, name: "Dr. Michael Lee", specialty: "Pediatrician", avatar: "/placeholder.svg" },
]

export function DoctorsList({ onBookAppointment }: { onBookAppointment: (doctor: Doctor) => void }) {
  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </div>
          </div>
          <Button onClick={() => onBookAppointment(doctor)} className="bg-green-500 hover:bg-green-600 text-white">
            Book Appointment
          </Button>
        </div>
      ))}
    </div>
  )
}

