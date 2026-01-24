"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AnimatePresence, motion } from "framer-motion"
import {
    Bomb,
    Coins,
    HeartCrack,
    Skull,
    Sparkles,
    Star,
    Timer
} from "lucide-react"
import { useMemo, useState } from "react"

export function GachaDespair() {
  const [pullRate, setPullRate] = useState(0.6) // Standard 0.6% rate
  const [currentPulls, setCurrentPulls] = useState(0)
  const [targetPulls, setTargetPulls] = useState(80)
  const [hasFailed, setHasFailed] = useState(false)

  const stats = useMemo(() => {
    const rate = pullRate / 100
    // Probability of NOT hitting target in X pulls: (1 - rate)^pulls
    const probFailure = Math.pow(1 - rate, targetPulls)
    const probSuccess = 1 - probFailure
    const saltLevel = Math.min((targetPulls / 80) * (100 - (probSuccess * 100)), 100)
    
    return {
      successChance: (probSuccess * 100).toFixed(2),
      failureChance: (probFailure * 100).toFixed(2),
      saltLevel: Math.round(saltLevel),
      expectedCost: targetPulls * 2.5 // $2.5 avg per pull
    }
  }, [pullRate, targetPulls])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Glitch-Core Header */}
      <Card className="bg-slate-950 border-purple-500/30 overflow-hidden relative group">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none z-20" />
         <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
         
         <CardHeader className="relative z-30 p-8 border-b border-purple-900/40">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                     <div className="bg-purple-600 p-2 rounded-lg animate-bounce">
                        <Star className="h-6 w-6 text-white" />
                     </div>
                     <CardTitle className="text-4xl font-black text-white italic tracking-tighter uppercase underline decoration-purple-500/50 underline-offset-8">
                        Gacha Pit of Despair
                     </CardTitle>
                  </div>
                  <CardDescription className="text-purple-300 font-bold uppercase text-[10px] tracking-[0.3em]">
                     Probability forecasting for the emotionally compromised.
                  </CardDescription>
               </div>
               <div className="bg-slate-900 border border-purple-500/20 p-4 rounded-2xl flex items-center gap-4">
                  <div className="text-right">
                     <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Active Salt Accumulation</div>
                     <div className="text-2xl font-black text-white">{stats.saltLevel}%</div>
                  </div>
                  <HeartCrack className="h-8 w-8 text-rose-500 animate-pulse" />
               </div>
            </div>
         </CardHeader>

         <CardContent className="p-0 relative z-30">
            <div className="grid lg:grid-cols-2">
               
               {/* Controls */}
               <div className="p-8 lg:p-12 space-y-10 border-b lg:border-b-0 lg:border-r border-purple-900/40">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Base Drop Rate (%)</Label>
                           <span className="text-xl font-black text-white">{pullRate}%</span>
                        </div>
                        <Slider 
                           value={[pullRate]} 
                           onValueChange={([v]) => setPullRate(v)} 
                           min={0.1} 
                           max={5} 
                           step={0.1}
                           className="[&_.range-thumb]:bg-purple-500"
                        />
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Planned Pull Count</Label>
                           <span className="text-xl font-black text-white">{targetPulls}</span>
                        </div>
                        <Slider 
                           value={[targetPulls]} 
                           onValueChange={([v]) => setTargetPulls(v)} 
                           min={1} 
                           max={300} 
                           step={1}
                           className="[&_.range-thumb]:bg-purple-500"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-900/50 border border-purple-500/10 p-5 rounded-3xl text-center space-y-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estimated Investment</div>
                        <div className="text-2xl font-black text-white">${stats.expectedCost.toLocaleString()}</div>
                     </div>
                     <div className="bg-slate-900/50 border border-purple-500/10 p-5 rounded-3xl text-center space-y-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pity Hard-Cap</div>
                        <div className="text-2xl font-black text-white">90 PULLS</div>
                     </div>
                  </div>

                  <div className="pt-4">
                     <Button 
                       onClick={() => setHasFailed(!hasFailed)}
                       className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
                         hasFailed ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
                       }`}
                     >
                        {hasFailed ? "RECOVERY MODE ACTIVE" : "EXECUTE SUMMON SEQUENCE"}
                     </Button>
                  </div>
               </div>

               {/* Forecast Display */}
               <div className="p-8 lg:p-12 flex flex-col justify-center gap-12 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                     <motion.div 
                        key={stats.successChance}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12 relative z-10"
                     >
                        <div className="text-center space-y-2">
                           <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">Outcome Forecast</div>
                           <div className="text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                              {stats.successChance}%
                           </div>
                           <div className="text-xs font-black text-purple-400 uppercase tracking-widest">Total Success Probability</div>
                        </div>

                        <div className="space-y-6">
                           <div className="flex justify-between items-center border-b border-purple-500/10 pb-3">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Psychological Warning</span>
                              <span className={`text-[10px] font-black uppercase italic ${stats.saltLevel > 70 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                 {stats.saltLevel > 70 ? "CRITICAL SALT RISK" : "STABLE EMOTIONAL STATE"}
                              </span>
                           </div>

                           <div className="grid gap-4">
                              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-900/50 border border-purple-500/20 group hover:border-purple-500/50 transition-colors">
                                 <div className="bg-purple-600/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Skull className="h-8 w-8 text-purple-400" />
                                 </div>
                                 <div className="space-y-1 text-left">
                                    <div className="text-xl font-black text-white tracking-tight">{stats.failureChance}%</div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Probability of "Total Shaft"</div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-900/50 border border-purple-500/20 group hover:border-purple-500/50 transition-colors">
                                 <div className="bg-rose-600/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Bomb className="h-8 w-8 text-rose-400" />
                                 </div>
                                 <div className="space-y-1 text-left">
                                    <div className="text-xl font-black text-white tracking-tight">{Math.round(stats.expectedCost * 1.5)}$</div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estimated "Sunk Cost" Trap</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  </AnimatePresence>
               </div>

            </div>
         </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { title: "Pity Meta", txt: "Calculates the exact moment your luck is forced by code.", icon: Timer, color: "text-blue-500" },
           { title: "Emotional Debt", txt: "The non-refundable cost of expectations.", icon: HeartCrack, color: "text-rose-500" },
           { title: "Currency Drain", txt: "Visualize how fast your 'gems' become 'dust'.", icon: Coins, color: "text-amber-500" },
           { title: "RNG Aura", txt: "Simulated luck based on celestial (random) alignment.", icon: Sparkles, color: "text-emerald-500" }
         ].map((item, idx) => (
           <Card key={idx} className="bg-slate-900 border-slate-800 p-5 hover:border-slate-700 transition-all cursor-default">
              <item.icon className={`${item.color} w-5 h-5 mb-3`} />
              <div className="font-black text-[10px] uppercase tracking-widest text-slate-300 mb-1">{item.title}</div>
              <p className="text-[9px] text-slate-600 font-medium leading-tight">{item.txt}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
