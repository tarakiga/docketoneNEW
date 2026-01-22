"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Activity } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ChaosExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generations, setGenerations] = useState(100)
  const [zoom, setZoom] = useState(1) // 1x to 10x
  
  useEffect(() => {
    draw()
  }, [generations, zoom])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const w = canvas.width
    const h = canvas.height
    
    ctx.fillStyle = '#0f172a' // Slate 950
    ctx.fillRect(0, 0, w, h)
    
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)' // Sky 400 with opacity
    
    // Logistic Map: x_n+1 = r * x_n * (1 - x_n)
    // r (growth rate) on X axis: 2.0 to 4.0
    // x (population) on Y axis: 0.0 to 1.0
    
    // Zoom Logic
    // Default: r from 2.4 to 4.0
    // Zoom focuses on the chaotic region 3.5 to 4.0
    const minR = 2.4 + (1.1 * (zoom - 1) / 10) 
    const maxR = 4.0
    
    for (let x = 0; x < w; x++) {
       const r = minR + (x / w) * (maxR - minR)
       let val = 0.5
       
       // Stabilize
       for (let i = 0; i < 100; i++) {
          val = r * val * (1 - val)
       }
       
       // Draw generations
       for (let i = 0; i < generations; i++) {
          val = r * val * (1 - val)
          const py = h - (val * h)
          ctx.fillRect(x, py, 1, 1)
       }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-cyan-900">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-cyan-400 flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Bifurcation Explorer
          </CardTitle>
          <CardDescription>Visualizing population growth stability vs chaos (The Logistic Map).</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-12 gap-8">
           
           <div className="lg:col-span-9 bg-black rounded-xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={500} 
                className="w-full h-full object-cover"
              />
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                       <span>Generations</span>
                       <span>{generations}</span>
                    </div>
                    <Slider value={[generations]} onValueChange={([v]) => setGenerations(v)} min={50} max={500} step={10} className="[&_.range-thumb]:bg-cyan-500" />
                    <p className="text-xs text-slate-500">More points = denser graph.</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                       <span>Zoom Level</span>
                       <span>{zoom}x</span>
                    </div>
                    <Slider value={[zoom]} onValueChange={([v]) => setZoom(v)} min={1} max={10} step={0.1} className="[&_.range-thumb]:bg-cyan-500" />
                    <p className="text-xs text-slate-500">Zoom into the chaotic region (r=3.5+).</p>
                 </div>

                 <Button onClick={draw} className="w-full bg-cyan-900 hover:bg-cyan-800 text-cyan-100">
                   Redraw
                 </Button>
              </div>

              <div className="p-4 bg-cyan-950/30 rounded-lg border border-cyan-900/50">
                 <h4 className="text-cyan-400 font-bold mb-2 text-sm">What am I looking at?</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   This is the "Bifurcation Diagram". 
                   As the growth rate (X-axis) increases, the population (Y-axis) splits from a single stable value into 2, then 4, then 8... until it hits <strong>Chaos</strong> (the fuzzy bands).
                 </p>
              </div>

              <ShareResult 
                 title="Exploring Chaos" 
                 text="I'm exploring the Logistic Map bifurcation diagram. Stability is overrated, give me chaos! 🌀" 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
