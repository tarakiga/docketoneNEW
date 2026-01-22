"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"

export interface CaffeineControlsProps {
    amount: number
    setAmount: (v: number) => void
    time: string
    setTime: (v: string) => void
    halfLife: number
    setHalfLife: (v: number) => void
    sleepGoal: string
    setSleepGoal: (v: string) => void
}

const DRINK_PRESETS = [
    { name: "Coffee", caffeine: 95, icon: "☕" },
    { name: "Espresso", caffeine: 150, icon: "🍵" },
    { name: "Energy Drink", caffeine: 200, icon: "🥤" },
    { name: "Tea", caffeine: 50, icon: "🫖" },
]

export function CaffeineControls({ 
    amount, setAmount, time, setTime, halfLife, setHalfLife, sleepGoal, setSleepGoal 
}: CaffeineControlsProps) {
    
    return (
        <div className="space-y-8">
            {/* Presets */}
            <div className="space-y-4">
                <Label className="text-indigo-200/60 uppercase tracking-widest text-xs font-bold pl-1">Select Drink</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DRINK_PRESETS.map((preset) => (
                        <motion.button
                            key={preset.name}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAmount(preset.caffeine)}
                            className={`
                                relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group
                                ${amount === preset.caffeine 
                                    ? "bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                                    : "bg-white/5 border-white/5 hover:border-indigo-500/50"}
                            `}
                        >
                            <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{preset.icon}</span>
                            <span className={`text-xs font-bold uppercase tracking-wider ${amount === preset.caffeine ? "text-indigo-300" : "text-slate-400"}`}>
                                {preset.name}
                            </span>
                            <span className="text-[10px] text-white/40 bg-black/20 px-2 py-0.5 rounded-full font-mono">
                                {preset.caffeine}mg
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Amount Slider */}
            <div className="space-y-4 p-5 bg-black/20 rounded-xl border border-white/5">
                <div className="flex justify-between items-center px-1">
                    <Label className="text-indigo-200/60 uppercase tracking-widest text-xs font-bold">Caffeine Amount</Label>
                    <span className="text-2xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{amount}mg</span>
                </div>
                <Slider
                    value={[amount]}
                    onValueChange={(v) => setAmount(v[0])}
                    max={500}
                    step={5}
                    className="cursor-pointer py-4"
                />
            </div>

            {/* Time Settings */}
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <Label className="text-indigo-200/60 uppercase tracking-widest text-xs font-bold pl-1">Consumption Time</Label>
                    <Input
                        type="datetime-local"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-black/30 border-white/10 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-14 text-lg text-slate-200"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-indigo-200/60 uppercase tracking-widest text-xs font-bold pl-1">Metabolism</Label>
                        <Select value={halfLife.toString()} onValueChange={(v) => setHalfLife(Number(v))}>
                            <SelectTrigger className="bg-black/30 border-white/10 h-14 text-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                                <SelectItem value="3">Fast (3 hrs)</SelectItem>
                                <SelectItem value="5">Average (5 hrs)</SelectItem>
                                <SelectItem value="7">Slow (7 hrs)</SelectItem>
                                <SelectItem value="9">Very Slow (9 hrs)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                            <Label className="text-indigo-200/60 uppercase tracking-widest text-xs font-bold pl-1">Bedtime Goal</Label>
                            <Input 
                            type="time" 
                            value={sleepGoal} 
                            onChange={(e) => setSleepGoal(e.target.value)} 
                            className="bg-black/30 border-white/10 h-14 text-lg text-slate-200 focus-visible:ring-indigo-500"
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}
