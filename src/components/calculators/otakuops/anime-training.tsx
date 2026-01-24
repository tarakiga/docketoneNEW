"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Flame, Music } from "lucide-react"
import { useState } from "react"

export function AnimeTrainingCalculator() {
  const [intensity, setIntensity] = useState('shounen')
  const [currentPower, setCurrentPower] = useState(50)
  const [musicBonus, setMusicBonus] = useState(50)
  const [rivalTaunts, setRivalTaunts] = useState('none')
  const [flashback, setFlashback] = useState(30)
  
  const [trainingState, setTrainingState] = useState<'idle' | 'training' | 'complete'>('idle')
  const [progress, setProgress] = useState(0)
  
  const calculatePlan = () => {
    setTrainingState('training')
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTrainingState('complete')
          return 100
        }
        return p + 2
      })
    }, 50)
  }

  const results = (() => {
    let basePushups = 10000 - (currentPower * 10)
    const intMult = { 'casual': 0.8, 'shounen': 1.0, 'demon slayer': 1.5 }
    basePushups *= intMult[intensity as keyof typeof intMult]
    basePushups *= (1 - (musicBonus / 400))
    const rivalMult = { 'none': 1.0, 'occasional': 0.9, 'constant': 0.8, 'trauma': 0.7 }
    basePushups *= rivalMult[rivalTaunts as keyof typeof rivalMult]
    if (rivalTaunts !== 'none') {
       basePushups *= (1 - (flashback / 500))
    }
    const pushups = Math.max(100, Math.round(basePushups))
    let pm = (intMult[intensity as keyof typeof intMult] * 0.5) + (musicBonus/100 * 0.3) + (rivalTaunts !== 'none' ? 0.4 : 0)
    
    return {
      pushups,
      powerMult: pm.toFixed(1),
      finalPower: 'OVER 9000',
      mainCharacterStatus: true
    }
  })()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="white-glass-card shadow-xl shadow-red-500/5 relative overflow-hidden">
        {/* Subtle Manga Speed Lines */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 30px, #000 30px, #000 31px)' 
             }}>
        </div>

        <CardHeader className="border-b border-slate-100 bg-white/50 relative z-10 p-5 sm:p-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <CardTitle className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 drop-shadow-sm flex items-center justify-center md:justify-start gap-4">
                  <span className="bg-red-600 text-white px-4 py-1 skew-x-[-12deg] shadow-lg shadow-red-200">ANIME</span>
                  <span>TRAINING ARC</span>
                </CardTitle>
                <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  Calculate the physical toll of your next protagonist montage
                </CardDescription>
              </div>
              <div className="shrink-0">
                <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-black italic text-xs tracking-widest border-2 border-slate-800 shadow-xl">
                    STATUS: {currentPower < 200 ? "SIDE CHARACTER" : "PROTAGONIST"}
                </div>
              </div>
           </div>
        </CardHeader>
        
        <CardContent className="grid gap-8 md:grid-cols-2 p-5 sm:p-10 relative z-10">
           
           <div className="space-y-8">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-[10px]">
                    <Flame className="h-4 w-4 fill-red-500 text-red-500"/> Sequence Intensity
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   {['casual', 'shounen', 'demon slayer'].map(i => (
                     <button 
                       key={i}
                       onClick={() => setIntensity(i)}
                       className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest border-2 rounded-2xl transition-all ${intensity === i ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-200 -translate-y-1' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}
                     >
                       {i}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-500">
                    <span>Current Vitality</span>
                    <span className="text-slate-900">{currentPower}</span>
                </Label>
                <Slider value={[currentPower]} onValueChange={([v]) => setCurrentPower(v)} max={1000} className="[&_.range-thumb]:bg-red-600 [&_.range-thumb]:border-red-600" />
              </div>

              <div className="space-y-4">
                  <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-500">
                     <span className="flex items-center gap-2"><Music className="w-4 h-4 text-purple-600"/> OST Hype Bonus</span>
                     <span className="text-purple-600">{musicBonus}%</span>
                  </div>
                  <Slider value={[musicBonus]} onValueChange={([v]) => setMusicBonus(v)} max={100} className="[&_.range-thumb]:bg-purple-600" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <Label className="font-black uppercase tracking-widest text-[10px] text-slate-500">Rival Dynamics</Label>
                    <Select value={rivalTaunts} onValueChange={setRivalTaunts}>
                       <SelectTrigger className="font-bold border-slate-200 bg-white shadow-sm h-11 rounded-2xl"><SelectValue/></SelectTrigger>
                       <SelectContent className="rounded-2xl">
                          <SelectItem value="none">None (Boring)</SelectItem>
                          <SelectItem value="occasional">Occasional Insults</SelectItem>
                          <SelectItem value="constant">Constant Mockery</SelectItem>
                          <SelectItem value="trauma">Ancient Bloodrival</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 {rivalTaunts !== 'none' && (
                    <div className="space-y-3">
                       <Label className="font-black uppercase tracking-widest text-[10px] text-slate-500 flex justify-between">
                         <span>Flashback</span>
                         <span>{flashback}%</span>
                       </Label>
                       <Slider value={[flashback]} onValueChange={([v]) => setFlashback(v)} max={100} className="[&_.range-thumb]:bg-blue-600" />
                    </div>
                 )}
              </div>

              {trainingState === 'idle' && (
                 <Button onClick={calculatePlan} className="w-full min-h-[4rem] px-6 py-4 text-lg sm:text-xl font-black italic bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-2xl shadow-red-200 rounded-[2rem] border-b-8 border-red-800 active:border-b-0 active:translate-y-2 transition-all tracking-tighter uppercase whitespace-normal leading-tight">
                    Unleash Potential!
                 </Button>
              )}
           </div>

           {/* Results Area */}
           <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-slate-900 text-white p-6 sm:p-10 border-4 border-slate-800 relative overflow-hidden flex flex-col justify-center min-h-[300px] sm:min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent pointer-events-none" />
              
              {trainingState === 'training' && (
                <div className="space-y-6 text-center animate-in zoom-in-95 py-12 relative z-10">
                   <h3 className="text-3xl sm:text-5xl font-black italic text-yellow-400 animate-pulse tracking-tighter">SURGING...</h3>
                   <div className="w-full bg-slate-800 h-10 rounded-full overflow-hidden border-2 border-slate-700 p-1.5">
                      <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]" style={{ width: `${progress}%` }}></div>
                   </div>
                   <div className="flex justify-between font-mono text-emerald-400 text-xs px-2">
                       <span>SYNERGY: {progress}%</span>
                       <span>EST. REPS: {Math.round(results.pushups * (progress/100))}</span>
                   </div>
                </div>
              )}

              {trainingState === 'complete' && (
                <div className="space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700 relative z-10">
                   <h3 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 tracking-tighter uppercase drop-shadow-2xl">
                      EVOLVED!
                   </h3>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl group hover:bg-white/20 transition-all">
                         <div className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-2">Arc Workload</div>
                         <div className="text-2xl sm:text-4xl font-black text-white">{results.pushups.toLocaleString()}</div>
                         <div className="text-[10px] text-red-400 font-bold mt-1 uppercase">Total Push-ups</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl group hover:bg-white/20 transition-all">
                         <div className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-2">Divergence Mult</div>
                         <div className="text-2xl sm:text-4xl font-black text-white">{results.powerMult}x</div>
                         <div className="text-[10px] text-blue-400 font-bold mt-1 uppercase">Multiplier Active</div>
                      </div>
                   </div>

                   <div className="bg-yellow-400 text-slate-900 p-4 font-black text-2xl italic border-4 border-slate-900 rounded-2xl transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                      STATUS: ASCENDED
                   </div>

                   <div className="flex flex-col gap-4 pt-4">
                      <ShareResult 
                        title="Anime Training Arc Complete" 
                        text={`I've reached 9000! Finished my arc with ${results.pushups} push-ups. I am the Chosen One!`}
                        className="w-full"
                      />
                      <button 
                        onClick={() => setTrainingState('idle')}
                        className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                      >
                         Restart Arc Montage
                      </button>
                   </div>
                </div>
              )}

              {trainingState === 'idle' && (
                <div className="text-center space-y-4 py-12 opacity-40">
                    <div className="text-8xl">🥋</div>
                    <div className="font-black uppercase tracking-widest text-xs">Waiting for Montage Activation</div>
                </div>
              )}
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
