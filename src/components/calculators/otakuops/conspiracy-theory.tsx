"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Eye, FileSearch } from "lucide-react"
import { useState } from "react"

export function ConspiracyTheoryCalculator() {
  const [theory, setTheory] = useState("Birds are Drones")
  const [evidence, setEvidence] = useState({ anomalies: 30, denials: 30, whistleblowers: 10 })
  const [tinfoil, setTinfoil] = useState({ disbelief: 50, entities: 50, years: 20 })
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    // Logic from legacy
    const evidenceScore = Math.round((evidence.anomalies * 0.4) + (evidence.denials * 0.3) + (evidence.whistleblowers * 0.3))
    const tinfoilScore = Math.round((tinfoil.disbelief * 0.5) + (tinfoil.entities * 0.3) + (tinfoil.years * 0.2))
    
    // Plausibility = Evidence - Tinfoil Penalty
    // High evidence is good, high tinfoil factors (requires huge suspension of disbelief) is bad for plausibility
    const plausibility = Math.max(0, Math.min(100, evidenceScore - (tinfoilScore / 3)))
    
    setResult({
        plausibility: Math.round(plausibility),
        evidenceScore,
        tinfoilScore,
        verdict: plausibility < 30 ? "Unlikely (Take off the hat)" : plausibility < 70 ? "Possible (Keep digging)" : "HIGHLY SUSPICIOUS (Run!)"
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-serif">
      <Card className="bg-[#f4f1ea] border-stone-400 border-2 shadow-2xl relative overflow-hidden">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>

        <CardHeader className="border-b-2 border-stone-300 pb-6 relative z-10">
           {/* Stamp */}
           <div className="absolute top-2 right-4 transform rotate-12 border-4 border-red-700 md:text-xl font-black text-red-700 px-4 py-2 opacity-70 rounded-sm pointer-events-none">
             TOP SECRET
           </div>

           <CardTitle className="text-3xl font-black text-stone-800 text-center uppercase tracking-widest flex items-center justify-center gap-2">
              <Eye className="w-8 h-8 text-stone-700"/> DEPT. OF TRUTH
           </CardTitle>
           <CardDescription className="text-center font-mono text-stone-600">
              CASE FILE: {theory}
           </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 relative z-10 space-y-8">
           
           <div className="space-y-4">
              <label className="font-bold text-xs uppercase tracking-widest text-stone-500">Subject / Theory Name</label>
              <input 
                type="text" 
                value={theory} 
                onChange={e => setTheory(e.target.value)} 
                className="w-full bg-transparent border-b-2 border-stone-400 font-mono text-xl focus:outline-none focus:border-red-700 transition-colors"
                placeholder="e.g. The Moon is Cheese"
              />
           </div>

           <div className="grid md:grid-cols-2 gap-12">
              
              {/* Evidence Section */}
              <div className="space-y-6 bg-white/50 p-6 rounded shadow-sm border border-stone-200">
                 <h3 className="font-bold text-stone-800 flex items-center gap-2 border-b border-stone-300 pb-2">
                    <FileSearch className="w-4 h-4 text-blue-700"/> Evidence Factors
                 </h3>
                 
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs font-mono text-stone-600"><span>Anomalies</span><span>{evidence.anomalies}%</span></div>
                       <Slider value={[evidence.anomalies]} onValueChange={([v]) => setEvidence({...evidence, anomalies: v})} className="[&_.range-thumb]:bg-blue-700"/>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs font-mono text-stone-600"><span>Official Denials</span><span>{evidence.denials}%</span></div>
                       <Slider value={[evidence.denials]} onValueChange={([v]) => setEvidence({...evidence, denials: v})} className="[&_.range-thumb]:bg-blue-700"/>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs font-mono text-stone-600"><span>Whistleblowers</span><span>{evidence.whistleblowers}%</span></div>
                       <Slider value={[evidence.whistleblowers]} onValueChange={([v]) => setEvidence({...evidence, whistleblowers: v})} className="[&_.range-thumb]:bg-blue-700"/>
                    </div>
                 </div>
              </div>

              {/* Tinfoil Section */}
              <div className="space-y-6 bg-white/50 p-6 rounded shadow-sm border border-stone-200">
                 <h3 className="font-bold text-stone-800 flex items-center gap-2 border-b border-stone-300 pb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600"/> Tinfoil Factors
                 </h3>
                 
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs font-mono text-stone-600"><span>Suspension of Disbelief</span><span>{tinfoil.disbelief}%</span></div>
                       <Slider value={[tinfoil.disbelief]} onValueChange={([v]) => setTinfoil({...tinfoil, disbelief: v})} className="[&_.range-thumb]:bg-orange-600"/>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs font-mono text-stone-600"><span>Entities Involved</span><span>{tinfoil.entities}%</span></div>
                       <Slider value={[tinfoil.entities]} onValueChange={([v]) => setTinfoil({...tinfoil, entities: v})} className="[&_.range-thumb]:bg-orange-600"/>
                    </div>
                    <div className="space-y-1">
                       <div className="flex justify-between text-xs font-mono text-stone-600"><span>Time Covered (Years)</span><span>{tinfoil.years}y</span></div>
                       <Slider value={[tinfoil.years]} onValueChange={([v]) => setTinfoil({...tinfoil, years: v})} className="[&_.range-thumb]:bg-orange-600"/>
                    </div>
                 </div>
              </div>

           </div>

           <div className="flex justify-center pt-4">
               <Button onClick={analyze} className="bg-stone-800 hover:bg-stone-900 text-white font-mono uppercase tracking-widest px-8 py-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all">
                  Analyze Truth
               </Button>
           </div>

           {result && (
              <div className="mt-8 border-t-4 border-double border-stone-400 pt-8 text-center animate-in slide-in-from-bottom space-y-6">
                  
                  <div className="relative inline-block">
                      <div className={`text-6xl font-black ${result.plausibility > 70 ? 'text-green-700' : result.plausibility > 30 ? 'text-yellow-600' : 'text-red-700'}`}>
                         {result.plausibility}%
                      </div>
                      <div className="text-xs uppercase font-bold tracking-[0.2em] text-stone-500 mt-2">Plausibility Index</div>
                      
                      {/* Stamp Effect */}
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 px-4 py-2 text-2xl font-black uppercase tracking-widest opacity-80 mix-blend-multiply pointer-events-none whitespace-nowrap
                         ${result.plausibility > 70 ? 'border-green-700 text-green-700' : result.plausibility > 30 ? 'border-yellow-600 text-yellow-600' : 'border-red-700 text-red-700'}
                      `}>
                         {result.verdict}
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm font-mono text-stone-600">
                      <div>Evidence Score: {result.evidenceScore}/100</div>
                      <div>Tinfoil Penalty: {result.tinfoilScore}/100</div>
                  </div>

                  <div className="flex justify-center gap-4">
                     <ShareResult 
                        title="Conspiracy Analysis"
                        text={`I analyzed the theory "${theory}" and it has a ${result.plausibility}% plausibility index. ${result.verdict}!`}
                     />
                  </div>
              </div>
           )}

        </CardContent>
      </Card>
    </div>
  )
}
