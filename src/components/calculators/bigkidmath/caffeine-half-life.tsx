"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ShareResult } from "@/components/molecules/share-result"

const DRINK_PRESETS = [
    { name: "Coffee", caffeine: 95, icon: "☕" },
    { name: "Espresso", caffeine: 150, icon: "🍵" },
    { name: "Energy Drink", caffeine: 200, icon: "🥤" },
    { name: "Tea", caffeine: 50, icon: "🫖" },
]

export function CaffeineHalfLifeCalculator() {
    const [amount, setAmount] = useState<number>(95)
    const [time, setTime] = useState<string>("") // ISO string or simple time? Original used datetime-local.
    const [halfLife, setHalfLife] = useState<number>(5)
    const [sleepGoal, setSleepGoal] = useState<string>("22:00")
    const [data, setData] = useState<any[]>([])
    const [currentLevel, setCurrentLevel] = useState<number>(0)

    // Initialize time on mount to avoid hydration mismatch
    useEffect(() => {
        const now = new Date()
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        setTime(local)
    }, [])

    useEffect(() => {
        calculate()
    }, [amount, time, halfLife, sleepGoal])

    const calculate = () => {
        if (!time) return

        const consumptionDate = new Date(time)
        const now = new Date()
        const timeDiffHours = (now.getTime() - consumptionDate.getTime()) / (1000 * 60 * 60)
        
        // Calculate current level
        // Formula: C(t) = C0 * (0.5)^(t/halfLife)
        const current = timeDiffHours > 0 
            ? amount * Math.pow(0.5, timeDiffHours / halfLife)
            : 0 // Not consumed yet or just consumed
        
        setCurrentLevel(Math.max(0, current))

        // Generate Chart Data (24h from consumption)
        const newData = []
        for (let i = 0; i <= 24; i++) {
            const t = new Date(consumptionDate)
            t.setHours(t.getHours() + i)
            const level = amount * Math.pow(0.5, i / halfLife)
            
            // Mark if this is sleep time
            const sleepTime = new Date(time) // Approximation, need better date math usually
            const [sh, sm] = sleepGoal.split(':').map(Number)
            sleepTime.setHours(sh, sm, 0, 0)
            if (sleepTime < consumptionDate) sleepTime.setDate(sleepTime.getDate() + 1)
            
            // Just graph relative hours for simplicity or readable time
            newData.push({
                hour: i,
                label: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                caffeine: Math.max(0, level).toFixed(1),
                isSleep: Math.abs(t.getTime() - sleepTime.getTime()) < 3600000 // Close to sleep time
            })
        }
        setData(newData)
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="glass-card lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Caffeine Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Quick Select</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {DRINK_PRESETS.map(preset => (
                                <Button 
                                    key={preset.name} 
                                    variant="outline" 
                                    className={`h-auto flex flex-col gap-1 py-3 ${amount === preset.caffeine ? 'border-primary bg-primary/10' : ''}`}
                                    onClick={() => setAmount(preset.caffeine)}
                                >
                                    <span className="text-2xl">{preset.icon}</span>
                                    <span className="text-xs font-medium">{preset.name}</span>
                                    <span className="text-xs text-muted-foreground">{preset.caffeine}mg</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Amount (mg)</Label>
                        <div className="flex gap-4">
                             <Slider 
                                value={[amount]} 
                                onValueChange={(v) => setAmount(v[0])} 
                                max={500} 
                                step={5} 
                                className="flex-1"
                             />
                             <Input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))} 
                                className="w-20"
                             />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Consumption Time</Label>
                        <Input 
                            type="datetime-local" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Metabolism Speed</Label>
                        <Select value={halfLife.toString()} onValueChange={(v) => setHalfLife(Number(v))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">Fast (3 hrs)</SelectItem>
                                <SelectItem value="5">Average (5 hrs)</SelectItem>
                                <SelectItem value="7">Slow (7 hrs)</SelectItem>
                                <SelectItem value="9">Very Slow (9 hrs)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                         <Label>Bedtime Goal</Label>
                         <Input 
                            type="time" 
                            value={sleepGoal} 
                            onChange={(e) => setSleepGoal(e.target.value)} 
                         />
                    </div>
                </CardContent>
            </Card>

            {/* Visualization Panel */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-primary/20 bg-primary/5">
                    <CardContent className="pt-6 text-center">
                        <div className="text-lg font-medium text-muted-foreground">Current Level</div>
                        <div className="text-5xl font-bold tracking-tighter text-gradient my-2">
                            {currentLevel.toFixed(1)} <span className="text-xl text-muted-foreground">mg</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${currentLevel > 50 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                            {currentLevel > 50 ? "System Active" : "Nearly Clear"}
                        </div>
                        <div className="mt-6">
                            <ShareResult 
                                title="Caffeine Status" 
                                text={`I currently have ${currentLevel.toFixed(1)}mg of caffeine in my system! calculated at Docket One.`}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Caffeine Decay Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCaffeine" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
                                <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}mg`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="caffeine" stroke="#6366f1" fillOpacity={1} fill="url(#colorCaffeine)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {currentLevel > 20 && (
                     <Alert variant="destructive" className="glass-card border-orange-500/50 bg-orange-500/10 text-orange-200">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Sleep Warning</AlertTitle>
                        <AlertDescription>
                            You still have substantial caffeine in your system. It might impact your deep sleep quality tonight.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}
