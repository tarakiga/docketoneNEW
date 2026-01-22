"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Banknote, TrendingDown } from "lucide-react"
import { useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Approx historic inflation averages for US (simplified)
const HISTORIC_RATES = {
  1970: 5.84, 1971: 4.3, 1972: 3.27, 1973: 6.16, 1974: 11.03, 1975: 9.13, 
  1976: 5.76, 1977: 6.5, 1978: 7.59, 1979: 11.35, 1980: 13.5, 1981: 10.32,
  1982: 6.16, 1983: 3.21, 1984: 4.32, 1985: 3.56, 1986: 1.86, 1987: 3.65,
  1988: 4.14, 1989: 4.82, 1990: 5.4, 1991: 4.21, 1992: 3.01, 1993: 2.99,
  1994: 2.56, 1995: 2.83, 1996: 2.95, 1997: 2.29, 1998: 1.56, 1999: 2.21,
  2000: 3.36, 2001: 2.85, 2002: 1.58, 2003: 2.28, 2004: 2.66, 2005: 3.39,
  2006: 3.23, 2007: 2.85, 2008: 3.84, 2009: -0.36, 2010: 1.64, 2011: 3.16,
  2012: 2.07, 2013: 1.46, 2014: 1.62, 2015: 0.12, 2016: 1.26, 2017: 2.13,
  2018: 2.44, 2019: 1.81, 2020: 1.23, 2021: 4.70, 2022: 8.00, 2023: 3.4
}

export function InflationImpact() {
  const [startYear, setStartYear] = useState(1990)
  const [amount, setAmount] = useState(100)
  const [customRate, setCustomRate] = useState(3) // For future projection
  const [mode, setMode] = useState<'historic' | 'future'>('historic')

  const calculation = useMemo(() => {
    let current = amount
    const data = []
    const endYear = mode === 'historic' ? 2023 : startYear + 30
    
    // Initial point
    data.push({ year: startYear, value: amount, buyingPower: amount })

    if (mode === 'historic') {
      let cumulative = amount
      for (let y = startYear + 1; y <= endYear; y++) {
        const rate = HISTORIC_RATES[y as keyof typeof HISTORIC_RATES] || 3
        cumulative = cumulative * (1 + rate / 100)
        // Buying power = how much original money is worth relative to new costs
        // Actually, classic calc: "What $100 in 1990 costs today"
        // Let's do: "Value Erosion". If you kept $100 under a mattress.
        // value = amount / cumulative_inflation
        
        // Let's do: "Equivalent Cost". To buy what cost $100 then, you need X now.
        data.push({ year: y, value: cumulative, rate })
      }
      return { data, final: data[data.length-1].value, label: "Equivalent Cost Today" }
    } else {
      // Future erosion
      // If you have $100 today, what is it worth in 30 years?
      // value = amount / ((1+r)^n)
      for (let i = 1; i <= 30; i++) {
         const year = startYear + i
         const eroded = amount / Math.pow(1 + customRate/100, i)
         data.push({ year, value: eroded })
      }
      return { data, final: data[data.length-1].value, label: "Future Value (Purchasing Power)" }
    }
  }, [amount, startYear, mode, customRate])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-slate-700 flex items-center gap-2">
            <TrendingDown className="h-8 w-8 text-red-500" />
            The Silent Thief (Inflation)
          </CardTitle>
          <CardDescription>Visualize how inflation erodes value or increases costs over time.</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-12 gap-8">
           
           <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setMode('historic')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'historic' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                       Past (History)
                    </button>
                    <button onClick={() => setMode('future')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'future' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                       Future (Projection)
                    </button>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-slate-600">{mode === 'historic' ? 'Start Year' : 'Current Year'}</Label>
                    <Select value={startYear.toString()} onValueChange={(v) => setStartYear(Number(v))}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {mode === 'historic' 
                           ? Object.keys(HISTORIC_RATES).map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)
                           : <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
                        }
                      </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-slate-600">Amount ($)</Label>
                    <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                 </div>

                 {mode === 'future' && (
                    <div className="space-y-4 pt-2">
                       <div className="flex justify-between text-sm">
                          <Label>Assumed Inflation Rate</Label>
                          <span className="font-mono text-red-500">{customRate}%</span>
                       </div>
                       <Slider value={[customRate]} onValueChange={([v]) => setCustomRate(v)} min={1} max={15} step={0.5} className="[&_.range-thumb]:bg-red-500" />
                    </div>
                 )}
              </div>
           </div>

           <div className="lg:col-span-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Original Amount</div>
                    <div className="text-4xl font-black text-slate-800">${amount.toLocaleString()}</div>
                    <div className="text-sm text-slate-400 mt-2">
                       in {startYear}
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{calculation.label}</div>
                    <div className={`text-4xl font-black ${mode === 'historic' ? 'text-red-600' : 'text-orange-600'}`}>
                      ${calculation.final.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-slate-400 mt-2">
                       in {mode === 'historic' ? '2023' : startYear + 30}
                    </div>
                 </div>
              </div>

              <div className="h-[300px] w-full bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={calculation.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Value']}
                      />
                      <Line type="monotone" dataKey="value" stroke={mode === 'historic' ? '#ef4444' : '#f97316'} strokeWidth={3} dot={false} />
                   </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 flex gap-3">
                 <Banknote className="h-5 w-5 shrink-0" />
                 <p>
                    {mode === 'historic' 
                       ? `That's a ${(calculation.final / amount * 100 - 100).toFixed(0)}% increase in prices since ${startYear}. Ouch.` 
                       : `Your money will lose ${(100 - (calculation.final / amount * 100)).toFixed(0)}% of its purchasing power in 30 years at this rate.`
                    }
                 </p>
              </div>

              <ShareResult title="Inflation is scary" text={`$${amount} in ${startYear} is equivalent to $${calculation.final.toFixed(2)} today. Thanks, inflation. 💸`} />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
