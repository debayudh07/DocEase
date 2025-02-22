"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { Stethoscope } from "lucide-react";

import { useDoctorAuth } from "@/app/_context/Doctorcontext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DoctorLogin() {
  const { loginDoctor } = useDoctorAuth();
  const [formData, setFormData] = useState({
    name: "",
    contact_info: {
      email: "",
    },
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setFormData({
        ...formData,
        contact_info: { ...formData.contact_info, email: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    console.log("Submitting form with data:", formData);

    try {
      await loginDoctor(formData);
    } catch (error) {
      alert("Login failed! Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-green-600"
        >
          <Stethoscope className="h-6 w-6" />
          MediConnect
        </Link>
        <Card className="mt-4 w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Doctor Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Dr. John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  required
                  value={formData.contact_info.email}
                  onChange={handleChange}
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-green-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/doctor/register"
                className="text-green-600 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
