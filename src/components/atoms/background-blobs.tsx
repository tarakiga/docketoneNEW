"use client"

import { motion } from "framer-motion"

export function BackgroundBlobs() {
  return (
    <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-20 pointer-events-none user-select-none">
      {/* Blob 1 - Indigo/Blue Mix - Stronger Visibility */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/40 rounded-full blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Blob 2 - Purple/Pink Mix - Stronger Visibility */}
      <motion.div
        className="absolute top-[0%] right-[-10%] w-[600px] h-[600px] bg-purple-500/40 rounded-full blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />

      {/* Blob 3 - Cyan Accent - Stronger Visibility */}
      <motion.div
        className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-cyan-400/30 rounded-full blur-[80px]"
        animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay: 2
        }}
      />
    </div>
  )
}
