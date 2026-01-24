"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CarVsUberCalculator() {
    // Car Ownership State (ICE)
    const [carPrice, setCarPrice] = useState(32000)
    const [loanTerm, setLoanTerm] = useState(5)
    const [interestRate, setInterestRate] = useState(5.5)
    const [insurance, setInsurance] = useState(1500)
    const [maintenance, setMaintenance] = useState(800)
    const [fuelCost, setFuelCost] = useState(3.50) // Gas price per gallon
    const [mpg, setMpg] = useState(25)
    const [milesDriven, setMilesDriven] = useState(12000)

    // EV State
    const [evPrice, setEvPrice] = useState(45000)
    const [electricityCost, setElectricityCost] = useState(0.14) // per kWh
    const [evEfficiency, setEvEfficiency] = useState(3.5) // miles per kWh
    const [chargerInstall, setChargerInstall] = useState(1200)
    const [evMaintenance, setEvMaintenance] = useState(400) // Lower maintenance for EV

    // Rideshare State
    const [uberCostPerRide, setUberCostPerRide] = useState(22)
    const [ridesPerWeek, setRidesPerWeek] = useState(10)

    // Results State
    const [annualCarCost, setAnnualCarCost] = useState(0)
    const [annualEvCost, setAnnualEvCost] = useState(0)
    const [annualUberCost, setAnnualUberCost] = useState(0)
    const [savings, setSavings] = useState(0)
    const [winner, setWinner] = useState<"car" | "ev" | "uber">("car")
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculate()
    }, [carPrice, loanTerm, interestRate, insurance, maintenance, fuelCost, mpg, milesDriven, evPrice, electricityCost, evEfficiency, chargerInstall, evMaintenance, uberCostPerRide, ridesPerWeek])

    const calculate = () => {
        // Shared Calculation: Amortized Loan Component
        const getAnnualLoanPayment = (price: number, term: number, rate: number) => {
            const monthlyInterestRate = rate / 100 / 12
            const numberOfPayments = term * 12
            if (price <= 0) return 0
            if (monthlyInterestRate === 0) return (price / term)
            const monthlyPayment = price * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
            return monthlyPayment * 12
        }

        // 1. ICE Car Cost
        const annualIceLoan = getAnnualLoanPayment(carPrice, loanTerm, interestRate)
        const annualFuelTotal = (milesDriven / (mpg || 1)) * fuelCost
        const totalIce = annualIceLoan + insurance + maintenance + annualFuelTotal

        // 2. EV Cost
        // Amortize charger install over same term as loan for fair comparison
        const annualEvLoan = getAnnualLoanPayment(evPrice + chargerInstall, loanTerm, interestRate)
        const annualElectricityTotal = (milesDriven / (evEfficiency || 1)) * electricityCost
        const totalEv = annualEvLoan + (insurance * 1.1) + evMaintenance + annualElectricityTotal // Insurance usually +10% for EV

        // 3. Uber Cost
        const totalUber = uberCostPerRide * ridesPerWeek * 52

        // Determine Winner
        const costs = [
            { type: "car" as const, val: totalIce, label: "Gas Car", color: "#3b82f6" },
            { type: "ev" as const, val: totalEv, label: "Electric Vehicle", color: "#a855f7" },
            { type: "uber" as const, val: totalUber, label: "Rideshare", color: "#10b981" }
        ].sort((a, b) => a.val - b.val)

        const mainWinner = costs[0]
        const secondBest = costs[1]

        setAnnualCarCost(totalIce)
        setAnnualEvCost(totalEv)
        setAnnualUberCost(totalUber)
        setWinner(mainWinner.type)
        setSavings(secondBest.val - mainWinner.val)

        setChartData([
            { name: 'Gas Car', value: totalIce, color: '#3b82f6' },
            { name: 'Electric Car', value: totalEv, color: '#a855f7' },
            { name: 'Rideshare', value: totalUber, color: '#10b981' },
        ])
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-primary" />
                        Financing Scenarios
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="car" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4 bg-white/5 p-1 h-12">
                            <TabsTrigger value="car" className="text-xs">⛽ Gas</TabsTrigger>
                            <TabsTrigger value="ev" className="text-xs">⚡ EV</TabsTrigger>
                            <TabsTrigger value="uber" className="text-xs">🚕 Uber</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="car" className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                             <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Purchase Price ($)</Label>
                                <Input type="number" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value))} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">MPG</Label>
                                    <Input type="number" value={mpg} onChange={(e) => setMpg(Number(e.target.value))} className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Gas ($/gal)</Label>
                                    <Input type="number" value={fuelCost} step="0.1" onChange={(e) => setFuelCost(Number(e.target.value))} className="bg-white/5 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Maintenance/Year ($)</Label>
                                <Input type="number" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} className="bg-white/5 border-white/10" />
                            </div>
                        </TabsContent>

                        <TabsContent value="ev" className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                             <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">EV Price ($)</Label>
                                <Input type="number" value={evPrice} onChange={(e) => setEvPrice(Number(e.target.value))} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">mi/kWh</Label>
                                    <Input type="number" value={evEfficiency} step="0.1" onChange={(e) => setEvEfficiency(Number(e.target.value))} className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Elec ($/kWh)</Label>
                                    <Input type="number" value={electricityCost} step="0.01" onChange={(e) => setElectricityCost(Number(e.target.value))} className="bg-white/5 border-white/10" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Charger Install ($)</Label>
                                <Input type="number" value={chargerInstall} onChange={(e) => setChargerInstall(Number(e.target.value))} className="bg-white/5 border-white/10" />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="uber" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Avg Cost per Ride ($)</Label>
                                <Input type="number" value={uberCostPerRide} onChange={(e) => setUberCostPerRide(Number(e.target.value))} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Rides per Week</Label>
                                <Slider value={[ridesPerWeek]} onValueChange={(v) => setRidesPerWeek(v[0])} max={50} step={1} className="py-4" />
                                <div className="text-right text-xs font-mono text-primary font-bold">{ridesPerWeek} rides/week</div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="pt-6 border-t border-white/10 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Annual Mileage</Label>
                            <Slider value={[milesDriven]} onValueChange={(v) => setMilesDriven(v[0])} min={1000} max={40000} step={500} className="py-4" />
                            <div className="text-right text-xs font-mono text-primary font-bold">{milesDriven.toLocaleString()} miles/year</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Loan Term ({loanTerm} Years)</Label>
                            <Slider value={[loanTerm]} onValueChange={(v) => setLoanTerm(v[0])} min={1} max={8} step={1} className="py-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                 {/* Winner Card */}
                <Card className={`relative overflow-hidden glass-card border-none bg-gradient-to-br from-slate-900 to-slate-950 p-1`}>
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-t ${
                        winner === 'car' ? 'from-blue-600' : winner === 'ev' ? 'from-purple-600' : 'from-green-600'
                    }`} />
                    
                    <CardContent className="relative pt-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                                    Ultimate Verdict
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                        {winner === 'car' ? "Own a Gas Car" : winner === 'ev' ? "Go Electric" : "Stick to Uber"}
                                    </h3>
                                    <p className="text-slate-400 font-medium italic">
                                        {winner === 'car' ? "Tradition wins the wallet race... for now." : 
                                         winner === 'ev' ? "The future is cheaper than you think." : 
                                         "Let someone else do the driving."}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-green-400 font-black text-xl">
                                    <TrendingDown className="w-5 h-5" />
                                    <span>Save {formatCurrency(savings)} / year</span>
                                </div>
                            </div>
                            
                            <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl min-w-[240px] group transition-all hover:bg-white/10">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">5-Year Impact</div>
                                <div className="text-4xl font-black text-gradient group-hover:scale-110 transition-transform">
                                    {formatCurrency(savings * 5)}
                                </div>
                            </div>
                        </div>

                         <div className="mt-10 px-4">
                             <ShareResult 
                                title="Car vs. EV vs. Uber" 
                                text={`I save ${formatCurrency(savings)}/year by choosing ${
                                    winner === 'car' ? 'ICE Car' : winner === 'ev' ? 'EV' : 'Rideshare'
                                }! Check your savings at Docket One.`}
                                className={`w-full py-6 text-lg font-black tracking-tight rounded-2xl ${
                                    winner === 'car' ? 'bg-blue-600 hover:bg-blue-500' : 
                                    winner === 'ev' ? 'bg-purple-600 hover:bg-purple-500' : 
                                    'bg-green-600 hover:bg-green-500'
                                } text-white border-none shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]`}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Visual Data Section */}
                <div className="grid md:grid-cols-5 gap-6">
                    <Card className="glass-card md:col-span-3 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <TrendingUp className="w-48 h-48 rotate-12" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                Annual Cost Variance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[320px] pb-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                         contentStyle={{ 
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            borderRadius: '16px', 
                                            color: '#fff',
                                            padding: '12px'
                                         }}
                                         itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                         formatter={(value: number | undefined) => [formatCurrency(value || 0), 'Annual Spend']}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36} 
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs font-bold text-slate-400">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="glass-card md:col-span-2 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">The Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Gas Car Cost", value: annualCarCost, color: "blue", type: 'ICE' },
                                { label: "Electric Car Cost", value: annualEvCost, color: "purple", type: 'EV' },
                                { label: "Rideshare Cost", value: annualUberCost, color: "green", type: 'Uber' }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl bg-${item.color}-500/5 border border-${item.color}-500/10 hover:border-${item.color}-500/30 transition-all group`}>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-${item.color}-500/60`}>Total / Year</span>
                                        <span className="font-bold text-slate-200">{item.label}</span>
                                    </div>
                                    <span className={`font-black text-lg text-${item.color}-500 group-hover:scale-105 transition-transform`}>{formatCurrency(item.value)}</span>
                                </div>
                            ))}

                            <Alert className="bg-white/5 border-white/10 mt-6 rounded-2xl">
                                <Info className="h-4 w-4 text-indigo-400" />
                                <AlertTitle className="text-xs font-bold text-slate-200">The "EV Premium" Factor</AlertTitle>
                                <AlertDescription className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider font-medium">
                                    EVs cost more to buy but often save 70% on "fuel" and 50% on maintenance over ICE cars. Check your local electricity rates for precision.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
