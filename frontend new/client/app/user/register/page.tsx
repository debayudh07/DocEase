"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../../_context/Authcontext';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function UserRegistrationForm() {
  const { register, error: authError, isLoading, clearError } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setFormError('');
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        contact_info: {
          email: formData.email || undefined,
          phone: formData.phone || undefined,
        },
        password: formData.password
      };

      await register(userData);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="min-h-screen w-full relative flex items-center justify-center bg-green-50 p-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        {/* Main Form Card */}
        <div className="relative w-full max-w-[400px] z-10">
          <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-green-100">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-green-700">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join our community today
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Social Sign In Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  type="button" 
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm flex items-center justify-center gap-2 py-5 relative overflow-hidden group"
                  variant="outline"
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-green-600 to-green-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>

               
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-green-700">Username</Label>
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text" 
                      required 
                      className="border-green-200 focus:border-green-500 focus:ring-green-500" 
                      placeholder="Choose a username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-700">Email</Label>
                    <Input 
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email" 
                      className="border-green-200 focus:border-green-500 focus:ring-green-500" 
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-green-700">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel" 
                      className="border-green-200 focus:border-green-500 focus:ring-green-500" 
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-green-700">Password</Label>
                    <Input 
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type="password" 
                      required 
                      className="border-green-200 focus:border-green-500 focus:ring-green-500" 
                      placeholder="Create a password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-green-700">Confirm Password</Label>
                    <Input 
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      type="password" 
                      required 
                      className="border-green-200 focus:border-green-500 focus:ring-green-500" 
                      placeholder="Confirm your password"
                    />
                  </div>

                  {(formError || authError) && (
                    <div className="text-red-500 text-sm">{formError || authError}</div>
                  )}
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-center text-xs text-gray-600 px-6 flex flex-col gap-2">
              <p>
                By registering, you agree to our{' '}
                <a href="#" className="text-green-600 hover:text-green-700 underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-green-600 hover:text-green-700 underline">Privacy Policy</a>
              </p>
              <p>
                Already have an account?{' '}
                <a href="/l" className="text-green-600 hover:text-green-700 underline">Sign in</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

export default UserRegistrationForm;