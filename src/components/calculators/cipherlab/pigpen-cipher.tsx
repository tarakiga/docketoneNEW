"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

// Pigpen Font Mapping (using Unicode approximations / specific shapes logic visually would be better, 
// but for a text-based/simple component, mapping to special chars or SVGs is best. 
// However, standard fonts don't support pigpen. We need to render SVGs for each char.)

const PIGPEN_MAP: Record<string, { type: 'square' | 'x', border: string, dot: boolean }> = {
    // Square grid 1 (A-I)
    'A': { type: 'square', border: 'border-r border-b', dot: false },
    'B': { type: 'square', border: 'border-l border-r border-b', dot: false },
    'C': { type: 'square', border: 'border-l border-b', dot: false },
    'D': { type: 'square', border: 'border-r border-t border-b', dot: false },
    'E': { type: 'square', border: 'border-l border-r border-t border-b', dot: false },
    'F': { type: 'square', border: 'border-l border-t border-b', dot: false },
    'G': { type: 'square', border: 'border-r border-t', dot: false },
    'H': { type: 'square', border: 'border-l border-r border-t', dot: false },
    'I': { type: 'square', border: 'border-l border-t', dot: false },

    // Square grid 2 (J-R) - Same as above but with dots
    'J': { type: 'square', border: 'border-r border-b', dot: true },
    'K': { type: 'square', border: 'border-l border-r border-b', dot: true },
    'L': { type: 'square', border: 'border-l border-b', dot: true },
    'M': { type: 'square', border: 'border-r border-t border-b', dot: true },
    'N': { type: 'square', border: 'border-l border-r border-t border-b', dot: true },
    'O': { type: 'square', border: 'border-l border-t border-b', dot: true },
    'P': { type: 'square', border: 'border-r border-t', dot: true },
    'Q': { type: 'square', border: 'border-l border-r border-t', dot: true },
    'R': { type: 'square', border: 'border-l border-t', dot: true },

    // X grid 1 (S-V)
    'S': { type: 'x', border: 'v-top', dot: false },
    'T': { type: 'x', border: 'v-right', dot: false },
    'U': { type: 'x', border: 'v-left', dot: false },
    'V': { type: 'x', border: 'v-bottom', dot: false },

    // X grid 2 (W-Z) - Same as above but with dots
    'W': { type: 'x', border: 'v-top', dot: true },
    'X': { type: 'x', border: 'v-right', dot: true },
    'Y': { type: 'x', border: 'v-left', dot: true },
    'Z': { type: 'x', border: 'v-bottom', dot: true },
}

export function PigpenCipher() {
    const [text, setText] = useState("")
    
    // We'll render the output as a flex-wrap container of SVG-like divs
    const renderPigpenChar = (char: string, index: number) => {
        const upper = char.toUpperCase()
        const config = PIGPEN_MAP[upper]

        if (!config) {
            // Visualize spaces or unknown chars
            if (char === ' ') return <div key={index} className="w-8 h-8" />
            return <div key={index} className="w-8 h-12 flex items-center justify-center font-mono text-xl">{char}</div>
        }

        if (config.type === 'square') {
            return (
                <div key={index} className={`w-12 h-12 relative flex items-center justify-center border-yellow-500/50 ${config.border.replace(/border-/g, 'border-2 border-transparent ').replace(/border-t/g, '!border-t-yellow-500').replace(/border-b/g, '!border-b-yellow-500').replace(/border-l/g, '!border-l-yellow-500').replace(/border-r/g, '!border-r-yellow-500')}`}>
                    {config.dot && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                </div>
            )
        }
        
        // Custom rendering for 'X' shapes using borders is tricky with Tailwind classes alone for diagonals.
        // Better to use SVG for X shapes.
        const isDot = config.dot
        
        return (
            <div key={index} className="w-12 h-12 relative flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-full h-full stroke-yellow-500 stroke-[8] fill-none">
                    {/* S / W (Top V) */}
                    {(config.border === 'v-top') && <polyline points="0,0 50,50 100,0" />}
                    {/* U / Y (Left V) */}
                    {(config.border === 'v-left') && <polyline points="0,0 50,50 0,100" />}
                    {/* T / X (Right V) */}
                    {(config.border === 'v-right') && <polyline points="100,0 50,50 100,100" />}
                    {/* V / Z (Bottom V) */}
                    {(config.border === 'v-bottom') && <polyline points="0,100 50,50 100,100" />}
                 </svg>
                 {isDot && <div className="absolute w-2 h-2 bg-yellow-500 rounded-full" />}
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Message Encoder</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Enter text to encode (A-Z)..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg uppercase"
                        />
                    </CardContent>
                </Card>

                <Card className="glass-card bg-yellow-500/5 border-yellow-500/20">
                     <CardContent className="pt-6">
                        <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                             🐷 Geometric Cipher
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Used by Freemasons in the 18th century to keep records private. 
                            Also known as the Masonic Cipher. It replaces letters with fragments of a grid.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Pigpen Visuals</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-2 content-start p-6 bg-stone-900 rounded-xl border border-stone-800 min-h-[300px]">
                             {text.length === 0 && (
                                <span className="text-stone-600 italic w-full text-center mt-10">Symbols will appear here...</span>
                            )}
                            {text.split('').map((char, i) => renderPigpenChar(char, i))}
                        </div>
                    </CardContent>
                     <div className="p-6 pt-0">
                         <ShareResult 
                            title="Pigpen Secret Message"
                            text="I created a secret Masonic cipher! Decode it at Docket One."
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
