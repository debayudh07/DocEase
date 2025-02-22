// context/DoctorAuthContext.js
"use client"
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DoctorContextType {
    doctor: any;
    registerDoctor: (doctorData: any) => Promise<void>;
}

const DoctorAuthContext = createContext<DoctorContextType>({
    doctor: null,
    registerDoctor: async () => {},
});

export const DoctorAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [doctor, setDoctor] = useState(null);
    const router = useRouter();

    // Register Doctor Function
    const registerDoctor = async (doctorData: any) => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/doctors/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctorData),
            });

            const data = await response.json();

            if (response.ok) {
                setDoctor(data); // Set the registered doctor in state
                router.push('/kyc/doctor'); // Redirect to dashboard
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error; // Re-throw the error for the form to handle
        }
    };

    return (
        <DoctorAuthContext.Provider value={{ doctor, registerDoctor }}>
            {children}
        </DoctorAuthContext.Provider>
    );
};

// Custom hook to use the DoctorAuthContext
export const useDoctorAuth = () => useContext(DoctorAuthContext);