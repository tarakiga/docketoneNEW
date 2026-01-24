"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { AnimatePresence, motion } from "framer-motion"
import {
    AlertTriangle,
    Coffee,
    Frown,
    Ghost,
    Receipt,
    Smile,
    Wind,
    Zap
} from "lucide-react"
import { useMemo, useState } from "react"

export function UnspentPotentialTax() {
  const [taskName, setTaskName] = useState("")
  const [hoursDelayed, setHoursDelayed] = useState(1)
  const [taskImportance, setTaskImportance] = useState(50)
  const [isDone, setIsDone] = useState(false)

  // Calculations
  const metrics = useMemo(() => {
    // Procrastination Coefficient
    const coeff = (hoursDelayed * (taskImportance / 10)) / 2
    const leisureFine = Math.min(hoursDelayed * 0.75, 48) // max 48 hours fine
    const stressLevel = Math.min((hoursDelayed * taskImportance) / 10, 100)
    
    return { coeff, leisureFine, stressLevel }
  }, [hoursDelayed, taskImportance])

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div
            key="procrastination-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="white-glass-card border-rose-200/50 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.02] to-transparent pointer-events-none" />
               
               <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600 animate-pulse">
                    <Ghost className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-4xl font-display text-slate-900 tracking-tight">The Unspent Potential Tax</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Quantifying the hidden cost of "doing it later."</CardDescription>
               </CardHeader>

               <CardContent className="p-8 space-y-10">
                  <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="space-y-3">
                           <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The Looming Task</Label>
                           <Input 
                             placeholder="e.g. Tax Returns, Gym Session, Ending a War..." 
                             className="bg-white/50 border-slate-200 h-14 text-lg font-bold"
                             value={taskName}
                             onChange={(e) => setTaskName(e.target.value)}
                           />
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hours Delayed Since Start</Label>
                              <span className="text-2xl font-black text-rose-600">{hoursDelayed}h</span>
                           </div>
                           <Slider 
                             value={[hoursDelayed]} 
                             onValueChange={([v]) => setHoursDelayed(v)} 
                             max={168} 
                             step={1}
                             className="[&_.range-thumb]:bg-rose-500"
                           />
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Psychological Weight</Label>
                              <span className="text-sm font-bold text-slate-600">{taskImportance > 80 ? "Existential Dread" : taskImportance > 40 ? "Nagging Guilt" : "Minor Inconvenience"}</span>
                           </div>
                           <Slider 
                             value={[taskImportance]} 
                             onValueChange={([v]) => setTaskImportance(v)} 
                             max={100} 
                             className="[&_.range-thumb]:bg-slate-950"
                           />
                        </div>
                     </div>

                     <div className="flex flex-col justify-center gap-6">
                        <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                              <Receipt className="h-12 w-12" />
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-2">Notice of Fine</div>
                           <div className="text-5xl font-black tracking-tighter mb-4">
                              {metrics.leisureFine.toFixed(1)}h
                           </div>
                           <p className="text-xs text-slate-400 leading-relaxed font-medium">
                              This is the amount of **Pure Relaxation** you have "taxed" from your future self. 
                              For every hour you delay, your weekend gets shorter.
                           </p>
                           <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
                              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Interest rate: 15% per day</div>
                           </div>
                        </div>

                        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-rose-800 uppercase tracking-widest leading-none flex items-center gap-2">
                                <Zap className="h-3 w-3" /> Cortisol Index
                              </span>
                              <span className="text-xs font-black text-rose-900">{metrics.stressLevel}%</span>
                           </div>
                           <Progress value={metrics.stressLevel} className="h-2 bg-rose-200" />
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-center pt-8 border-t border-slate-100">
                     <Button 
                       onClick={() => setIsDone(true)}
                       className="h-16 px-12 rounded-full bg-slate-950 hover:bg-black text-white font-black uppercase tracking-widest text-sm shadow-xl group"
                     >
                       I've Finished the Task! 
                       <span className="ml-2 group-hover:rotate-12 transition-transform">🎉</span>
                     </Button>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="zen-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="white-glass-card border-emerald-200/50 shadow-2xl relative overflow-hidden p-12 text-center bg-emerald-50/30">
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.05] to-emerald-500/[0.05] animate-pulse pointer-events-none" />
               
               <motion.div 
                 initial={{ scale: 0.5, rotate: -20 }}
                 animate={{ scale: 1, rotate: 0 }}
                 className="mx-auto w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl"
               >
                 <Wind className="h-12 w-12" />
               </motion.div>

               <div className="space-y-4 relative z-10 max-w-lg mx-auto">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Breathe In.</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    By completing <span className="font-black text-slate-950 underline decoration-emerald-400 decoration-4 underline-offset-4">{taskName || "your task"}</span>, you have officially **canceled** your potential tax.
                  </p>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-[0.2em] pt-4">Leisure Reclaimed: {metrics.leisureFine.toFixed(1)} Hours</p>
               </div>

               <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDone(false)}
                    className="rounded-full h-12 px-8 border-emerald-500/20 text-emerald-700 hover:bg-emerald-50 font-bold"
                  >
                    Calculate Another Debt
                  </Button>
                  <Button 
                    className="rounded-full h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg"
                  >
                    Go Play Outside ☀️
                  </Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-3 gap-6">
         {[
           { title: "The Fine Print", desc: "Leisure debt is calculated by multiplying your avoidance time by importance.", icon: Coffee, color: "text-amber-500" },
           { title: "Zen Equilibrium", desc: "Completing a task instantly resets your cortisol index to 0.", icon: Smile, color: "text-emerald-500" },
           { title: "Future Self", desc: "Don't steal relaxation time from someone you haven't met yet.", icon: Frown, color: "text-rose-500" }
         ].map((item, idx) => (
           <Card key={idx} className="white-glass-card p-6 border-slate-100 transition-all hover:-translate-y-1">
              <item.icon className={`h-6 w-6 ${item.color} mb-4`} />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-2">{item.title}</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
