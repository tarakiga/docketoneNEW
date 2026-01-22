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
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader>
           <CardTitle className="text-3xl font-display text-pink-500 flex items-center gap-3">
              <IceCream className="h-8 w-8 fill-pink-200" />
              Stress-to-Ice-Cream Ratio
           </CardTitle>
           <CardDescription className="text-pink-400">
              Scientific calculation of required dairy-based emotional support.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between font-bold uppercase text-sm text-pink-800">
                       <Label>Stress Level (1-10)</Label>
                       <span>{stress}</span>
                    </div>
                    <Slider value={[stress]} onValueChange={([v]) => setStress(v)} min={1} max={10} step={1} className="[&_.range-thumb]:bg-pink-500" />
                 </div>

                 <div className="flex items-center justify-between space-x-2 bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                    <Label htmlFor="breakup" className="flex flex-col space-y-1">
                       <span className="font-bold text-pink-800">Recent Breakup?</span>
                       <span className="text-xs text-pink-400">Adds an automatic +3 pints.</span>
                    </Label>
                    <Switch id="breakup" checked={breakup} onCheckedChange={setBreakup} className="data-[state=checked]:bg-pink-500" />
                 </div>

                 <div className="flex items-center justify-between space-x-2 bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                    <Label htmlFor="deadline" className="flex flex-col space-y-1">
                       <span className="font-bold text-pink-800">Work Deadline?</span>
                       <span className="text-xs text-pink-400">Adds +1 pint for late nights.</span>
                    </Label>
                    <Switch id="deadline" checked={workDeadline} onCheckedChange={setWorkDeadline} className="data-[state=checked]:bg-pink-500" />
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6">
                 <div className="relative flex flex-col-reverse items-center justify-end h-[300px] w-full">
                    
                    {/* Cone */}
                    <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[120px] border-t-orange-300 relative z-10 filter drop-shadow-lg"></div>
                    
                    {/* Scoops */}
                    <div className="flex flex-col-reverse items-center -mb-6 space-y-reverse space-y-[-20px] z-20 transition-all duration-500">
                       {Array.from({length: result.pints}).map((_, i) => (
                          <div 
                             key={i} 
                             className={`w-36 h-36 rounded-full border-4 border-white/20 shadow-inner animate-in zoom-in slide-in-from-bottom-10 fade-in duration-500`}
                             style={{ 
                                animationDelay: `${i * 100}ms`,
                                backgroundColor: i % 2 === 0 ? '#fbcfe8' : '#fce7f3' // Pink shades
                             }}
                          ></div>
                       ))}
                    </div>
                 </div>

                 <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-pink-900">{result.pints} Pints Required</div>
                    <div className="text-sm font-medium text-pink-500 bg-pink-100 px-4 py-2 rounded-full inline-block">
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
