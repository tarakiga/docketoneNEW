"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"

const OGHAM_MAP: Record<string, { char: string, name: string }> = {
    'A': { char: 'ᚐ', name: 'Ailm' },
    'B': { char: 'ᚁ', name: 'Beith' },
    'C': { char: 'ᚂ', name: 'Coll' },
    'D': { char: 'ᚃ', name: 'Duir' },
    'E': { char: 'ᚄ', name: 'Eadha' },
    'F': { char: 'ᚅ', name: 'Fearn' },
    'G': { char: 'ᚆ', name: 'Gort' },
    'H': { char: 'ᚇ', name: 'Huathe' },
    'I': { char: 'ᚈ', name: 'Ioho' },
    'L': { char: 'ᚊ', name: 'Luis' },
    'M': { char: 'ᚋ', name: 'Muin' },
    'N': { char: 'ᚌ', name: 'Nion' },
    'O': { char: 'ᚍ', name: 'Onn' },
    'P': { char: 'ᚎ', name: 'Peith' },
    'Q': { char: 'ᚏ', name: 'Queirt' },
    'R': { char: 'ᚒ', name: 'Ruis' },
    'S': { char: 'ᚑ', name: 'Saille' },
    'T': { char: 'ᚒ', name: 'Tinne' },
    'U': { char: 'ᚓ', name: 'Ur' },
    'Z': { char: 'ᚗ', name: 'Straif' },
    ' ': { char: ' ', name: 'Space' }
}

export function OghamTranslator() {
    const [text, setText] = useState("")
    const [ogham, setOgham] = useState("")

    useEffect(() => {
        const converted = text.toUpperCase().split('').map(char => {
            return OGHAM_MAP[char]?.char || char
        }).join('')
        setOgham(converted)
    }, [text])

    // Vertical stone rendering
    const renderStone = () => {
        // Ogham is read bottom to top usually
        const chars = text.toUpperCase().split('').reverse()
        return (
            <div className="w-24 bg-stone-400 mx-auto rounded-t-full shadow-xl overflow-hidden border-2 border-stone-500 relative py-8 min-h-[300px] flex flex-col items-center justify-end">
                {/* Center line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-stone-700 -translate-x-1/2" />
                
                {/* Chars */}
                <div className="relative z-10 flex flex-col gap-1 w-full text-center">
                    {chars.map((char, i) => (
                        <div key={i} className="text-3xl font-bold text-stone-800 rotate-90 h-8 flex items-center justify-center">
                            {OGHAM_MAP[char]?.char || ''}
                        </div>
                    ))}
                </div>
                
                {/* Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-30 pointer-events-none" />
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Latin to Ogham</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Type English (A-Z)..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg uppercase"
                        />
                    </CardContent>
                </Card>

                <Card className="glass-card bg-stone-500/10 border-stone-500/20">
                     <CardContent className="pt-6">
                        <h4 className="font-bold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-2">
                             🗿 Ancient Irish Script
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Used from the 4th to 6th centuries CE. Traditionally carved on stone pillars, 
                            reading from bottom to top. Each letter is associated with a tree (e.g., B = Beith/Birch).
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Ogham Stone</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 bg-stone-100 dark:bg-stone-900 rounded-xl p-8 border border-border flex items-center justify-center">
                        {renderStone()}
                        
                        <div className="ml-8 hidden sm:block">
                            <h4 className="font-bold mb-4">Tree Mapping</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                {text.toUpperCase().split('').slice(0, 8).map((char, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="font-mono">{char}</span>
                                        <span>→</span>
                                        <span>{OGHAM_MAP[char]?.name || '?'}</span>
                                    </div>
                                ))}
                                {text.length > 8 && <div>...</div>}
                            </div>
                        </div>
                    </CardContent>
                     <div className="p-6 pt-0">
                         <ShareResult 
                            title="Ogham Stone 🗿"
                            text={`I inscribed an ancient Ogham stone: "${text}"`}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
