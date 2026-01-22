"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skull } from "lucide-react"
import { useMemo, useState } from "react"

export function LifeVisualized() {
  const [birthday, setBirthday] = useState("1995-01-01")
  const [expectancy, setExpectancy] = useState(80)
  const [viewMode, setViewMode] = useState<'years' | 'months' | 'weeks'>('weeks')

  const data = useMemo(() => {
    const birth = new Date(birthday)
    const now = new Date()
    const years = expectancy
    
    // Calculate precise difference
    const diffTime = Math.max(0, now.getTime() - birth.getTime())
    
    let totalUnits = 0
    let livedUnits = 0
    let label = ""
    let gridRows = []

    if (viewMode === 'years') {
      totalUnits = years
      livedUnits = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
      label = "Years"
      // 1 row per 10 years for easier viewing
      gridRows = Array.from({ length: Math.ceil(totalUnits / 10) }, (_, i) => i * 10)
    } else if (viewMode === 'months') {
      totalUnits = years * 12
      livedUnits = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))
      label = "Months"
      // 1 row per year (12 months)
      gridRows = Array.from({ length: years }, (_, i) => i) 
    } else { // weeks
      totalUnits = years * 52
      livedUnits = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
      label = "Weeks"
      // 1 row per year (52 weeks)
      gridRows = Array.from({ length: years }, (_, i) => i)
    }
    
    return { livedUnits, totalUnits, label, gridRows }
  }, [birthday, expectancy, viewMode])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-stone-50 border-stone-200">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-stone-800 flex items-center gap-2">
            <Skull className="h-8 w-8 text-stone-600" />
            Memento Mori (Life in {data.label})
          </CardTitle>
          <CardDescription>Your life fits on a single sheet of paper. Make the boxes count.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
           
           <div className="flex flex-col md:flex-row gap-6 p-6 bg-stone-100 rounded-xl border border-stone-200 items-end">
              <div className="space-y-2 flex-1">
                 <Label className="text-stone-600">Date of Birth</Label>
                 <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="bg-white border-stone-300" />
              </div>
              <div className="space-y-2 flex-1">
                 <Label className="text-stone-600">Life Expectancy (Years)</Label>
                 <Input type="number" value={expectancy} onChange={(e) => setExpectancy(Number(e.target.value))} className="bg-white border-stone-300" />
              </div>
              <div className="bg-white p-1 rounded-lg border border-stone-200 flex">
                 {['years', 'months', 'weeks'].map((m) => (
                   <button 
                     key={m}
                     onClick={() => setViewMode(m as any)}
                     className={`px-4 py-2 text-sm font-bold rounded-md capitalize transition-all ${viewMode === m ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                   >
                     {m}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex gap-4 text-sm font-bold text-stone-500 justify-center">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-stone-800 rounded-sm"></div> Lived
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-stone-200 border border-stone-300 rounded-sm"></div> Remaining
                 </div>
              </div>

              <div className="overflow-x-auto pb-4">
                 <div className={`min-w-[600px] space-y-1 ${viewMode === 'years' ? 'flex flex-wrap gap-1 space-y-0 w-full min-w-0' : ''}`}>
                    {viewMode === 'years' ? (
                       // Simple Grid for Years
                       Array.from({ length: data.totalUnits }, (_, i) => {
                          const isLived = i < data.livedUnits
                          return (
                            <div 
                              key={i} 
                              className={`w-6 h-6 rounded-[2px] border ${isLived ? 'bg-stone-800 border-stone-800' : 'bg-stone-100 border-stone-300'} transition-all hover:scale-125 hover:bg-stone-500`}
                              title={`Age ${i}`}
                            />
                          )
                       })
                    ) : (
                       // Row-based for Months and Weeks
                       data.gridRows.map(rowKey => (
                         <div key={rowKey} className={`flex gap-1 items-center ${viewMode === 'months' ? 'h-6' : 'h-3'}`}>
                            {/* Label */}
                            <div className="w-8 text-[9px] text-stone-400 text-right pr-2 font-mono shrink-0">
                              {/* Show age every 5 years */}
                              {rowKey % 5 === 0 ? rowKey : ''}
                            </div>
                            
                            {/* Blocks */}
                            {Array.from({ length: viewMode === 'months' ? 12 : 52 }, (_, k) => {
                               const unitIndex = viewMode === 'months' 
                                 ? rowKey * 12 + k 
                                 : rowKey * 52 + k
                               
                               const isLived = unitIndex < data.livedUnits
                               return (
                                  <div 
                                    key={k} 
                                    className={`flex-1 h-full rounded-[1px] ${isLived ? 'bg-stone-800' : 'bg-stone-200 border border-stone-300'} transition-all hover:scale-150 hover:bg-red-500`}
                                    title={`Age ${rowKey}, ${viewMode === 'months' ? 'Month' : 'Week'} ${k+1}`}
                                  />
                               )
                            })}
                         </div>
                       ))
                    )}
                 </div>
              </div>
              
              <div className="text-center space-y-2 pt-4">
                 <div className="text-2xl font-black text-stone-800">
                    {Math.round((data.livedUnits / data.totalUnits) * 100)}% Complete
                 </div>
                 <p className="text-stone-500 max-w-lg mx-auto italic">
                    "It is not that we have a short time to live, but that we waste a lot of it." — Seneca
                 </p>
              </div>

              <ShareResult title="Life Check" text={`I've lived ${data.livedUnits.toLocaleString()} ${data.label.toLowerCase()} out of my expected ${data.totalUnits.toLocaleString()}. Time to get moving! ⌛`} />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
