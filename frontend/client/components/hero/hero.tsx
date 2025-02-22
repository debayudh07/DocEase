"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Stethoscope } from "lucide-react"
import { FloatingPaper } from "@/components/common/floating-paper"
import { RoboAnimation } from "@/components/common/robo-animation"

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center bg-gray-100">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6">
              Revolutionize Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                {" "}
                Medical Practice
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto"
          >
            Securely manage patient records, streamline appointments, and access cutting-edge AI diagnostics with
            MediConnect.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-8"
            >
              <FileText className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-green-600 border-green-500 hover:bg-green-500/20">
              <Stethoscope className="mr-2 h-5 w-5" />
              Book Demo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated medical icon */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  )
}

