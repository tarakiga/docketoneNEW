"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft } from "lucide-react"
import { useMemo, useState } from "react"

export function MinecraftPortalPlanner() {
  const [size, setSize] = useState('small')
  const [customW, setCustomW] = useState(4)
  const [customH, setCustomH] = useState(5)
  const [coordType, setCoordType] = useState<'overworld' | 'nether'>('overworld')
  const [coords, setCoords] = useState({ x: 0, y: 64, z: 0 })

  const requirements = useMemo(() => {
    let w = 4, h = 5
    if (size === 'medium') { w = 6; h = 7 }
    if (size === 'large') { w = 8; h = 9 }
    if (size === 'custom') { w = Math.max(4, customW); h = Math.max(5, customH) }

    return {
       width: w,
       height: h,
       obsidian: (w * 2) + (h * 2) - 4, // Corners optional? This formula assumes full frame with corners.
       interior: (w - 2) * (h - 2)
    }
  }, [size, customW, customH])

  const convertedCoords = useMemo(() => {
    if (coordType === 'overworld') {
       return { x: Math.floor(coords.x / 8), y: coords.y, z: Math.floor(coords.z / 8), dest: 'Nether' }
    } else {
       return { x: coords.x * 8, y: coords.y, z: coords.z * 8, dest: 'Overworld' }
    }
  }, [coords, coordType])

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <Card className="bg-[#121212] border-[#3C0F59] border-4 shadow-xl text-white overflow-hidden">
        <CardHeader className="bg-[#2D0A42] border-b-4 border-[#1A0526]">
           <CardTitle className="text-center font-bold text-2xl tracking-widest text-[#D685E0] uppercase flex items-center justify-center gap-3">
             <div className="w-8 h-8 bg-[#3C0F59] border-2 border-[#542478]"></div> 
             Nether Architect
           </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 grid md:grid-cols-2 gap-8">
           
           {/* Section 1: Portal Builder */}
           <div className="space-y-6">
              <h3 className="font-bold text-[#D685E0] uppercase border-b border-[#3C0F59] pb-2">Portal Configuration</h3>
              
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-400">Frame Size</label>
                 <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#333]"><SelectValue/></SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                       <SelectItem value="small">Standard (4x5)</SelectItem>
                       <SelectItem value="medium">Medium (6x7)</SelectItem>
                       <SelectItem value="large">Large (8x9)</SelectItem>
                       <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              {size === 'custom' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs text-slate-500">Width</label>
                       <input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))} className="w-full bg-[#1A1A1A] border border-[#333] p-2 rounded text-white"/>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs text-slate-500">Height</label>
                       <input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))} className="w-full bg-[#1A1A1A] border border-[#333] p-2 rounded text-white"/>
                    </div>
                 </div>
              )}
              
              <div className="bg-[#1A1A1A] p-4 rounded border border-[#333] space-y-2">
                  <div className="flex justify-between">
                     <span className="text-slate-400">Obsidian Blocks:</span>
                     <span className="font-bold text-[#D685E0]">{requirements.obsidian}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Interior Spaces:</span>
                     <span className="font-bold text-[#A020F0]">{requirements.interior}</span>
                  </div>
              </div>

              {/* Visual Preview */}
              <div className="flex justify-center items-center p-4 bg-[#0a0a0a] rounded border border-[#222] min-h-[150px]">
                  <div style={{ 
                     display: 'grid', 
                     gridTemplateColumns: `repeat(${requirements.width}, 1fr)`,
                     gap: '2px',
                     width: `${requirements.width * 12}px`
                  }}>
                     {Array.from({ length: requirements.width * requirements.height }).map((_, i) => {
                        const x = i % requirements.width;
                        const y = Math.floor(i / requirements.width);
                        const isFrame = x === 0 || x === requirements.width - 1 || y === 0 || y === requirements.height - 1;
                        return (
                          <div 
                            key={i} 
                            style={{ 
                              width: '10px', height: '10px',
                              backgroundColor: isFrame ? '#1f1f1f' : '#6A0DAD', // Obsidian vs Portal
                              boxShadow: isFrame ? 'inset 0 0 2px #000' : '0 0 4px #A020F0',
                              border: isFrame ? '1px solid #333' : 'none'
                             }} 
                          />
                        )
                     })}
                  </div>
              </div>

           </div>

           {/* Section 2: Coordinate Calculator */}
           <div className="space-y-6">
              <h3 className="font-bold text-[#D685E0] uppercase border-b border-[#3C0F59] pb-2">Coordinate Linker</h3>
              
              <div className="flex bg-[#1A1A1A] p-1 rounded">
                 <button onClick={() => setCoordType('overworld')} className={`flex-1 text-sm py-1 rounded ${coordType === 'overworld' ? 'bg-green-700 text-white' : 'text-slate-500 hover:text-white'}`}>Overworld</button>
                 <ArrowRightLeft className="w-4 h-4 mx-2 text-slate-500 self-center"/>
                 <button onClick={() => setCoordType('nether')} className={`flex-1 text-sm py-1 rounded ${coordType === 'nether' ? 'bg-red-900 text-white' : 'text-slate-500 hover:text-white'}`}>Nether</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-bold uppercase">X</label>
                    <input type="number" value={coords.x} onChange={e => setCoords({...coords, x: Number(e.target.value)})} className="w-full bg-[#1A1A1A] border border-[#333] p-2 rounded text-white font-mono"/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-bold uppercase">Y</label>
                    <input type="number" value={coords.y} onChange={e => setCoords({...coords, y: Number(e.target.value)})} className="w-full bg-[#1A1A1A] border border-[#333] p-2 rounded text-white font-mono"/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-bold uppercase">Z</label>
                    <input type="number" value={coords.z} onChange={e => setCoords({...coords, z: Number(e.target.value)})} className="w-full bg-[#1A1A1A] border border-[#333] p-2 rounded text-white font-mono"/>
                 </div>
              </div>

              <div className="bg-[#2D0A42] p-6 rounded border border-[#542478] text-center space-y-2">
                 <div className="text-xs uppercase text-[#D685E0]/70 font-bold">Build in {convertedCoords.dest} at:</div>
                 <div className="text-2xl font-mono font-bold text-white tracking-widest">
                    {convertedCoords.x} / {convertedCoords.y} / {convertedCoords.z}
                 </div>
                 <div className="text-xs italic text-slate-400 mt-2">
                    (Y-coordinate doesn't strictly matter for linking, but match it for convenience!)
                 </div>
              </div>
              
              <ShareResult 
                 title="Portal Plans"
                 text={`Planning a ${requirements.width}x${requirements.height} Nether Portal. Needs ${requirements.obsidian} obsidian. Linking local coords to ${convertedCoords.x}, ${convertedCoords.y}, ${convertedCoords.z}!`}
              />

           </div>

        </CardContent>
      </Card>
    </div>
  )
}
