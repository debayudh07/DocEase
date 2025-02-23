"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface DoctorAuthContextType {
  doctor: Doctor | null;
  isLoading: boolean;
  error: string | null;
  access_token: string | null;
  user_id: string | null;
  registerDoctor: (doctorData: DoctorRegistrationData) => Promise<void>;
  loginDoctor: (loginData: DoctorLoginData) => Promise<void>;
  clearError: () => void;
  logoutDoctor: () => void;
}

interface Doctor {
  experience: number;
  specialty: never[];
  qualifications: never[];
  availability: never[];
  hospital_affiliation: string;
  consultation_fee: number;
  registrationNumber: string;
  _id: string;
  name: string;
  specialization: string;
  contact_info: {
    email?: string;
    phone?: string;
  };
}

interface DoctorRegistrationData {
  name: string;
  specialization: string;
  contact_info: {
    email?: string;
    phone?: string;
  };
  password: string;
}

interface DoctorLoginData {
  contact_info: {
    email?: string;
    phone?: string;
  };
  password: string;
}

const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(undefined);

export function DoctorAuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load access_token and user_id from cookies on initial load
//   useEffect(() => {
//     const accessToken = Cookies.get("accessToken");
//     console.log(accessToken);
//     const userId = Cookies.get("userId");
//     console.log(userId);
//     if (accessToken && userId) {
//       setAccessToken(accessToken);
//       setUserId(userId);
//       fetchDoctorData(accessToken, userId);
//     } else {
//       setIsLoading(false); // No tokens found, stop loading
//     }
//   }, []);

  // Fetch doctor data if access_token and user_id are present
//   const fetchDoctorData = async (token: string, userId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/v1/doctors/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDoctor(response.data.data);
//     } catch (error) {
//       console.error("Error fetching doctor data:", error);
//       logoutDoctor(); // Clear invalid tokens
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const clearError = () => setError(null);

  const registerDoctor = async (doctorData: DoctorRegistrationData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { name, contact_info, password } = doctorData;
      const { email, phone } = contact_info;

      if (!name || (!email && !phone) || !password) {
        throw new Error("Please provide all required fields");
      }

      const response = await axios.post("http://localhost:8000/api/v1/doctors/register", doctorData);

      if (response.data.data) {
        setDoctor(response.data.data);
        router.push("/kyc/doctor");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginDoctor = async (loginData: DoctorLoginData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { contact_info, password } = loginData;
      const { email } = contact_info;

      if (!email || !password) {
        throw new Error("Please provide all required fields");
      }

      const response = await axios.post("http://localhost:8000/api/v1/doctors/login", loginData, {
        withCredentials: true,
      });

      if (response.data.data.user) {
        const user = response.data.data.user;
        const token = response.data.data.accessToken;

        setDoctor(user);
        setAccessToken(token);
        console.log(token);
        setUserId(user._id);
        console.log(user._id);
        // Store in cookies for persistence
        Cookies.set("accessToken", token, { expires: 7, secure: true, sameSite: "strict" });
        Cookies.set("userId", user._id, { expires: 7, secure: true, sameSite: "strict" });

        router.push("/dashboard/doctor");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logoutDoctor = () => {
    setDoctor(null);
    setAccessToken(null);
    setUserId(null);

    // Clear cookies
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("userId", { path: "/" });

    router.push("/doctor/login");
  };

  const value = {
    doctor,
    isLoading,
    error,
    access_token,
    user_id,
    registerDoctor,
    loginDoctor,
    clearError,
    logoutDoctor,
  };

  return <DoctorAuthContext.Provider value={value}>{children}</DoctorAuthContext.Provider>;
}

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);
  if (context === undefined) {
    throw new Error("useDoctorAuth must be used within a DoctorAuthProvider");
  }
  return context;
}