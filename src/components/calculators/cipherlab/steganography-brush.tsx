"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
    Command,
    EyeOff,
    Paintbrush,
    ShieldAlert,
    Waves
} from "lucide-react"
import { useMemo, useRef, useState } from "react"

export function SteganographyBrush() {
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [brushPos, setBrushPos] = useState({ x: 0, y: 0 })
  const [isBrushing, setIsBrushing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const particles = useMemo(() => {
    return Array.from({ length: 400 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      color: `hsl(${220 + Math.random() * 60}, 70%, ${50 + Math.random() * 20}%)`
    }))
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setBrushPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const encodedSymbols = useMemo(() => {
    return message.split('').map((char, i) => ({
        id: i,
        char,
        x: (i % 8) * 12 + 10 + Math.random() * 5,
        y: Math.floor(i / 8) * 15 + 15 + Math.random() * 5,
    }))
  }, [message])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <CardHeader className="border-b border-slate-900 flex flex-row items-center justify-between p-8">
           <div className="space-y-1">
             <CardTitle className="text-3xl font-display text-white flex items-center gap-3">
               <ShieldAlert className="h-8 w-8 text-cyan-400" />
               Quantum Steganography
             </CardTitle>
             <CardDescription className="text-slate-500 font-medium">Hide your intent within the digital noise.</CardDescription>
           </div>
           <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-[200px]">
              <TabsList className="bg-slate-900 border-slate-800">
                 <TabsTrigger value="encode" className="text-xs font-black uppercase">Obscure</TabsTrigger>
                 <TabsTrigger value="decode" className="text-xs font-black uppercase">Reveal</TabsTrigger>
              </TabsList>
           </Tabs>
        </CardHeader>

        <CardContent className="p-0">
           <div className="grid lg:grid-cols-2 min-h-[500px]">
              
              {/* Input Section */}
              <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-900 space-y-8">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Master Sequence</Label>
                    <div className="relative group">
                       <div className="absolute inset-0 bg-cyan-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                       <Input 
                         placeholder="Enter your secret message..." 
                         className="bg-slate-900 border-slate-800 text-white h-14 rounded-2xl relative z-10 font-bold placeholder:text-slate-700 focus:ring-cyan-500/50"
                         value={message}
                         onChange={(e) => setMessage(e.target.value.slice(0, 64))}
                       />
                    </div>
                    <div className="flex justify-between items-center px-1">
                       <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">Limit: 64 Characters</span>
                       <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">{message.length}/64</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                       <div className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Entropy Level</div>
                       <div className="text-2xl font-black text-white">99.8%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                       <div className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Key Depth</div>
                       <div className="text-2xl font-black text-white">256-bit</div>
                    </div>
                 </div>

                 <div className="pt-4 space-y-4">
                    <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-2 border-l-2 border-cyan-500 pl-3">Instruction</div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       Your message is decomposed into microscopic light-value adjustments. To reveal the sequence, move your "Quantum Brush" across the canvas on the right.
                    </p>
                 </div>
              </div>

              {/* Canvas Section */}
              <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsBrushing(true)}
                onMouseLeave={() => setIsBrushing(false)}
                className="relative bg-black cursor-none overflow-hidden select-none"
              >
                 {/* Noise Particles */}
                 {particles.map((p) => (
                    <div 
                      key={p.id}
                      className="absolute rounded-full opacity-20 pointer-events-none"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        boxShadow: `0 0 4px ${p.color}`
                      }}
                    />
                 ))}

                 {/* Hidden Symbols */}
                 {encodedSymbols.map((item) => {
                    const dx = brushPos.x - (item.x * (containerRef.current?.clientWidth || 0) / 100)
                    const dy = brushPos.y - (item.y * (containerRef.current?.clientHeight || 0) / 100)
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const isRevealed = isBrushing && distance < 80

                    return (
                      <motion.div
                        key={item.id}
                        initial={false}
                        animate={{
                          opacity: isRevealed ? (mode === 'decode' ? 1 : 0.05) : (mode === 'decode' ? 0.02 : 0.1),
                          scale: isRevealed ? 1.2 : 0.9,
                          filter: isRevealed ? 'blur(0px)' : 'blur(2px)',
                          color: isRevealed ? '#22d3ee' : '#334155'
                        }}
                        className="absolute font-mono font-bold text-2xl transition-all duration-300 pointer-events-none"
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                        }}
                      >
                         {item.char}
                      </motion.div>
                    )
                 })}

                 {/* Brush Visualizer */}
                 <motion.div 
                   animate={{
                     x: brushPos.x - 40,
                     y: brushPos.y - 40,
                     opacity: isBrushing ? 1 : 0,
                     scale: isBrushing ? 1 : 0.5
                   }}
                   transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
                   className="absolute pointer-events-none z-50 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center backdrop-blur-sm"
                   style={{ width: 80, height: 80 }}
                 >
                    <div className="absolute inset-0 rounded-full border-t border-cyan-400 rotate-12 animate-spin-slow opacity-50" />
                    <Command className="h-4 w-4 text-cyan-400 opacity-40" />
                 </motion.div>

                 {/* Scanline Effect */}
                 <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
              </div>

           </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
         {[
           { title: "Entropy Mask", desc: "Intent is shattered across 400 unique coordinate vectors to ensure non-detection.", icon: Waves, color: "text-cyan-400" },
           { title: "Visual Synthesis", desc: "Symbols are phase-shifted to remain invisible outside the quantum focal point.", icon: EyeOff, color: "text-purple-400" },
           { title: "Quantum Brush", desc: "A localized decryption field that reconstructs light data into readable intent.", icon: Paintbrush, color: "text-emerald-400" }
         ].map((item, idx) => (
           <Card key={idx} className="bg-slate-900 border-slate-800 p-6 group hover:border-slate-700 transition-all">
              <item.icon className={`h-6 w-6 ${item.color} mb-4 transition-transform group-hover:scale-110`} />
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-200 mb-2">{item.title}</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
