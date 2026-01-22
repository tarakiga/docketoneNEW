"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    
    // Simulate training progress
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
    // Logic from legacy
    let basePushups = 10000 - (currentPower * 10)
    
    // Intensity mult
    const intMult = { 'casual': 0.8, 'shounen': 1.0, 'demon slayer': 1.5 }
    basePushups *= intMult[intensity as keyof typeof intMult]
    
    // Music reduction
    basePushups *= (1 - (musicBonus / 400))
    
    // Rival
    const rivalMult = { 'none': 1.0, 'occasional': 0.9, 'constant': 0.8, 'trauma': 0.7 }
    basePushups *= rivalMult[rivalTaunts as keyof typeof rivalMult]

    // Flashback
    if (rivalTaunts !== 'none') {
       basePushups *= (1 - (flashback / 500))
    }

    const pushups = Math.max(100, Math.round(basePushups))
    
    // Power Mult
    let pm = (intMult[intensity as keyof typeof intMult] * 0.5) + (musicBonus/100 * 0.3) + (rivalTaunts !== 'none' ? 0.4 : 0)
    
    return {
      pushups,
      powerMult: pm.toFixed(1),
      finalPower: 'OVER 9000', // Simplified for fun
      mainCharacterStatus: true
    }
  })()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-50 border-red-500 border-4 shadow-[10px_10px_0px_0px_rgba(239,68,68,1)] overflow-hidden relative">
        {/* Anime Speed Lines Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #ef4444 40px, #ef4444 42px)' 
             }}>
        </div>

        <CardHeader className="bg-red-600 text-white transform -skew-x-12 mx-8 mt-6 mb-4 py-6 border-b-4 border-black shadow-lg relative z-10">
           <CardTitle className="text-4xl font-black text-center italic uppercase transform skew-x-12 drop-shadow-md">
             Anime Training Arc
           </CardTitle>
           <CardDescription className="text-center text-red-100 font-bold transform skew-x-12 opacity-90">
             From NPC to Protagonist in one montage!
           </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8 relative z-10">
           
           <div className="bg-white p-6 border-2 border-black rounded-xl shadow-lg space-y-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Flame className="text-orange-500 fill-orange-500"/> CONFIGURATION
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <label className="font-bold text-sm uppercase text-slate-500">Training Intensity</label>
                    <div className="flex gap-2">
                       {['casual', 'shounen', 'demon slayer'].map(i => (
                         <button 
                           key={i}
                           onClick={() => setIntensity(i)}
                           className={`flex-1 py-3 font-black uppercase text-sm border-2 rounded transition-all ${intensity === i ? 'bg-red-100 border-red-500 text-red-600 -translate-y-1 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'}`}
                         >
                           {i}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="font-bold text-sm uppercase text-slate-500">Current Power Level: {currentPower}</label>
                    <Slider value={[currentPower]} onValueChange={([v]) => setCurrentPower(v)} max={1000} className="[&_.range-thumb]:bg-red-500 [&_.range-thumb]:border-black" />
                    <p className="text-xs text-slate-400 text-right font-mono">
                      {currentPower < 200 ? "Background NPC" : currentPower < 600 ? "Side Character" : "Protagonist"}
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                  <div className="flex justify-between font-bold text-sm uppercase text-slate-500">
                     <span className="flex items-center gap-2"><Music className="w-4 h-4"/> Dramatic Music Bonus</span>
                     <span>{musicBonus}%</span>
                  </div>
                  <Slider value={[musicBonus]} onValueChange={([v]) => setMusicBonus(v)} max={100} className="[&_.range-thumb]:bg-purple-500" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="font-bold text-sm uppercase text-slate-500">Rival Taunts</label>
                    <Select value={rivalTaunts} onValueChange={setRivalTaunts}>
                       <SelectTrigger className="font-bold border-2 border-slate-300 bg-slate-50"><SelectValue/></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="none">None (Boring)</SelectItem>
                          <SelectItem value="occasional">Occasional Insults</SelectItem>
                          <SelectItem value="constant">Constant Mockery</SelectItem>
                          <SelectItem value="trauma">Tragic Backstory Link</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 {rivalTaunts !== 'none' && (
                    <div className="space-y-2">
                       <label className="font-bold text-sm uppercase text-slate-500">Flashback Potential: {flashback}%</label>
                       <Slider value={[flashback]} onValueChange={([v]) => setFlashback(v)} max={100} className="[&_.range-thumb]:bg-blue-500" />
                    </div>
                 )}
              </div>

              {trainingState === 'idle' && (
                 <Button onClick={calculatePlan} className="w-full h-16 text-xl font-black italic bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 border-b-8 border-red-800 active:border-b-0 active:translate-y-2 transition-all">
                    BEGIN MONTAGE SEQUENCE!
                 </Button>
              )}
           </div>

           {/* Results Area */}
           {(trainingState === 'training' || trainingState === 'complete') && (
              <div className="bg-slate-900 text-white p-6 rounded-xl border-4 border-black relative overflow-hidden animate-in zoom-in-95">
                 
                 {trainingState === 'training' && (
                    <div className="space-y-4 text-center py-12">
                       <h3 className="text-4xl font-black italic text-yellow-400 animate-pulse">TRAINING...</h3>
                       <div className="w-full bg-slate-800 h-8 rounded-full overflow-hidden border-2 border-white">
                          <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500" style={{ width: `${progress}%` }}></div>
                       </div>
                       <p className="font-mono text-green-400">Push-ups: {Math.round(results.pushups * (progress/100))}</p>
                    </div>
                 )}

                 {trainingState === 'complete' && (
                    <div className="space-y-6 text-center animate-in slide-in-from-bottom duration-500">
                       <h3 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-t from-yellow-400 to-white drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                          TRAINING COMPLETE!
                       </h3>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-red-600 p-4 rounded-lg border-b-4 border-red-900 transform rotate-2">
                             <div className="font-bold text-red-200 text-xs">PUSH-UPS COMPLETED</div>
                             <div className="text-3xl font-black">{results.pushups.toLocaleString()}</div>
                          </div>
                          <div className="bg-blue-600 p-4 rounded-lg border-b-4 border-blue-900 transform -rotate-1">
                             <div className="font-bold text-blue-200 text-xs">POWER MULTIPLIER</div>
                             <div className="text-3xl font-black">{results.powerMult}x</div>
                          </div>
                       </div>

                       <div className="bg-yellow-500 text-black p-4 font-black text-xl italic border-4 border-black transform skew-x-[-10deg]">
                          NEW STATUS: MAIN CHARACTER
                       </div>

                       <div className="flex justify-center gap-4">
                          <Button variant="outline" className="text-black border-2 border-white hover:bg-white/10" onClick={() => setTrainingState('idle')}>Reset Arc</Button>
                          <div className="text-left w-full max-w-xs">
                            <ShareResult 
                              title="Anime Training Results" 
                              text={`I completed my training arc! ${results.pushups} push-ups and a ${results.powerMult}x power boost. I am now the Main Character!`}
                            />
                          </div>
                       </div>
                    </div>
                 )}

              </div>
           )}

        </CardContent>
      </Card>
    </div>
  )
}
