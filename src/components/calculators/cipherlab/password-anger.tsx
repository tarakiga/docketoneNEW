"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useState } from "react"

export function PasswordAnger() {
    const [password, setPassword] = useState("")
    
    // Analysis
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const isLong = password.length >= 12
    const isVeryLong = password.length >= 16

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLong, isVeryLong].filter(Boolean).length

    // Sarcastic / "Anger" feedback
    // The "Hacker Anger" increases as the password gets stronger.
    // Weak password = Happy Hacker (Low Anger)
    // Strong password = Angry Hacker (High Anger)
    
    const getAngerLevel = () => {
        if (password.length === 0) return { level: 0, text: "Waiting...", emoji: "😐", color: "#b3aae0" }
        if (score < 2) return { level: 10, text: "Hacker is Laughing at you", emoji: "🤣", color: "#ff8a8a" }
        if (score < 4) return { level: 40, text: "Hacker is Mildly Annoyed", emoji: "🙄", color: "#ffd23c" }
        if (score < 6) return { level: 80, text: "Hacker is Frustrated", emoji: "😤", color: "#ffd23c" }
        return { level: 100, text: "Hacker is Furious!", emoji: "🤬", color: "#86efac" } // Green because it's good for YOU
    }

    const feedback = getAngerLevel()

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="glass-card" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#ECEAE3' }}>Password Strength Test</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <Input
                                type="password" // or text for visibility? Let's use text to see it, it's a demo tool
                                placeholder="Type a password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-lg font-mono focus-visible:ring-[#b388ff] focus-visible:border-[#b388ff]"
                                style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}
                             />
                             <p className="text-xs" style={{ color: '#b3aae0' }}>
                                Don&apos;t use your real banking password here, obviously.
                             </p>
                        </div>

                        <div className="space-y-2">
                             <div className="flex justify-between text-sm" style={{ color: '#ECEAE3' }}>
                                <span>Hacker Anger Level</span>
                                <span className="font-bold">{feedback.level}%</span>
                             </div>
                             <Progress value={feedback.level} className="h-4" style={{ backgroundColor: '#0c0824' }} indicatorClassName={
                                 feedback.level < 30 ? "bg-[#ff8a8a]" :
                                 feedback.level < 70 ? "bg-[#ffd23c]" :
                                 "bg-[#86efac]"
                             } />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                             <div className="flex items-center gap-2" style={{ color: hasLower ? '#86efac' : '#b3aae0' }}>
                                {hasLower ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Lowercase
                             </div>
                             <div className="flex items-center gap-2" style={{ color: hasUpper ? '#86efac' : '#b3aae0' }}>
                                {hasUpper ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Uppercase
                             </div>
                             <div className="flex items-center gap-2" style={{ color: hasNumber ? '#86efac' : '#b3aae0' }}>
                                {hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Numbers
                             </div>
                             <div className="flex items-center gap-2" style={{ color: hasSpecial ? '#86efac' : '#b3aae0' }}>
                                {hasSpecial ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Symbols
                             </div>
                             <div className="flex items-center gap-2" style={{ color: isLong ? '#86efac' : '#b3aae0' }}>
                                {isLong ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} 12+ Chars
                             </div>
                             <div className="flex items-center gap-2" style={{ color: isVeryLong ? '#86efac' : '#b3aae0' }}>
                                {isVeryLong ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} 16+ Chars
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col justify-center items-center text-center p-8" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={feedback.text}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-6"
                         >
                             <div className="text-9xl mb-4 filter drop-shadow-lg">
                                 {feedback.emoji}
                             </div>
                             <div>
                                 <h3 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-bungee), cursive', color: feedback.color }}>
                                     {feedback.text}
                                 </h3>
                                 <p className="mt-2 max-w-xs mx-auto" style={{ color: '#b3aae0' }}>
                                     {feedback.level < 50 
                                        ? "This password would take approximately 3 milliseconds to crack." 
                                        : "This password would make a hacker flip their desk."}
                                 </p>
                             </div>
                         </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 w-full max-w-sm">
                         <ShareResult 
                            title="Hacker Anger Level 🤬"
                            text={`I generated a password that makes hackers ${feedback.level}% angry! ${feedback.emoji} Check yours at Docket One.`}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
