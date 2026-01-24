"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Info, Skull, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

export function ExterminatusCostCalculator() {
    const [population, setPopulation] = useState(10) // Billions
    const [biome, setBiome] = useState<"hive" | "agri" | "forge">("hive")
    const [method, setMethod] = useState<"cyclonic" | "virus" | "orbital">("cyclonic")

    const [cost, setCost] = useState(0)
    const [torpedoes, setTorpedoes] = useState(0)
    const [gdpYears, setGdpYears] = useState(0)
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculate()
    }, [population, biome, method])

    const calculate = () => {
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

        setCost(totalCost)
        setTorpedoes(torpedoCount)
        setGdpYears(years)

        // Dynamic Chart Data
        const munitionsBase = method === "cyclonic" ? 0.7 : method === "virus" ? 0.5 : 0.4
        const logisticsBase = method === "orbital" ? 0.5 : 0.3
        const bureaucracy = 1 - munitionsBase - logisticsBase

        setChartData([
            { name: 'Munitions', value: totalCost * munitionsBase, color: '#ef4444' },
            { name: 'Fuel & Logistics', value: totalCost * logisticsBase, color: '#f97316' },
            { name: 'Bureaucracy', value: totalCost * bureaucracy, color: '#eab308' },
        ])
    }

    const formatCurrency = (val: number) => {
        if (val >= 1000000000000) return (val / 1000000000000).toFixed(1) + "T ₮"
        if (val >= 1000000000) return (val / 1000000000).toFixed(1) + "B ₮"
        return (val / 1000000).toFixed(1) + "M ₮"
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            Warhammer 40,000
                        </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary" />
                        Purge Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Target Population</Label>
                        <Slider value={[population]} onValueChange={(v) => setPopulation(v[0])} min={1} max={100} step={1} className="py-4" />
                        <div className="text-right text-xs font-mono text-primary font-bold">{population} Billion Souls</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Classification</Label>
                        <Tabs defaultValue="hive" onValueChange={(v) => setBiome(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                <TabsTrigger value="hive">Hive</TabsTrigger>
                                <TabsTrigger value="agri">Agri</TabsTrigger>
                                <TabsTrigger value="forge">Forge</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Method</Label>
                        <Tabs defaultValue="cyclonic" onValueChange={(v) => setMethod(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                <TabsTrigger value="cyclonic">Cyclonic</TabsTrigger>
                                <TabsTrigger value="virus">Virus</TabsTrigger>
                                <TabsTrigger value="orbital">Orbital</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="relative overflow-hidden glass-card border-none bg-gradient-to-br from-slate-900 to-slate-950 p-1">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-red-900" />
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                                    Total Expenditure
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                        {formatCurrency(cost)}
                                    </h3>
                                    <p className="text-slate-400 font-medium italic">
                                        The Emperor protects, but munitions cost money.
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-wider mt-2">
                                        From the Warhammer 40,000 Lore
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl min-w-[200px]">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">GDP Equivalent</div>
                                <div className="text-4xl font-black text-red-500">
                                    {gdpYears.toFixed(1)} Years
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 px-4">
                            <ShareResult 
                                title="Exterminatus Cost"
                                text={`Ordering an Exterminatus on this ${biome} world costs ${formatCurrency(cost)}! That's ${gdpYears.toFixed(1)} years of GDP.`}
                                className="w-full py-6 text-lg font-black tracking-tight rounded-2xl bg-red-600 hover:bg-red-500 text-white border-none shadow-2xl shadow-red-900/20"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-5 gap-6">
                    <Card className="glass-card md:col-span-3 border-white/5 relative overflow-hidden">
                        <CardHeader>
                             <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
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
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="glass-card md:col-span-2 border-white/5">
                        <CardHeader><CardTitle className="text-lg font-bold">Munitions Log</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase opacity-60">Ordnance Type</span>
                                    <span className="font-bold">{method === "cyclonic" ? "Cyclonic Torpedo" : method === "virus" ? "Life-Eater Virus" : "Macro-Cannon Battery"}</span>
                                </div>
                                <Skull className="w-8 h-8 opacity-20" />
                            </div>
                             <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase opacity-60">Required Units</span>
                                    <span className="font-bold text-2xl">{method === "orbital" ? "N/A" : torpedoes}</span>
                                </div>
                            </div>
                            <Alert className="bg-white/5 border-white/10">
                                <Info className="h-4 w-4 text-primary" />
                                <AlertTitle>Inquisitorial Note</AlertTitle>
                                <AlertDescription className="text-xs opacity-70">
                                    "Innocence proves nothing." - Ensure Form 27B/6 is filed in triplicate before firing.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
