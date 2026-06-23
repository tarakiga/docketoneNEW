"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Copy, Lock, Unlock } from "lucide-react"
import { useMemo, useState } from "react"

export function CaesarCipher() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode')
    const [text, setText] = useState("")
    const [shift, setShift] = useState(3)
    const result = useMemo(() => {
        if (!text) return ""

        const effectiveShift = mode === 'encode' ? shift : (26 - shift) % 26
        
        return text.split('').map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0)
                const base = code >= 65 && code <= 90 ? 65 : 97
                return String.fromCharCode(((code - base + effectiveShift) % 26) + base)
            }
            return char
        }).join('')
    }, [mode, shift, text])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result)
    }

    // Wheel animation rotation
    const rotation = mode === 'encode' ? shift * (360/26) : -shift * (360/26)

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6 min-w-0">
                <Card className="glass-card" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                            {mode === 'encode' ? <Lock className="w-5 h-5" style={{ color: '#b388ff' }} /> : <Unlock className="w-5 h-5" style={{ color: '#86efac' }} />}
                            {mode === 'encode' ? 'Encrypt Message' : 'Decrypt Message'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2 p-1 rounded-lg" style={{ backgroundColor: '#0c0824' }}>
                            <Button
                                variant={mode === 'encode' ? 'default' : 'ghost'}
                                onClick={() => setMode('encode')}
                                className="flex-1"
                                style={mode === 'encode'
                                    ? { backgroundColor: '#b388ff', color: '#160e33' }
                                    : { backgroundColor: '#241a52', color: '#ECEAE3' }}
                            >
                                Encrypt
                            </Button>
                            <Button
                                variant={mode === 'decode' ? 'default' : 'ghost'}
                                onClick={() => setMode('decode')}
                                className="flex-1"
                                style={mode === 'decode'
                                    ? { backgroundColor: '#b388ff', color: '#160e33' }
                                    : { backgroundColor: '#241a52', color: '#ECEAE3' }}
                            >
                                Decrypt
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <Label style={{ color: '#ECEAE3' }}>Shift Amount: {shift}</Label>
                            <Slider
                                value={[shift]}
                                onValueChange={(v) => setShift(v[0])}
                                max={25}
                                min={1}
                                step={1}
                                className="py-2"
                            />
                            <div className="text-xs text-center" style={{ color: '#b3aae0' }}>
                                A {mode === 'encode' ? 'becomes' : 'was'} {String.fromCharCode(65 + ((mode === 'encode' ? shift : (26-shift)%26) % 26))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label style={{ color: '#ECEAE3' }}>Message</Label>
                            <Textarea
                                placeholder="Type your secret message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="min-h-[100px] font-mono focus-visible:ring-0 focus-visible:border-[#b388ff]"
                                style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}
                            />
                        </div>
                    </CardContent>
                </Card>

                 {/* Decoder Wheel Visual */}
                 <Card className="glass-card overflow-hidden" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                    <CardContent className="pt-6 flex justify-center items-center py-12">
                        <div className="relative w-64 h-64">
                            {/* Outer Ring (Static) */}
                            <div className="absolute inset-0 rounded-full border-4 flex items-center justify-center" style={{ borderColor: '#4a3f7a' }}>
                                {Array.from({ length: 26 }).map((_, i) => {
                                    const angle = (i * 360) / 26;
                                    return (
                                        <div
                                            key={i}
                                            className="absolute text-xs font-bold"
                                            style={{
                                                color: '#b3aae0',
                                                transform: `rotate(${angle}deg) translateY(-110px) rotate(-${angle}deg)`
                                            }}
                                        >
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Inner Ring (Rotating) */}
                            <motion.div
                                className="absolute inset-4 rounded-full border-4 flex items-center justify-center"
                                style={{ borderColor: '#b388ff', backgroundColor: '#1d1442' }}
                                animate={{ rotate: -rotation }}
                                transition={{ type: "spring", stiffness: 60 }}
                            >
                                 {Array.from({ length: 26 }).map((_, i) => {
                                    const angle = (i * 360) / 26;
                                    return (
                                        <div
                                            key={i}
                                            className="absolute text-xs font-bold"
                                            style={{
                                                color: '#b388ff',
                                                transform: `rotate(${angle}deg) translateY(-85px) rotate(-${angle}deg)`
                                            }}
                                        >
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    )
                                })}
                                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                                    🏛️
                                </div>
                            </motion.div>

                            {/* Indicator */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-2xl" style={{ color: '#b388ff' }}>
                                ▼
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6 min-w-0">
                 <Card className="glass-card h-full flex flex-col" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#ECEAE3' }}>Result</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="flex items-baseline gap-2 text-sm" style={{ color: '#b3aae0' }}>
                            <span>Shift Key</span>
                            <span style={{ fontFamily: 'var(--font-bungee), cursive', color: '#b388ff' }}>{shift}</span>
                        </div>
                        <div className="relative flex-1 rounded-xl p-4 border" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                            {result ? (
                                <p className="font-mono break-words text-lg" style={{ color: '#ECEAE3' }}>{result}</p>
                            ) : (
                                <p className="italic" style={{ color: '#b3aae0' }}>Result will appear here...</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                             <Button onClick={copyToClipboard} variant="outline" className="flex-1 gap-2" disabled={!result} style={{ backgroundColor: '#b388ff', borderColor: '#b388ff', color: '#160e33' }}>
                                <Copy className="w-4 h-4" /> Copy
                            </Button>
                             <ShareResult 
                                title="Caesar Cipher Secret 🤐"
                                text={mode === 'encode' 
                                    ? `🔐 Can you decode this? "${result}" (Shift: ${shift})`
                                    : `🔓 I cracked the code! "${result}"`
                                }
                                className="flex-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Educational Bit */}
                <Card className="glass-card" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                    <CardContent className="pt-6">
                        <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#b388ff' }}>
                             👑 History Check
                        </h4>
                        <p className="text-sm" style={{ color: '#b3aae0' }}>
                            Julius Caesar actually used this! He typically used a shift of 3 to protect military messages.
                            It&apos;s one of the simplest forms of encryption, easily broken today by frequency analysis,
                            but was state-of-the-art in 50 BC!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
