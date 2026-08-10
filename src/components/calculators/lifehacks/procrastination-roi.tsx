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
    // Panic ≈ (importance · 15) / effective days left, where procrastination eats into
    // the days you have. daysToStart = how long you'll stall before actually beginning.
    const daysRemaining = Math.max(0.1, daysUntilDue * (1 - (procrastinationLevel / 100)))
    const panicScore = Math.min(100, (taskValue * 15) / daysRemaining)
    const daysToStart = daysUntilDue * (procrastinationLevel / 100)

    const status = panicScore < 30 ? "Chill Mode" : panicScore < 70 ? "Mild Concern" : panicScore < 90 ? "Panic Monster Awakening" : "FULL MELTDOWN"
    // Status colors kept by meaning but tuned for readability on the dark arcade theme.
    const color = panicScore < 30 ? "bg-[#86efac]" : panicScore < 70 ? "bg-[var(--dk-yel)]" : panicScore < 90 ? "bg-[#ff8a3c]" : "bg-[#ff8a8a] animate-pulse"
    // All status pills use dark ink for contrast against their bright fills.
    const textColor = "text-[var(--dk-on-fill)]"

    return { panicScore: Math.round(panicScore), status, color, textColor, daysRemaining: daysRemaining.toFixed(1), daysToStart: daysToStart.toFixed(1) }
  }

  const result = calculatePanic()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-[var(--dk-surface)] border-4 border-[var(--dk-line)] shadow-[8px_8px_0px_0px_rgba(12,8,36,1)]">
        <CardHeader className="bg-[var(--dk-lim)] border-b-4 border-[var(--dk-line)] py-6">
          <CardTitle className="text-[var(--dk-on-fill)] text-2xl sm:text-4xl font-black uppercase italic flex items-center gap-3 break-words min-w-0">
             <Bomb className="h-7 w-7 sm:h-8 sm:w-8 animate-bounce shrink-0" />
             Procrastination ROI
          </CardTitle>
          <CardDescription className="text-[var(--dk-on-fill)] font-bold opacity-90">
             Calculate exactly when the Panic Monster will arrive to save you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 min-w-0">
                 <div className="space-y-3">
                    <div className="flex justify-between font-bold uppercase text-sm text-[var(--dk-ink)]">
                       <Label>Task Importance</Label>
                       <span>{taskValue}/10</span>
                    </div>
                    <Slider value={[taskValue]} onValueChange={([v]) => setTaskValue(v)} min={1} max={10} step={1} className="[&_[data-slot=slider-track]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-range]]:bg-[var(--dk-lim)] [&_[data-slot=slider-thumb]]:border-[var(--dk-lim-ink)] [&_[data-slot=slider-thumb]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-thumb]]:focus-visible:ring-[var(--dk-lim-ink)]" />
                    <p className="text-xs text-[var(--dk-ink-soft)]">1 = Doing laundry, 10 = Thesis defense</p>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between font-bold uppercase text-sm text-[var(--dk-ink)]">
                       <Label>Days Until Due</Label>
                       <span>{daysUntilDue} Days</span>
                    </div>
                    <Slider value={[daysUntilDue]} onValueChange={([v]) => setDaysUntilDue(v)} min={1} max={30} step={1} className="[&_[data-slot=slider-track]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-range]]:bg-[var(--dk-lim)] [&_[data-slot=slider-thumb]]:border-[var(--dk-lim-ink)] [&_[data-slot=slider-thumb]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-thumb]]:focus-visible:ring-[var(--dk-lim-ink)]" />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between font-bold uppercase text-sm text-[var(--dk-ink)]">
                       <Label>Procrastination Level</Label>
                       <span>{procrastinationLevel}%</span>
                    </div>
                    <Slider value={[procrastinationLevel]} onValueChange={([v]) => setProcrastinationLevel(v)} min={0} max={99} step={1} className="[&_[data-slot=slider-track]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-range]]:bg-[#ff8a8a] [&_[data-slot=slider-thumb]]:border-[#ff8a8a] [&_[data-slot=slider-thumb]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-thumb]]:focus-visible:ring-[#ff8a8a]" />
                    <p className="text-xs text-[var(--dk-ink-soft)]">How long will you define &quot;doing research&quot; as watching YouTube?</p>
                 </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-6 p-6 bg-[var(--dk-raised)] rounded-xl border-2 border-[var(--dk-line)] border-dashed min-w-0">
                 <div className="relative w-44 h-44 sm:w-48 sm:h-48 max-w-full flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-[var(--dk-line)]"></div>
                    <div 
                      className={`absolute inset-0 rounded-full border-8 ${result.color.replace('bg-', 'border-')} transition-all duration-500`}
                      style={{ clipPath: `polygon(0 0, 100% 0, 100% ${result.panicScore}%, 0 ${result.panicScore}%)` }} // Simple visual hack or use SVG
                    ></div>
                     
                     {/* SVG Gauge */}
                    <svg className="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--dk-on-fill)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={`${result.panicScore > 80 ? 'text-[#ff8a8a]' : 'text-[var(--dk-lim-ink)]'} transition-all duration-1000`}
                        strokeDasharray={`${result.panicScore * 2.51} 251.2`} 
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="flex flex-col items-center">
                       <span className="text-5xl font-black text-[var(--dk-ink)]">{result.panicScore}%</span>
                       <span className="text-xs font-bold uppercase text-[var(--dk-ink-soft)]">Panic Level</span>
                    </div>
                 </div>
                 
                 <div className={`w-full py-4 text-center font-black uppercase rounded-lg shadow-lg ${result.color} ${result.textColor} transition-all`}>
                    {result.status}
                 </div>

                 <div className="text-center space-y-1 text-[var(--dk-ink)]">
                    <div className="font-bold flex items-center justify-center gap-2">
                       <Clock className="w-4 h-4"/> Time to Start:
                    </div>
                    <p>In roughly <span className="font-black bg-[var(--dk-lim)] text-[var(--dk-on-fill)] px-1">{result.daysToStart} days</span></p>
                    <p className="text-xs text-[var(--dk-ink-soft)] pt-2">&quot;Diamonds are made under pressure.&quot; - You, probably.</p>
                 </div>
              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="Procrastination Level"
                 text={`My current obsession is at ${result.panicScore}% Panic Level. I'll stall for ${result.daysToStart} days before I start. Maybe. 💣`}
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
