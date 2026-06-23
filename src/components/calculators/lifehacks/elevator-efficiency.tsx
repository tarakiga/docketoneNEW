"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowUpFromLine, Footprints, Timer, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"

export function ElevatorDilemmaCalculator() {
    const [floors, setFloors] = useState(3)
    const [crowdLevel, setCrowdLevel] = useState<"empty" | "normal" | "busy">("normal")
    const [fitness, setFitness] = useState(5) // 1-10

    const { stairsTime, elevatorTime, calories, stops, decision, decisionColor } = useMemo(() => {
        // Guard against bad inputs (divide-by-zero / NaN).
        const safeFloors = Math.max(1, Math.floor(floors) || 1)
        const safeFitness = Math.min(10, Math.max(1, Math.floor(fitness) || 1))

        // --- Stairs ---
        // ~4s/floor centred, adjusted by fitness. fitness 1 -> 5.2s, 10 -> 2.5s.
        // Clamped to a believable 2.5-6s/floor band.
        const stairSecPerFloor = Math.min(6, Math.max(2.5, 5.5 - safeFitness * 0.3))
        const totalStairsTime = safeFloors * stairSecPerFloor

        // --- Calories (~2 cal/floor, matching the copy's ~0.17 cal/step x 12 steps) ---
        const totalCalories = safeFloors * 2

        // --- Elevator ---
        // Base call wait (scales slightly with crowd) + 2.5s/floor of travel
        // + a fixed 10s penalty per stop. The per-stop penalty is the dominant term.
        let waitTime: number
        let stopCount: number
        if (crowdLevel === "empty") {
            waitTime = 8
            stopCount = 0
        } else if (crowdLevel === "normal") {
            waitTime = 15
            // 1-2 intermediate stops, more likely on longer trips.
            stopCount = 1 + (safeFloors >= 5 ? 1 : 0)
        } else {
            waitTime = 25
            // 3-5 intermediate stops, scaling with trip length.
            stopCount = Math.min(5, 3 + Math.floor(safeFloors / 6))
        }

        const PER_STOP_PENALTY = 10
        const totalElevatorTime = waitTime + safeFloors * 2.5 + stopCount * PER_STOP_PENALTY

        let decision: string
        let decisionColor: string
        if (totalStairsTime < totalElevatorTime - 15) {
            decision = "TAKE THE STAIRS"
            decisionColor = "text-[#86efac]"
        } else if (totalStairsTime <= totalElevatorTime + 15) {
            decision = "TOO CLOSE TO CALL"
            decisionColor = "text-[#ffd23c]"
        } else {
            decision = "WAIT FOR LIFT"
            decisionColor = "text-[#b6ff3c]"
        }

        return {
            stairsTime: totalStairsTime,
            elevatorTime: totalElevatorTime,
            calories: totalCalories,
            stops: stopCount,
            decision,
            decisionColor,
        }
    }, [floors, crowdLevel, fitness])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        if (m > 0) return `${m}m ${s}s`
        return `${s}s`
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit bg-[#1d1442] border-[#4a3f7a]">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-[#241a52] border border-[#b6ff3c] text-[10px] font-bold text-[#b6ff3c] uppercase tracking-widest">
                            Optimization
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2 text-[#ECEAE3]">
                        <ArrowUpFromLine className="w-5 h-5 text-[#b6ff3c]" />
                        Variables
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#b3aae0]">Floors to Travel</Label>
                        <Slider value={[floors]} onValueChange={(v) => setFloors(v[0])} min={1} max={50} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-[#b6ff3c] font-bold">{floors} Floors</div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#b3aae0]">Elevator Traffic</Label>
                        <RadioGroup defaultValue="normal" onValueChange={(v) => setCrowdLevel(v as "empty" | "normal" | "busy")} className="grid grid-cols-3 gap-2">
                            <div>
                                <RadioGroupItem value="empty" id="empty" className="peer sr-only" />
                                <Label htmlFor="empty" className="flex flex-col items-center justify-between rounded-md border-2 border-[#4a3f7a] bg-[#0c0824] p-2 text-[#ECEAE3] hover:bg-[#241a52] peer-data-[state=checked]:border-[#b6ff3c] [&:has([data-state=checked])]:border-[#b6ff3c] cursor-pointer text-center h-full">
                                    <span className="text-lg mb-1">👻</span>
                                    <span className="text-[10px] font-bold">Empty</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="normal" id="normal" className="peer sr-only" />
                                <Label htmlFor="normal" className="flex flex-col items-center justify-between rounded-md border-2 border-[#4a3f7a] bg-[#0c0824] p-2 text-[#ECEAE3] hover:bg-[#241a52] peer-data-[state=checked]:border-[#b6ff3c] [&:has([data-state=checked])]:border-[#b6ff3c] cursor-pointer text-center h-full">
                                    <span className="text-lg mb-1">👥</span>
                                    <span className="text-[10px] font-bold">Normal</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="busy" id="busy" className="peer sr-only" />
                                <Label htmlFor="busy" className="flex flex-col items-center justify-between rounded-md border-2 border-[#4a3f7a] bg-[#0c0824] p-2 text-[#ECEAE3] hover:bg-[#241a52] peer-data-[state=checked]:border-[#b6ff3c] [&:has([data-state=checked])]:border-[#b6ff3c] cursor-pointer text-center h-full">
                                    <span className="text-lg mb-1">🏢</span>
                                    <span className="text-[10px] font-bold">Packed</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                         <Label className="text-xs font-bold uppercase tracking-wider text-[#b3aae0]">Your Stair Fitness</Label>
                         <Slider value={[fitness]} onValueChange={(v) => setFitness(v[0])} min={1} max={10} step={1} className="py-4" />
                         <div className="flex justify-between text-[10px] text-[#b3aae0] uppercase font-bold">
                             <span>Winded Easily</span>
                             <span>Iron Legs</span>
                         </div>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-none bg-[#1d1442] p-1">
                    <CardContent className="pt-12 pb-16 text-center">
                        <div className="text-[10px] uppercase text-[#b3aae0] tracking-widest mb-2">Verdict</div>
                        <div
                            className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 px-2 break-words ${decisionColor}`}
                            style={{ fontFamily: 'var(--font-bungee), cursive' }}
                        >
                            {decision}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <div className="p-6 bg-[#0c0824] rounded-2xl border border-[#4a3f7a] relative overflow-hidden group">
                                <div className="relative">
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#b3aae0] mb-2 flex items-center justify-center gap-2">
                                        <Timer className="w-3 h-3" />
                                        Elevator Time
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[#ECEAE3]">{formatTime(elevatorTime)}</div>
                                    <div className="text-[10px] text-[#b3aae0] mt-1">Wait + {stops} stop{stops === 1 ? "" : "s"}</div>
                                </div>
                            </div>

                            <div className="p-6 bg-[#0c0824] rounded-2xl border border-[#4a3f7a] relative overflow-hidden group">
                                <div className="relative">
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#b3aae0] mb-2 flex items-center justify-center gap-2">
                                        <Footprints className="w-3 h-3" />
                                        Stairs Time
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-[#ECEAE3]">{formatTime(stairsTime)}</div>
                                    <div className="text-[10px] text-[#b3aae0] mt-1">Consistent pace</div>
                                </div>
                            </div>
                        </div>

                         <div className="mt-6 flex flex-col items-center">
                             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#241a52] border border-[#4a3f7a]">
                                 <TrendingUp className="w-4 h-4 text-[#b6ff3c]" />
                                 <span className="text-sm font-bold text-[#b6ff3c]">
                                     Burn {calories.toFixed(0)} calories taking the stairs
                                 </span>
                             </div>
                         </div>
                    </CardContent>
                </Card>

                 <div className="px-4">
                    <ShareResult 
                        title="Elevator Dilemma"
                        text={`I save ${Math.abs(elevatorTime - stairsTime).toFixed(0)} seconds by ${stairsTime < elevatorTime ? 'taking the stairs' : 'waiting for the elevator'} for ${floors} floors (stairs ${formatTime(stairsTime)} vs elevator ${formatTime(elevatorTime)}). Decision: ${decision}.`}
                        className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-[#b6ff3c] text-[#160e33] hover:bg-[#a3e835] border-none"
                    />
                </div>
            </div>
        </div>
    )
}
