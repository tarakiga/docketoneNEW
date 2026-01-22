"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bug, Coffee, Terminal } from "lucide-react"
import { useMemo, useState } from "react"

export function CoffeeToCode() {
  const [cups, setCups] = useState(3)
  const [complexity, setComplexity] = useState(5) // 1-10

  const result = useMemo(() => {
    // Logic:
    // Base lines per cup = 50 * complexity
    // After 5 cups, bugs increase exponentially
    // Optimal Zone: 2-4 cups
    
    let lines = Math.round(cups * 50 * (complexity * 0.5))
    let bugs = 0
    let jitter = 0
    
    if (cups <= 4) {
      bugs = Math.round(lines / 100) // Normal bug rate
      jitter = cups * 10
    } else {
      // Diminishing returns & bugs
      lines = Math.round(lines * (1 - ((cups - 4) * 0.1))) 
      bugs = Math.round((lines / 50) * (cups * 0.5))
      jitter = Math.min(100, cups * 15)
    }

    // Ballmer Peak check
    const isBallmerPeak = cups >= 8 && cups <= 9
    if (isBallmerPeak) {
      lines *= 2 // Superhuman burst
      bugs = 0 // Miracle
    }

    return { lines, bugs, jitter, isBallmerPeak }
  }, [cups, complexity])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-amber-950 border-amber-800 text-amber-50">
        <CardHeader>
           <CardTitle className="text-3xl font-display text-amber-400 flex items-center gap-3">
              <Coffee className="h-8 w-8 text-amber-500 animate-pulse" />
              Coffee to Code Converter
           </CardTitle>
           <CardDescription className="text-amber-200/60">
              Transform caffeine into raw functionalities (and bugs).
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between font-bold uppercase text-sm">
                       <Label>Cups of Coffee</Label>
                       <span className="text-amber-200">{cups} Cups</span>
                    </div>
                    <Slider value={[cups]} onValueChange={([v]) => setCups(v)} min={0} max={12} step={1} className="[&_.range-thumb]:bg-amber-500" />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between font-bold uppercase text-sm">
                       <Label>Task Complexity</Label>
                       <span className="text-amber-200">{complexity}/10</span>
                    </div>
                    <Slider value={[complexity]} onValueChange={([v]) => setComplexity(v)} min={1} max={10} step={1} className="[&_.range-thumb]:bg-amber-500" />
                 </div>

                 <div className="p-4 bg-amber-900/30 rounded-xl space-y-2 border border-amber-800">
                    <div className="flex justify-between text-xs font-bold uppercase text-amber-400">
                       <span>Jitter Levels</span>
                       <span>{result.jitter}%</span>
                    </div>
                    <div className="w-full bg-amber-950 h-2 rounded-full overflow-hidden">
                       <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${result.jitter}%` }}></div>
                    </div>
                 </div>
              </div>

              <div className="bg-black p-6 rounded-xl border-2 border-amber-800 font-mono text-sm shadow-2xl relative overflow-hidden">
                 
                 {result.isBallmerPeak && (
                    <div className="absolute inset-0 bg-green-500/10 z-0 animate-pulse flex items-center justify-center pointer-events-none">
                       <span className="text-6xl font-black text-green-500 opacity-20 rotate-12">BALLMER PEAK!</span>
                    </div>
                 )}

                 <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2 text-green-400">
                       <Terminal className="w-4 h-4" /> root@dev-machine:~$ ./compile
                    </div>
                    <div className="text-slate-300 text-xs">Compiling...</div>
                    
                    <div className="py-4 space-y-4 text-center">
                       <div className="space-y-1">
                          <div className="text-4xl font-black text-white">{result.lines}</div>
                          <div className="text-xs uppercase text-slate-500 tracking-widest">Lines of Code Written</div>
                       </div>
                       
                       <div className="flex justify-center items-center gap-2 text-red-400">
                          <Bug className="w-4 h-4"/>
                          <span className="font-bold">{result.bugs} Bugs Found</span>
                       </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                       <span>Status: {result.jitter > 80 ? 'VIBRATING' : result.jitter > 40 ? 'Optimal' : 'Sleepy'}</span>
                       <span>{cups} Cups</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="My Caffeine Code Output" 
                 text={`I drank ${cups} cups of coffee and wrote ${result.lines} lines of code with ${result.bugs} bugs. ${result.isBallmerPeak ? 'BALLMER PEAK ACHIEVED! 🚀' : '☕'} #CoffeeToCode`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
