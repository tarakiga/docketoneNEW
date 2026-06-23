"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Flashlight, Play, Square } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const MORSE_MAP: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ' ': '/'
}

export function MorseCode() {
    const [text, setText] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFlashlight, setIsFlashlight] = useState(false)
    const [activeChar, setActiveChar] = useState(-1) // Index of character being played
    
    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscillatorRef = useRef<OscillatorNode | null>(null)
    const gainNodeRef = useRef<GainNode | null>(null)
    const playingRef = useRef(false)

    const morse = useMemo(() => {
        return text.toUpperCase().split('').map(char => {
            return MORSE_MAP[char] || char
        }).join(' ')
    }, [text])

    const startSignal = () => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
            if (!AudioContextClass) return
            audioContextRef.current = new AudioContextClass()
        }
        
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(600, ctx.currentTime) // 600Hz tone
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start()
        gain.gain.setValueAtTime(0, ctx.currentTime) // Silent initially

        oscillatorRef.current = osc
        gainNodeRef.current = gain
    }

    const stopSignal = useCallback(() => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop()
            oscillatorRef.current.disconnect()
            oscillatorRef.current = null
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect()
            gainNodeRef.current = null
        }
    }, [])

    // Cleanup audio on unmount
    useEffect(() => {
        return () => stopSignal()
    }, [stopSignal])

    const beep = (duration: number) => {
        if (!gainNodeRef.current || !audioContextRef.current) return
        
        const ctx = audioContextRef.current
        const gain = gainNodeRef.current
        
        gain.gain.cancelScheduledValues(ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.setValueAtTime(0, ctx.currentTime + duration)
        
        if (isFlashlight) {
             // Visual Flash (hacky global, but works for effect)
             const flashOverlay = document.getElementById('flashlight-overlay')
             if (flashOverlay) {
                 flashOverlay.style.opacity = '1'
                 setTimeout(() => { flashOverlay.style.opacity = '0' }, duration * 1000)
             }
        }
    }

    const playMorse = async () => {
        if (playingRef.current) {
            playingRef.current = false
            setIsPlaying(false)
            stopSignal()
            setActiveChar(-1)
            return
        }

        if (!morse) return

        playingRef.current = true
        setIsPlaying(true)
        startSignal()

        const DOT_TIME = 100 // ms
        const DASH_TIME = DOT_TIME * 3
        const SYMBOL_SPACE = DOT_TIME
        const LETTER_SPACE = DOT_TIME * 3
        
        // We need to map morse string back to indices to highlight
        // Simple approach: Iterate through morse string
        for (let i = 0; i < morse.length; i++) {
            if (!playingRef.current) break
            
            setActiveChar(i)
            const symbol = morse[i]

            if (symbol === '.') {
                beep(DOT_TIME / 1000)
                await new Promise(r => setTimeout(r, DOT_TIME + SYMBOL_SPACE))
            } else if (symbol === '-') {
                beep(DASH_TIME / 1000)
                await new Promise(r => setTimeout(r, DASH_TIME + SYMBOL_SPACE))
            } else if (symbol === '/') {
                await new Promise(r => setTimeout(r, LETTER_SPACE))
            } else if (symbol === ' ') {
                await new Promise(r => setTimeout(r, LETTER_SPACE)) // Space between letters
            } else {
                 await new Promise(r => setTimeout(r, DOT_TIME))
            }
        }

        stopSignal()
        playingRef.current = false
        setIsPlaying(false)
        setActiveChar(-1)
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 relative">
            {/* Flashlight Overlay */}
            <div id="flashlight-overlay" className="fixed inset-0 bg-white pointer-events-none opacity-0 z-50 transition-opacity duration-75 mix-blend-difference" />
            
            <div className="space-y-6">
                <Card className="glass-card" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#ECEAE3' }}>Text Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="SOS HELLO WORLD..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg uppercase font-mono"
                            style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}
                        />
                        <div className="flex gap-2">
                             <Button
                                onClick={playMorse}
                                className="flex-1 gap-2"
                                disabled={!morse}
                                style={isPlaying
                                    ? { backgroundColor: '#0c0824', border: '1px solid #4a3f7a', color: '#ff8a8a' }
                                    : { backgroundColor: '#b388ff', color: '#160e33' }}
                            >
                                {isPlaying ? <Square className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
                                {isPlaying ? "Stop Signal" : "Play Signal"}
                            </Button>
                             <Button
                                onClick={() => setIsFlashlight(!isFlashlight)}
                                className="flex-initial gap-2"
                                title="Toggle Screen Flash"
                                style={isFlashlight
                                    ? { backgroundColor: '#b388ff', color: '#160e33' }
                                    : { backgroundColor: '#241a52', border: '1px solid #4a3f7a', color: '#ECEAE3' }}
                            >
                                <Flashlight className="w-4 h-4" style={{ color: isFlashlight ? '#160e33' : '#b3aae0' }} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#ECEAE3' }}>Morse Output</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-1 content-start p-6 rounded-xl border min-h-[300px] font-mono text-2xl tracking-widest leading-loose" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                            {morse.split('').map((char, i) => (
                                <span
                                    key={i}
                                    className="transition-colors duration-100 ease-linear rounded px-0.5"
                                    style={activeChar === i
                                        ? { backgroundColor: '#b388ff', color: '#160e33' }
                                        : { color: '#b388ff' }}
                                >
                                    {char}
                                </span>
                            ))}
                            {!morse && <span className="italic text-base" style={{ color: '#b3aae0' }}>... --- ...</span>}
                        </div>
                    </CardContent>
                     <div className="p-6 pt-0">
                         <ShareResult 
                            title="Morse Code 📡"
                            text={`... --- ... I sent a Morse Code message: "${text}"`}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
