"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { CaffeineControls } from "./controls"
import { CaffeineDecayChart } from "./decay-chart"
import { CaffeineStatusCard } from "./status-card"

export function CaffeineCalculatorPremium() {
    const [amount, setAmount] = useState<number>(95)
    // Initialize with empty string to avoid hydration mismatch, default in useEffect
    const [time, setTime] = useState<string>("") 
    const [halfLife, setHalfLife] = useState<number>(5)
    const [sleepGoal, setSleepGoal] = useState<string>("22:00")
    const [data, setData] = useState<any[]>([])
    const [currentLevel, setCurrentLevel] = useState<number>(0)
    const [isSleepImpacted, setIsSleepImpacted] = useState<boolean>(false)

    // Hydration fix
    useEffect(() => {
        const now = new Date()
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        setTime(local)
    }, [])

    useEffect(() => {
        if (!time) return
        calculate()
    }, [amount, time, halfLife, sleepGoal])

    const calculate = () => {
        const consumptionDate = new Date(time)
        const now = new Date()
        const timeDiffHours = (now.getTime() - consumptionDate.getTime()) / (1000 * 60 * 60)
        
        // Current Level
        const current = timeDiffHours > 0 
            ? amount * Math.pow(0.5, timeDiffHours / halfLife)
            : amount // Assume immediate absorption for simplicity if future/now
        
        setCurrentLevel(Math.max(0, current))

        // Chart Data
        const newData = []
        let sleepLevel = 0

        const [sh, sm] = sleepGoal.split(':').map(Number)
        // Find next occurrence of sleep time
        const sleepDate = new Date(consumptionDate)
        sleepDate.setHours(sh, sm, 0, 0)
        if (sleepDate < consumptionDate) sleepDate.setDate(sleepDate.getDate() + 1)
        
        // Generate points
        for (let i = 0; i <= 24; i++) {
            const t = new Date(consumptionDate)
            t.setHours(t.getHours() + i)
            const level = amount * Math.pow(0.5, i / halfLife)
            const isSleep = Math.abs(t.getTime() - sleepDate.getTime()) < 3600000 / 2 // Within 30 min

            if (isSleep) sleepLevel = level

            newData.push({
                hour: i,
                label: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                caffeine: Math.max(0, level).toFixed(1),
                isSleep
            })
        }
        setData(newData)
        setIsSleepImpacted(sleepLevel > 20) // Threshold: 20mg can affect sleep
    }

    if (!time) return null // Wait for hydration

    return (
        <motion.div 
            className="w-full min-h-[800px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/5 overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
             {/* Dynamic Background Mesh */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
             </div>

             <div className="relative z-10 grid lg:grid-cols-12 gap-8 h-full">
                 {/* Left Panel: Controls */}
                 <motion.div 
                    className="lg:col-span-4 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                 >
                     <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-lg h-full">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                           <span className="text-3xl">🎛️</span> Configuration
                        </h2>
                        <CaffeineControls 
                            amount={amount} setAmount={setAmount}
                            time={time} setTime={setTime}
                            halfLife={halfLife} setHalfLife={setHalfLife}
                            sleepGoal={sleepGoal} setSleepGoal={setSleepGoal}
                        />
                     </div>
                 </motion.div>

                 {/* Right Panel: Data */}
                 <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
                     <div className="space-y-6">
                        <CaffeineStatusCard 
                            currentLevel={currentLevel}
                            isSleepImpacted={isSleepImpacted}
                            timeToSleep={0} 
                        />
                        
                        <CaffeineDecayChart 
                            data={data}
                            sleepGoalHour={22}
                        />
                     </div>

                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-end pt-4"
                     >
                         <ShareResult 
                            title="Caffeine Status"
                            text={`I'm currently running on ${currentLevel.toFixed(0)}mg of caffeine. My sleep forecast is: ${isSleepImpacted ? "Risky" : "Safe"}. Calculated via Docket One.`}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                         />
                     </motion.div>
                 </div>
             </div>
        </motion.div>
    )
}
