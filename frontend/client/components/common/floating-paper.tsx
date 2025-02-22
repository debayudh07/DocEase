"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, Pill, Syringe, Thermometer, Clipboard } from "lucide-react"

const medicalIcons = [FileText, Pill, Syringe, Thermometer, Clipboard]

export function FloatingPaper({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    // Update dimensions only on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative w-full h-full">
      {Array.from({ length: count }).map((_, i) => {
        const Icon = medicalIcons[i % medicalIcons.length]
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: [Math.random() * dimensions.width, Math.random() * dimensions.width, Math.random() * dimensions.width],
              y: [
                Math.random() * dimensions.height,
                Math.random() * dimensions.height,
                Math.random() * dimensions.height,
              ],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="relative w-16 h-20 bg-white/50 backdrop-blur-sm rounded-lg border border-green-200 flex items-center justify-center transform hover:scale-110 transition-transform">
              <Icon className="w-8 h-8 text-green-600/70" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

