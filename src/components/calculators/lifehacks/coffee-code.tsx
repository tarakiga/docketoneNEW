"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bug, Coffee, Terminal } from "lucide-react"
import { useMemo, useState } from "react"

export function CoffeeToCode() {
  const [cups, setCups] = useState(3)
  const [complexity, setComplexity] = useState(5) // 1-10

  const result = useMemo(() => {
    let lines = Math.round(cups * 50 * (complexity * 0.5))
    let bugs = 0
    let jitter = 0
    
    if (cups <= 4) {
      bugs = Math.round(lines / 100) 
      jitter = cups * 10
    } else {
      lines = Math.round(lines * (1 - ((cups - 4) * 0.1))) 
      bugs = Math.round((lines / 50) * (cups * 0.5))
      jitter = Math.min(100, cups * 15)
    }

    const isBallmerPeak = cups >= 8 && cups <= 9
    if (isBallmerPeak) {
      lines *= 2 
      bugs = 0 
    }

    return { lines, bugs, jitter, isBallmerPeak }
  }, [cups, complexity])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="white-glass-card shadow-xl shadow-amber-500/5">
        <CardHeader className="border-b border-slate-50 bg-white/50">
           <CardTitle className="text-3xl font-display text-amber-900 flex items-center gap-3">
              <Coffee className="h-8 w-8 text-amber-600 animate-pulse" />
              Coffee to Code Output
           </CardTitle>
           <CardDescription className="text-slate-500 font-medium">
              Real-time caffeine conversion and productivity analysis.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 sm:space-y-10 p-5 sm:p-10">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase text-[10px] tracking-widest text-amber-700">
                       <Label>Caffeine Intake</Label>
                       <span>{cups} Cups</span>
                    </div>
                    <Slider value={[cups]} onValueChange={([v]) => setCups(v)} min={0} max={12} step={1} className="[&_.range-thumb]:bg-amber-600" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase text-[10px] tracking-widest text-slate-500">
                       <Label>Task Complexity</Label>
                       <span>{complexity}/10</span>
                    </div>
                    <Slider value={[complexity]} onValueChange={([v]) => setComplexity(v)} min={1} max={10} step={1} className="[&_.range-thumb]:bg-slate-900" />
                 </div>

                 <div className="p-5 bg-amber-50 rounded-2xl space-y-3 border border-amber-100 shadow-inner">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-600">
                       <span>Neural Jitter</span>
                       <span>{result.jitter}%</span>
                    </div>
                    <div className="w-full bg-amber-200/30 h-3 rounded-full overflow-hidden">
                       <div className="bg-amber-600 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(217,119,6,0.5)]" style={{ width: `${result.jitter}%` }}></div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-950 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-4 border-slate-900 font-mono text-sm shadow-2xl relative overflow-hidden group">
                 {/* Decorative code scan line */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-1/2 w-full animate-pulse top-0" />
                 
                 {result.isBallmerPeak && (
                    <div className="absolute inset-0 bg-emerald-500/10 z-0 animate-pulse flex items-center justify-center pointer-events-none">
                       <span className="text-4xl sm:text-7xl font-black text-emerald-500 opacity-20 rotate-12 uppercase tracking-tighter">Peak State</span>
                    </div>
                 )}

                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                       <Terminal className="w-4 h-4" /> <span className="text-xs">compiler@dev-machine:~$ ./compute</span>
                    </div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Injected Caffeine -&gt; Synthesizing Logic...</div>
                    
                    <div className="py-6 space-y-6 text-center">
                       <div className="space-y-1">
                          <div className="text-4xl sm:text-6xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform duration-500">{result.lines}</div>
                          <div className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em]">Synthesized LOC</div>
                       </div>
                       
                       <div className="flex justify-center items-center gap-2 text-rose-500">
                          <Bug className="w-4 h-4"/>
                          <span className="font-black text-xs uppercase tracking-widest">{result.bugs} Entropy Units (Bugs)</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-bold flex justify-between uppercase tracking-tighter">
                       <span>Stability: {result.jitter > 80 ? 'CRITICAL' : result.jitter > 40 ? 'Optimal' : 'Low Output'}</span>
                       <span>Input: {cups}c</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex justify-center pt-4">
              <ShareResult 
                 title="Caffeine-to-Code Matrix" 
                 text={`Calculated a ${result.lines} line output with ${result.bugs} bugs from ${cups} cups. ${result.isBallmerPeak ? 'BALLMER PEAK ACTIVE! 🚀' : '☕'}`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
