"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { IceCream } from "lucide-react"
import { useMemo, useState } from "react"

export function StressToIceCream() {
  const [stress, setStress] = useState(5)
  const [breakup, setBreakup] = useState(false)
  const [workDeadline, setWorkDeadline] = useState(false)

  const result = useMemo(() => {
    let pints = Math.max(1, stress * 0.5)
    if (breakup) pints += 3
    if (workDeadline) pints += 1
    
    const flavor = breakup ? "Chunky Monkey (Emotional Support)" 
                 : stress > 8 ? "Dark Chocolate Fudge (Heavy Duty)" 
                 : stress > 5 ? "Cookie Dough (Comfort)" 
                 : "Vanilla Bean (Chilling)"
                 
    return { pints: Math.ceil(pints), flavor }
  }, [stress, breakup, workDeadline])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <CardHeader>
           <CardTitle className="text-3xl font-display flex items-center gap-3" style={{ color: '#b6ff3c' }}>
              <IceCream className="h-8 w-8" style={{ fill: '#fbcfe8' }} />
              Stress-to-Ice-Cream Ratio
           </CardTitle>
           <CardDescription style={{ color: '#b3aae0' }}>
              Scientific calculation of required dairy-based emotional support.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between font-bold uppercase text-sm" style={{ color: '#ECEAE3' }}>
                       <Label>Stress Level (1-10)</Label>
                       <span>{stress}</span>
                    </div>
                    <Slider value={[stress]} onValueChange={([v]) => setStress(v)} min={1} max={10} step={1} className="[&_.range-thumb]:bg-[#b6ff3c] [&_[role=slider]]:bg-[#b6ff3c] [&_[role=slider]]:border-[#b6ff3c]" />
                 </div>

                 <div className="flex items-center justify-between space-x-2 p-4 rounded-xl border shadow-sm" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                    <Label htmlFor="breakup" className="flex flex-col space-y-1">
                       <span className="font-bold" style={{ color: '#ECEAE3' }}>Recent Breakup?</span>
                       <span className="text-xs" style={{ color: '#b3aae0' }}>Adds an automatic +3 pints.</span>
                    </Label>
                    <Switch id="breakup" checked={breakup} onCheckedChange={setBreakup} className="data-[state=checked]:bg-[#b6ff3c]" />
                 </div>

                 <div className="flex items-center justify-between space-x-2 p-4 rounded-xl border shadow-sm" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                    <Label htmlFor="deadline" className="flex flex-col space-y-1">
                       <span className="font-bold" style={{ color: '#ECEAE3' }}>Work Deadline?</span>
                       <span className="text-xs" style={{ color: '#b3aae0' }}>Adds +1 pint for late nights.</span>
                    </Label>
                    <Switch id="deadline" checked={workDeadline} onCheckedChange={setWorkDeadline} className="data-[state=checked]:bg-[#b6ff3c]" />
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6">
                 <div className="relative flex flex-col-reverse items-center justify-end h-[300px] w-full overflow-hidden">

                    {/* Cone */}
                    <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[120px] border-t-orange-300 relative z-10 filter drop-shadow-lg"></div>

                    {/* Scoops — size/overlap scale with count so the stack always fits the box */}
                    {(() => {
                       const n = result.pints
                       const size = Math.max(36, Math.min(120, 168 / (1 + 0.5 * (n - 1))))
                       const overlap = size * 0.45
                       return (
                          <div className="flex flex-col-reverse items-center z-20" style={{ marginBottom: -overlap / 2 }}>
                             {Array.from({ length: n }).map((_, i) => (
                                <div
                                   key={i}
                                   className="rounded-full border-4 border-white/20 shadow-inner animate-in zoom-in fade-in duration-500"
                                   style={{
                                      width: size,
                                      height: size,
                                      marginTop: i === 0 ? 0 : -overlap,
                                      animationDelay: `${i * 80}ms`,
                                      backgroundColor: i % 2 === 0 ? '#fbcfe8' : '#fce7f3'
                                   }}
                                ></div>
                             ))}
                          </div>
                       )
                    })()}
                 </div>

                 <div className="text-center space-y-2">
                    <div className="text-xl font-bold" style={{ color: '#b6ff3c' }}>{result.pints} Pints Required</div>
                    <div className="text-sm font-medium px-4 py-2 rounded-full inline-block" style={{ color: '#ECEAE3', backgroundColor: '#241a52' }}>
                       Prescribed Flavor: {result.flavor}
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="Ice Cream Prescription" 
                 text={`Doctor's orders: I need ${result.pints} pints of ${result.flavor} right now. 🍦 #StressIceCream`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
