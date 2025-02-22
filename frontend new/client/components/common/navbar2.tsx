"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Stethoscope, Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAuth } from "@/app/_context/Authcontext" // Import the AuthContext

export default function Navbar2() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth() // Use the AuthContext

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-green-100/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <Link href="/" className="flex items-center space-x-2">
          <Stethoscope className="w-8 h-8 text-green-600" />
          <span className="text-green-800 font-medium text-xl">MediConnect</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/about">About</NavLink>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            // If the user is logged in, show profile and logout buttons
            <>
              <Link href="/dashboard/user">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            // If the user is not logged in, show sign-up and login buttons
            <>
              <Link href="/user/register">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
              <Link href="/doctor/register">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  Doctor Sign Up
                </Button>
              </Link>
            </>
          )}
          <ConnectButton />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-green-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-4 top-24 p-4 bg-white/80 backdrop-blur-lg rounded-2xl border border-green-100/20 shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/about"
                className="text-green-700 hover:text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-green-700 hover:text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-green-700 hover:text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <hr className="border-green-100" />
              {user ? (
                // If the user is logged in, show dashboard and logout buttons
                <>
                  <Link href="/dashboard/user" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                // If the user is not logged in, show sign-up and login buttons
                <>
                  <Link href="/userlogin" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/doctorlogin" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    >
                      Doctor Sign Up
                    </Button>
                  </Link>
                </>
              )}
              <div className="w-full">
                <ConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-green-700 hover:text-green-600 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full" />
    </Link>
  )
}