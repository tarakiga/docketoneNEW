"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Moon } from "lucide-react"

export interface CaffeineStatusCardProps {
    currentLevel: number
    isSleepImpacted: boolean
    timeToSleep: number // hours until sleep
}

export function CaffeineStatusCard({ currentLevel, isSleepImpacted, timeToSleep }: CaffeineStatusCardProps) {
    // Determine status state
    const status = currentLevel > 50 
        ? "active" 
        : currentLevel > 20 
            ? "moderate" 
            : "clear"

    const getStatusColor = () => {
        if (status === "active") return "text-red-500"
        if (status === "moderate") return "text-orange-400"
        return "text-emerald-400"
    }

    const getStatusText = () => {
        if (status === "active") return "System Active"
        if (status === "moderate") return "Winding Down"
        return "Ready for Sleep"
    }

    const getRecommendation = () => {
        if (isSleepImpacted) return "High chance of sleep disruption. Consider delaying bedtime."
        if (status === "moderate") return "You might feel slight alertness, but sleep should be okay."
        return "Your system is effectively clear. Sweet dreams!"
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Gauge */}
            <motion.div 
                className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">Current Load</div>
                        <div className={`text-5xl md:text-6xl font-black tracking-tighter ${getStatusColor()} flex items-baseline gap-2 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                            {currentLevel.toFixed(0)} <span className="text-xl text-slate-500 font-medium">mg</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6">
                        <div className={`h-3 w-3 rounded-full shadow-[0_0_10px_currentColor] ${status === "active" ? "bg-red-500 animate-pulse text-red-500" : status === "moderate" ? "bg-orange-400 text-orange-400" : "bg-emerald-400 text-emerald-400"}`} />
                        <span className="text-sm font-bold text-slate-200 tracking-wide">{getStatusText()}</span>
                    </div>
                </div>
                
                {/* Background Decoration */}
                <div className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-[80px] opacity-30 ${status === "active" ? "bg-red-600" : "bg-emerald-600"}`} />
            </motion.div>

            {/* Sleep Impact */}
            <motion.div 
                 className={`bg-black/40 backdrop-blur-xl p-6 rounded-2xl border-l-4 shadow-xl ${isSleepImpacted ? "border-l-red-500 shadow-[inset_10px_0_20px_-10px_rgba(239,68,68,0.2)]" : "border-l-emerald-500 shadow-[inset_10px_0_20px_-10px_rgba(16,185,129,0.2)]"}`}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
            >
                 <div className="h-full flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${isSleepImpacted ? "bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"}`}>
                            {isSleepImpacted ? <AlertTriangle className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
                        </div>
                        <div>
                            <h3 className={`font-bold text-xl mb-2 ${isSleepImpacted ? "text-red-100" : "text-emerald-100"}`}>{isSleepImpacted ? "Sleep Warning" : "Sleep Safe"}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {getRecommendation()}
                            </p>
                        </div>
                    </div>
                 </div>
            </motion.div>
        </div>
    )
}
