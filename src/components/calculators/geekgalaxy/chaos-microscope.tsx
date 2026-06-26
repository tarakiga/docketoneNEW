"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ShareResult } from "@/components/molecules/share-result"
import { Maximize } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ChaosMicroscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(500)
  
  // Viewport state for zoom (minR, maxR, minX, maxX)
  const [viewport, setViewport] = useState({
    minR: 2.8,
    maxR: 4.0,
    minX: 0.0,
    maxX: 1.0
  })

  const [resolution, setResolution] = useState(1000) // Points per vertical slice
  const [iterations, setIterations] = useState(200) // Skip transient
  const [showRuler, setShowRuler] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  // Resize observer
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        setWidth(canvasRef.current.parentElement.clientWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    setIsDrawing(true)
    
    // Defer drawing to avoid blocking UI immediately on state change
    const timeoutId = setTimeout(() => {
      ctx.fillStyle = "#0f172a" // Dark background (slate-900)
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = "rgba(232, 121, 249, 0.4)" // Purple/Pink dot, low opacity for accumulation
      
      const rRange = viewport.maxR - viewport.minR
      const xRange = viewport.maxX - viewport.minX
      
      // For each pixel column (each r value)
      for (let px = 0; px < width; px++) {
        // Map pixel to r value
        const r = viewport.minR + (px / width) * rRange
        
        // Initial population
        let x = 0.5
        
        // Skip transient iterations to settle into the attractor
        for (let i = 0; i < iterations; i++) {
          x = r * x * (1 - x)
        }
        
        // Plot the stable orbit/chaos
        for (let i = 0; i < resolution; i++) {
          x = r * x * (1 - x)
          
          // Map x to pixel y (invert y because canvas 0 is top)
          if (x >= viewport.minX && x <= viewport.maxX) {
            const py = height - ((x - viewport.minX) / xRange) * height
            ctx.fillRect(px, py, 1, 1)
          }
        }
      }
      setIsDrawing(false)
    }, 10)

    return () => clearTimeout(timeoutId)
  }, [width, height, viewport, resolution, iterations])

  const handleZoom = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    
    // Get mouse position relative to canvas
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Convert to graph coordinates
    const rRange = viewport.maxR - viewport.minR
    const xRange = viewport.maxX - viewport.minX
    
    const clickedR = viewport.minR + (mouseX / width) * rRange
    const clickedX = viewport.minX + ((height - mouseY) / height) * xRange // Inverted Y logic
    
    // Zoom factor
    const zoomFactor = 0.25 // Zoom in to 25% of current view
    
    const newRRange = rRange * zoomFactor
    const newXRange = xRange * zoomFactor
    
    setViewport({
      minR: Math.max(0, clickedR - newRRange / 2),
      maxR: Math.min(4.2, clickedR + newRRange / 2),
      minX: Math.max(0, clickedX - newXRange / 2),
      maxX: Math.min(1.0, clickedX + newXRange / 2)
    })
  }

  const resetZoom = () => {
    setViewport({
      minR: 2.8,
      maxR: 4.0,
      minX: 0.0,
      maxX: 1.0
    })
  }

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <CardHeader>
          <CardTitle style={{ color: '#ff8a3c', fontFamily: 'var(--font-bungee), cursive' }}>
            The Chaos Microscope
          </CardTitle>
          <CardDescription style={{ color: '#b3aae0' }}>
            Click anywhere on the diagram to zoom in. Discover the fractal hidden within the chaos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: '#4a3f7a', backgroundColor: '#0c0824' }}>
               {/* Feigenbaum Ruler Overlay */}
               {showRuler && (
                <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
                    {/* Visual approximation markers for B1 and B2 */}
                    <div className="absolute top-0 bottom-0 border-l border-yellow-400 border-dashed" style={{left: `${((3.0 - viewport.minR) / (viewport.maxR - viewport.minR)) * 100}%`}}>
                        <span className="bg-yellow-900/80 text-yellow-300 text-xs px-1 ml-1 mt-2 block w-fit rounded">r=3.0 (First Split)</span>
                    </div>
                    <div className="absolute top-0 bottom-0 border-l border-yellow-400 border-dashed" style={{left: `${((3.449 - viewport.minR) / (viewport.maxR - viewport.minR)) * 100}%`}}>
                        <span className="bg-yellow-900/80 text-yellow-300 text-xs px-1 ml-1 mt-10 block w-fit rounded">r≈3.45 (Second Split)</span>
                    </div>
                     <div className="absolute top-0 bottom-0 border-l border-red-500 border-dashed" style={{left: `${((3.56995 - viewport.minR) / (viewport.maxR - viewport.minR)) * 100}%`}}>
                        <span className="bg-red-900/80 text-red-300 text-xs px-1 ml-1 mt-20 block w-fit rounded">r≈3.57 (Chaos Onset)</span>
                    </div>
                </div>
              )}
              
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={handleZoom}
                className="w-full max-w-full h-[400px] lg:h-[500px] cursor-crosshair active:cursor-grabbing block touch-none"
              />
              
              {isDrawing && (
                <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full animate-pulse" style={{ backgroundColor: '#241a52', color: '#ECEAE3' }}>
                  Rendering...
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-between p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#0c0824' }}>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
                <Button variant="outline" size="sm" onClick={resetZoom} style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a', color: '#ECEAE3' }}>
                  <Maximize className="w-4 h-4 mr-2" />
                  Reset Zoom
                </Button>

                <div className="flex items-center space-x-2 min-w-0">
                    <Label htmlFor="ruler-mode" className="text-sm" style={{ color: '#ECEAE3' }}>Feigenbaum Ruler</Label>
                    <Switch id="ruler-mode" checked={showRuler} onCheckedChange={setShowRuler} className="data-[state=checked]:bg-[#ff8a3c]" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 flex-1 w-full min-w-0 sm:min-w-[200px]">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <Label className="text-xs" style={{ color: '#b3aae0' }}>Detail (Iterations)</Label>
                    <span className="text-xs" style={{ color: '#ECEAE3' }}>{resolution} pts</span>
                  </div>
                  <Slider 
                    value={[resolution]} 
                    min={100} 
                    max={2000} 
                    step={100} 
                    onValueChange={(v) => setResolution(v[0])}
                    className="cursor-pointer"
                  />
                </div>
                 <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <Label className="text-xs" style={{ color: '#b3aae0' }}>Settle Time (Transient)</Label>
                    <span className="text-xs" style={{ color: '#ECEAE3' }}>{iterations} skips</span>
                  </div>
                  <Slider 
                    value={[iterations]} 
                    min={0} 
                    max={500} 
                    step={10} 
                    onValueChange={(v) => setIterations(v[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs font-mono p-2 rounded border" style={{ color: '#b3aae0', backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
              <div>Viewport R: [{viewport.minR.toFixed(5)} ... {viewport.maxR.toFixed(5)}]</div>
              <div>Constant δ ≈ 4.6692016...</div>
            </div>

            <div className="flex justify-center mt-6">
              <ShareResult
                title="Chaos Microscope"
                text={`I zoomed into the edge of chaos at r ∈ [${viewport.minR.toFixed(3)} … ${viewport.maxR.toFixed(3)}] on Docket One. 🔬🦋`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
           <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#ECEAE3' }}>What am I looking at?</CardTitle>
           </CardHeader>
           <CardContent className="text-sm space-y-2" style={{ color: '#b3aae0' }}>
             <p>
               This is the <strong>Bifurcation Diagram</strong> of the Logistic Map. It shows how a population changes over time based on its growth rate ($r$).
             </p>
             <ul className="list-disc pl-4 space-y-1">
               <li><strong>r &lt; 3.0</strong>: The population stabilizes at a single value (1 line).</li>
               <li><strong>r = 3.0</strong>: The first split! The population oscillates between two values (2 lines).</li>
               <li><strong>r ≈ 3.45</strong>: Second split (4 lines). This is "Period Doubling".</li>
               <li><strong>r ≈ 3.57</strong>: Chaos. The population becomes unpredictable/infinite.</li>
             </ul>
           </CardContent>
        </Card>
        
        <Card style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
           <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#ECEAE3' }}>The Feigenbaum Constant</CardTitle>
           </CardHeader>
           <CardContent className="text-sm space-y-2" style={{ color: '#b3aae0' }}>
             <p>
                Mitchell Feigenbaum discovered that the <em>rate</em> at which these splits happen is universal.
             </p>
             <p>
                If you measure the distance between the first split and the second, then divide it by the distance between the second and the third, you get <strong>4.669...</strong>
             </p>
             <p>
               This number appears in fluid dynamics, heart beats, and electronic circuits. It is the universal fingerprint of chaos.
             </p>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
