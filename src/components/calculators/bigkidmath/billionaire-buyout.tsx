"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import {
    Beef,
    Building2,
    DollarSign,
    FastForward,
    Globe,
    Heart,
    Home,
    Ship,
    TrendingUp,
    Wallet,
    Zap
} from "lucide-react"
import { useEffect, useState } from "react"

const BILLIONAIRES = [
  { id: 'musk', name: 'Elon Musk', wealth: 245000000000, color: 'text-indigo-500' },
  { id: 'bezos', name: 'Jeff Bezos', wealth: 200000000000, color: 'text-orange-500' },
  { id: 'zuck', name: 'Mark Zuckerberg', wealth: 195000000000, color: 'text-blue-500' },
  { id: 'gates', name: 'Bill Gates', wealth: 125000000000, color: 'text-cyan-500' },
  { id: 'buffett', name: 'Warren Buffett', wealth: 140000000000, color: 'text-emerald-500' }
]

const SHOP_ITEMS = [
  { label: 'Superyacht', price: 500000000, icon: Ship, cat: 'Luxury' },
  { label: 'Private Island', price: 100000000, icon: Globe, cat: 'Real Estate' },
  { label: 'F-35 Fighter Jet', price: 80000000, icon: Zap, cat: 'Defense' },
  { label: 'Hyper-Luxury Mansion', price: 50000000, icon: Home, cat: 'Real Estate' },
  { label: 'SpaceX Rocket Launch', price: 67000000, icon: FastForward, cat: 'Space' },
  { label: 'Small Nation GDP', price: 1000000000, icon: Building2, cat: 'Global' },
  { label: 'Meal for 1 Million People', price: 5000000, icon: Beef, cat: 'Humanitarian' },
  { label: 'High-Tech Hospital', price: 250000000, icon: Heart, cat: 'Healthcare' },
]

export function BillionaireBuyout() {
  const [personId, setPersonId] = useState('musk')
  const [balance, setBalance] = useState(0)
  const [interestEarned, setInterestEarned] = useState(0)

  const selectedPerson = BILLIONAIRES.find(p => p.id === personId) || BILLIONAIRES[0]

  useEffect(() => {
    setBalance(selectedPerson.wealth)
    setInterestEarned(0)
  }, [selectedPerson])

  // Real-time interest simulator (~7% annual returns)
  useEffect(() => {
    const timer = setInterval(() => {
      const perSec = (selectedPerson.wealth * 0.07) / (365 * 24 * 60 * 60)
      setInterestEarned(prev => prev + (perSec / 10))
    }, 100)
    return () => clearInterval(timer)
  }, [selectedPerson])

  const buy = (price: number) => {
    setBalance(prev => Math.max(0, prev - price))
  }

  const reset = () => {
    setBalance(selectedPerson.wealth)
    setInterestEarned(0)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Wealth Header */}
      <div className="grid lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 white-glass-card border-indigo-100 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
               <Wallet className="w-64 h-64 -mr-20 -mt-20" />
            </div>
            <CardHeader className="pb-4">
               <div className="flex justify-between items-center">
                  <div className="space-y-1">
                     <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Net Worth Controller</CardTitle>
                     <Select value={personId} onValueChange={setPersonId}>
                        <SelectTrigger className="border-none p-0 h-auto bg-transparent focus:ring-0 shadow-none text-4xl font-black text-slate-950 tracking-tighter">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                           {BILLIONAIRES.map(p => (
                             <SelectItem key={p.id} value={p.id} className="font-bold">{p.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <Button variant="outline" onClick={reset} className="rounded-full font-bold px-6 border-indigo-100 hover:bg-indigo-50">Reset Vault</Button>
               </div>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
               <div className="space-y-2">
                  <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">Active Liquidity</div>
                  <motion.div 
                    key={balance}
                    className="text-8xl font-black text-slate-950 tracking-tighter break-all"
                  >
                     ${Math.floor(balance).toLocaleString()}
                  </motion.div>
               </div>
               
               <div className="flex items-center gap-6 pt-4 border-t border-indigo-50">
                  <div className="flex-1 space-y-1">
                     <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" /> Real-time Interest Growth
                     </div>
                     <div className="text-3xl font-black text-emerald-500 font-mono tracking-tighter">
                        +${interestEarned.toFixed(2)}
                     </div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-400 max-w-[120px] leading-tight font-mono italic">
                     *Based on estimated 7% return on assets.
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-slate-950 text-white p-8 flex flex-col justify-center gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
            <div className="space-y-2 relative z-10">
               <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Statistical Insight</div>
               <h3 className="text-2xl font-black leading-tight tracking-tight">At this rate, you'd have to spend $1M every day for...</h3>
               <div className="text-6xl font-black text-indigo-100 tracking-tighter">
                  {Math.floor(balance / 1000000 / 365)} <span className="text-xl text-indigo-400 uppercase">Years</span>
               </div>
               <p className="text-xs text-slate-500 font-medium">Just to reach zero (without accounting for interest).</p>
            </div>
         </Card>
      </div>

      {/* Shopping Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {SHOP_ITEMS.map((item, idx) => (
           <motion.button
             whileHover={{ y: -5 }}
             whileTap={{ scale: 0.98 }}
             key={idx}
             onClick={() => buy(item.price)}
             className="white-glass-card p-5 md:p-6 border-slate-100 hover:border-slate-300 transition-all text-left flex flex-col justify-between h-[180px] md:h-[220px] group relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-indigo-600 text-white rounded-full p-1"><DollarSign className="h-3 w-3" /></div>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-slate-50 p-3 rounded-2xl w-fit group-hover:bg-indigo-50 transition-colors">
                    <item.icon className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                 </div>
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{item.cat}</div>
                    <div className="font-black text-sm text-slate-900 leading-tight">{item.label}</div>
                 </div>
              </div>
              
              <div className="pt-4 border-t border-slate-50">
                 <div className="font-mono text-xs font-black text-indigo-600 uppercase tracking-tighter">
                    ${(item.price / 1000000 >= 1 ? `${item.price / 1000000}M` : `${item.price.toLocaleString()}`)}
                 </div>
                 <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Single Unit Cost</div>
              </div>
           </motion.button>
         ))}
      </div>

      <div className="pt-8 flex justify-center">
         <ShareResult 
            title="Billionaire Buy-Out Challenge"
            text={`I tried to spend ${selectedPerson.name}'s wealth! Even after buying everything, I still have $${Math.floor(balance).toLocaleString()} left. The wealth scale is insane! #DocketOne`}
         />
      </div>
    </div>
  )
}
