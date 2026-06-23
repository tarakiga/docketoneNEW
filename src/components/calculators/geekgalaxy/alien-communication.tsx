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

  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Drake Equation Result
  const N = useMemo(() => {
    return Math.round(drake.rStar * drake.fp * drake.ne * drake.fl * drake.fi * drake.fc * drake.l)
  }, [drake])

  const stars = useMemo(() => {
    const count = Math.min(100, Math.max(10, Math.ceil(Math.log10(N + 1) * 20)))

    return Array.from({ length: count }).map((_, i) => {
      const baseSeed = N * 97 + i * 131

      return {
        id: i,
        size: pseudoRandom(baseSeed + 1) * 2 + 1,
        top: pseudoRandom(baseSeed + 2) * 100,
        left: pseudoRandom(baseSeed + 3) * 100,
        opacity: pseudoRandom(baseSeed + 4),
        delay: pseudoRandom(baseSeed + 5) * 2
      }
    })
  }, [N])

  const setD = (key: keyof typeof drake, val: number) => setDrake(p => ({...p, [key]: val}))

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="overflow-hidden relative" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

        <CardHeader>
          <CardTitle className="text-3xl font-display flex items-center gap-2" style={{ color: '#ff8a3c' }}>
            <Radio className="h-6 w-6 animate-pulse" style={{ color: '#ff8a3c' }} />
            Drake Equation Simulator
          </CardTitle>
          <CardDescription style={{ color: '#b3aae0' }}>
            N = R* ⋅ fp ⋅ ne ⋅ fl ⋅ fi ⋅ fc ⋅ L
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid lg:grid-cols-2 gap-8 relative z-10">
          
          <div className="space-y-6">
            
            <div className="space-y-4 p-4 rounded" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
              <h3 className="font-bold flex items-center gap-2" style={{ color: '#ff8a3c' }}><Star className="h-4 w-4"/> Astrophysical Factors</h3>

              <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>R* (Star Formation Rate)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{drake.rStar} / yr</span>
                </div>
                <Slider value={[drake.rStar]} onValueChange={([v]) => setD('rStar', v)} max={10} step={0.1} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>fₚ (Planetary Systems)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{Math.round(drake.fp * 100)}%</span>
                </div>
                <Slider value={[drake.fp]} onValueChange={([v]) => setD('fp', v)} max={1} step={0.01} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>nₑ (Habitable Planets)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{drake.ne} / system</span>
                </div>
                <Slider value={[drake.ne]} onValueChange={([v]) => setD('ne', v)} max={5} step={0.1} />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
              <h3 className="font-bold flex items-center gap-2" style={{ color: '#ff8a3c' }}><Atom className="h-4 w-4"/> Biological Factors</h3>

              <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>fₗ (Life Evolves)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{Math.round(drake.fl * 100)}%</span>
                </div>
                <Slider value={[drake.fl]} onValueChange={([v]) => setD('fl', v)} max={1} step={0.01} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>fᵢ (Intelligence Emerges)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{Math.round(drake.fi * 100)}%</span>
                </div>
                <Slider value={[drake.fi]} onValueChange={([v]) => setD('fi', v)} max={1} step={0.001} />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
              <h3 className="font-bold flex items-center gap-2" style={{ color: '#ff8a3c' }}><Globe className="h-4 w-4"/> Sociological Factors</h3>

              <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>f꜀ (Communicative)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{Math.round(drake.fc * 100)}%</span>
                </div>
                <Slider value={[drake.fc]} onValueChange={([v]) => setD('fc', v)} max={1} step={0.001} />
              </div>

               <div>
                <div className="flex justify-between text-sm mb-2">
                   <Label style={{ color: '#ECEAE3' }}>L (Civilization Lifespan)</Label>
                   <span className="font-mono" style={{ color: '#ff8a3c' }}>{drake.l.toLocaleString()} yrs</span>
                </div>
                <Slider value={[Math.log10(drake.l)]} onValueChange={([v]) => setD('l', Math.round(Math.pow(10, v)))} min={1} max={9} step={0.1} />
              </div>
            </div>

          </div>

          {/* Results */}
          <div className="flex flex-col items-center justify-center space-y-8 rounded-xl p-6" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>

             <div className="text-center space-y-4">
               <div className="text-sm uppercase tracking-widest" style={{ color: '#ff8a3c' }}>Active Civilizations in Milky Way</div>
               <div className="text-6xl md:text-8xl font-black transition-all duration-300" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ff8a3c' }}>
                 {N.toLocaleString()}
               </div>
               <p className="max-w-sm mx-auto" style={{ color: '#b3aae0' }}>
                 {N < 1 ? "We are effectively alone in the galaxy." :
                  N < 100 ? "Life is rare and precious. Contact is unlikely." :
                  N < 10000 ? "A sparse galaxy. We might find them eventually." :
                  "The galaxy is teeming with life! Where is everybody?"}
               </p>
             </div>

             <div className="w-full relative h-48 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
                {/* Simulated Galaxy View */}
                <div className="absolute inset-0 opacity-50" style={{ backgroundColor: '#241a52' }}></div>
                {/* Random stars based on N */}
                {stars.map((star) => (
                    <div
                      key={star.id}
                      className="absolute rounded-full animate-pulse"
                      style={{
                        backgroundColor: '#ECEAE3',
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        opacity: star.opacity,
                        animationDelay: `${star.delay}s`
                      }}
                    />
                ))}
                {N > 1000 && <div className="absolute inset-0 flex items-center justify-center font-bold opacity-30 text-4xl" style={{ color: '#ff8a3c' }}>ACTIVE SIGNAL</div>}
             </div>

             <ShareResult 
                title="Drake Equation Result"
                text={`According to my calculations, there are ${N.toLocaleString()} active alien civilizations in our galaxy. 👽`}
             />

          </div>

        </CardContent>
      </Card>
      
    </div>
  )
}
