"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Heart, Sparkles } from "lucide-react"
import { useState } from "react"

// Archetypes
const ARCHETYPES = {
  tsundere: { 
    name: "The Prideful Tsundere", 
    traits: ["Harsh Exterior", "Secretly Caring", "Prone to Outbursts"], 
    color: "text-pink-400",
    bg: "bg-pink-500"
  },
  kuudere: { 
    name: "The Stoic Kuudere", 
    traits: ["Calm & Collected", "Logically-Minded", "Rare Smiles"], 
    color: "text-blue-400",
    bg: "bg-blue-400"
  },
  dandere: { 
    name: "The Shy Dandere", 
    traits: ["Introverted", "Sweet & Gentle", "Safety Oriented"], 
    color: "text-purple-400",
    bg: "bg-purple-400"
  },
  genki: { 
    name: "The Energetic Genki", 
    traits: ["Optimistic", "Loud & Expressive", "Chaos Engine"], 
    color: "text-yellow-400",
    bg: "bg-yellow-400"
  },
  protector: { 
    name: "The Loyal Protector", 
    traits: ["Devoted", "Physically Strong", "Self-Sacrificing"], 
    color: "text-slate-200",
    bg: "bg-slate-600"
  }
}

export function WaifuCompatibilityMatrix() {
  const [prefs, setPrefs] = useState({ social: 50, passion: 50, dynamic: 50, dependence: 50 })
  const [result, setResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculate = () => {
    setIsCalculating(true)
    setTimeout(() => {
        const scores = { tsundere: 0, kuudere: 0, dandere: 0, genki: 0, protector: 0 }
        
        // Logic from legacy
        if (prefs.social < 40) { scores.kuudere += 2; scores.dandere += 3 } else { scores.genki += 2; scores.tsundere += 1 }
        if (prefs.passion > 60) { scores.tsundere += 2; scores.genki += 2 } else { scores.kuudere += 2; scores.dandere += 1 }
        if (prefs.dynamic < 40) { scores.tsundere += 3 } else { scores.dandere += 2; scores.genki += 1 }
        if (prefs.dependence < 40) { scores.protector += 4 } else { scores.kuudere += 1 }

        let bestMatch = 'kuudere'
        let maxScore = 0
        
        Object.entries(scores).forEach(([key, score]) => {
           if (score > maxScore) { maxScore = score; bestMatch = key }
        })
        
        // Calculate sync rate (rough approx)
        const syncRate = Math.min(100, Math.round((maxScore / 8) * 100) + 50) 

        setResult({
           archetype: ARCHETYPES[bestMatch as keyof typeof ARCHETYPES],
           syncRate
        })
        setIsCalculating(false)
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-900 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
         <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-400 flex items-center justify-center gap-2">
               <Heart className="fill-pink-500 stroke-pink-500 animate-pulse"/> 
               Waifu / Husbando Lab
            </CardTitle>
            <CardDescription className="text-center text-pink-200">
               Analyze your preferences to find your ideal archetype.
            </CardDescription>
         </CardHeader>
         
         <CardContent className="space-y-8 p-8">
            
            {!result ? (
               <div className="space-y-8 animate-in slide-in-from-right">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400">
                              <span>Reserved</span><span>Expressive</span>
                           </div>
                           <Slider value={[prefs.social]} onValueChange={([v]) => setPrefs({...prefs, social: v})} className="[&_.range-thumb]:bg-pink-500" aria-label="Social Preference"/>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400">
                              <span>Calm</span><span>Passionate</span>
                           </div>
                           <Slider value={[prefs.passion]} onValueChange={([v]) => setPrefs({...prefs, passion: v})} className="[&_.range-thumb]:bg-red-500" aria-label="Passion Preference"/>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400">
                              <span>Teasing / Banter</span><span>Sweet / Gentle</span>
                           </div>
                           <Slider value={[prefs.dynamic]} onValueChange={([v]) => setPrefs({...prefs, dynamic: v})} className="[&_.range-thumb]:bg-purple-500" aria-label="Dynamic Preference"/>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs uppercase font-bold text-slate-400">
                              <span>Protective / Strong</span><span>Independent</span>
                           </div>
                           <Slider value={[prefs.dependence]} onValueChange={([v]) => setPrefs({...prefs, dependence: v})} className="[&_.range-thumb]:bg-blue-500" aria-label="Dependence Preference"/>
                        </div>
                     </div>
                  </div>

                  <Button onClick={calculate} disabled={isCalculating} className="w-full bg-pink-600 hover:bg-pink-700 h-12 font-bold text-lg">
                     {isCalculating ? <span className="flex items-center gap-2"><Sparkles className="animate-spin"/> SYNCHRONIZING...</span> : "SYNTHESIZE IDEAL PARTNER"}
                  </Button>
               </div>
            ) : (
               <div className="text-center space-y-8 animate-in zoom-in duration-500">
                  <div className="inline-block p-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                     <div className="bg-slate-900 rounded-full px-6 py-2 text-xs font-bold tracking-widest uppercase">
                        Analysis Complete
                     </div>
                  </div>

                  <div className="space-y-2">
                     <h2 className={`text-4xl font-black ${result.archetype.color} drop-shadow-lg`}>
                        {result.archetype.name}
                     </h2>
                     <p className="text-slate-400 italic">"The stars have aligned for this pairing."</p>
                  </div>

                  <div className="flex justify-center flex-wrap gap-2">
                     {result.archetype.traits.map((t: string) => (
                        <span key={t} className={`px-3 py-1 rounded-full text-xs font-bold text-black ${result.archetype.bg} opacity-90`}>{t}</span>
                     ))}
                  </div>

                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 inline-block w-full max-w-sm">
                     <div className="text-xs uppercase text-slate-500 mb-2 font-bold tracking-widest">Synchronization Rate</div>
                     <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        {result.syncRate}%
                     </div>
                  </div>

                  <div className="flex justify-center gap-4">
                     <Button variant="ghost" onClick={() => setResult(null)}>Retake Analysis</Button>
                     <ShareResult 
                        title="Waifu Compatibility Results"
                        text={`I have a ${result.syncRate}% synchronization rate with the ${result.archetype.name} archetype! Who is your ideal partner?`}
                     />
                  </div>
               </div>
            )}

         </CardContent>
      </Card>
    </div>
  )
}
