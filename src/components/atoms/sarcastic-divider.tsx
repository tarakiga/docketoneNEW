"use client"

import { motion } from "framer-motion"

export function SarcasticDivider() {
  return (
    <div className="w-full flex justify-center py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-100/80 border border-amber-200 shadow-sm backdrop-blur-sm"
      >
        <span className="text-2xl">😴</span>
        <p className="text-amber-900 font-medium text-sm md:text-base">
          Or... you could have some fun with our regular "boring" calculators below!
        </p>
      </motion.div>
    </div>
  )
}
