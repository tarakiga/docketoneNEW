"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Info, Skull, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

export function ExterminatusCostCalculator() {
    const [population, setPopulation] = useState(10) // Billions
    const [biome, setBiome] = useState<"hive" | "agri" | "forge">("hive")
    const [method, setMethod] = useState<"cyclonic" | "virus" | "orbital">("cyclonic")

    const { cost, torpedoes, gdpYears, chartData } = useMemo(() => {
        let baseCost = 0
        let torpedoCount = 0

        // Base cost calculation (Arbitrary "Throne Gelt" units)
        if (method === "cyclonic") {
            baseCost = 5000000000 // 5 Billion
            torpedoCount = Math.ceil(population * 0.5) + (biome === "forge" ? 50 : 0)
        } else if (method === "virus") {
            baseCost = 2500000000 // 2.5 Billion
            torpedoCount = Math.ceil(population * 0.8)
        } else {
            baseCost = 10000000000 // 10 Billion (Orbital bombardment takes time/fuel)
            torpedoCount = 0 // Not applicable, uses battery fire
        }

        // Biome multipliers
        const biomeMult = biome === "hive" ? 1.5 : biome === "forge" ? 2.0 : 1.0
        const totalCost = baseCost * biomeMult + (population * 100000000)

        // GDP Calculation (Average Hive World GDP ~ 500 Billion?)
        const years = totalCost / 500000000000

        // Dynamic Chart Data
        const munitionsBase = method === "cyclonic" ? 0.7 : method === "virus" ? 0.5 : 0.4
        const logisticsBase = method === "orbital" ? 0.5 : 0.3
        const bureaucracy = 1 - munitionsBase - logisticsBase

        return {
            cost: totalCost,
            torpedoes: torpedoCount,
            gdpYears: years,
            chartData: [
                { name: "Munitions", value: totalCost * munitionsBase, color: "#ffd23c" },
                { name: "Fuel & Logistics", value: totalCost * logisticsBase, color: "#b3aae0" },
                { name: "Bureaucracy", value: totalCost * bureaucracy, color: "#4a3f7a" },
            ]
        }
    }, [biome, method, population])

    const formatCurrency = (val: number) => {
        if (val >= 1000000000000) return (val / 1000000000000).toFixed(1) + "T ₮"
        if (val >= 1000000000) return (val / 1000000000).toFixed(1) + "B ₮"
        return (val / 1000000).toFixed(1) + "M ₮"
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a', borderWidth: '1px', color: '#ffd23c' }}>
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                        <Flame className="w-5 h-5" style={{ color: '#ffd23c' }} />
                        Purge Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Target Population</Label>
                        <Slider value={[population]} onValueChange={(v) => setPopulation(v[0])} min={1} max={100} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono font-bold" style={{ color: '#ffd23c' }}>{population} Billion Souls</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Classification</Label>
                        <Tabs defaultValue="hive" onValueChange={(v) => setBiome(v as "hive" | "agri" | "forge")} className="w-full">
                            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: '#0c0824' }}>
                                <TabsTrigger value="hive" className="text-[#b3aae0] bg-[#0c0824] border border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33]">Hive</TabsTrigger>
                                <TabsTrigger value="agri" className="text-[#b3aae0] bg-[#0c0824] border border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33]">Agri</TabsTrigger>
                                <TabsTrigger value="forge" className="text-[#b3aae0] bg-[#0c0824] border border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33]">Forge</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3aae0' }}>Method</Label>
                        <Tabs defaultValue="cyclonic" onValueChange={(v) => setMethod(v as "cyclonic" | "virus" | "orbital")} className="w-full">
                            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: '#0c0824' }}>
                                <TabsTrigger value="cyclonic" className="text-[#b3aae0] bg-[#0c0824] border border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33]">Cyclonic</TabsTrigger>
                                <TabsTrigger value="virus" className="text-[#b3aae0] bg-[#0c0824] border border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33]">Virus</TabsTrigger>
                                <TabsTrigger value="orbital" className="text-[#b3aae0] bg-[#0c0824] border border-[#4a3f7a] data-[state=active]:bg-[#ffd23c] data-[state=active]:text-[#160e33]">Orbital</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden border-none p-1" style={{ backgroundColor: '#1d1442' }}>
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a', borderWidth: '1px', color: '#b3aae0' }}>
                                    Total Expenditure
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#ffd23c' }}>
                                        {formatCurrency(cost)}
                                    </h3>
                                    <p className="font-medium italic" style={{ color: '#b3aae0' }}>
                                        The Emperor protects, but munitions cost money.
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-2" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a', borderWidth: '1px', color: '#ffd23c' }}>
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>

                            <div className="text-center p-8 rounded-3xl min-w-[200px]" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a', borderWidth: '1px' }}>
                                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#b3aae0' }}>GDP Equivalent</div>
                                <div className="text-4xl font-black" style={{ color: '#ffd23c' }}>
                                    {gdpYears.toFixed(1)} Years
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 px-4">
                            <ShareResult
                                title="Exterminatus Cost"
                                text={`Ordering an Exterminatus on this ${biome} world costs ${formatCurrency(cost)}! That's ${gdpYears.toFixed(1)} years of GDP.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl border-none bg-[#ffd23c] hover:bg-[#ffd23c]/90 text-[#160e33]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-5 gap-6">
                    <Card className="md:col-span-3 relative overflow-hidden" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                        <CardHeader>
                             <CardTitle className="text-lg font-bold flex items-center gap-2" style={{ color: '#ECEAE3' }}>
                                <TrendingUp className="w-4 h-4" style={{ color: '#ffd23c' }} />
                                Budget Allocation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0c0824', borderRadius: '12px', border: '1px solid #4a3f7a' }}
                                        itemStyle={{ color: '#ECEAE3' }}
                                        formatter={(value) => formatCurrency(value as number)}
                                    />
                                    <Legend formatter={(value) => <span style={{ color: '#b3aae0' }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
                        <CardHeader><CardTitle className="text-lg font-bold" style={{ color: '#ECEAE3' }}>Munitions Log</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#0c0824' }}>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase" style={{ color: '#b3aae0' }}>Ordnance Type</span>
                                    <span className="font-bold" style={{ color: '#ECEAE3' }}>{method === "cyclonic" ? "Cyclonic Torpedo" : method === "virus" ? "Life-Eater Virus" : "Macro-Cannon Battery"}</span>
                                </div>
                                <Skull className="w-8 h-8" style={{ color: '#4a3f7a' }} />
                            </div>
                             <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#0c0824' }}>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase" style={{ color: '#b3aae0' }}>Required Units</span>
                                    <span className="font-bold text-2xl" style={{ color: '#ffd23c' }}>{method === "orbital" ? "N/A" : torpedoes}</span>
                                </div>
                            </div>
                            <Alert style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                                <Info className="h-4 w-4" style={{ color: '#ffd23c' }} />
                                <AlertTitle style={{ color: '#ECEAE3' }}>Inquisitorial Note</AlertTitle>
                                    <AlertDescription className="text-xs" style={{ color: '#b3aae0' }}>
                                    {`“Innocence proves nothing.” - Ensure Form 27B/6 is filed in triplicate before firing.`}
                                    </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
