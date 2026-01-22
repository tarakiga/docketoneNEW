"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, DollarSign, Hourglass } from "lucide-react"
import { useMemo, useState } from "react"

export function TimeIsMoney() {
  const [hourlyWage, setHourlyWage] = useState(20)
  const [itemCost, setItemCost] = useState(60) // Video game price

  const result = useMemo(() => {
    const hours = itemCost / (hourlyWage || 1) // prevent div by 0
    
    // Work day logic (8 hours)
    const days = (hours / 8).toFixed(1)
    
    return { 
       hours: hours.toFixed(1),
       days,
       minutes: Math.round(hours * 60)
    }
  }, [hourlyWage, itemCost])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-900 border-green-900 text-green-50 shadow-[0_0_50px_rgba(20,83,45,0.2)]">
        <CardHeader>
           <CardTitle className="text-3xl font-display text-green-400 flex items-center gap-3">
              <Hourglass className="h-8 w-8 text-green-500" />
              Time is Money
           </CardTitle>
           <CardDescription className="text-green-200/60">
              Calculate the true cost of purchases in "Life Hours".
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-green-500 tracking-widest">Your Hourly Wage ($)</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
                       <Input 
                          type="number" 
                          value={hourlyWage} 
                          onChange={(e) => setHourlyWage(Number(e.target.value))} 
                          className="pl-10 h-12 text-lg bg-green-950 border-green-800 text-green-100 focus:border-green-500"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-green-500 tracking-widest">Item Cost ($)</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
                       <Input 
                          type="number" 
                          value={itemCost} 
                          onChange={(e) => setItemCost(Number(e.target.value))} 
                          className="pl-10 h-12 text-lg bg-green-950 border-green-800 text-green-100 focus:border-green-500"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-black/40 p-8 rounded-xl border border-green-900/50 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                 
                 {/* Background draining animation if cost > wage */}
                 <div className="absolute inset-0 bg-green-500/5 z-0"></div>
                 
                 <div className="relative z-10 space-y-1">
                    <div className="text-sm font-bold text-green-600 uppercase">This item costs you</div>
                    <div className="text-6xl font-black text-white tracking-tighter">
                       {result.hours} <span className="text-2xl font-normal text-green-500">hours</span>
                    </div>
                 </div>

                 <div className="relative z-10 flex gap-4 text-green-400 text-sm font-mono">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4"/> {result.minutes} Minutes
                    </div>
                    <div className="w-px bg-green-800 h-4"></div>
                    <div>
                       {result.days} Work Days
                    </div>
                 </div>

                 <div className="relative z-10 pt-4">
                    <div className="text-xs text-slate-500 italic">
                       "Is it really worth {result.hours} hours of your life sitting in a chair?"
                    </div>
                 </div>

              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="The Cost of Life" 
                 text={`This $${itemCost} purchase will cost me ${result.hours} hours of work. Thinking twice about it. 💸 #TimeIsMoney`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
