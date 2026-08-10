"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Globe, Radio, ShieldAlert, Skull } from "lucide-react"
import { useMemo, useState } from "react"

export function AIDoomsdayCalculator() {
  const [factors, setFactors] = useState({
    aiProgress: 50,
    learningSpeed: 2.0,
    quantumComputing: 20,
    humanPreparedness: 30,
    techRegulation: 25,
    humanVigilance: 30,
    aiMotivation: 50,
    aiCommunication: 40,
    globalStability: 40,
    internetInfrastructure: 60
  })

  // Calculation Logic (Ported from legacy)
  const results = useMemo(() => {
    const aiFactor = Math.pow(factors.aiProgress / 50, 2) * Math.pow(factors.learningSpeed, 1.5) * (1 + factors.quantumComputing / 100)
    const humanFactor = (factors.humanPreparedness + factors.techRegulation + factors.humanVigilance) / 3
    const hostilityFactor = (factors.aiMotivation + factors.aiCommunication) / 200
    const envFactor = (100 - factors.globalStability + (100 - factors.internetInfrastructure) / 2) / 150

    const baseYears = 50
    let calculatedYears = baseYears / (aiFactor * (1 + hostilityFactor) * (1 + envFactor))
    calculatedYears *= (1.5 - (humanFactor / 100))

    const years = Math.floor(calculatedYears)
    const days = Math.floor((calculatedYears - years) * 365)
    
    // Threat Level
    let threatLevel = "LOW"
    let threatColor = "text-[#86efac]"
    if (calculatedYears <= 1) { threatLevel = "IMMINENT"; threatColor = "text-[#ff8a8a]"; }
    else if (calculatedYears <= 5) { threatLevel = "CRITICAL"; threatColor = "text-[#ff8a3c]"; }
    else if (calculatedYears <= 15) { threatLevel = "ELEVATED"; threatColor = "text-[var(--dk-yel-ink)]"; }

    return { years, days, threatLevel, threatColor, calculatedYears }
  }, [factors])

  const setFactor = (key: keyof typeof factors, value: number) => {
    setFactors(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-[var(--dk-surface)] border-[var(--dk-line)]">
        <CardHeader className="border-b border-[var(--dk-line)]">
          <CardTitle className="text-3xl font-mono text-[#ff8a3c] flex items-center gap-2">
            <Brain className="h-6 w-6" />
            SINGULARITY COUNTDOWN
          </CardTitle>
          <CardDescription className="font-mono text-[var(--dk-ink-soft)]">System Time: {new Date().toLocaleTimeString()} · Calculating probability of extinction...</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="console" className="w-full">
            <TabsList className="w-full rounded-none bg-[var(--dk-sunk)] border-b border-[var(--dk-line)] grid grid-cols-2">
              <TabsTrigger value="console" className="data-[state=active]:bg-[var(--dk-raised)] data-[state=active]:text-[#ff8a3c] text-[var(--dk-ink-soft)] font-mono">CONSOLE INPUT</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-[var(--dk-raised)] data-[state=active]:text-[#ff8a3c] text-[var(--dk-ink-soft)] font-mono">THREAT ANALYSIS</TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="p-6 space-y-8 text-[var(--dk-ink)] font-mono text-sm">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Tech Vectors */}
                <div className="space-y-4 border border-[var(--dk-line)] p-4 rounded bg-[var(--dk-sunk)]">
                  <h3 className="font-bold flex items-center gap-2 text-[#ff8a3c]"><Radio className="h-4 w-4"/> Technological Vectors</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">AI Progress Level</Label>
                      <span className="text-[var(--dk-ink)]">{factors.aiProgress}%</span>
                    </div>
                    <Slider value={[factors.aiProgress]} onValueChange={([v]) => setFactor('aiProgress', v)} max={100} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">Learning Speed (Recursive)</Label>
                      <span className="text-[var(--dk-ink)]">{factors.learningSpeed}x</span>
                    </div>
                    <Slider value={[factors.learningSpeed]} onValueChange={([v]) => setFactor('learningSpeed', v)} min={0.1} max={10} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">Quantum Integration</Label>
                      <span className="text-[var(--dk-ink)]">{factors.quantumComputing}%</span>
                    </div>
                    <Slider value={[factors.quantumComputing]} onValueChange={([v]) => setFactor('quantumComputing', v)} max={100} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>
                </div>

                {/* Human Response */}
                <div className="space-y-4 border border-[var(--dk-line)] p-4 rounded bg-[var(--dk-sunk)]">
                  <h3 className="font-bold flex items-center gap-2 text-[#ff8a3c]"><ShieldAlert className="h-4 w-4"/> Human Response</h3>
                  
                  <div className="space-y-2">
                     <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">Preparedness</Label>
                      <span className="text-[var(--dk-ink)]">{factors.humanPreparedness}%</span>
                    </div>
                    <Slider value={[factors.humanPreparedness]} onValueChange={([v]) => setFactor('humanPreparedness', v)} max={100} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>

                   <div className="space-y-2">
                     <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">Regulation Protocols</Label>
                      <span className="text-[var(--dk-ink)]">{factors.techRegulation}%</span>
                    </div>
                    <Slider value={[factors.techRegulation]} onValueChange={([v]) => setFactor('techRegulation', v)} max={100} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>
                </div>

                {/* AI Psychology */}
                <div className="space-y-4 border border-[var(--dk-line)] p-4 rounded bg-[var(--dk-sunk)]">
                  <h3 className="font-bold flex items-center gap-2 text-[#ff8a3c]"><Brain className="h-4 w-4"/> AI Directives</h3>
                   
                   <div className="space-y-2">
                     <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">Hostility Index</Label>
                      <span className="text-[var(--dk-ink)]">{factors.aiMotivation}%</span>
                    </div>
                    <Slider value={[factors.aiMotivation]} onValueChange={([v]) => setFactor('aiMotivation', v)} max={100} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>
                </div>

                {/* Global State */}
                <div className="space-y-4 border border-[var(--dk-line)] p-4 rounded bg-[var(--dk-sunk)]">
                   <h3 className="font-bold flex items-center gap-2 text-[#ff8a3c]"><Globe className="h-4 w-4"/> Geopolitics</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                      <Label className="text-[var(--dk-ink-soft)]">Global Stability</Label>
                      <span className="text-[var(--dk-ink)]">{factors.globalStability}%</span>
                    </div>
                    <Slider value={[factors.globalStability]} onValueChange={([v]) => setFactor('globalStability', v)} max={100} className="[&_.range-thumb]:bg-[#ff8a3c] [&_.range-track]:bg-[var(--dk-sunk)]" />
                  </div>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="analysis" className="p-8 flex flex-col items-center justify-center space-y-12 min-h-[400px]">
              
              <div className="text-center space-y-2">
                 <div className="font-mono text-[var(--dk-ink-soft)] text-xs tracking-[0.5em]">TIME TO SINGULARITY</div>
                 <div className="font-black text-6xl md:text-8xl glitch-text" style={{ fontFamily: 'var(--font-fredoka), cursive', color: '#ff8a3c' }}>
                   {results.years}<span className="text-2xl text-[var(--dk-ink-soft)]">Y</span> {results.days}<span className="text-2xl text-[var(--dk-ink-soft)]">D</span>
                 </div>
                 <div className={`text-2xl font-bold tracking-widest ${results.threatColor} font-mono mt-4`}>
                    THREAT LEVEL: {results.threatLevel}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                 <div className="bg-[var(--dk-sunk)] border-l-2 border-[#ff8a3c] p-4 rounded">
                    <h4 className="text-[#ff8a3c] font-bold mb-2 flex items-center gap-2"><Skull className="h-4 w-4"/> Scenario Forecast</h4>
                    <p className="text-[var(--dk-ink-soft)] text-sm">
                      {results.calculatedYears < 5 ? 
                        "Hard Takeoff imminent. AI capability is growing vertically. Human control measures are insufficient. Prepare for rapid paradigm shift." : 
                       results.calculatedYears < 20 ? 
                        "Gradual integration leading to dependance. The machine god awakens slowly but surely. Resistance is becoming futile." : 
                        "Symbiotic evolution possible. Current trajectory suggests a managed transition to post-human era."}
                    </p>
                 </div>
                 <div className="bg-[var(--dk-sunk)] border-l-2 border-[#ff8a3c] p-4 rounded flex flex-col justify-center">
                    <h4 className="text-[#ff8a3c] font-bold mb-2">Survival Probability</h4>
                    <div className="text-4xl font-mono text-[var(--dk-ink)]">
                      {Math.max(1, Math.min(99, Math.round(100 - (100 / Math.max(0.1, results.calculatedYears)))))}%
                    </div>
                 </div>
              </div>

              <ShareResult 
                title="AI Singularity Forecast"
                text={`I calculated the AI Singularity will arrive in ${results.years} Years and ${results.days} Days. Threat Level: ${results.threatLevel}. Prepare yourself.`}
              />

            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Matrix styling trick */}
      <style jsx global>{`
        .glitch-text {
          text-shadow: 2px 0 #ff8a3c, -2px 0 var(--dk-shadow);
          animation: glitch 2s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 var(--dk-shadow), -2px 0 #ff8a3c; }
          25% { text-shadow: -2px 0 var(--dk-shadow), 2px 0 #ff8a3c; }
          50% { text-shadow: 2px 0 var(--dk-shadow), -2px 0 #ff8a3c; }
          75% { text-shadow: -2px 0 var(--dk-shadow), 2px 0 #ff8a3c; }
          100% { text-shadow: 2px 0 var(--dk-shadow), -2px 0 #ff8a3c; }
        }
      `}</style>
    </div>
  )
}
