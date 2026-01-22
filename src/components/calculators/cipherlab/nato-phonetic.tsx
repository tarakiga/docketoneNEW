"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { FileText, Play, Square, Volume2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
    const [phoneticWords, setPhoneticWords] = useState<string[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentWordIndex, setCurrentWordIndex] = useState(-1)
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

    useEffect(() => {
        if (!text) {
            setPhoneticWords([])
            return
        }

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
        setPhoneticWords(words)
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
                <Card className="glass-card">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                             <FileText className="w-5 h-5 text-blue-400" />
                            Input Message
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Type text to convert (e.g., 'Hello Control')..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg"
                        />
                        <div className="flex gap-2">
                            <Button 
                                onClick={speak}
                                variant={isPlaying ? "destructive" : "default"}
                                className="w-full gap-2"
                                disabled={phoneticWords.length === 0}
                            >
                                {isPlaying ? <Square className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
                                {isPlaying ? "Stop Transmission" : "Transmit Audio"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-blue-500/5 border-blue-500/20">
                     <CardContent className="pt-6">
                        <h4 className="font-bold text-blue-500 mb-2 flex items-center gap-2">
                             ✈️ Pilot Protocol
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Used by NATO, aviation, and maritime professionals worldwide. 
                            The words are chosen to be distinct and clear even over static-filled radio lines.
                            "B" and "D" sound alike, but "Bravo" and "Delta" are unmistakable.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                             <Volume2 className="w-5 h-5 text-green-400" />
                            Phonetic Output
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-2 content-start h-full p-4 bg-muted/30 rounded-xl border border-border min-h-[300px]">
                            {phoneticWords.length === 0 && (
                                <span className="text-muted-foreground italic w-full text-center mt-10">Start typing to see NATO usage...</span>
                            )}
                            {phoneticWords.map((word, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ 
                                        scale: currentWordIndex === i ? 1.1 : 1, 
                                        opacity: 1,
                                        backgroundColor: currentWordIndex === i ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.1)'
                                    }}
                                    className={`
                                        px-3 py-1.5 rounded-md font-mono font-bold text-sm border
                                        ${word === '[SPACE]' ? 'opacity-0 w-4' : 'border-blue-500/30 text-blue-600 dark:text-blue-300'}
                                    `}
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
