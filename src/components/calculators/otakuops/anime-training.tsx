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
    const pm = (intMult[intensity as keyof typeof intMult] * 0.5) + (musicBonus/100 * 0.3) + (rivalTaunts !== 'none' ? 0.4 : 0)
    
    return {
      pushups,
      powerMult: pm.toFixed(1),
      finalPower: 'OVER 9000',
      mainCharacterStatus: true
    }
  })()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="relative overflow-hidden bg-[#1d1442] border-2 border-[#4a3f7a] shadow-xl">
        {/* Subtle Manga Speed Lines */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
             style={{
               backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 30px, #ffd23c 30px, #ffd23c 31px)'
             }}>
        </div>

        <CardHeader className="border-b border-[#4a3f7a] bg-[#0c0824] relative z-10 p-5 sm:p-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <CardTitle className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-[#ECEAE3] flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
                  <span className="bg-[#ffd23c] text-[#0c0824] px-4 py-1 skew-x-[-12deg]">ANIME</span>
                  <span>TRAINING ARC</span>
                </CardTitle>
                <CardDescription className="text-[#b3aae0] font-bold uppercase tracking-widest text-[10px]">
                  Calculate the physical toll of your next protagonist montage
                </CardDescription>
              </div>
              <div className="shrink-0">
                <div className="bg-[#241a52] text-[#ffd23c] px-6 py-2 rounded-full font-black italic text-xs tracking-widest border-2 border-[#ffd23c]">
                    STATUS: {currentPower < 200 ? "SIDE CHARACTER" : "PROTAGONIST"}
                </div>
              </div>
           </div>
        </CardHeader>
        
        <CardContent className="grid gap-8 md:grid-cols-2 p-5 sm:p-10 relative z-10">
           
           <div className="space-y-8">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-[#ffd23c] font-black uppercase tracking-widest text-[10px]">
                    <Flame className="h-4 w-4 fill-[#ffd23c] text-[#ffd23c]"/> Sequence Intensity
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   {['casual', 'shounen', 'demon slayer'].map(i => (
                     <button
                       key={i}
                       onClick={() => setIntensity(i)}
                       className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest border-2 rounded-2xl transition-all ${intensity === i ? 'bg-[#ffd23c] border-[#ffd23c] text-[#0c0824] -translate-y-1' : 'bg-[#0c0824] border-[#4a3f7a] text-[#b3aae0] hover:bg-[#241a52]'}`}
                     >
                       {i}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex justify-between font-black uppercase tracking-widest text-[10px] text-[#b3aae0]">
                    <span>Current Vitality</span>
                    <span className="text-[#ffd23c]">{currentPower}</span>
                </Label>
                <Slider value={[currentPower]} onValueChange={([v]) => setCurrentPower(v)} max={1000} className="[&_.range-thumb]:bg-[#ffd23c] [&_.range-thumb]:border-[#ffd23c]" />
              </div>

              <div className="space-y-4">
                  <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-[#b3aae0]">
                     <span className="flex items-center gap-2"><Music className="w-4 h-4 text-[#ffd23c]"/> OST Hype Bonus</span>
                     <span className="text-[#ffd23c]">{musicBonus}%</span>
                  </div>
                  <Slider value={[musicBonus]} onValueChange={([v]) => setMusicBonus(v)} max={100} className="[&_.range-thumb]:bg-[#ffd23c]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                 <div className="space-y-3 min-w-0">
                    <Label className="font-black uppercase tracking-widest text-[10px] text-[#b3aae0] whitespace-normal break-words">Rival Dynamics</Label>
                    <Select value={rivalTaunts} onValueChange={setRivalTaunts}>
                       <SelectTrigger className="w-full min-w-0 font-bold border-[#4a3f7a] bg-[#0c0824] text-[#ECEAE3] h-11 rounded-2xl focus:ring-2 focus:ring-[#ffd23c] focus:border-[#ffd23c]"><SelectValue/></SelectTrigger>
                       <SelectContent className="rounded-2xl bg-[#241a52] border-[#4a3f7a] text-[#ECEAE3]">
                          <SelectItem value="none">None (Boring)</SelectItem>
                          <SelectItem value="occasional">Occasional Insults</SelectItem>
                          <SelectItem value="constant">Constant Mockery</SelectItem>
                          <SelectItem value="trauma">Ancient Bloodrival</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 {rivalTaunts !== 'none' && (
                    <div className="space-y-3 min-w-0">
                       <Label className="font-black uppercase tracking-widest text-[10px] text-[#b3aae0] flex justify-between gap-2">
                         <span>Flashback</span>
                         <span className="text-[#ffd23c]">{flashback}%</span>
                       </Label>
                       <Slider value={[flashback]} onValueChange={([v]) => setFlashback(v)} max={100} className="[&_.range-thumb]:bg-[#ffd23c]" />
                    </div>
                 )}
              </div>

              {trainingState === 'idle' && (
                 <Button onClick={calculatePlan} className="w-full min-h-[4rem] px-6 py-4 text-lg sm:text-xl font-black italic bg-[#ffd23c] hover:bg-[#ffdb5c] text-[#0c0824] rounded-[2rem] border-b-8 border-[#b8941f] active:border-b-0 active:translate-y-2 transition-all tracking-tighter uppercase whitespace-normal leading-tight">
                    Unleash Potential!
                 </Button>
              )}
           </div>

           {/* Results Area */}
           <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#0c0824] text-[#ECEAE3] p-6 sm:p-10 border-4 border-[#4a3f7a] relative overflow-hidden flex flex-col justify-center min-h-[300px] sm:min-h-[400px]">

              {trainingState === 'training' && (
                <div className="space-y-6 text-center animate-in zoom-in-95 py-12 relative z-10">
                   <h3 className="text-3xl sm:text-5xl font-black italic text-[#ffd23c] animate-pulse tracking-tighter">SURGING...</h3>
                   <div className="w-full bg-[#241a52] h-10 rounded-full overflow-hidden border-2 border-[#4a3f7a] p-1.5">
                      <div className="h-full bg-[#ffd23c] rounded-full" style={{ width: `${progress}%` }}></div>
                   </div>
                   <div className="flex justify-between font-mono text-[#b3aae0] text-xs px-2">
                       <span>SYNERGY: {progress}%</span>
                       <span>EST. REPS: {Math.round(results.pushups * (progress/100))}</span>
                   </div>
                </div>
              )}

              {trainingState === 'complete' && (
                <div className="space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700 relative z-10">
                   <h3 className="text-6xl font-black italic text-[#ffd23c] tracking-tighter uppercase">
                      EVOLVED!
                   </h3>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#241a52] p-6 rounded-3xl border border-[#4a3f7a] group hover:bg-[#2c2160] transition-all">
                         <div className="font-black text-[#b3aae0] text-[10px] uppercase tracking-[0.2em] mb-2">Arc Workload</div>
                         <div className="text-2xl sm:text-4xl font-black text-[#ffd23c]">{results.pushups.toLocaleString()}</div>
                         <div className="text-[10px] text-[#b3aae0] font-bold mt-1 uppercase">Total Push-ups</div>
                      </div>
                      <div className="bg-[#241a52] p-6 rounded-3xl border border-[#4a3f7a] group hover:bg-[#2c2160] transition-all">
                         <div className="font-black text-[#b3aae0] text-[10px] uppercase tracking-[0.2em] mb-2">Divergence Mult</div>
                         <div className="text-2xl sm:text-4xl font-black text-[#ffd23c]">{results.powerMult}x</div>
                         <div className="text-[10px] text-[#b3aae0] font-bold mt-1 uppercase">Multiplier Active</div>
                      </div>
                   </div>

                   <div className="bg-[#ffd23c] text-[#0c0824] p-4 font-black text-2xl italic border-4 border-[#0c0824] rounded-2xl transform">
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
                        className="text-[#b3aae0] font-black uppercase text-[10px] tracking-widest hover:text-[#ffd23c] transition-colors"
                      >
                         Restart Arc Montage
                      </button>
                   </div>
                </div>
              )}

              {trainingState === 'idle' && (
                <div className="text-center space-y-4 py-12 opacity-50 text-[#b3aae0]">
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
