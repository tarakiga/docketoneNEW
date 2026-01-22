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
    const strengthPercent = (score / 6) * 100

    // Sarcastic / "Anger" feedback
    // The "Hacker Anger" increases as the password gets stronger.
    // Weak password = Happy Hacker (Low Anger)
    // Strong password = Angry Hacker (High Anger)
    
    const getAngerLevel = () => {
        if (password.length === 0) return { level: 0, text: "Waiting...", emoji: "😐", color: "text-muted-foreground" }
        if (score < 2) return { level: 10, text: "Hacker is Laughing at you", emoji: "🤣", color: "text-red-500" }
        if (score < 4) return { level: 40, text: "Hacker is Mildly Annoyed", emoji: "🙄", color: "text-orange-500" }
        if (score < 6) return { level: 80, text: "Hacker is Frustrated", emoji: "😤", color: "text-yellow-500" }
        return { level: 100, text: "Hacker is Furious!", emoji: "🤬", color: "text-green-500" } // Green because it's good for YOU
    }

    const feedback = getAngerLevel()

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Password Strength Test</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <Input 
                                type="password" // or text for visibility? Let's use text to see it, it's a demo tool
                                placeholder="Type a password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-lg font-mono"
                             />
                             <p className="text-xs text-muted-foreground">
                                Don't use your real banking password here, obviously.
                             </p>
                        </div>
                        
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm">
                                <span>Hacker Anger Level</span>
                                <span className="font-bold">{feedback.level}%</span>
                             </div>
                             <Progress value={feedback.level} className="h-4" indicatorClassName={
                                 feedback.level < 30 ? "bg-red-500" :
                                 feedback.level < 70 ? "bg-orange-500" :
                                 "bg-green-600"
                             } />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                             <div className={`flex items-center gap-2 ${hasLower ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {hasLower ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Lowercase
                             </div>
                             <div className={`flex items-center gap-2 ${hasUpper ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {hasUpper ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Uppercase
                             </div>
                             <div className={`flex items-center gap-2 ${hasNumber ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Numbers
                             </div>
                             <div className={`flex items-center gap-2 ${hasSpecial ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {hasSpecial ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Symbols
                             </div>
                             <div className={`flex items-center gap-2 ${isLong ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {isLong ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} 12+ Chars
                             </div>
                             <div className={`flex items-center gap-2 ${isVeryLong ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {isVeryLong ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} 16+ Chars
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-background to-secondary/20">
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
                                 <h3 className={`text-3xl font-extrabold ${feedback.color}`}>
                                     {feedback.text}
                                 </h3>
                                 <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
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
