"use client"

import { useState } from "react"
import Hero from "@/components/hero/hero"
import Navbar from "@/components/common/navbar"

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-100 antialiased bg-grid-green/[0.05]">
      <Navbar 
      />
      <Hero />
      
      
    </main>
  )
}