"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Result = { midichlorian: number, title: string, alignment: number, aspects: { control: number, sense: number, alter: number } }

export function ForceSensitivityCalculator() {
  const [step, setStep] = useState(1)
  const [lineage, setLineage] = useState("unknown")
  const [focusScore, setFocusScore] = useState(0)
  const [vision, setVision] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  
  // Focus Mini-game
  const [gameState, setGameState] = useState<'idle' | 'active' | 'complete'>('idle')
  const [orbSize, setOrbSize] = useState(1)
  const [growing, setGrowing] = useState(true)
  const [clicks, setClicks] = useState(0)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    if (gameState === 'active') {
       const animate = () => {
         setOrbSize(s => {
           if (s >= 1.5) setGrowing(false)
           if (s <= 0.5) setGrowing(true)
           return growing ? s + 0.01 : s - 0.01
         })
         requestRef.current = requestAnimationFrame(animate)
       }
       requestRef.current = requestAnimationFrame(animate)
       return () => cancelAnimationFrame(requestRef.current!)
    }
  }, [gameState, growing])

  const clickOrb = () => {
    // Target is 1.0 (mid-breath) or 1.5/0.5 (extremes)? Legacy code: >0.98 or <0.62 is perfect.
    // Let's simplify: Extremes are best (full inhale/exhale) for "Balance".
    const score = (orbSize > 1.4 || orbSize < 0.6) ? 20 : (orbSize > 1.2 || orbSize < 0.8) ? 10 : 2
    setFocusScore(s => s + score)
    setClicks(c => c + 1)
    if (clicks >= 4) setGameState('complete')
  }

  const calculate = () => {
    let base = 2500
    let algn = 50
    
    // Lineage
    if (lineage === 'skywalker') { base *= 1.8; algn = 50 }
    if (lineage === 'kenobi') { base *= 1.4; algn += 10 }
    if (lineage === 'palpatine') { base *= 1.6; algn -= 15 }
    if (lineage === 'yoda') { base *= 1.5; algn += 5 }

    // Focus
    base += focusScore * 50
    
    // Vision
    if (vision === 'search') { base *= 1.1; algn += 10 }
    if (vision === 'protect') { base *= 1.0; algn += 20 }
    if (vision === 'convince') { base *= 1.2; algn -= 10 }
    if (vision === 'break') { base *= 1.4; algn -= 25 }

    const count = Math.round(base)
    const title = count > 15000 ? "Grand Master" : count > 10000 ? "Master" : count > 7000 ? "Knight" : "Sensitive"

    setResult({
      midichlorian: count,
      title,
      alignment: Math.max(0, Math.min(100, algn)),
      aspects: { control: Math.min(100, focusScore), sense: 50, alter: 50 } // Simplified
    })
    setStep(4)
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-700">
       <Card className="bg-[var(--dk-surface)] border-[var(--dk-line)] overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
         <CardHeader>
           <CardTitle className="text-3xl font-display text-[#ff8a3c] text-center flex items-center justify-center gap-2">
             <Zap className="h-6 w-6"/> Holocron Aptitude Test
           </CardTitle>
           <CardDescription className="text-center text-[var(--dk-ink-soft)]">Trial {step} of 3</CardDescription>
         </CardHeader>
         <CardContent className="space-y-8 min-h-[400px] flex flex-col justify-center">
            
            {step === 1 && (
               <div className="space-y-6 animate-in slide-in-from-right relative z-10">
                 <h2 className="text-xl font-bold text-[var(--dk-ink)] text-center">Trial 1: The Calling</h2>
                 <p className="text-[var(--dk-ink-soft)] text-center">From where does your connection stem?</p>
                 <div className="grid gap-3">
                   {[['unknown', 'Unknown Heritage'], ['skywalker', 'Skywalker Bloodline'], ['kenobi', 'Kenobi Lineage'], ['palpatine', 'Palpatine Heritage'], ['yoda', 'Unknown Species']].map(([val, label]) => (
                     <button key={val} onClick={() => setLineage(val)} className={`p-4 rounded border font-medium ${lineage === val ? 'bg-[var(--dk-raised)] border-[#ff8a3c] text-[#ff8a3c]' : 'bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] hover:bg-[var(--dk-raised)]'} transition focus:ring-2 focus:ring-[#ff8a3c]`}>
                       {label}
                     </button>
                   ))}
                 </div>
                 <Button onClick={() => setStep(2)} className="w-full bg-[#ff8a3c] hover:bg-[#ff8a3c] text-[var(--dk-on-fill)] font-bold">Next Trial</Button>
               </div>
            )}

            {step === 2 && (
               <div className="space-y-6 animate-in slide-in-from-right flex flex-col items-center relative z-10">
                 <h2 className="text-xl font-bold text-[var(--dk-ink)] text-center">Trial 2: Focus</h2>
                 <p className="text-[var(--dk-ink-soft)] text-center">Click the orb when it pulses to its extremes.</p>

                 <div className="relative w-48 h-48 flex items-center justify-center my-8">
                    <button
                      onClick={clickOrb}
                      disabled={gameState === 'complete'}
                      aria-label="Focus Orb"
                      className="rounded-full bg-[var(--dk-tea)] transition-transform duration-75 focus:ring-4 focus:ring-[#ff8a3c]"
                      style={{ width: '60px', height: '60px', transform: `scale(${orbSize})` }}
                    />
                 </div>

                 {gameState === 'idle' && <Button onClick={() => setGameState('active')} className="bg-[var(--dk-raised)] hover:bg-[var(--dk-raised)] text-[var(--dk-ink)] border border-[var(--dk-line)]">Begin Meditation</Button>}
                 {gameState === 'active' && <p className="text-[var(--dk-tea-ink)] animate-pulse font-bold">Focus...</p>}
                 {gameState === 'complete' && <Button onClick={() => setStep(3)} className="w-full bg-[#ff8a3c] hover:bg-[#ff8a3c] text-[var(--dk-on-fill)] font-bold">Trial Complete</Button>}
               </div>
            )}

            {step === 3 && (
               <div className="space-y-6 animate-in slide-in-from-right relative z-10">
                 <h2 className="text-xl font-bold text-[var(--dk-ink)] text-center">Trial 3: Insight</h2>
                <p className="text-[var(--dk-ink-soft)] text-center italic">&quot;You see a locked door. Beyond it, power. The key is lost.&quot;</p>
                 <div className="grid gap-3">
                    {[
                      ['search', 'Search for the Key', 'Patience reveals path.'],
                      ['protect', 'Guard the Door', 'Some power must be kept.'],
                      ['convince', 'Persuade the Lock', 'The mind is the key.'],
                      ['break', 'Break the Wall', 'Power is to be taken.']
                    ].map(([val, label, sub]) => (
                      <button key={val} onClick={() => setVision(val)} className={`p-4 rounded border text-left ${vision === val ? 'bg-[var(--dk-raised)] border-[#ff8a3c] text-[#ff8a3c]' : 'bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] hover:bg-[var(--dk-raised)]'} transition focus:ring-2 focus:ring-[#ff8a3c]`}>
                        <div className="font-bold">{label}</div>
                        <div className="text-xs opacity-70 text-[var(--dk-ink-soft)]">{sub}</div>
                      </button>
                    ))}
                 </div>
                 <Button onClick={calculate} disabled={!vision} className="w-full bg-[#ff8a3c] hover:bg-[#ff8a3c] text-[var(--dk-on-fill)] font-bold">Reveal Path</Button>
               </div>
            )}

            {step === 4 && result && (
               <div className="space-y-8 animate-in zoom-in text-center">
                 <div>
                    <div className="text-sm text-[#ff8a3c] uppercase tracking-widest mb-2">Midichlorian Count</div>
                    <div className="text-6xl font-black" style={{ fontFamily: 'var(--font-fredoka), cursive', color: '#ff8a3c' }}>{result.midichlorian.toLocaleString()}</div>
                    <div className="text-2xl mt-2 text-[var(--dk-ink)]">{result.title} Potential</div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase text-[var(--dk-ink-soft)] font-bold px-1">
                       <span>Dark</span><span>Balance</span><span>Light</span>
                    </div>
                    <div className="h-4 bg-[var(--dk-sunk)] rounded-full overflow-hidden border border-[var(--dk-line)] relative">
                       <div className="absolute top-0 bottom-0 w-1 bg-[var(--dk-surface)]" style={{ left: result.alignment + '%' }} />
                       <div className="h-full w-full bg-gradient-to-r from-[#ff8a8a] via-[var(--dk-raised)] to-[var(--dk-tea)] opacity-50"/>
                    </div>
                    <div className="text-[var(--dk-ink-soft)] text-sm">{result.alignment < 40 ? "Dark Tendencies" : result.alignment > 60 ? "Light Adherent" : "Gray Alignment"}</div>
                 </div>

                 <ShareResult 
                   title="Force Sensitivity Analysis"
                   text={`I have a midichlorian count of ${result.midichlorian.toLocaleString()} and show ${result.title} potential! What's your connection?`}
                 />
                 
                 <Button onClick={() => { setStep(1); setFocusScore(0); setGameState('idle'); }} variant="ghost" className="text-[var(--dk-ink-soft)] hover:text-[var(--dk-ink)]">Retake Trials</Button>
               </div>
            )}

         </CardContent>
       </Card>
    </div>
  )
}
