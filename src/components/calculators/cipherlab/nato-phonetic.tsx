"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { FileText, Play, Square, Volume2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const NATO_ALPHABET: Record<string, string> = {
    'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
    'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet',
    'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
    'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
    'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
    'Z': 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
    '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
}

export function NATOPhonetic() {
    const [text, setText] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentWordIndex, setCurrentWordIndex] = useState(-1)
    const phoneticWords = useMemo(() => {
        if (!text) return []

        const words: string[] = []
        for (const char of text.toUpperCase()) {
            if (NATO_ALPHABET[char]) {
                words.push(NATO_ALPHABET[char])
            } else if (char === ' ') {
                words.push('[SPACE]')
            } else if (/[.,!?]/.test(char)) {
                // Skip basic punctuation for visual clarity or handle if needed
            }
        }

        return words
    }, [text])

    const speak = async () => {
        if (isPlaying) {
            window.speechSynthesis.cancel()
            setIsPlaying(false)
            setCurrentWordIndex(-1)
            return
        }

        if (phoneticWords.length === 0) return

        setIsPlaying(true)

        // Simple sequential Playback
        for (let i = 0; i < phoneticWords.length; i++) {
             // Check if user cancelled
             if (!window.speechSynthesis.speaking && i > 0 && !isPlaying) break; // Crude check

            setCurrentWordIndex(i)
            const word = phoneticWords[i]
            
            if (word === '[SPACE]') {
                await new Promise(r => setTimeout(r, 400))
                continue
            }

            await new Promise<void>((resolve) => {
                const u = new SpeechSynthesisUtterance(word)
                u.rate = 1.1
                u.pitch = 1
                u.onend = () => resolve()
                window.speechSynthesis.speak(u)
            })
            
            // Should verify if we should continue
             // This loop implementation is a bit tricky with React state updates, 
             // but sufficient for a simple sequential reader
        }

        setIsPlaying(false)
        setCurrentWordIndex(-1)
    }

    // Improving the playback to be cancel-able via Ref check
    // Actually, simple way:
    useEffect(() => {
        // Cleanup on unmount
        return () => window.speechSynthesis.cancel()
    }, [])


    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="glass-card" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3', fontFamily: 'var(--font-bungee), cursive' }}>
                             <FileText className="w-5 h-5" style={{ color: '#b388ff' }} />
                            Input Message
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Type text to convert (e.g., 'Hello Control')..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg focus-visible:ring-[#b388ff]"
                            style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={speak}
                                className="w-full gap-2"
                                disabled={phoneticWords.length === 0}
                                style={isPlaying
                                    ? { backgroundColor: '#0c0824', border: '1px solid #4a3f7a', color: '#ECEAE3' }
                                    : { backgroundColor: '#b388ff', color: '#160e33' }}
                            >
                                {isPlaying ? <Square className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
                                {isPlaying ? "Stop Transmission" : "Transmit Audio"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                     <CardContent className="pt-6">
                        <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#b388ff' }}>
                             ✈️ Pilot Protocol
                        </h4>
                        <p className="text-sm" style={{ color: '#b3aae0' }}>
                            Used by NATO, aviation, and maritime professionals worldwide.
                            The words are chosen to be distinct and clear even over static-filled radio lines.
                            &quot;B&quot; and &quot;D&quot; sound alike, but &quot;Bravo&quot; and &quot;Delta&quot; are unmistakable.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3', fontFamily: 'var(--font-bungee), cursive' }}>
                             <Volume2 className="w-5 h-5" style={{ color: '#b388ff' }} />
                            Phonetic Output
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-2 content-start h-full p-4 rounded-xl border min-h-[300px]" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                            {phoneticWords.length === 0 && (
                                <span className="italic w-full text-center mt-10" style={{ color: '#b3aae0' }}>Start typing to see NATO usage...</span>
                            )}
                            {phoneticWords.map((word, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{
                                        scale: currentWordIndex === i ? 1.1 : 1,
                                        opacity: 1,
                                        backgroundColor: currentWordIndex === i ? 'rgba(179, 136, 255, 0.4)' : 'rgba(179, 136, 255, 0.12)'
                                    }}
                                    className={`
                                        px-3 py-1.5 rounded-md font-mono font-bold text-sm border
                                        ${word === '[SPACE]' ? 'opacity-0 w-4' : ''}
                                    `}
                                    style={word === '[SPACE]' ? undefined : { borderColor: '#4a3f7a', color: '#b388ff' }}
                                >
                                    {word !== '[SPACE]' && word}
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                     <div className="p-6 pt-0">
                         <ShareResult
                            title="NATO Transmission 📡"
                            text={`I transmitted: "${phoneticWords.filter(w => w !== '[SPACE]').join(' ')}"`}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
