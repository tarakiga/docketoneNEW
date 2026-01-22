"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Clock } from "lucide-react"
import { useMemo, useState } from "react"

export function TimeParadoxDetector() {
  const [targetYear, setTargetYear] = useState(1955)
  const [significance, setSignificance] = useState('personal')
  const [intensity, setIntensity] = useState(10)
  const [paradigm, setParadigm] = useState('dynamic')

  const results = useMemo(() => {
    let risk = intensity
    
    // Significance multiplier
    const sigMult = { 'none': 0.8, 'personal': 1.5, 'event': 2.5, 'linchpin': 5.0 }
    risk *= sigMult[significance as keyof typeof sigMult]

    // Time distance multiplier (logarithmic - further back isn't linearly worse, but recency is volatile)
    const yearsAgo = Math.abs(new Date().getFullYear() - targetYear)
    const distMult = 1 + (Math.log10(yearsAgo + 1) * 0.5)
    risk *= distMult

    // Paradigm multiplier
    const paraMult = { 'fixed': 0.1, 'dynamic': 1.0, 'multiverse': 0.05 }
    
    // Final raw risk
    let finalRisk = Math.min(100, risk * paraMult[paradigm as keyof typeof paraMult])
    
    // Paradox Speculation
    let paradoxType = "Stable Loop"
    if (finalRisk > 90) paradoxType = "Reality Collapse"
    else if (finalRisk > 60) paradoxType = "Grandfather Paradox"
    else if (finalRisk > 30) paradoxType = "Bootstrap Paradox"
    else if (finalRisk > 10) paradoxType = "Butterfly Effect"

    return { 
      risk: Math.round(finalRisk), 
      paradoxType,
      color: finalRisk > 80 ? 'text-red-500' : finalRisk > 50 ? 'text-orange-500' : finalRisk > 20 ? 'text-yellow-500' : 'text-green-500'
    }
  }, [targetYear, significance, intensity, paradigm])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-cyan-500/30 overflow-hidden">
        <CardHeader className="border-b border-cyan-900/30">
          <CardTitle className="text-3xl font-mono text-cyan-400 flex items-center gap-2">
            <Clock className="h-6 w-6"/> CHRONOS ANOMALY DETECTOR
          </CardTitle>
          <CardDescription className="text-cyan-700 font-mono">Temporal Integrity Monitoring System</CardDescription>
        </CardHeader>
        
        <CardContent className="grid lg:grid-cols-2 gap-12 p-8">
           
           <div className="space-y-6 font-mono text-cyan-500">
             
             <div className="space-y-2">
                <Label>Target Temporal Coordinate (Year)</Label>
                <input 
                  type="number" 
                  value={targetYear} 
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-cyan-800 rounded p-2 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
             </div>

             <div className="space-y-2">
                <Label>Target Significance</Label>
                <Select value={significance} onValueChange={setSignificance}>
                   <SelectTrigger className="bg-slate-900 border-cyan-800 text-cyan-300"><SelectValue/></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="none">Zero Significance (Void)</SelectItem>
                     <SelectItem value="personal">Personal Ancestor</SelectItem>
                     <SelectItem value="event">Historical Event</SelectItem>
                     <SelectItem value="linchpin">Causal Linchpin</SelectItem>
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between">
                   <Label>Interaction Intensity</Label>
                   <span>{intensity}%</span>
                </div>
                <Slider value={[intensity]} onValueChange={([v]) => setIntensity(v)} max={100} className="[&_.range-thumb]:bg-cyan-500" />
                <p className="text-xs opacity-70 mt-1">
                  {intensity < 20 ? "Observation Only" : intensity < 50 ? "Minor Interaction" : intensity < 80 ? "Significant Alteration" : "Timeline Erasure"}
                </p>
             </div>
             
             <div className="space-y-2">
                <Label>Temporal Physics Model</Label>
                <Select value={paradigm} onValueChange={setParadigm}>
                   <SelectTrigger className="bg-slate-900 border-cyan-800 text-cyan-300"><SelectValue/></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="fixed">Fixed (Novikov Principle)</SelectItem>
                     <SelectItem value="dynamic">Dynamic (Back to the Future)</SelectItem>
                     <SelectItem value="multiverse">Multiverse (Branching)</SelectItem>
                   </SelectContent>
                </Select>
             </div>

           </div>

           <div className="flex flex-col items-center justify-center space-y-8 bg-slate-900/30 rounded-xl p-6 border border-cyan-500/20">
              
              <div className="relative w-64 h-64">
                 {/* Gauge Visual */}
                 <div className="absolute inset-0 rounded-full border-8 border-slate-800"></div>
                 <div 
                   className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000"
                   style={{ 
                     borderTopColor: results.risk > 80 ? '#ef4444' : results.risk > 50 ? '#f97316' : results.risk > 20 ? '#eab308' : '#22c55e',
                     transform: `rotate(${results.risk * 3.6}deg)`
                   }}
                 ></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-black ${results.color} font-mono`}>{results.risk}%</div>
                    <div className="text-cyan-600 text-xs tracking-widest uppercase mt-2">Paradox Probability</div>
                 </div>
              </div>

              <div className="text-center space-y-2">
                 <div className={`text-2xl font-bold font-mono ${results.color}`}>{results.paradoxType.toUpperCase()}</div>
                 <p className="text-cyan-200/50 text-sm max-w-xs mx-auto">
                   {results.risk > 80 ? "CRITICAL FAILURE. CAUSALITY LOOP IMMINENT. ABORT." : 
                    results.risk > 50 ? "High risk of contradictory timeline emergence." : 
                    "Timeline stable within acceptable parameters."}
                 </p>
              </div>

              <ShareResult 
                 title="Temporal Paradox Check"
                 text={`My time travel mission to ${targetYear} has a ${results.risk}% paradox risk (${results.paradoxType}). Safe travels?`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
