"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toPng } from "html-to-image"
import { Download, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

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
    const [isDownloading, setIsDownloading] = useState(false)
    const stoneRef = useRef<HTMLDivElement>(null)

    const downloadInscription = async () => {
        if (!stoneRef.current) return
        
        setIsDownloading(true)
        const toastId = toast.loading("Preparing your ancient inscription...")

        try {
            // Give a small delay to ensure rendering is complete
            await new Promise(r => setTimeout(r, 100))
            
            const dataUrl = await toPng(stoneRef.current, {
                quality: 1,
                pixelRatio: 3, // High resolution for printing
                backgroundColor: '#0c0824',
                style: {
                    margin: '0',
                    transform: 'none'
                }
            })

            const link = document.createElement('a')
            link.download = `ogham-inscription-${text.toLowerCase().replace(/\s+/g, '-') || 'untiltled'}.png`
            link.href = dataUrl
            link.click()
            
            toast.success("Inscription downloaded! Ready for printing.", { id: toastId })
        } catch (error) {
            console.error("Download failed:", error)
            toast.error("Failed to capture image. Please try again.", { id: toastId })
        } finally {
            setIsDownloading(false)
        }
    }

    // Clear inscription rendering (replaces stone)
    const renderInscription = () => {
        const chars = text.toUpperCase().trim().split('').reverse()
        return (
            <div
                ref={stoneRef}
                className="mx-auto relative py-20 min-h-[500px] flex flex-col items-center justify-end px-10 sm:px-24 bg-[#0c0824] rounded-3xl"
            >
                {/* Stem Line (Continuous line) */}
                <div className="absolute top-0 bottom-12 left-1/2 w-[3px] bg-[#b388ff]/80 -translate-x-1/2" />
                
                {/* Characters Container */}
                <div className="relative z-10 flex flex-col gap-10 w-full mb-12">
                    {chars.map((char, i) => (
                        <div key={i} className="flex items-center justify-center h-12 relative w-full group/char">
                            {/* Ogham character - The strokes centered on the line */}
                            <div className="text-6xl font-bold text-[#ECEAE3] rotate-90 absolute left-1/2 -translate-x-1/2 flex items-center justify-center min-w-[100px]">
                                {OGHAM_MAP[char]?.char || ''}
                            </div>

                            {/* Latin label (on the right) */}
                            {char !== ' ' && (
                                <div className="text-3xl font-mono font-black text-[#b3aae0] absolute left-1/2 translate-x-12 opacity-40 group-hover/char:opacity-100 transition-opacity">
                                    {char}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Footer arrowhead (V-shape at the bottom) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 border-b-[4px] border-l-[4px] border-[#b388ff]/60 rotate-45 -translate-y-4" />
                </div>

                {chars.length === 0 && (
                    <div className="text-[#b3aae0] italic text-lg font-bold opacity-30">
                        Awaiting inscription...
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6 min-w-0">
                <Card className="white-glass-card bg-[#1d1442] border-[#4a3f7a]">
                    <CardHeader className="border-b border-[#4a3f7a] bg-[#241a52]">
                        <CardTitle className="flex items-center gap-2 text-[#ECEAE3] font-bold">
                             🖋️ Inscription Editor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 p-8">
                        <Textarea
                            placeholder="Type English text to inscribe (e.g., 'DOCKET')..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[160px] text-lg uppercase font-black tracking-widest border-[#4a3f7a] bg-[#0c0824] text-[#ECEAE3] placeholder:text-[#b3aae0] shadow-inner rounded-2xl resize-none focus:border-[#b388ff] transition-all"
                        />
                        <div className="pt-2">
                            <Button 
                                onClick={downloadInscription} 
                                className="w-full h-14 gap-2 relative overflow-hidden group shadow-xl shadow-[#b388ff]/10 rounded-2xl font-black uppercase tracking-wide text-xs whitespace-normal leading-tight text-center bg-[#b388ff] text-[#160e33] hover:bg-[#b388ff]/90"
                                variant="default"
                                disabled={!text || isDownloading}
                            >
                                {isDownloading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                                )}
                                {isDownloading ? "Capturing..." : "Download Inscription (PNG)"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="white-glass-card bg-[#241a52] border-[#4a3f7a]" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a" }}>
                     <CardContent className="p-8">
                        <h4 className="font-black text-[#6ee7b7] mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                             📜 The Druim Backline
                        </h4>
                        <p className="text-sm text-[#b3aae0] font-medium leading-relaxed">
                            Ogham is read from the bottom upwards. The central line, known as the <strong className="text-[#6ee7b7]">druim</strong> (ridge),
                            acts as the backbone of the script. Strokes are carved to the left, right, or across 
                            this line to represent different vowel and consonant sounds.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6 min-w-0">
                 <Card className="white-glass-card h-full flex flex-col bg-[#1d1442] border-[#4a3f7a] overflow-hidden shadow-2xl shadow-black/50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-[#4a3f7a] bg-[#241a52] pb-4 p-6">
                        <CardTitle className="text-[#ECEAE3] font-bold">Inscription Preview</CardTitle>
                        <div className="text-[9px] uppercase tracking-[0.25em] font-black text-[#b388ff] bg-[#b388ff]/10 px-4 py-1.5 rounded-full border border-[#b388ff]/30">
                            Read Bottom Up
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden bg-[#0c0824]">
                        {/* Decorative subtle texture/dots */}
                        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#b388ff_1px,transparent_1px)] [background-size:20px_20px]" />
                        
                        <div className="relative z-10 scale-90 sm:scale-110 transition-all duration-700 ease-out">
                             {renderInscription()}
                        </div>
                    </CardContent>
                     <div className="p-8 pt-0 bg-[#1d1442]">
                         <ShareResult 
                            title="Ogham Inscription 🗿"
                            text={`I've created an Ogham inscription: "${text}"`}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
