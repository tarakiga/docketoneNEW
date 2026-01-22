"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Infinity } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function DoublePendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trailLength, setTrailLength] = useState(100)
  const [mass1, setMass1] = useState(10)
  const [mass2, setMass2] = useState(10)
  
  // Physics State
  const state = useRef({
    a1: Math.PI / 2, // angle 1
    a2: Math.PI / 2, // angle 2
    a1_v: 0, // velocity
    a2_v: 0,
    trail: [] as { x1: number, y1: number, x2: number, y2: number }[]
  })

  // Constants
  const L1 = 100
  const L2 = 100
  const G = 1

  const animate = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    
    // Physics Calc
    const { a1, a2, a1_v, a2_v } = state.current
    const m1 = mass1
    const m2 = mass2
    
    const num1 = -G * (2 * m1 + m2) * Math.sin(a1)
    const num2 = -m2 * G * Math.sin(a1 - 2 * a2)
    const num3 = -2 * Math.sin(a1 - a2) * m2
    const num4 = a2_v * a2_v * L2 + a1_v * a1_v * L1 * Math.cos(a1 - a2)
    const den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2))
    const a1_a = (num1 + num2 + num3 * num4) / den

    const num5 = 2 * Math.sin(a1 - a2)
    const num6 = (a1_v * a1_v * L1 * (m1 + m2))
    const num7 = G * (m1 + m2) * Math.cos(a1)
    const num8 = a2_v * a2_v * L2 * m2 * Math.cos(a1 - a2)
    const den2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2))
    const a2_a = (num5 * (num6 + num7 + num8)) / den2

    state.current.a1_v += a1_a
    state.current.a2_v += a2_a
    state.current.a1 += state.current.a1_v
    state.current.a2 += state.current.a2_v

    // Damping (optional, keeps it sane) - removing for true chaos
    // state.current.a1_v *= 0.999
    // state.current.a2_v *= 0.999

    // Positions
    const cx = canvasRef.current.width / 2
    const cy = 150
    const x1 = cx + L1 * Math.sin(state.current.a1)
    const y1 = cy + L1 * Math.cos(state.current.a1)
    const x2 = x1 + L2 * Math.sin(state.current.a2)
    const y2 = y1 + L2 * Math.cos(state.current.a2)

    // Add trail
    state.current.trail.push({ x1, y1, x2, y2 })
    if (state.current.trail.length > trailLength) {
      state.current.trail.shift()
    }

    // Draw
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Draw Trail
    ctx.beginPath()
    state.current.trail.forEach((t, i) => {
       ctx.strokeStyle = `rgba(168, 85, 247, ${i / state.current.trail.length})` // Purple fade
       ctx.lineWidth = 2
       if (i === 0) ctx.moveTo(t.x2, t.y2)
       else ctx.lineTo(t.x2, t.y2)
    })
    ctx.stroke()

    // Draw Rods
    ctx.beginPath()
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 4
    ctx.moveTo(cx, cy)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // Draw Pivot
    ctx.beginPath()
    ctx.fillStyle = '#94a3b8'
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI)
    ctx.fill()

    // Draw Mass 1
    ctx.beginPath()
    ctx.fillStyle = '#60a5fa' // Blue
    ctx.arc(x1, y1, m1, 0, 2 * Math.PI)
    ctx.fill()

    // Draw Mass 2
    ctx.beginPath()
    ctx.fillStyle = '#a855f7' // Purple
    ctx.arc(x2, y2, m2, 0, 2 * Math.PI)
    ctx.fill()
  }

  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (isPlaying) {
      const loop = () => {
        animate()
        animationRef.current = requestAnimationFrame(loop)
      }
      loop()
    } else {
      cancelAnimationFrame(animationRef.current!)
    }
    return () => cancelAnimationFrame(animationRef.current!)
  }, [isPlaying, trailLength, mass1, mass2])

  const reset = () => {
    state.current = {
      a1: Math.PI / 2,
      a2: Math.PI / 2,
      a1_v: 0,
      a2_v: 0,
      trail: []
    }
    // Do one render
    animate()
  }
  
  useEffect(() => { reset() }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-purple-900">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-purple-400 flex items-center gap-2">
            <Infinity className="h-8 w-8" />
            Chaotic Double Pendulum
          </CardTitle>
          <CardDescription>A physical demonstration of chaos theory. Small changes, big consequences.</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-12 gap-8">
           
           <div className="lg:col-span-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={500} 
                className="w-full h-full object-contain"
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                   <Button onClick={() => setIsPlaying(true)} className="bg-purple-600 hover:bg-purple-700 text-lg py-6 px-8 rounded-full shadow-[0_0_30px_#9333ea]">
                      Start Simulation
                   </Button>
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                       <span>Tail Length</span>
                       <span>{trailLength}</span>
                    </div>
                    <Slider value={[trailLength]} onValueChange={([v]) => setTrailLength(v)} min={10} max={500} step={10} className="[&_.range-thumb]:bg-purple-500" />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                       <span>Mass 1 (Blue)</span>
                       <span>{mass1}kg</span>
                    </div>
                    <Slider value={[mass1]} onValueChange={([v]) => setMass1(v)} min={5} max={30} step={1} className="[&_.range-thumb]:bg-blue-500" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                       <span>Mass 2 (Purple)</span>
                       <span>{mass2}kg</span>
                    </div>
                    <Slider value={[mass2]} onValueChange={([v]) => setMass2(v)} min={5} max={30} step={1} className="[&_.range-thumb]:bg-purple-500" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                    {isPlaying ? "Pause" : "Resume"}
                 </Button>
                 <Button variant="destructive" onClick={reset} className="bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-900">
                    Reset Chaos
                 </Button>
              </div>

              <ShareResult 
                 title="I created Chaos" 
                 text="I'm simulating a double pendulum physics system. Seeing the butterfly effect in real-time! 🦋" 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
