"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartPulse, Shield, Sword } from "lucide-react"
import { useEffect, useState } from "react"

export function SpaceMarineSurvivalCalculator() {
    const [benchPress, setBenchPress] = useState(135) // lbs
    const [sprintTime, setSprintTime] = useState(15) // seconds (100m)
    const [painTolerance, setPainTolerance] = useState(5) // 1-10

    const [opponent, setOpponent] = useState<"ork" | "tyranid" | "chaos">("ork")
    const [survivalTime, setSurvivalTime] = useState(0)
    const [deathCause, setDeathCause] = useState("")

    useEffect(() => {
        calculate()
    }, [benchPress, sprintTime, painTolerance, opponent])

    const calculate = () => {
        // Base score: Strength + Speed (inverse) + Pain
        // 100m sprint: 10s is elite. 20s is slow.
        const speedScore = Math.max(0, 25 - sprintTime) * 3
        const strengthScore = benchPress / 5
        const toughnessScore = painTolerance * 10
        
        const totalCombatScore = speedScore + strengthScore + toughnessScore

        let enemyDifficulty = 100
        let cause = ""

        if (opponent === "ork") {
            enemyDifficulty = 150
            cause = "Choppa to the face"
        } else if (opponent === "tyranid") {
            enemyDifficulty = 200
            cause = "Bio-acid digestion"
        } else {
            enemyDifficulty = 500 // Chaos Space Marine
            cause = "Plasma pistol disintegration"
        }

        // Survival time in seconds
        let survive = (totalCombatScore / enemyDifficulty) * 10 
        
        // Random grit factor
        if (painTolerance > 8) survive *= 1.5

        setSurvivalTime(Math.max(0.5, survive)) // Minimum 0.5s
        setDeathCause(cause)
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Sword className="w-5 h-5 text-primary" />
                        Combat Stats
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Bench Press (lbs)</Label>
                        <Slider value={[benchPress]} onValueChange={(v) => setBenchPress(v[0])} min={45} max={500} step={5} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{benchPress} lbs</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">100m Sprint (sec)</Label>
                        <Slider value={[sprintTime]} onValueChange={(v) => setSprintTime(v[0])} min={9} max={30} step={0.1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{sprintTime}s</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Pain Tolerance (1-10)</Label>
                        <Slider value={[painTolerance]} onValueChange={(v) => setPainTolerance(v[0])} min={1} max={10} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">Level {painTolerance}</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Opponent</Label>
                        <Tabs defaultValue="ork" onValueChange={(v) => setOpponent(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                <TabsTrigger value="ork">Ork Boy</TabsTrigger>
                                <TabsTrigger value="tyranid">Gaunt</TabsTrigger>
                                <TabsTrigger value="chaos">Chaos</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden glass-card border-none bg-gradient-to-br from-slate-900 to-slate-950 p-1">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-emerald-900" />
                    
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                                    Life Expectancy
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                        {survivalTime.toFixed(2)}s
                                    </h3>
                                    <p className="text-slate-400 font-medium italic">
                                        "Only in death does duty end."
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-2">
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl min-w-[200px]">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Cause of Death</div>
                                <div className="text-xl font-bold text-red-500 max-w-[150px] mx-auto leading-tight">
                                    {deathCause}
                                </div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult 
                                title="Combat Survival Index"
                                text={`I would survive exactly ${survivalTime.toFixed(2)} seconds against a ${opponent} before dying to ${deathCause}. Calculate your odds on Docket One.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-2xl shadow-emerald-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                     <Card className="glass-card border-white/5">
                        <CardHeader><CardTitle className="text-lg font-bold">Augmentation Status</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase opacity-60">Gene-Seed Compatibility</span>
                                    <span className="font-bold text-yellow-500">0.00% (Baseline Human)</span>
                                </div>
                                <HeartPulse className="w-8 h-8 opacity-20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5">
                        <CardHeader><CardTitle className="text-lg font-bold">Tactical Advice</CardTitle></CardHeader>
                        <CardContent>
                             <Alert className="bg-white/5 border-white/10">
                                <Shield className="h-4 w-4 text-primary" />
                                <AlertTitle>Guidance</AlertTitle>
                                <AlertDescription className="text-xs opacity-70">
                                    Fix bayonets. Die standing. Do not ask for mercy, for the alien has none to give.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
