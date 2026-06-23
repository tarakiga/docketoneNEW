"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ShareResult } from "@/components/molecules/share-result"
import { RotateCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ButterflyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [divergence, setDivergence] = useState(0) // Percentage 0-100 indicating difference
  
  // Lorenz Parameters
  const sigma = 10
  const rho = 28
  const beta = 8/3
  const dt = 0.01

  // State for particles
  // [x, y, z]
  const p1 = useRef([0.1, 0, 0])
  const p2 = useRef([0.1001, 0, 0]) // Tiny difference
  
  const history1 = useRef<number[][]>([])
  const history2 = useRef<number[][]>([])

  const resetSimulation = () => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current)
    setIsRunning(false)
    setDivergence(0)
    
    p1.current = [0.1, 0, 0]
    p2.current = [0.1001, 0, 0]
    
    // Initial random start to make it more interesting?
    // No, keep it deterministic to prove the point.
    // Maybe randomize the starting Z slightly?
    const startZ = Math.random() * 20
    p1.current = [1, 1, startZ]
    p2.current = [1.01, 1, startZ]

    history1.current = []
    history2.current = []
    
    // Clear canvas
    const canvas = canvasRef.current
    if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.fillStyle = "#0c0824" // deep inset panel
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    }
  }

  // Initial draw
  useEffect(() => {
    resetSimulation()
  }, [])

  const step = (point: number[]) => {
    let [x, y, z] = point
    
    const dx = sigma * (y - x) * dt
    const dy = (x * (rho - z) - y) * dt
    const dz = (x * y - beta * z) * dt
    
    return [x + dx, y + dy, z + dz]
  }

  const loop = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate next steps
    p1.current = step(p1.current)
    p2.current = step(p2.current)
    
    history1.current.push([...p1.current])
    history2.current.push([...p2.current])
    
    // Limit trail length for performance/visual clarity
    if (history1.current.length > 500) history1.current.shift()
    if (history2.current.length > 500) history2.current.shift()

    // Calculate Divergence (Euclidean distance)
    const d = Math.sqrt(
        Math.pow(p1.current[0] - p2.current[0], 2) +
        Math.pow(p1.current[1] - p2.current[1], 2) +
        Math.pow(p1.current[2] - p2.current[2], 2)
    )
    // Map approx max distance (around 60?) to 0-100%
    setDivergence(Math.min(100, (d / 40) * 100))

    // Render
    // Fade effect
    ctx.fillStyle = "rgba(12, 8, 36, 0.05)" // Fade trails slowly
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Helper to project 3D to 2D
    // Simple perspective projection
    const project = (p: number[]) => {
        const x3d = p[0] * 12 // Scale up
        const y3d = p[1] * 12
        const z3d = p[2]
        
        // Center on screen
        const cx = canvas.width / 2
        const cy = canvas.height / 1.5 // Move down a bit
        
        // Simple isomectric-ish
        return [cx + x3d, cy - z3d * 10 + y3d * 0.5] 
        // Better: plot X vs Z (classic Butterfly view)
        // Lorenz is usually X vs Z
        return [cx + (x3d * 1.5), cy - (z3d * 8) + 200]
    }

    // Draw P1 (Neon orange)
    ctx.beginPath()
    ctx.strokeStyle = "#ff8a3c" // arcade neon accent
    ctx.lineWidth = 2
    history1.current.forEach((p, i) => {
        const [px, py] = project(p)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
    })
    ctx.stroke()

    // Draw P2 (Muted lavender)
    ctx.beginPath()
    ctx.strokeStyle = "#b3aae0" // muted arcade text tone
    ctx.lineWidth = 2
    history2.current.forEach((p, i) => {
        const [px, py] = project(p)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
    })
    ctx.stroke()
    
    // Draw Heads
    const head1 = project(p1.current)
    const head2 = project(p2.current)
    
    ctx.fillStyle = "#ECEAE3"
    ctx.beginPath()
    ctx.arc(head1[0], head1[1], 3, 0, Math.PI * 2)
    ctx.arc(head2[0], head2[1], 3, 0, Math.PI * 2)
    ctx.fill()

    timerRef.current = requestAnimationFrame(loop)
  }

  const toggleSim = () => {
    if (isRunning) {
        if (timerRef.current) cancelAnimationFrame(timerRef.current)
    } else {
        loop()
    }
    setIsRunning(!isRunning)
  }
  
  // Cleanup
  useEffect(() => {
    return () => {
        if (timerRef.current) cancelAnimationFrame(timerRef.current)
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card className="border" style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a" }}>
        <CardHeader>
          <CardTitle style={{ color: "#ff8a3c" }}>
            The Butterfly Effect Simulator
          </CardTitle>
          <CardDescription style={{ color: "#b3aae0" }}>
            See how a microscopic difference (0.0001) in starting conditions leads to completely different outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border relative" style={{ borderColor: "#4a3f7a", backgroundColor: "#0c0824" }}>
                    <canvas 
                        ref={canvasRef}
                        width={800}
                        height={500}
                        className="w-full h-[300px] md:h-[500px]"
                    />
                    
                     <div className="absolute top-4 left-4 space-y-2 p-3 rounded-lg border" style={{ backgroundColor: "#0c0824", borderColor: "#4a3f7a" }}>
                        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: "#ff8a3c" }}>
                            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#ff8a3c" }}></span>
                            System A: Start + 0.0000
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: "#b3aae0" }}>
                             <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#b3aae0" }}></span>
                            System B: Start + 0.0001
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border" style={{ backgroundColor: "#0c0824", borderColor: "#4a3f7a" }}>
                    <Button
                        size="lg"
                        onClick={toggleSim}
                        style={isRunning ? { backgroundColor: "#ff8a8a", color: "#160e33" } : { backgroundColor: "#ff8a3c", color: "#160e33" }}
                    >
                         {isRunning ? "Pause Simulation" : "Start Chaos"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={resetSimulation} title="Reset" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a", color: "#ECEAE3" }}>
                        <RotateCcw className="w-4 h-4" />
                    </Button>

                    <div className="flex-1 space-y-1 ml-4">
                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider" style={{ color: "#b3aae0" }}>
                            <span>Synchronization</span>
                            <span>{Math.max(0, 100 - divergence).toFixed(0)}% Match</span>
                        </div>
                        <Progress value={Math.max(0, 100 - divergence)} className="h-2" style={{ backgroundColor: "#0c0824" }} indicatorClassName={divergence > 50 ? "bg-[#ff8a8a]" : "bg-[#86efac]"} />
                        <p className="text-xs pt-1" style={{ color: "#b3aae0" }}>
                            {divergence < 5 ? "Systems are effectively identical." :
                             divergence < 50 ? "Divergence detected. Outcomes splitting." :
                             "Systems are now completely chaotic and unrelated."}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <ShareResult title="Butterfly Effect" text={`Small input, wild divergence: ${divergence.toFixed(0)}% chaos. 🦋`} />
                </div>
            </div>
        </CardContent>
      </Card>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border" style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a" }}>
                <CardHeader>
                    <CardTitle className="text-lg" style={{ color: "#ECEAE3" }}>Sensitive Dependence</CardTitle>
                </CardHeader>
                <CardContent className="text-sm" style={{ color: "#b3aae0" }}>
                    <p>
                        This is the <strong>Lorenz Attractor</strong>, a set of differential equations originally intended to model weather patterns.
                    </p>
                    <br />
                    <p>
                        Edward Lorenz found that rounding off a variable from .506127 to .506 completely changed the 2-month weather forecast. This proved that long-term prediction of chaotic systems (like weather or the stock market) is impossible.
                    </p>
                </CardContent>
            </Card>
            <Card className="border" style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a" }}>
                 <CardHeader>
                    <CardTitle className="text-lg" style={{ color: "#ECEAE3" }}>The Butterfly Pattern</CardTitle>
                </CardHeader>
                <CardContent className="text-sm" style={{ color: "#b3aae0" }}>
                    <p>
                        Notice how the trails never cross themselves, and they stay confined within a specific shape (the "Attractor").
                    </p>
                    <br />
                    <p>
                        Even though we can't predict <em>exactly</em> where the particle will be at time T, we know for sure it will be somewhere on the butterfly's wings. This is the difference between "Randomness" and "Chaos".
                    </p>
                </CardContent>
            </Card>
       </div>
    </div>
  )
}
