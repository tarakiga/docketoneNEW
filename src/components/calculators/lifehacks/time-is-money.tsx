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
      <Card className="bg-[#1d1442] border-[#4a3f7a] text-[#ECEAE3]">
        <CardHeader>
           <CardTitle className="text-3xl font-display text-[#b6ff3c] flex items-center gap-3">
              <Hourglass className="h-8 w-8 text-[#b6ff3c]" />
              Time is Money
           </CardTitle>
             <CardDescription className="text-[#b3aae0]">
              Calculate the true cost of purchases in &quot;Life Hours&quot;.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-[#b6ff3c] tracking-widest">Your Hourly Wage ($)</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-[#b6ff3c]" />
                       <Input
                          type="number"
                          value={hourlyWage}
                          onChange={(e) => setHourlyWage(Number(e.target.value))}
                          className="pl-10 h-12 text-lg bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus:border-[#b6ff3c]"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-[#b6ff3c] tracking-widest">Item Cost ($)</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-[#b6ff3c]" />
                       <Input
                          type="number"
                          value={itemCost}
                          onChange={(e) => setItemCost(Number(e.target.value))}
                          className="pl-10 h-12 text-lg bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus:border-[#b6ff3c]"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-[#0c0824] p-8 rounded-xl border border-[#4a3f7a] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">

                 {/* Background draining animation if cost > wage */}
                 <div className="absolute inset-0 bg-[#241a52] z-0"></div>

                 <div className="relative z-10 space-y-1">
                    <div className="text-sm font-bold text-[#b6ff3c] uppercase">This item costs you</div>
                    <div className="text-6xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-bungee), cursive', color: '#b6ff3c' }}>
                       {result.hours} <span className="text-2xl font-normal text-[#ECEAE3]">hours</span>
                    </div>
                 </div>

                 <div className="relative z-10 flex gap-4 text-[#b3aae0] text-sm font-mono">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4"/> {result.minutes} Minutes
                    </div>
                    <div className="w-px bg-[#4a3f7a] h-4"></div>
                    <div>
                       {result.days} Work Days
                    </div>
                 </div>

                 <div className="relative z-10 pt-4">
                   <div className="text-xs text-[#b3aae0] italic">
                      &quot;Is it really worth {result.hours} hours of your life sitting in a chair?&quot;
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
