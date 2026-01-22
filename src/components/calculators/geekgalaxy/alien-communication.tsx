"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Atom, Globe, Radio, Star } from "lucide-react"
import { useMemo, useState } from "react"

export function AlienCommunicationCalculator() {
  const [drake, setDrake] = useState({
    rStar: 2, // Stars formed per year
    fp: 0.5, // Fraction with planets
    ne: 2, // Planets capable of life
    fl: 0.1, // Life actually appears
    fi: 0.01, // Intelligent life
    fc: 0.01, // Communicative
    l: 10000 // Years communicative
  })

  // Drake Equation Result
  const N = useMemo(() => {
    return Math.round(drake.rStar * drake.fp * drake.ne * drake.fl * drake.fi * drake.fc * drake.l)
  }, [drake])

  const setD = (key: keyof typeof drake, val: number) => setDrake(p => ({...p, [key]: val}))

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-cyan-900/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        
        <CardHeader>
          <CardTitle className="text-3xl font-display text-cyan-400 flex items-center gap-2">
            <Radio className="h-6 w-6 text-cyan-500 animate-pulse" />
            Drake Equation Simulator
          </CardTitle>
          <CardDescription className="text-cyan-200/50">
            N = R* ⋅ fp ⋅ ne ⋅ fl ⋅ fi ⋅ fc ⋅ L
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid lg:grid-cols-2 gap-8 relative z-10">
          
          <div className="space-y-6">
            
            <div className="space-y-4 p-4 rounded bg-cyan-950/10 border border-cyan-900/30">
              <h3 className="font-bold text-cyan-300 flex items-center gap-2"><Star className="h-4 w-4"/> Astrophysical Factors</h3>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">R* (Star Formation Rate)</Label>
                   <span className="text-cyan-400 font-mono">{drake.rStar} / yr</span>
                </div>
                <Slider value={[drake.rStar]} onValueChange={([v]) => setD('rStar', v)} max={10} step={0.1} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">fₚ (Planetary Systems)</Label>
                   <span className="text-cyan-400 font-mono">{Math.round(drake.fp * 100)}%</span>
                </div>
                <Slider value={[drake.fp]} onValueChange={([v]) => setD('fp', v)} max={1} step={0.01} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">nₑ (Habitable Planets)</Label>
                   <span className="text-cyan-400 font-mono">{drake.ne} / system</span>
                </div>
                <Slider value={[drake.ne]} onValueChange={([v]) => setD('ne', v)} max={5} step={0.1} />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded bg-cyan-950/10 border border-cyan-900/30">
              <h3 className="font-bold text-cyan-300 flex items-center gap-2"><Atom className="h-4 w-4"/> Biological Factors</h3>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">fₗ (Life Evolves)</Label>
                   <span className="text-cyan-400 font-mono">{Math.round(drake.fl * 100)}%</span>
                </div>
                <Slider value={[drake.fl]} onValueChange={([v]) => setD('fl', v)} max={1} step={0.01} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">fᵢ (Intelligence Emerges)</Label>
                   <span className="text-cyan-400 font-mono">{Math.round(drake.fi * 100)}%</span>
                </div>
                <Slider value={[drake.fi]} onValueChange={([v]) => setD('fi', v)} max={1} step={0.001} />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded bg-cyan-950/10 border border-cyan-900/30">
              <h3 className="font-bold text-cyan-300 flex items-center gap-2"><Globe className="h-4 w-4"/> Sociological Factors</h3>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">f꜀ (Communicative)</Label>
                   <span className="text-cyan-400 font-mono">{Math.round(drake.fc * 100)}%</span>
                </div>
                <Slider value={[drake.fc]} onValueChange={([v]) => setD('fc', v)} max={1} step={0.001} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label className="text-cyan-100">L (Civilization Lifespan)</Label>
                   <span className="text-cyan-400 font-mono">{drake.l.toLocaleString()} yrs</span>
                </div>
                <Slider value={[Math.log10(drake.l)]} onValueChange={([v]) => setD('l', Math.round(Math.pow(10, v)))} min={1} max={9} step={0.1} />
              </div>
            </div>

          </div>

          {/* Results */}
          <div className="flex flex-col items-center justify-center space-y-8 bg-black/40 rounded-xl p-6 border border-white/5">
             
             <div className="text-center space-y-4">
               <div className="text-sm text-cyan-500 uppercase tracking-widest">Active Civilizations in Milky Way</div>
               <div className="text-6xl md:text-8xl font-black text-white glow-cyan transition-all duration-300">
                 {N.toLocaleString()}
               </div>
               <p className="text-cyan-200/60 max-w-sm mx-auto">
                 {N < 1 ? "We are effectively alone in the galaxy." : 
                  N < 100 ? "Life is rare and precious. Contact is unlikely." : 
                  N < 10000 ? "A sparse galaxy. We might find them eventually." : 
                  "The galaxy is teeming with life! Where is everybody?"}
               </p>
             </div>

             <div className="w-full relative h-48 bg-black rounded-full overflow-hidden border border-cyan-900 shadow-inner">
                {/* Simulated Galaxy View */}
                <div className="absolute inset-0 opacity-50 bg-gradient-to-tr from-purple-900 via-transparent to-blue-900"></div>
                {/* Random stars based on N */}
                {Array.from({length: Math.min(100, Math.max(10, Math.ceil(Math.log10(N + 1) * 20)))}).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bg-white rounded-full animate-pulse"
                      style={{
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                        opacity: Math.random(),
                        animationDelay: Math.random() * 2 + 's'
                      }}
                    />
                ))}
                {N > 1000 && <div className="absolute inset-0 flex items-center justify-center text-cyan-500 font-bold opacity-30 text-4xl">ACTIVE SIGNAL</div>}
             </div>

             <ShareResult 
                title="Drake Equation Result"
                text={`According to my calculations, there are ${N.toLocaleString()} active alien civilizations in our galaxy. 👽`}
             />

          </div>

        </CardContent>
      </Card>
      
      <style jsx global>{`
        .glow-cyan {
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
