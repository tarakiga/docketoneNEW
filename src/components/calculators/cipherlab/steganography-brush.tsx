"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import {
    Command,
    EyeOff,
    Paintbrush,
    ShieldAlert,
    Waves
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

export function SteganographyBrush() {
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [brushPos, setBrushPos] = useState({ x: 0, y: 0 })
  const [isBrushing, setIsBrushing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const particles = useMemo(() => {
    return Array.from({ length: 400 }).map((_, i) => {
      const baseSeed = i + 1
      const hue = 255 + pseudoRandom(baseSeed * 11.1) * 30
      const light = 60 + pseudoRandom(baseSeed * 13.7) * 20

      return {
        id: i,
        x: pseudoRandom(baseSeed * 3.1) * 100,
        y: pseudoRandom(baseSeed * 5.7) * 100,
        size: pseudoRandom(baseSeed * 7.9) * 2 + 1,
        color: `hsl(${hue}, 70%, ${light}%)`
      }
    })
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setBrushPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  useEffect(() => {
    if (!containerRef.current) return
    const element = containerRef.current
    const updateSize = () => {
      setContainerSize({ width: element.clientWidth, height: element.clientHeight })
    }
    updateSize()
    const observer = new ResizeObserver(() => updateSize())
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const encodedSymbols = useMemo(() => {
    const seedBase = message.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0)

    return message.split('').map((char, i) => {
      const baseSeed = seedBase + i * 29

      return {
        id: i,
        char,
        x: (i % 8) * 12 + 10 + pseudoRandom(baseSeed * 1.7) * 5,
        y: Math.floor(i / 8) * 15 + 15 + pseudoRandom(baseSeed * 2.3) * 5,
      }
    })
  }, [message])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <Card className="bg-[#1d1442] border-[#4a3f7a] overflow-hidden">
        <CardHeader className="border-b border-[#4a3f7a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-8">
           <div className="space-y-1 min-w-0">
             <CardTitle className="text-2xl sm:text-3xl font-display text-[#ECEAE3] flex items-center gap-3" style={{ fontFamily: 'var(--font-bungee), cursive' }}>
               <ShieldAlert className="h-8 w-8" style={{ color: '#b388ff' }} />
               Quantum Steganography
             </CardTitle>
             <CardDescription className="text-[#b3aae0] font-medium">Hide your intent within the digital noise.</CardDescription>
           </div>
           <Tabs value={mode} onValueChange={(v) => setMode(v as 'encode' | 'decode')} className="w-full sm:w-[200px] shrink-0">
              <TabsList className="bg-[#0c0824] border-[#4a3f7a]">
                 <TabsTrigger value="encode" className="text-xs font-black uppercase text-[#b3aae0] border border-[#4a3f7a] hover:bg-[#241a52] hover:text-[#ECEAE3] data-[state=active]:bg-[#b388ff] data-[state=active]:text-[#160e33] data-[state=active]:border-[#b388ff]">Obscure</TabsTrigger>
                 <TabsTrigger value="decode" className="text-xs font-black uppercase text-[#b3aae0] border border-[#4a3f7a] hover:bg-[#241a52] hover:text-[#ECEAE3] data-[state=active]:bg-[#b388ff] data-[state=active]:text-[#160e33] data-[state=active]:border-[#b388ff]">Reveal</TabsTrigger>
              </TabsList>
           </Tabs>
        </CardHeader>

        <CardContent className="p-0">
           <div className="grid lg:grid-cols-2 lg:min-h-[500px]">

              {/* Input Section */}
              <div className="p-4 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#4a3f7a] space-y-8 min-w-0">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b3aae0]">Master Sequence</Label>
                    <div className="relative group">
                       <Input
                         placeholder="Enter your secret message..."
                         className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] h-14 rounded-2xl relative z-10 font-bold placeholder:text-[#b3aae0] focus:ring-[#b388ff]/50 focus:border-[#b388ff]"
                         value={message}
                         onChange={(e) => setMessage(e.target.value.slice(0, 64))}
                       />
                    </div>
                    <div className="flex justify-between items-center px-1">
                       <span className="text-[9px] font-bold text-[#b3aae0] uppercase tracking-widest leading-none">Limit: 64 Characters</span>
                       <span className="text-[9px] font-bold text-[#b3aae0] uppercase tracking-widest leading-none">{message.length}/64</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#0c0824] border border-[#4a3f7a] text-center space-y-2">
                       <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b388ff' }}>Entropy Level</div>
                       <div className="text-2xl font-black text-[#ECEAE3]">99.8%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0c0824] border border-[#4a3f7a] text-center space-y-2">
                       <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b388ff' }}>Key Depth</div>
                       <div className="text-2xl font-black text-[#ECEAE3]">256-bit</div>
                    </div>
                 </div>

                 <div className="pt-4 space-y-4">
                    <div className="text-[9px] font-black text-[#b3aae0] uppercase tracking-widest mb-2 border-l-2 border-[#b388ff] pl-3">Instruction</div>
                    <p className="text-xs text-[#b3aae0] leading-relaxed font-medium">
                       Your message is decomposed into microscopic light-value adjustments. To reveal the sequence, move your &quot;Quantum Brush&quot; across the canvas on the right.
                    </p>
                 </div>
              </div>

              {/* Canvas Section */}
              <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsBrushing(true)}
                onMouseLeave={() => setIsBrushing(false)}
                className="relative bg-[#0c0824] cursor-none overflow-hidden select-none"
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
                    const dx = brushPos.x - (item.x * containerSize.width / 100)
                    const dy = brushPos.y - (item.y * containerSize.height / 100)
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
                          color: isRevealed ? '#b388ff' : '#4a3f7a'
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
                   className="absolute pointer-events-none z-50 rounded-full border border-[#4a3f7a] flex items-center justify-center"
                   style={{ width: 80, height: 80, backgroundColor: 'rgba(179,136,255,0.08)' }}
                 >
                    <div className="absolute inset-0 rounded-full border-t rotate-12 animate-spin-slow opacity-50" style={{ borderTopColor: '#b388ff' }} />
                    <Command className="h-4 w-4 opacity-40" style={{ color: '#b388ff' }} />
                 </motion.div>

                 {/* Scanline Effect */}
                 <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
              </div>

           </div>

           <div className="flex justify-center mt-6 p-8 pt-0">
              <ShareResult title="Steganography Brush" text="I hid a secret message inside an image on Docket One. 🖼️🔐" />
           </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
         {[
           { title: "Entropy Mask", desc: "Intent is shattered across 400 unique coordinate vectors to ensure non-detection.", icon: Waves, color: "#b388ff" },
           { title: "Visual Synthesis", desc: "Symbols are phase-shifted to remain invisible outside the quantum focal point.", icon: EyeOff, color: "#b388ff" },
           { title: "Quantum Brush", desc: "A localized decryption field that reconstructs light data into readable intent.", icon: Paintbrush, color: "#b388ff" }
         ].map((item, idx) => (
           <Card key={idx} className="bg-[#241a52] border-[#4a3f7a] p-6 group hover:border-[#b388ff] transition-all">
              <item.icon className="h-6 w-6 mb-4 transition-transform group-hover:scale-110" style={{ color: item.color }} />
              <h3 className="font-black text-[10px] uppercase tracking-widest text-[#ECEAE3] mb-2">{item.title}</h3>
              <p className="text-[10px] text-[#b3aae0] leading-relaxed font-medium">{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
