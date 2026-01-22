"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pizza, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

type PizzaType = {
  id: string
  size: number
  price: number
  name: string
}

export function PizzaPiCalculator() {
  const [pizzas, setPizzas] = useState<PizzaType[]>([
    { id: '1', size: 12, price: 15, name: 'Medium' },
    { id: '2', size: 18, price: 28, name: 'X-Large' },
  ])

  const calculate = (p: PizzaType) => {
    const radius = p.size / 2
    const area = Math.PI * radius * radius
    const ratio = area / p.price
    return { area, ratio }
  }

  const results = useMemo(() => {
    const stats = pizzas.map(p => {
      const { area, ratio } = calculate(p)
      return { ...p, area, ratio }
    })
    
    // Find best value
    const best = [...stats].sort((a, b) => b.ratio - a.ratio)[0]
    return { stats, best }
  }, [pizzas])

  const addPizza = () => {
    setPizzas([...pizzas, { id: Math.random().toString(), size: 14, price: 20, name: `Pizza ${pizzas.length + 1}` }])
  }

  const removePizza = (id: string) => {
    setPizzas(pizzas.filter(p => p.id !== id))
  }

  const updatePizza = (id: string, field: keyof PizzaType, value: string | number) => {
    setPizzas(pizzas.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-orange-50/50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-orange-600 flex items-center gap-2">
            <Pizza className="h-8 w-8" />
            Pizza Pi Optimizer
          </CardTitle>
          <CardDescription>Scientific proof that bigger is usually better.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="grid gap-6">
            {pizzas.map((p, i) => (
              <div key={p.id} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center transition-all ${results.best?.id === p.id ? 'bg-green-50 border-green-300 ring-2 ring-green-400' : 'bg-white border-slate-200'}`}>
                 <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                       <Input value={p.name} onChange={(e) => updatePizza(p.id, 'name', e.target.value)} className="font-bold border-transparent hover:border-slate-300 focus:border-orange-400" />
                       {pizzas.length > 1 && (
                         <Button variant="ghost" size="icon" onClick={() => removePizza(p.id)} className="text-slate-400 hover:text-red-500">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       )}
                    </div>
                    <div className="flex gap-4">
                       <div className="space-y-1">
                          <Label className="text-xs text-slate-500 uppercase">Diameter (in)</Label>
                          <Input type="number" value={p.size} onChange={(e) => updatePizza(p.id, 'size', Number(e.target.value))} className="w-24" />
                       </div>
                       <div className="space-y-1">
                          <Label className="text-xs text-slate-500 uppercase">Price ($)</Label>
                          <Input type="number" value={p.price} onChange={(e) => updatePizza(p.id, 'price', Number(e.target.value))} className="w-24" />
                       </div>
                    </div>
                 </div>

                 {/* Visual Area */}
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className={`rounded-full border-2 border-dashed ${results.best?.id === p.id ? 'bg-orange-200/50 border-orange-500' : 'bg-slate-100 border-slate-300'}`}
                         style={{ width: `${(p.size / 30) * 100}%`, height: `${(p.size / 30) * 100}%` }} />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-slate-600 pointer-events-none">
                       {Math.round(calculate(p).area)} in²
                    </div>
                 </div>

                 <div className="text-right min-w-[120px]">
                    <div className="text-xs text-slate-500 uppercase mb-1">Value Score</div>
                    <div className={`text-2xl font-black ${results.best?.id === p.id ? 'text-green-600' : 'text-slate-400'}`}>
                      {calculate(p).ratio.toFixed(2)}
                      <span className="text-xs font-normal text-slate-400 ml-1">in²/$</span>
                    </div>
                 </div>
              </div>
            ))}
            
            {pizzas.length < 4 && (
              <Button onClick={addPizza} variant="outline" className="border-dashed border-2 py-8 hover:border-orange-400 hover:text-orange-500">
                + Add Comparison
              </Button>
            )}
          </div>

          <div className="bg-orange-100 rounded-xl p-6 border border-orange-200">
             <h3 className="font-bold text-orange-800 mb-2">The Verdict</h3>
             <p className="text-orange-900 leading-relaxed">
               The <span className="font-black">{results.best?.name}</span> is the mathematical winner, offering <span className="font-bold">{((results.best!.ratio / results.stats.sort((a,b) => a.ratio - b.ratio)[0].ratio) * 100 - 100).toFixed(0)}% more pizza</span> per dollar than the worst option.
               <br/>
               Always optimize for circular area—it scales quadratically!
             </p>
             <div className="mt-4">
               <ShareResult title="Pizza Maths" text={`I calculated that the ${results.best?.name} pizza (${results.best?.size}") is ${results.best?.ratio.toFixed(2)} sq inches per dollar! 🍕`} />
             </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
