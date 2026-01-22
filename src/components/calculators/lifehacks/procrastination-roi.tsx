"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bomb, Clock } from "lucide-react"
import { useState } from "react"

export function ProcrastinationCalculator() {
  const [taskValue, setTaskValue] = useState(5) // Importance 1-10
  const [daysUntilDue, setDaysUntilDue] = useState(7)
  const [procrastinationLevel, setProcrastinationLevel] = useState(50) // % of time wasted

  const calculatePanic = () => {
    // Arbitrary "Panic" formula
    // Panic = (Importance * 10) / (DaysRemaining + 0.1) * (ProcrastinationFactor)
    
    const daysRemaining = Math.max(0.1, daysUntilDue * (1 - (procrastinationLevel/100)))
    const panicScore = Math.min(100, (taskValue * 15) / daysRemaining)
    
    const status = panicScore < 30 ? "Chill Mode" : panicScore < 70 ? "Mild Concern" : panicScore < 90 ? "Panic Monster Awakening" : "FULL MELTDOWN"
    const color = panicScore < 30 ? "bg-green-500" : panicScore < 70 ? "bg-yellow-500" : panicScore < 90 ? "bg-orange-500" : "bg-red-600 animate-pulse"
    
    return { panicScore: Math.round(panicScore), status, color, daysRemaining: daysRemaining.toFixed(1) }
  }

  const result = calculatePanic()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-yellow-400 border-b-4 border-black py-6">
          <CardTitle className="text-4xl font-black uppercase italic flex items-center gap-3">
             <Bomb className="h-8 w-8 animate-bounce" />
             Procrastination ROI
          </CardTitle>
          <CardDescription className="text-black font-bold opacity-75">
             Calculate exactly when the Panic Monster will arrive to save you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between font-bold uppercase text-sm">
                       <Label>Task Importance</Label>
                       <span>{taskValue}/10</span>
                    </div>
                    <Slider value={[taskValue]} onValueChange={([v]) => setTaskValue(v)} min={1} max={10} step={1} className="[&_.range-thumb]:bg-black" />
                    <p className="text-xs text-slate-500">1 = Doing laundry, 10 = Thesis defense</p>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between font-bold uppercase text-sm">
                       <Label>Days Until Due</Label>
                       <span>{daysUntilDue} Days</span>
                    </div>
                    <Slider value={[daysUntilDue]} onValueChange={([v]) => setDaysUntilDue(v)} min={1} max={30} step={1} className="[&_.range-thumb]:bg-black" />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between font-bold uppercase text-sm">
                       <Label>Procrastination Level</Label>
                       <span>{procrastinationLevel}%</span>
                    </div>
                    <Slider value={[procrastinationLevel]} onValueChange={([v]) => setProcrastinationLevel(v)} min={0} max={99} step={1} className="[&_.range-thumb]:bg-red-500" />
                    <p className="text-xs text-slate-500">How long will you define "doing research" as watching YouTube?</p>
                 </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-6 p-6 bg-slate-200 rounded-xl border-2 border-black border-dashed">
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-slate-300"></div>
                    <div 
                      className={`absolute inset-0 rounded-full border-8 ${result.color.replace('bg-', 'border-')} transition-all duration-500`}
                      style={{ clipPath: `polygon(0 0, 100% 0, 100% ${result.panicScore}%, 0 ${result.panicScore}%)` }} // Simple visual hack or use SVG
                    ></div>
                     
                     {/* SVG Gauge */}
                    <svg className="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        className={`${result.panicScore > 80 ? 'text-red-500' : 'text-blue-500'} transition-all duration-1000`}
                        strokeDasharray={`${result.panicScore * 2.51} 251.2`} 
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="flex flex-col items-center">
                       <span className="text-5xl font-black">{result.panicScore}%</span>
                       <span className="text-xs font-bold uppercase">Panic Level</span>
                    </div>
                 </div>
                 
                 <div className={`w-full py-4 text-center font-black uppercase text-white rounded-lg shadow-lg ${result.color} transition-all`}>
                    {result.status}
                 </div>
                 
                 <div className="text-center space-y-1">
                    <div className="font-bold flex items-center justify-center gap-2">
                       <Clock className="w-4 h-4"/> Time to Start:
                    </div>
                    <p>In roughly <span className="font-black bg-yellow-200 px-1">{(daysUntilDue * (procrastinationLevel/100)).toFixed(1)} days</span></p>
                    <p className="text-xs text-slate-500 pt-2">"Diamonds are made under pressure." - You, probably.</p>
                 </div>
              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="Procrastination Level" 
                 text={`My current obsession is at ${result.panicScore}% Panic Level. I'll start working in ${result.daysRemaining} days. Maybe. 💣`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
