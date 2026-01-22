"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function FireCalculator() {
  const [expenses, setExpenses] = useState(40000)
  const [savings, setSavings] = useState(100000)
  const [contribution, setContribution] = useState(20000) // Annual
  const [rate, setRate] = useState(7) // Growth rate %
  const [swr, setSwr] = useState(4) // Safe withdrawal rate %

  const calculation = useMemo(() => {
    const fireNumber = expenses / (swr / 100)
    let current = savings
    let years = 0
    const data = []
    
    // Project up to 50 years max or until hit
    while (current < fireNumber && years < 50) {
      data.push({ year: `Year ${years}`, amount: Math.round(current), target: fireNumber })
      current = current * (1 + rate / 100) + contribution
      years++
    }
    // Add the final year
    data.push({ year: `Year ${years}`, amount: Math.round(current), target: fireNumber })

    return { fireNumber, years, data, reached: current >= fireNumber }
  }, [expenses, savings, contribution, rate, swr])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-emerald-950 border-emerald-800 text-emerald-50">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-emerald-400 flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            F.I.R.E. Countdown
          </CardTitle>
          <CardDescription className="text-emerald-200/60">Financial Independence, Retire Early.</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-12 gap-8">
           
           <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4 p-4 rounded-xl bg-emerald-900/30 border border-emerald-800">
                 <div className="space-y-2">
                    <Label className="text-emerald-100">Annual Expenses</Label>
                    <div className="flex gap-2 items-center">
                       <span className="text-emerald-400">$</span>
                       <Input type="number" 
                              value={expenses} 
                              onChange={(e) => setExpenses(Number(e.target.value))} 
                              className="bg-emerald-950 border-emerald-700 text-emerald-50" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-emerald-100">Current Savings</Label>
                    <div className="flex gap-2 items-center">
                       <span className="text-emerald-400">$</span>
                       <Input type="number" 
                              value={savings} 
                              onChange={(e) => setSavings(Number(e.target.value))} 
                              className="bg-emerald-950 border-emerald-700 text-emerald-50" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-emerald-100">Annual Contribution</Label>
                    <div className="flex gap-2 items-center">
                       <span className="text-emerald-400">$</span>
                       <Input type="number" 
                              value={contribution} 
                              onChange={(e) => setContribution(Number(e.target.value))} 
                              className="bg-emerald-950 border-emerald-700 text-emerald-50" />
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                       <Label>Investment Return</Label>
                       <span className="font-mono text-emerald-300">{rate}%</span>
                    </div>
                    <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={1} max={15} step={0.5} className="[&_.range-thumb]:bg-emerald-500" />
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                       <Label>Safe Withdrawal Rate</Label>
                       <span className="font-mono text-emerald-300">{swr}%</span>
                    </div>
                    <Slider value={[swr]} onValueChange={([v]) => setSwr(v)} min={2} max={6} step={0.1} className="[&_.range-thumb]:bg-emerald-500" />
                    <p className="text-xs text-emerald-500/60">Standard rule is 4% (25x expenses).</p>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-emerald-900/40 p-6 rounded-xl border border-emerald-800">
                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Your Freedom Number</div>
                    <div className="text-4xl font-black text-white">${calculation.fireNumber.toLocaleString()}</div>
                    <div className="text-sm text-emerald-400 mt-2">
                       (25x Expenses)
                    </div>
                 </div>
                 <div className="bg-emerald-900/40 p-6 rounded-xl border border-emerald-800">
                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Time to Freedom</div>
                    <div className="text-4xl font-black text-white">
                      {calculation.years >= 50 ? "50+" : calculation.years} <span className="text-lg text-emerald-300 font-normal">Years</span>
                    </div>
                    <div className="text-sm text-emerald-400 mt-2">
                       by {new Date().getFullYear() + calculation.years}
                    </div>
                 </div>
              </div>

              <div className="h-[300px] w-full bg-emerald-950/50 rounded-xl p-4 border border-emerald-800/50">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={calculation.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                      <XAxis dataKey="year" hide />
                      <YAxis hide domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#022c22', borderColor: '#059669', color: '#ecfdf5' }}
                        itemStyle={{ color: '#ecfdf5' }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Savings']}
                        labelStyle={{ color: '#6ee7b7' }}
                      />
                      <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
              </div>

              <ShareResult title="My FIRE Plan" text={`I'm on track to reach Financial Independence in ${calculation.years} years! My target is $${(calculation.fireNumber/1000000).toFixed(2)}M. 📈`} />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
