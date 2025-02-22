"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Stethoscope, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { MenuItem, Menu as NavMenu, ProductItem, HoveredLink} from "@/components/ui/navbar-menu"

export default function Navbar2() {
  const [active, setActive] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-50">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-gradient-to-r from-green-50 via-green-100/80 to-green-50 backdrop-blur-md shadow-lg rounded-2xl border border-green-100"
      >
        <Link href="/" className="flex items-center space-x-2">
          <Stethoscope className="w-8 h-8 text-green-600" />
          <span className="text-green-800 font-medium text-xl">MediConnect</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavMenu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-1 bg-white/90">
                <HoveredLink href="/consultations" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  Online Consultations
                </HoveredLink>
                <HoveredLink href="/prescriptions" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  E-Prescriptions
                </HoveredLink>
                <HoveredLink href="/records" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  Medical Records
                </HoveredLink>
                <HoveredLink href="/emergency" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  Emergency Care
                </HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Products">
              <div className="grid grid-cols-2 gap-4 p-3 bg-white/90">
                <ProductItem
                  title="Health Monitor"
                  href="/products/monitor"
                  src="/images/health-monitor.jpg"
                  description="Track your vital signs in real-time"
                />
                <ProductItem
                  title="MediTracker"
                  href="/products/tracker"
                  src="/images/medi-tracker.jpg"
                  description="Manage your medications and appointments"
                />
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-1 bg-white/90">
                <HoveredLink href="/pricing/basic" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  Basic Plan
                </HoveredLink>
                <HoveredLink href="/pricing/premium" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  Premium Plan
                </HoveredLink>
                <HoveredLink href="/pricing/family" className="px-4 py-2 hover:bg-green-100 transition-colors duration-200 rounded-lg text-green-700">
                  Family Plan
                </HoveredLink>
              </div>
            </MenuItem>
          </NavMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal }) => (
              <Button
                onClick={account ? openAccountModal : openConnectModal}
                variant="outline"
                className="rounded-xl bg-green-50/50 backdrop-blur-md border-green-200 hover:bg-green-100 text-green-700"
              >
                {account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : "Connect Wallet"}
              </Button>
            )}
          </ConnectButton.Custom>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-green-700 rounded-xl hover:bg-green-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-4 top-24 p-4 bg-white/80 backdrop-blur-lg rounded-2xl border border-green-100 shadow-lg divide-y divide-green-100"
          >
            {/* Services Section */}
            <div className="py-4">
              <h3 className="text-green-800 font-medium px-2 mb-2">Services</h3>
              <div className="space-y-1">
                <HoveredLink href="/consultations" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  Online Consultations
                </HoveredLink>
                <HoveredLink href="/prescriptions" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  E-Prescriptions
                </HoveredLink>
                <HoveredLink href="/records" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  Medical Records
                </HoveredLink>
                <HoveredLink href="/emergency" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  Emergency Care
                </HoveredLink>
              </div>
            </div>

            {/* Products Section */}
            <div className="py-4">
              <h3 className="text-green-800 font-medium px-2 mb-2">Products</h3>
              <div className="space-y-2 px-2">
                <ProductItem
                  title="Health Monitor"
                  href="/products/monitor"
                  src="/images/health-monitor.jpg"
                  description="Track your vital signs in real-time"
                />
                <ProductItem
                  title="MediTracker"
                  href="/products/tracker"
                  src="/images/medi-tracker.jpg"
                  description="Manage your medications and appointments"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="py-4">
              <h3 className="text-green-800 font-medium px-2 mb-2">Pricing</h3>
              <div className="space-y-1">
                <HoveredLink href="/pricing/basic" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  Basic Plan
                </HoveredLink>
                <HoveredLink href="/pricing/premium" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  Premium Plan
                </HoveredLink>
                <HoveredLink href="/pricing/family" className="block px-4 py-2 hover:bg-green-100 rounded-lg text-green-700">
                  Family Plan
                </HoveredLink>
              </div>
            </div>

            {/* Connect Wallet */}
            <div className="pt-4">
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openConnectModal }) => (
                  <Button
                    onClick={account ? openAccountModal : openConnectModal}
                    variant="default"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    {account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : "Connect Wallet"}
                  </Button>
                )}
              </ConnectButton.Custom>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}