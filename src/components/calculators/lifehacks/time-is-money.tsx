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
      <Card className="bg-[var(--dk-surface)] border-[var(--dk-line)] text-[var(--dk-ink)]">
        <CardHeader>
           <CardTitle className="text-3xl font-display text-[var(--dk-lim-ink)] flex items-center gap-3">
              <Hourglass className="h-8 w-8 text-[var(--dk-lim-ink)]" />
              Time is Money
           </CardTitle>
             <CardDescription className="text-[var(--dk-ink-soft)]">
              Calculate the true cost of purchases in &quot;Life Hours&quot;.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-[var(--dk-lim-ink)] tracking-widest">Your Hourly Wage ($)</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-[var(--dk-lim-ink)]" />
                       <Input
                          type="number"
                          value={hourlyWage}
                          onChange={(e) => setHourlyWage(Number(e.target.value))}
                          className="pl-10 h-12 text-lg bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] focus:border-[var(--dk-lim-ink)]"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-[var(--dk-lim-ink)] tracking-widest">Item Cost ($)</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-[var(--dk-lim-ink)]" />
                       <Input
                          type="number"
                          value={itemCost}
                          onChange={(e) => setItemCost(Number(e.target.value))}
                          className="pl-10 h-12 text-lg bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] focus:border-[var(--dk-lim-ink)]"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-[var(--dk-sunk)] p-8 rounded-xl border border-[var(--dk-line)] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">

                 {/* Background draining animation if cost > wage */}
                 <div className="absolute inset-0 bg-[var(--dk-raised)] z-0"></div>

                 <div className="relative z-10 space-y-1">
                    <div className="text-sm font-bold text-[var(--dk-lim-ink)] uppercase">This item costs you</div>
                    <div className="text-6xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-fredoka), cursive', color: 'var(--dk-lim-ink)' }}>
                       {result.hours} <span className="text-2xl font-normal text-[var(--dk-ink)]">hours</span>
                    </div>
                 </div>

                 <div className="relative z-10 flex gap-4 text-[var(--dk-ink-soft)] text-sm font-mono">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4"/> {result.minutes} Minutes
                    </div>
                    <div className="w-px bg-[var(--dk-mute)] h-4"></div>
                    <div>
                       {result.days} Work Days
                    </div>
                 </div>

                 <div className="relative z-10 pt-4">
                   <div className="text-xs text-[var(--dk-ink-soft)] italic">
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
