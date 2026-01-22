"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Moon } from "lucide-react"
import { useMemo, useState } from "react"

export function SleepCycleCalculator() {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake') // 'wake': I want to wake up at..., 'sleep': If I sleep now...
  const [hour, setHour] = useState('7')
  const [minute, setMinute] = useState('00')
  const [ampm, setAmpm] = useState('AM')
  const [now, setNow] = useState(false) // For 'sleep' mode: sleep now vs sleep at specific time

  const calculateCycles = () => {
    let targetTime = new Date()
    
    if (mode === 'wake' || !now) {
      targetTime.setHours(
        ampm === 'PM' && hour !== '12' ? parseInt(hour) + 12 : (ampm === 'AM' && hour === '12' ? 0 : parseInt(hour))
      )
      targetTime.setMinutes(parseInt(minute))
      targetTime.setSeconds(0)
      
      // If target is in the past, assume tomorrow (for wake mode) or next occurence
      if (targetTime < new Date()) {
        targetTime.setDate(targetTime.getDate() + 1)
      }
    }

    const cycles = []
    const cycleLength = 90 // minutes
    const fallingAsleepTime = 14 // average minutes to fall asleep

    if (mode === 'wake') {
      // If I want to wake up at X, when should I sleep?
      // Count backwards 90 min cycles from wake time
      // Subtract falling asleep time
      for (let c = 6; c >= 3; c--) {
        const sleepTime = new Date(targetTime.getTime() - (c * cycleLength * 60000) - (fallingAsleepTime * 60000))
        cycles.push({
          cycles: c,
          time: sleepTime,
          label: c === 5 || c === 6 ? "Optimal" : "Sufficient"
        })
      }
    } else {
      // If I sleep at X, when should I wake up?
      // Count forwards 90 min cycles from sleep time + falling asleep
      const baseTime = now ? new Date() : targetTime
      const startSleep = new Date(baseTime.getTime() + (fallingAsleepTime * 60000))
      
      for (let c = 3; c <= 6; c++) {
        const wakeTime = new Date(startSleep.getTime() + (c * cycleLength * 60000))
        cycles.push({
          cycles: c,
          time: wakeTime,
          label: c === 5 || c === 6 ? "Optimal" : "Sufficient"
        })
      }
    }

    return cycles
  }

  const results = useMemo(calculateCycles, [mode, hour, minute, ampm, now])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-900 border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-indigo-400 flex items-center gap-2">
            <Moon className="h-8 w-8 text-indigo-500 fill-indigo-500/20" />
            Sleep Cycle Optimizer
          </CardTitle>
          <CardDescription className="text-indigo-200/60">
            Master your REM cycles. Waking up in the middle of a sleep cycle leaves you groggy. 
            Aim for 5-6 cycles (7.5 - 9 hours).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="bg-slate-950 p-6 rounded-xl border border-indigo-900/50 space-y-6">
              <div className="flex gap-4 p-1 bg-slate-900 rounded-lg w-fit mx-auto border border-slate-800">
                 <button 
                    onClick={() => setMode('wake')} 
                    className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${mode === 'wake' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                    I want to wake up at...
                 </button>
                 <button 
                    onClick={() => setMode('sleep')} 
                    className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${mode === 'sleep' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                    If I go to sleep at...
                 </button>
              </div>

              {mode === 'sleep' && (
                 <div className="flex justify-center items-center gap-2 text-indigo-300 font-bold">
                    <Switch checked={now} onCheckedChange={setNow} />
                    <Label>Sleep Right Now?</Label>
                 </div>
              )}

              {(!now || mode === 'wake') && (
                <div className="flex justify-center gap-2 items-center animate-in zoom-in duration-300">
                   <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-indigo-500/30">
                      <Select value={hour} onValueChange={setHour}>
                         <SelectTrigger className="w-[70px] text-2xl font-black bg-transparent border-none text-white focus:ring-0"><SelectValue/></SelectTrigger>
                         <SelectContent className="max-h-[300px]">
                            {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                               <SelectItem key={h} value={h.toString()}>{h}</SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                      <span className="text-2xl font-black text-indigo-500">:</span>
                      <Select value={minute} onValueChange={setMinute}>
                         <SelectTrigger className="w-[70px] text-2xl font-black bg-transparent border-none text-white focus:ring-0"><SelectValue/></SelectTrigger>
                         <SelectContent className="max-h-[300px]">
                            {['00', '15', '30', '45'].map(m => (
                               <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                      <Select value={ampm} onValueChange={setAmpm}>
                         <SelectTrigger className="w-[70px] text-xl font-bold bg-indigo-900/50 border-none text-indigo-300 focus:ring-0"><SelectValue/></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-4">
              <h3 className="text-center text-indigo-200 font-bold text-sm uppercase tracking-widest">
                 {mode === 'wake' ? "You should try to fall asleep at one of these times:" : "You should try to wake up at one of these times:"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {results.map((r, i) => (
                    <div key={i} className={`relative p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${r.cycles >= 5 ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-slate-800 border-slate-700 opacity-80'}`}>
                       {r.cycles >= 5 && (
                          <div className="absolute -top-3 px-3 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
                             Recommended
                          </div>
                       )}
                       <div className="text-3xl font-black text-white">{formatTime(r.time)}</div>
                       <div className={`text-xs font-bold uppercase ${r.cycles >= 5 ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {r.cycles} Cycles ({r.cycles * 1.5} Hours)
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="flex justify-center mt-8">
              <ShareResult 
                 title="Optimal Sleep Found" 
                 text={`I'm optimizing my sleep! Aiming for ${results[3].cycles} cycles (${results[3].cycles * 1.5} hrs) to wake up feeling fresh. 🌙`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
