"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AnimatePresence, motion } from "framer-motion"
import { Building, Flame, Hammer, Info, ShieldAlert, ShieldCheck, Zap } from "lucide-react"
import { useMemo, useState } from "react"

const CITIES = [
  { id: 'metropolis', name: 'Metropolis', baseRisk: 1.2, alert: "Extraterrestrial Threats High" },
  { id: 'gotham', name: 'Gotham City', baseRisk: 1.8, alert: "Chronic Arson & Chemical Hazards" },
  { id: 'central-city', name: 'Central City', baseRisk: 1.1, alert: "Temporal Anomalies Common" },
  { id: 'wakanda', name: 'Birnin Zana (Wakanda)', baseRisk: 0.5, alert: "Vibranium Shield Active" },
  { id: 'hells-kitchen', name: 'Hell\'s Kitchen', baseRisk: 1.5, alert: "Street-Level Vigilante Zone" }
]

const HERO_MODIFIERS = [
  { id: 'hulk', name: 'Gamma-Class (e.g. Hulk)', multiplier: 5.0, sound: 'SMASH!' },
  { id: 'superman', name: 'Omega-Class (e.g. Superman)', multiplier: 2.5, sound: 'WHOOSH!' },
  { id: 'spiderman', name: 'Street-Level (e.g. Spiderman)', multiplier: 1.2, sound: 'THWIP!' },
  { id: 'batman', name: 'Non-Powered (e.g. Batman)', multiplier: 1.8, sound: 'KAPOW!' },
]

export function SuperheroInsuranceQuote() {
  const [cityId, setCityId] = useState('metropolis')
  const [propertyValue, setPropertyValue] = useState(500000)
  const [heroExposure, setHeroExposure] = useState(50)
  const [activeHero, setActiveHero] = useState('superman')
  const [showBlast, setShowBlast] = useState(false)

  const selectedCity = CITIES.find(c => c.id === cityId) || CITIES[0]
  const selectedHero = HERO_MODIFIERS.find(h => h.id === activeHero) || HERO_MODIFIERS[0]

  const quote = useMemo(() => {
    const base = propertyValue * 0.002
    const risk = base * selectedCity.baseRisk
    const heroImpact = risk * (selectedHero.multiplier * (heroExposure / 50))
    const monthly = (risk + heroImpact) / 12
    
    return {
      monthly: Math.round(monthly),
      annual: Math.round(monthly * 12),
      riskLevel: selectedCity.baseRisk > 1.5 ? "EXTREME" : "HIGH"
    }
  }, [propertyValue, selectedCity, selectedHero, heroExposure])

  const triggerBlast = () => {
    setShowBlast(true)
    setTimeout(() => setShowBlast(false), 800)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <Card className="white-glass-card border-slate-200 shadow-2xl relative overflow-hidden">
        
        {/* Comic Overlay Effect */}
        <AnimatePresence>
          {showBlast && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1.5, opacity: 1, rotate: 10 }}
              exit={{ scale: 2, opacity: 0, rotate: 30 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-40 animate-pulse" />
                <div className="text-9xl font-black text-white italic drop-shadow-[10px_10px_0_#ef4444] uppercase tracking-tighter">
                   {selectedHero.sound}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-display flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                  Hero-Liability Insurance Quote
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Protecting your assets in the world of legends.</CardDescription>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 flex items-center gap-3">
                 <ShieldAlert className="h-4 w-4 text-rose-500 animate-bounce" />
                 <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest leading-none">Status: {selectedCity.alert}</span>
              </div>
           </div>
        </CardHeader>

        <CardContent className="p-0">
           <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Form Section */}
              <div className="lg:col-span-7 p-8 lg:p-12 space-y-10">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <Building className="h-3 w-3" /> Designated Jurisdiction
                        </Label>
                        <Select value={cityId} onValueChange={setCityId}>
                           <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl font-bold">
                              <SelectValue placeholder="Select City" />
                           </SelectTrigger>
                           <SelectContent>
                              {CITIES.map(c => (
                                <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <Info className="h-3 w-3" /> Property Valuation
                        </Label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                           <Input 
                             type="number" 
                             className="pl-8 bg-white border-slate-200 h-12 rounded-xl font-black text-lg"
                             value={propertyValue}
                             onChange={(e) => setPropertyValue(Number(e.target.value))}
                           />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Primary Hero Exposure</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                           {HERO_MODIFIERS.map(h => (
                             <button
                               key={h.id}
                               onClick={() => {
                                 setActiveHero(h.id)
                                 triggerBlast()
                               }}
                               className={`p-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-tighter ${
                                 activeHero === h.id ? "bg-slate-950 border-slate-950 text-white shadow-lg -translate-y-1" : "bg-white border-slate-100 hover:border-slate-200"
                               }`}
                             >
                               {h.name.split(' (')[0]}
                             </button>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-5 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                           <span>Collateral Radius Exposure</span>
                           <span className="text-slate-950">{heroExposure} miles</span>
                        </div>
                        <Slider 
                          value={[heroExposure]} 
                          onValueChange={([v]) => setHeroExposure(v)} 
                          max={100} 
                          step={1}
                          className="[&_.range-thumb]:bg-slate-950"
                        />
                    </div>
                 </div>
              </div>

              {/* Result Section */}
              <div className="lg:col-span-5 p-8 lg:p-12 bg-slate-50/30 flex flex-col justify-center items-center text-center space-y-8">
                 <div className="space-y-2">
                    <div className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Estimated Premium</div>
                    <motion.div 
                      key={quote.monthly}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl font-sans font-black text-slate-950 tracking-tighter"
                    >
                       ${quote.monthly.toLocaleString()}
                       <span className="text-sm text-slate-400 font-bold ml-1 uppercase">/ mo</span>
                    </motion.div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Annual Total: ${quote.annual.toLocaleString()}
                    </div>
                 </div>

                 <div className="w-full space-y-4">
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/20 text-left space-y-4">
                       <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Category</span>
                          <span className="text-xs font-black text-rose-600 italic underline decoration-rose-500/30 underline-offset-4">{quote.riskLevel}</span>
                       </div>
                       <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-slate-600">
                             <div className="bg-orange-100 p-2 rounded-lg"><Zap className="h-4 w-4 text-orange-600" /></div>
                             <span className="text-[11px] font-medium leading-tight">Secondary Impact Waiver Included</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600">
                             <div className="bg-red-100 p-2 rounded-lg"><Flame className="h-4 w-4 text-red-600" /></div>
                             <span className="text-[11px] font-medium leading-tight">Heat-Vision Fire Coverage</span>
                          </div>
                       </div>
                    </div>
                    
                    <Button 
                      onClick={triggerBlast}
                      className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest transition-transform active:scale-95"
                    >
                      Process Claim
                    </Button>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { title: "Shield Waiver", txt: "Optional coverage for Vibranium or Adamanitum incidents.", icon: ShieldCheck, color: "text-blue-500" },
           { title: "Collateral Aid", txt: "Emergency relocation if your home becomes a boss fight.", icon: Building, color: "text-emerald-500" },
           { title: "Gadget Guard", txt: "Insure high-tech bunkers against EMP or hacking.", icon: Hammer, color: "text-orange-500" },
           { title: "Speed Claim", txt: "Instant payout for supersonic-boom window damage.", icon: Zap, color: "text-purple-500" }
         ].map((item, idx) => (
           <Card key={idx} className="white-glass-card p-5 border-slate-100 hover:border-slate-300 transition-all cursor-default group">
              <item.icon className={`${item.color} w-5 h-5 mb-3 group-hover:scale-110 transition-transform`} />
              <div className="font-black text-[10px] uppercase tracking-widest text-slate-900 mb-1">{item.title}</div>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">{item.txt}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
