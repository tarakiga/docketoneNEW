"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ShareResult } from "@/components/molecules/share-result"
import { Music, Pause, Play, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ChaosComposer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [r, setR] = useState(2.0)
  const [speed, setSpeed] = useState(250) // ms per beat
  const [useScale, setUseScale] = useState(true)

  // Math State
  const xRef = useRef(0.5)
  
  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Visualization State
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const historyRef = useRef<number[]>([])

  // Pentatonic Scale (C Major Pentatonic: C, D, E, G, A)
  // Mapping 0.0 - 1.0 to frequencies
  const scaleFreqs = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
  ]

  const getFrequency = (value: number) => {
    if (useScale) {
        const index = Math.floor(value * scaleFreqs.length)
        return scaleFreqs[Math.min(index, scaleFreqs.length - 1)]
    } else {
        // Raw mapping: 200Hz - 800Hz
        return 200 + (value * 600)
    }
  }

  const playTone = (freq: number) => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const ctx = audioCtxRef.current
    
    // Create oscillator
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    
    // Envelope: Attack -> Decay
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (speed / 1000) - 0.05)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + (speed / 1000))
  }

  const tick = () => {
    // Calculate next logistic map value
    // x(n+1) = r * x(n) * (1 - x(n))
    const nextX = r * xRef.current * (1 - xRef.current)
    xRef.current = nextX
    
    // Update history
    historyRef.current.push(nextX)
    if (historyRef.current.length > 50) historyRef.current.shift()

    // Play Sound
    playTone(getFrequency(nextX))
    
    // Draw
    drawVisualizer()
  }

  const drawVisualizer = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)
    
    // Style
    ctx.strokeStyle = "#ff8a3c" // Arcade neon orange
    ctx.lineWidth = 2
    ctx.beginPath()

    const step = w / 50
    historyRef.current.forEach((val, i) => {
        const x = i * step
        const y = h - (val * h)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    })
    
    ctx.stroke()
    
    // Draw current point
    if (historyRef.current.length > 0) {
        const lastVal = historyRef.current[historyRef.current.length - 1]
        const lx = (historyRef.current.length - 1) * step
        const ly = h - (lastVal * h)
        
        ctx.fillStyle = "#ECEAE3"
        ctx.beginPath()
        ctx.arc(lx, ly, 4, 0, Math.PI * 2)
        ctx.fill()
    }
  }

  useEffect(() => {
    if (isPlaying) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(tick, speed)
    } else {
        if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, r, speed, useScale])


  return (
    <div className="space-y-6">
      <Card className="border" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#ff8a3c', fontFamily: 'var(--font-bungee), cursive' }}>
            <Music className="w-6 h-6" />
            The Chaos Composer
          </CardTitle>
          <CardDescription style={{ color: '#b3aae0' }}>
            Listen to the rhythm of math. Hear how simple Period Doubling turns into complex Orchestral Chaos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Visualizer Canvas */}
            <div className="rounded-lg p-4 border h-[150px] relative" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={120}
                    className="w-full h-full block"
                />
                 {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm px-3 py-1 rounded-full border" style={{ color: '#b3aae0', backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                            Press Play to start the simulation
                        </span>
                    </div>
                 )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* R Control */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-lg font-bold" style={{ color: '#ff8a3c', fontFamily: 'var(--font-bungee), cursive' }}>Growth Rate (r): {r.toFixed(2)}</Label>
                        <span className="text-xs font-mono" style={{ color: '#b3aae0' }}>
                            {r < 3.0 ? "Stable (Period 1)" :
                             r < 3.45 ? "Period 2" :
                             r < 3.56 ? "Period 4/8/16..." : "CHAOS"}
                        </span>
                    </div>
                    <Slider
                        value={[r]}
                        min={2.0}
                        max={4.0}
                        step={0.01}
                        onValueChange={(v) => setR(v[0])}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs px-1" style={{ color: '#b3aae0' }}>
                        <span>2.0 (Stable)</span>
                        <span>3.0 (Bifurcation)</span>
                        <span>3.57 (Chaos)</span>
                        <span>4.0 (Max)</span>
                    </div>
                </div>

                 {/* Speed & Scale */}
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Button
                                className="w-12 h-12 rounded-full"
                                style={isPlaying
                                    ? { backgroundColor: '#0c0824', border: '1px solid #4a3f7a', color: '#ff8a8a' }
                                    : { backgroundColor: '#ff8a3c', color: '#160e33' }}
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current pl-1" />}
                            </Button>
                             <div className="flex flex-col">
                                <span className="text-sm font-semibold" style={{ color: '#ECEAE3' }}>{isPlaying ? "Playing" : "Paused"}</span>
                                <span className="text-xs" style={{ color: '#b3aae0' }}>x = {xRef.current.toFixed(4)}</span>
                             </div>
                         </div>

                         <div className="flex items-center gap-2">
                            <Label htmlFor="scale-mode" className="text-xs" style={{ color: '#ECEAE3' }}>Musical Scale</Label>
                            <Switch id="scale-mode" checked={useScale} onCheckedChange={setUseScale} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                             <Label className="text-xs" style={{ color: '#ECEAE3' }}>Tempo ({speed}ms)</Label>
                             <Zap className="w-3 h-3" style={{ color: '#ffd23c' }} />
                        </div>
                         <Slider 
                            value={[1000 - speed]} 
                            min={500} // 1000 - 500 = 500ms
                            max={950} // 1000 - 50 = 50ms
                            step={10} 
                            onValueChange={(v) => setSpeed(1000 - v[0])}
                        />
                    </div>
                 </div>
            </div>
            
             <div className="border p-4 rounded-lg text-sm" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#b3aae0' }}>
                <p>
                    <strong style={{ color: '#ff8a3c' }}>How to use:</strong> Slide the Growth Rate ($r$) slowly from left to right.
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>At <strong>r=2.5</strong>, you will hear a single steady beat. The population is stable.</li>
                    <li>Pass <strong>r=3.0</strong>, and you'll hear a "galloping" rhythm (high-low-high-low). This is period-doubling.</li>
                    <li>At <strong>r=3.5</strong>, the rhythm splits again into a complex 4-beat loop.</li>
                    <li>Enter <strong>r &gt; 3.57</strong>, and the pattern dissolves into non-repeating, chaotic jazz.</li>
                </ul>
            </div>

            <div className="flex justify-center mt-6">
              <ShareResult
                title="Chaos Composer"
                text={`I generated music from pure chaos theory (Growth Rate r = ${r.toFixed(2)}) on Docket One. 🎶🦋`}
              />
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
