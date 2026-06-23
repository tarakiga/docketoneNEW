"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Briefcase, Film, Globe, Music, Smartphone, Wallet } from "lucide-react"
import { useState } from "react"

type Generation = {
    name: string
    range: string
    start: number
    end: number
    color: string
    icon: string
    description: string
    cultural: {
        music: string
        film: string
        tech: string
        events: string
    }
    workStyle: string
    financial: string
}

const GENERATIONS: Generation[] = [
    {
        name: "Generation Alpha",
        range: "2013 - Present",
        start: 2013,
        end: 9999, // open-ended: the input guard caps entries at the current year
        color: "from-purple-500 to-pink-500",
        icon: "🤖",
        description: "The first generation born entirely within the 21st century. Raised with AI, tablets, and constant connectivity.",
        cultural: {
            music: "Viral TikTok Sounds, AI-Gen Pop",
            film: "Interactive Streaming, YouTube Shorts",
            tech: "AI Assistants, iPads, VR",
            events: "Global Pandemic, Climate Crisis"
        },
        workStyle: "Digital Natives x 10. Likely to prefer remote/async work and gig economy.",
        financial: "Digital currency natives. Use Roblox 'Robux' as first currency.",
    },
    {
        name: "Generation Z",
        range: "1997 - 2012",
        start: 1997,
        end: 2012,
        color: "from-blue-500 to-purple-500",
        icon: "📱",
        description: "Digital natives who prioritize authenticity, social justice, and pragmatic financial planning.",
        cultural: {
            music: "Streaming, Billie Eilish, K-Pop",
            film: "Marvel MCU, Euphoria, Twitch",
            tech: "Smartphone-first, Social Media",
            events: "2008 Recession, COVID-19"
        },
        workStyle: "Value flexibility, purpose, and mental health. Skeptical of corporate loyalty.",
        financial: "Risk-averse but crypto-curious. Early investors.",
    },
    {
        name: "Millennials",
        range: "1981 - 1996",
        start: 1981,
        end: 1996,
        color: "from-cyan-500 to-blue-500",
        icon: "🥑",
        description: "The bridge between analog and digital. Value experiences over possessions and pioneered the gig economy.",
        cultural: {
            music: "Pop Punk, Hip Hop, Beyoncé",
            film: "Harry Potter, The Office",
            tech: "The Internet, MySpace/Facebook",
            events: "9/11, The Great Recession"
        },
        workStyle: "Collaborative and feedback-hungry. Seek work-life integration.",
        financial: "Burdened by student debt but high earners in tech sectors.",
    },
    {
        name: "Generation X",
        range: "1965 - 1980",
        start: 1965,
        end: 1980,
        color: "from-emerald-500 to-cyan-500",
        icon: "📼",
        description: "The 'Latchkey Generation'. Independent, cynical, and adaptable. Skeptical of authority.",
        cultural: {
            music: "Grunge, Nirvana, Tupac",
            film: "John Hughes Movies, Star Wars",
            tech: "MTV, Personal Computers",
            events: "End of Cold War, Dot-com Bubble"
        },
        workStyle: "Self-reliant and direct. 'Work hard, play hard'.",
        financial: "High earning years, focused on retirement catch-up.",
    },
    {
        name: "Baby Boomers",
        range: "1946 - 1964",
        start: 1946,
        end: 1964,
        color: "from-amber-500 to-orange-500",
        icon: "☮️",
        description: "Defined by post-war optimism and civil rights movements. Value visibility and structured success.",
        cultural: {
            music: "Rock n Roll, The Beatles, Woodstock",
            film: "Golden Age of Hollywood",
            tech: "Television, Moon Landing",
            events: "Vietnam War, Civil Rights Movement"
        },
        workStyle: "Optimistic and team-oriented. Value face-time and loyalty.",
        financial: "Hold majority of wealth. Traditional pensions and real estate.",
    },
    {
        name: "Silent Generation",
        range: "1928 - 1945",
        start: 1928,
        end: 1945,
        color: "from-gray-500 to-slate-500",
        icon: "📻",
        description: "Traditionalists who grew up during hard times. Value duty, honor, and sacrifice.",
        cultural: {
            music: "Jazz, Swing, Frank Sinatra",
            film: "Technicolor, Casablanca",
            tech: "Radio, Automobiles",
            events: "World War II, Korean War"
        },
        workStyle: "Disciplined and loyal. Respect authority.",
        financial: "Frugal and conservative. 'Save for a rainy day'.",
    },
    {
        name: "Greatest Generation",
        range: "1901 - 1927",
        start: 1901,
        end: 1927,
        color: "from-stone-500 to-zinc-600",
        icon: "🎖️",
        description: "The 'G.I. Generation' who came of age during the Great Depression and went on to fight World War II. Defined by grit, sacrifice, and civic duty.",
        cultural: {
            music: "Big Band, Swing, Jazz",
            film: "Silent Films, Early Talkies",
            tech: "Radio, Telephone, Early Flight",
            events: "Great Depression, World War II"
        },
        workStyle: "Hardworking and loyal. Built the institutions and infrastructure of the modern era.",
        financial: "Extremely frugal, shaped by the Depression. 'Waste not, want not'.",
    }
]

export function GenerationalTimelineCalculator() {
    const [birthYear, setBirthYear] = useState<string>("")
    const [result, setResult] = useState<Generation | null>(null)
    const [age, setAge] = useState<number>(0)
    const [notice, setNotice] = useState<string>("")

    const calculate = () => {
        const currentYear = new Date().getFullYear()
        const year = parseInt(birthYear, 10)

        if (!year || Number.isNaN(year)) {
            setResult(null); setNotice("Please enter a valid 4-digit birth year."); return
        }
        if (year < 1901) {
            setResult(null); setNotice("Our timeline starts in 1901 (the Greatest Generation). Try a later year."); return
        }
        if (year > currentYear) {
            setResult(null); setNotice(`That year is in the future. Try ${currentYear} or earlier.`); return
        }

        const gen = GENERATIONS.find(g => year >= g.start && year <= g.end)
        if (gen) {
            setResult(gen)
            setAge(currentYear - year)
            setNotice("")
        } else {
            setResult(null)
            setNotice("Hmm, we couldn't place that year. Double-check it and try again.")
        }
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <CardTitle style={{ color: '#ECEAE3' }}>Find Your Place in History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label style={{ color: '#b3aae0' }}>Enter Birth Year</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 1990"
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && calculate()}
                            style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', color: '#ECEAE3' }}
                        />
                    </div>
                    <Button onClick={calculate} className="w-full hover:opacity-90 transition-opacity" style={{ backgroundColor: '#29e0ff', color: '#160e33' }}>
                        Reveal My Generation
                    </Button>
                </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                {result ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                         {/* Hero Result Card */}
                        <Card className={`overflow-hidden border-0 relative shadow-xl`} style={{ backgroundColor: '#1d1442' }}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${result.color} opacity-10 dark:opacity-20`} />
                            <CardContent className="pt-8 relative z-10 text-center space-y-4">
                                <div className="text-6xl mb-2">{result.icon}</div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-bold tracking-tight mb-1" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#29e0ff' }}>
                                        You are {result.name}
                                    </h2>
                                    <p style={{ color: '#b3aae0' }}>Born {birthYear} • Approx {age} years old</p>
                                </div>
                                <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: '#ECEAE3' }}>
                                    {result.description}
                                </p>
                                <div className="pt-6">
                                    <ShareResult 
                                        title={`I am ${result.name}!`}
                                        text={`Born in ${birthYear}, I am part of ${result.name}. ${result.description} Find your generation at Docket One.`}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cultural Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Card className="transition-colors" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                                <CardContent className="pt-6 flex items-start gap-4">
                                     <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300"><Music className="w-5 h-5" /></div>
                                     <div>
                                         <h4 className="font-bold mb-1" style={{ color: '#ECEAE3' }}>Music</h4>
                                         <p className="text-sm" style={{ color: '#b3aae0' }}>{result.cultural.music}</p>
                                     </div>
                                </CardContent>
                            </Card>
                            <Card className="transition-colors" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                                <CardContent className="pt-6 flex items-start gap-4">
                                     <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-300"><Film className="w-5 h-5" /></div>
                                     <div>
                                         <h4 className="font-bold mb-1" style={{ color: '#ECEAE3' }}>Pop Culture</h4>
                                         <p className="text-sm" style={{ color: '#b3aae0' }}>{result.cultural.film}</p>
                                     </div>
                                </CardContent>
                            </Card>
                            <Card className="transition-colors" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                                <CardContent className="pt-6 flex items-start gap-4">
                                     <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300"><Smartphone className="w-5 h-5" /></div>
                                     <div>
                                         <h4 className="font-bold mb-1" style={{ color: '#ECEAE3' }}>Tech</h4>
                                         <p className="text-sm" style={{ color: '#b3aae0' }}>{result.cultural.tech}</p>
                                     </div>
                                </CardContent>
                            </Card>
                            <Card className="transition-colors" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                                <CardContent className="pt-6 flex items-start gap-4">
                                     <div className="p-2 rounded-lg bg-green-500/20 text-green-300"><Globe className="w-5 h-5" /></div>
                                     <div>
                                         <h4 className="font-bold mb-1" style={{ color: '#ECEAE3' }}>Events</h4>
                                         <p className="text-sm" style={{ color: '#b3aae0' }}>{result.cultural.events}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </div>

                         {/* Work & Finance */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium" style={{ color: '#ECEAE3' }}>
                                    <Briefcase className="w-4 h-4" style={{ color: '#29e0ff' }} /> Work Style
                                </div>
                                <p className="text-sm leading-relaxed p-4 rounded-lg" style={{ color: '#b3aae0', backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
                                    {result.workStyle}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium" style={{ color: '#ECEAE3' }}>
                                    <Wallet className="w-4 h-4" style={{ color: '#29e0ff' }} /> Financial Outlook
                                </div>
                                <p className="text-sm leading-relaxed p-4 rounded-lg" style={{ color: '#b3aae0', backgroundColor: '#0c0824', border: '1px solid #4a3f7a' }}>
                                    {result.financial}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl" style={{ borderColor: '#4a3f7a', backgroundColor: '#0c0824' }}>
                        <div className="text-4xl mb-4 opacity-50">{notice ? "🤔" : "🕰️"}</div>
                        <h3 className="text-xl font-medium mb-2" style={{ color: '#ECEAE3' }}>{notice ? "Out of range" : "Waiting for input..."}</h3>
                        <p className="max-w-md" style={{ color: '#b3aae0' }}>
                            {notice || "Enter your birth year to unlock a detailed breakdown of your generational identity and cultural touchstones."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
