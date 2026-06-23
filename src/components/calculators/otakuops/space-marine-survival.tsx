"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartPulse, Shield, Sword } from "lucide-react"
import { useMemo, useState } from "react"

export function SpaceMarineSurvivalCalculator() {
    const [benchPress, setBenchPress] = useState(135) // lbs
    const [sprintTime, setSprintTime] = useState(15) // seconds (100m)
    const [painTolerance, setPainTolerance] = useState(5) // 1-10

    const [opponent, setOpponent] = useState<"ork" | "tyranid" | "chaos">("ork")
    const { survivalTime, deathCause } = useMemo(() => {
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

        return {
            survivalTime: Math.max(0.5, survive),
            deathCause: cause,
        }
    }, [benchPress, sprintTime, painTolerance, opponent])

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a" }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a", color: "#ffd23c" }}>
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: "#ECEAE3" }}>
                        <Sword className="w-5 h-5" style={{ color: "#ffd23c" }} />
                        Combat Stats
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b3aae0" }}>Bench Press (lbs)</Label>
                        <Slider value={[benchPress]} onValueChange={(v) => setBenchPress(v[0])} min={45} max={500} step={5} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: "#ffd23c" }}>{benchPress} lbs</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b3aae0" }}>100m Sprint (sec)</Label>
                        <Slider value={[sprintTime]} onValueChange={(v) => setSprintTime(v[0])} min={9} max={30} step={0.1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: "#ffd23c" }}>{sprintTime}s</div>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b3aae0" }}>Pain Tolerance (1-10)</Label>
                        <Slider value={[painTolerance]} onValueChange={(v) => setPainTolerance(v[0])} min={1} max={10} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: "#ffd23c" }}>Level {painTolerance}</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b3aae0" }}>Opponent</Label>
                        <Tabs defaultValue="ork" onValueChange={(v) => setOpponent(v as "ork" | "tyranid" | "chaos")} className="w-full">
                            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: "#0c0824" }}>
                                <TabsTrigger value="ork" className="border data-[state=inactive]:text-[#b3aae0] data-[state=inactive]:bg-[#241a52] data-[state=inactive]:border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33] data-[state=active]:border-[#ffd23c]">Ork Boy</TabsTrigger>
                                <TabsTrigger value="tyranid" className="border data-[state=inactive]:text-[#b3aae0] data-[state=inactive]:bg-[#241a52] data-[state=inactive]:border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33] data-[state=active]:border-[#ffd23c]">Gaunt</TabsTrigger>
                                <TabsTrigger value="chaos" className="border data-[state=inactive]:text-[#b3aae0] data-[state=inactive]:bg-[#241a52] data-[state=inactive]:border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33] data-[state=active]:border-[#ffd23c]">Chaos</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden border-none p-1" style={{ backgroundColor: "#0c0824" }}>
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a", color: "#b3aae0" }}>
                                    Life Expectancy
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: "var(--font-bungee), cursive", color: "#ffd23c" }}>
                                        {survivalTime.toFixed(2)}s
                                    </h3>
                                    <p className="font-medium italic" style={{ color: "#b3aae0" }}>
                                        &quot;Only in death does duty end.&quot;
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider mt-2" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a", color: "#ffd23c" }}>
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>

                            <div className="text-center p-8 rounded-3xl border min-w-[200px]" style={{ backgroundColor: "#241a52", borderColor: "#4a3f7a" }}>
                                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#b3aae0" }}>Cause of Death</div>
                                <div className="text-xl font-bold max-w-[150px] mx-auto leading-tight" style={{ color: "#ff8a8a" }}>
                                    {deathCause}
                                </div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                            <ShareResult
                                title="Combat Survival Index"
                                text={`I would survive exactly ${survivalTime.toFixed(2)} seconds against a ${opponent} before dying to ${deathCause}. Calculate your odds on Docket One.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none !bg-[#ffd23c] hover:!bg-[#ffd23c]/90 !text-[#160e33]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                     <Card style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a" }}>
                        <CardHeader><CardTitle className="text-lg font-bold" style={{ color: "#ECEAE3" }}>Augmentation Status</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: "#241a52" }}>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase" style={{ color: "#b3aae0" }}>Gene-Seed Compatibility</span>
                                    <span className="font-bold" style={{ color: "#ffd23c" }}>0.00% (Baseline Human)</span>
                                </div>
                                <HeartPulse className="w-8 h-8" style={{ color: "#4a3f7a" }} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: "#1d1442", borderColor: "#4a3f7a" }}>
                        <CardHeader><CardTitle className="text-lg font-bold" style={{ color: "#ECEAE3" }}>Tactical Advice</CardTitle></CardHeader>
                        <CardContent>
                             <Alert style={{ backgroundColor: "#0c0824", borderColor: "#4a3f7a" }}>
                                <Shield className="h-4 w-4" style={{ color: "#ffd23c" }} />
                                <AlertTitle style={{ color: "#ECEAE3" }}>Guidance</AlertTitle>
                                <AlertDescription className="text-xs" style={{ color: "#b3aae0" }}>
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
