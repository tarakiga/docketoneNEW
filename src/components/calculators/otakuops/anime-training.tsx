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
      <Card className="relative overflow-hidden bg-[var(--dk-surface)] border-2 border-[var(--dk-line)] shadow-xl">
        {/* Subtle Manga Speed Lines */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
             style={{
               backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 30px, var(--dk-yel) 30px, var(--dk-yel) 31px)'
             }}>
        </div>

        <CardHeader className="border-b border-[var(--dk-line)] bg-[var(--dk-sunk)] relative z-10 p-5 sm:p-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <CardTitle className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-[var(--dk-ink)] flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
                  <span className="bg-[var(--dk-yel)] text-[var(--dk-on-fill)] px-4 py-1 skew-x-[-12deg]">ANIME</span>
                  <span>TRAINING ARC</span>
                </CardTitle>
                <CardDescription className="text-[var(--dk-ink-soft)] font-bold uppercase tracking-widest text-[10px]">
                  Calculate the physical toll of your next protagonist montage
                </CardDescription>
              </div>
              <div className="shrink-0">
                <div className="bg-[var(--dk-raised)] text-[var(--dk-yel-ink)] px-6 py-2 rounded-full font-black italic text-xs tracking-widest border-2 border-[var(--dk-yel-ink)]">
                    STATUS: {currentPower < 200 ? "SIDE CHARACTER" : "PROTAGONIST"}
                </div>
              </div>
           </div>
        </CardHeader>
        
        <CardContent className="grid gap-8 md:grid-cols-2 p-5 sm:p-10 relative z-10">
           
           <div className="space-y-8">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-[var(--dk-yel-ink)] font-black uppercase tracking-widest text-[10px]">
                    <Flame className="h-4 w-4 fill-[var(--dk-yel-ink)] text-[var(--dk-yel-ink)]"/> Sequence Intensity
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   {['casual', 'shounen', 'demon slayer'].map(i => (
                     <button
                       key={i}
                       onClick={() => setIntensity(i)}
                       className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest border-2 rounded-2xl transition-all ${intensity === i ? 'bg-[var(--dk-yel)] border-[var(--dk-yel-ink)] text-[var(--dk-on-fill)] -translate-y-1' : 'bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink-soft)] hover:bg-[var(--dk-raised)]'}`}
                     >
                       {i}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex justify-between font-black uppercase tracking-widest text-[10px] text-[var(--dk-ink-soft)]">
                    <span>Current Vitality</span>
                    <span className="text-[var(--dk-yel-ink)]">{currentPower}</span>
                </Label>
                <Slider value={[currentPower]} onValueChange={([v]) => setCurrentPower(v)} max={1000} className="[&_.range-thumb]:bg-[var(--dk-yel)] [&_.range-thumb]:border-[var(--dk-yel-ink)]" />
              </div>

              <div className="space-y-4">
                  <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-[var(--dk-ink-soft)]">
                     <span className="flex items-center gap-2"><Music className="w-4 h-4 text-[var(--dk-yel-ink)]"/> OST Hype Bonus</span>
                     <span className="text-[var(--dk-yel-ink)]">{musicBonus}%</span>
                  </div>
                  <Slider value={[musicBonus]} onValueChange={([v]) => setMusicBonus(v)} max={100} className="[&_.range-thumb]:bg-[var(--dk-yel)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                 <div className="space-y-3 min-w-0">
                    <Label className="font-black uppercase tracking-widest text-[10px] text-[var(--dk-ink-soft)] whitespace-normal break-words">Rival Dynamics</Label>
                    <Select value={rivalTaunts} onValueChange={setRivalTaunts}>
                       <SelectTrigger className="w-full min-w-0 font-bold border-[var(--dk-line)] bg-[var(--dk-sunk)] text-[var(--dk-ink)] h-11 rounded-2xl focus:ring-2 focus:ring-[var(--dk-yel-ink)] focus:border-[var(--dk-yel-ink)]"><SelectValue/></SelectTrigger>
                       <SelectContent className="rounded-2xl bg-[var(--dk-raised)] border-[var(--dk-line)] text-[var(--dk-ink)]">
                          <SelectItem value="none">None (Boring)</SelectItem>
                          <SelectItem value="occasional">Occasional Insults</SelectItem>
                          <SelectItem value="constant">Constant Mockery</SelectItem>
                          <SelectItem value="trauma">Ancient Bloodrival</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 {rivalTaunts !== 'none' && (
                    <div className="space-y-3 min-w-0">
                       <Label className="font-black uppercase tracking-widest text-[10px] text-[var(--dk-ink-soft)] flex justify-between gap-2">
                         <span>Flashback</span>
                         <span className="text-[var(--dk-yel-ink)]">{flashback}%</span>
                       </Label>
                       <Slider value={[flashback]} onValueChange={([v]) => setFlashback(v)} max={100} className="[&_.range-thumb]:bg-[var(--dk-yel)]" />
                    </div>
                 )}
              </div>

              {trainingState === 'idle' && (
                 <Button onClick={calculatePlan} className="w-full min-h-[4rem] px-6 py-4 text-lg sm:text-xl font-black italic bg-[var(--dk-yel)] hover:bg-[#ffdb5c] text-[var(--dk-on-fill)] rounded-[2rem] border-b-8 border-[#b8941f] active:border-b-0 active:translate-y-2 transition-all tracking-tighter uppercase whitespace-normal leading-tight">
                    Unleash Potential!
                 </Button>
              )}
           </div>

           {/* Results Area */}
           <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-[var(--dk-sunk)] text-[var(--dk-ink)] p-6 sm:p-10 border-4 border-[var(--dk-line)] relative overflow-hidden flex flex-col justify-center min-h-[300px] sm:min-h-[400px]">

              {trainingState === 'training' && (
                <div className="space-y-6 text-center animate-in zoom-in-95 py-12 relative z-10">
                   <h3 className="text-3xl sm:text-5xl font-black italic text-[var(--dk-yel-ink)] animate-pulse tracking-tighter">SURGING...</h3>
                   <div className="w-full bg-[var(--dk-raised)] h-10 rounded-full overflow-hidden border-2 border-[var(--dk-line)] p-1.5">
                      <div className="h-full bg-[var(--dk-yel)] rounded-full" style={{ width: `${progress}%` }}></div>
                   </div>
                   <div className="flex justify-between font-mono text-[var(--dk-ink-soft)] text-xs px-2">
                       <span>SYNERGY: {progress}%</span>
                       <span>EST. REPS: {Math.round(results.pushups * (progress/100))}</span>
                   </div>
                </div>
              )}

              {trainingState === 'complete' && (
                <div className="space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700 relative z-10">
                   <h3 className="text-6xl font-black italic text-[var(--dk-yel-ink)] tracking-tighter uppercase">
                      EVOLVED!
                   </h3>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[var(--dk-raised)] p-6 rounded-3xl border border-[var(--dk-line)] group hover:bg-[#2c2160] transition-all">
                         <div className="font-black text-[var(--dk-ink-soft)] text-[10px] uppercase tracking-[0.2em] mb-2">Arc Workload</div>
                         <div className="text-2xl sm:text-4xl font-black text-[var(--dk-yel-ink)]">{results.pushups.toLocaleString()}</div>
                         <div className="text-[10px] text-[var(--dk-ink-soft)] font-bold mt-1 uppercase">Total Push-ups</div>
                      </div>
                      <div className="bg-[var(--dk-raised)] p-6 rounded-3xl border border-[var(--dk-line)] group hover:bg-[#2c2160] transition-all">
                         <div className="font-black text-[var(--dk-ink-soft)] text-[10px] uppercase tracking-[0.2em] mb-2">Divergence Mult</div>
                         <div className="text-2xl sm:text-4xl font-black text-[var(--dk-yel-ink)]">{results.powerMult}x</div>
                         <div className="text-[10px] text-[var(--dk-ink-soft)] font-bold mt-1 uppercase">Multiplier Active</div>
                      </div>
                   </div>

                   <div className="bg-[var(--dk-yel)] text-[var(--dk-on-fill)] p-4 font-black text-2xl italic border-4 border-[var(--dk-line)] rounded-2xl transform">
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
                        className="text-[var(--dk-ink-soft)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--dk-yel-ink)] transition-colors"
                      >
                         Restart Arc Montage
                      </button>
                   </div>
                </div>
              )}

              {trainingState === 'idle' && (
                <div className="text-center space-y-4 py-12 opacity-50 text-[var(--dk-ink-soft)]">
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
