"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Info, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

import { ShareResult } from "@/components/molecules/share-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CarVsUberCalculator() {
    // Car Ownership State
    const [carPrice, setCarPrice] = useState(28000)
    const [loanTerm, setLoanTerm] = useState(5)
    const [interestRate, setInterestRate] = useState(5.5)
    const [insurance, setInsurance] = useState(1200)
    const [maintenance, setMaintenance] = useState(1000)
    const [fuelCost, setFuelCost] = useState(0.15)
    const [milesDriven, setMilesDriven] = useState(12000)

    // Rideshare State
    const [uberCostPerRide, setUberCostPerRide] = useState(18)
    const [ridesPerWeek, setRidesPerWeek] = useState(10)

    // Results State
    const [annualCarCost, setAnnualCarCost] = useState(0)
    const [annualUberCost, setAnnualUberCost] = useState(0)
    const [savings, setSavings] = useState(0)
    const [carWins, setCarWins] = useState(false)
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculate()
    }, [carPrice, loanTerm, interestRate, insurance, maintenance, fuelCost, milesDriven, uberCostPerRide, ridesPerWeek])

    const calculate = () => {
        // Car Calc
        const monthlyInterestRate = interestRate / 100 / 12
        const numberOfPayments = loanTerm * 12
        let monthlyPayment = 0
        
        if (carPrice > 0 && monthlyInterestRate > 0) {
             monthlyPayment = carPrice * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
        } else if (carPrice > 0) {
            monthlyPayment = carPrice / numberOfPayments
        }

        const annualLoanCost = monthlyPayment * 12
        const annualFuelTotal = fuelCost * milesDriven
        
        // Simple depreciation assumption (15% per year approx or just based on loan cost for cash flow)
        // For cash flow comparison, we use the loan payment.
        
        const totalCar = annualLoanCost + insurance + maintenance + annualFuelTotal
        
        // Uber Calc
        const totalUber = uberCostPerRide * ridesPerWeek * 52

        setAnnualCarCost(totalCar)
        setAnnualUberCost(totalUber)
        setSavings(Math.abs(totalCar - totalUber))
        setCarWins(totalCar < totalUber)

        setChartData([
            { name: 'Car Ownership', value: totalCar, color: '#3b82f6' }, // Blue
            { name: 'Rideshare', value: totalUber, color: '#10b981' },   // Green
        ])
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Cost Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="car" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5">
                            <TabsTrigger value="car">🚗 Car Env</TabsTrigger>
                            <TabsTrigger value="uber">🚕 Rideshare</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="car" className="space-y-4">
                             <div className="space-y-2">
                                <Label>Car Price ($)</Label>
                                <Input type="number" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Loan Term (Years)</Label>
                                <Slider value={[loanTerm]} onValueChange={(v) => setLoanTerm(v[0])} max={10} step={1} />
                                <div className="text-right text-xs text-muted-foreground">{loanTerm} Years</div>
                            </div>
                             <div className="space-y-2">
                                <Label>Annual Insurance ($)</Label>
                                <Input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} />
                            </div>
                             <div className="space-y-2">
                                <Label>Annual Maintenance ($)</Label>
                                <Input type="number" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="uber" className="space-y-4">
                             <div className="space-y-2">
                                <Label>Avg Cost per Ride ($)</Label>
                                <Input type="number" value={uberCostPerRide} onChange={(e) => setUberCostPerRide(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rides per Week</Label>
                                <Slider value={[ridesPerWeek]} onValueChange={(v) => setRidesPerWeek(v[0])} max={50} step={1} />
                                <div className="text-right text-xs text-muted-foreground">{ridesPerWeek} rides/week</div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                 {/* Winner Card */}
                <Card className={`glass-card border-l-4 ${carWins ? 'border-l-blue-500' : 'border-l-green-500'} bg-gradient-to-br from-primary/5 to-transparent`}>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="text-lg text-muted-foreground font-medium">Winner</div>
                                <div className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                                    {carWins ? "Own a Car" : "Use Rideshare"}
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm">
                                    {carWins ? <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" /> : <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                    <span className="text-green-700 dark:text-green-400">Save {formatCurrency(savings)} / year</span>
                                </div>
                            </div>
                            
                            <div className="text-center p-4 bg-black/20 rounded-xl min-w-[200px]">
                                <div className="text-sm text-muted-foreground mb-1">Total Impact (5 Years)</div>
                                <div className="text-3xl font-bold text-gradient">
                                    {formatCurrency(savings * 5)}
                                </div>
                            </div>
                        </div>

                         <div className="mt-8">
                             <ShareResult 
                                title="Car vs Uber Verdict" 
                                text={`I could save ${formatCurrency(savings)}/year by ${carWins ? 'owning a car' : 'using specific rideshare services'}! Calculated at Docket One.`}
                                className={`w-full ${carWins ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} text-white border-none`}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Chart */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card">
                         <CardHeader>
                            <CardTitle>Annual Cost Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                         contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                         formatter={(value: number | undefined) => [formatCurrency(value || 0), '']}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>The Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-blue-400" />
                                    <span className="font-medium text-blue-900 dark:text-blue-100">Car Cost</span>
                                </div>
                                <span className="font-bold text-blue-700 dark:text-blue-400">{formatCurrency(annualCarCost)}</span>
                            </div>

                             <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-green-400" />
                                    <span className="font-medium text-green-900 dark:text-green-100">Rideshare Cost</span>
                                </div>
                                <span className="font-bold text-green-700 dark:text-green-400">{formatCurrency(annualUberCost)}</span>
                            </div>

                            <Alert className="bg-white/5 border-white/10 mt-4">
                                <Info className="h-4 w-4 text-muted-foreground" />
                                <AlertTitle>Did you know?</AlertTitle>
                                <AlertDescription className="text-xs text-muted-foreground">
                                    Depreciation is often the largest hidden cost of car ownership, often exceeding fuel costs.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
