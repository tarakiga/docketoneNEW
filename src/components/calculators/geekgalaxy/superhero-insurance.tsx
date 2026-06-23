"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ShareResult } from "@/components/molecules/share-result"
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
    <div className="almanac max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700" style={{ ['--card' as string]: '#1d1442', ['--ink' as string]: '#ECEAE3', ['--ink-soft' as string]: '#b3aae0', ['--accent' as string]: '#ff8a3c', ['--line' as string]: '#4a3f7a' }}>
      <Card className="border-[#4a3f7a] shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#1d1442', color: '#ECEAE3' }}>
        
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
                <div className="text-5xl sm:text-7xl md:text-9xl font-black text-white italic drop-shadow-[10px_10px_0_#ef4444] uppercase tracking-tighter">
                   {selectedHero.sound}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="border-b border-[#4a3f7a] p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#0c0824' }}>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <CardTitle className="text-xl md:text-3xl font-display flex items-center gap-3" style={{ color: '#ECEAE3' }}>
                  <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" style={{ color: '#ff8a3c' }} />
                  Hero-Liability Quote
                </CardTitle>
                <CardDescription className="text-[10px] md:text-sm font-medium" style={{ color: '#b3aae0' }}>Protecting assets in the world of legends.</CardDescription>
              </div>
              <div className="border rounded-xl px-4 py-2 flex items-center gap-3" style={{ backgroundColor: '#241a52', borderColor: '#ff8a3c' }}>
                 <ShieldAlert className="h-4 w-4 animate-bounce" style={{ color: '#ff8a3c' }} />
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: '#ff8a3c' }}>Status: {selectedCity.alert}</span>
              </div>
           </div>
        </CardHeader>

        <CardContent className="p-0">
           <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#4a3f7a]">

              {/* Form Section */}
              <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 space-y-8 sm:space-y-10">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#b3aae0' }}>
                           <Building className="h-3 w-3" /> Designated Jurisdiction
                        </Label>
                        <Select value={cityId} onValueChange={setCityId}>
                           <SelectTrigger className="h-12 rounded-xl font-bold border-[#4a3f7a] focus:border-[#ff8a3c] focus:ring-1 focus:ring-[#ff8a3c]" style={{ backgroundColor: '#0c0824', color: '#ECEAE3' }}>
                              <SelectValue placeholder="Select City" />
                           </SelectTrigger>
                           <SelectContent style={{ backgroundColor: '#241a52', color: '#ECEAE3', borderColor: '#4a3f7a' }}>
                              {CITIES.map(c => (
                                <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#b3aae0' }}>
                           <Info className="h-3 w-3" /> Property Valuation
                        </Label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold z-10" style={{ color: '#b3aae0' }}>$</span>
                           <Input
                             type="number"
                             className="pl-8 h-12 rounded-xl font-black text-lg border-[#4a3f7a] focus:border-[#ff8a3c] focus:ring-1 focus:ring-[#ff8a3c]"
                             style={{ backgroundColor: '#0c0824', color: '#ECEAE3' }}
                             value={propertyValue}
                             onChange={(e) => setPropertyValue(Number(e.target.value))}
                           />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Primary Hero Exposure</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                           {HERO_MODIFIERS.map(h => (
                             <button
                               key={h.id}
                               onClick={() => {
                                 setActiveHero(h.id)
                                 triggerBlast()
                               }}
                               className="p-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-tighter"
                               style={
                                 activeHero === h.id
                                   ? { backgroundColor: '#ff8a3c', borderColor: '#ff8a3c', color: '#0c0824', transform: 'translateY(-0.25rem)' }
                                   : { backgroundColor: '#241a52', borderColor: '#4a3f7a', color: '#ECEAE3' }
                               }
                             >
                               {h.name.split(' (')[0]}
                             </button>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-5 p-6 rounded-[2rem] border border-[#4a3f7a]" style={{ backgroundColor: '#0c0824' }}>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>
                           <span>Collateral Radius Exposure</span>
                           <span style={{ color: '#ff8a3c' }}>{heroExposure} miles</span>
                        </div>
                        <Slider
                          value={[heroExposure]}
                          onValueChange={([v]) => setHeroExposure(v)}
                          max={100}
                          step={1}
                          className="[&_.range-thumb]:bg-[#ff8a3c]"
                        />
                    </div>
                 </div>
              </div>

              {/* Result Section */}
              <div className="lg:col-span-5 p-5 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-center space-y-6 sm:space-y-8" style={{ backgroundColor: '#0c0824' }}>
                 <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#ff8a3c' }}>Estimated Premium</div>
                    <motion.div
                      key={quote.monthly}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tighter"
                      style={{ color: '#ff8a3c' }}
                    >
                       ${quote.monthly.toLocaleString()}
                       <span className="text-sm font-bold ml-1 uppercase" style={{ color: '#b3aae0' }}>/ mo</span>
                    </motion.div>
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b3aae0' }}>
                       Annual Total: ${quote.annual.toLocaleString()}
                    </div>
                 </div>

                 <div className="flex justify-center mt-6">
                    <ShareResult title="Superhero Insurance" text={`My hero-liability premium is $${quote.monthly}/mo. 🦸💥`} />
                 </div>

                 <div className="w-full space-y-4">
                    <div className="p-6 rounded-3xl border border-[#4a3f7a] text-left space-y-4" style={{ backgroundColor: '#1d1442' }}>
                       <div className="flex justify-between items-center border-b border-[#4a3f7a] pb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#b3aae0' }}>Risk Category</span>
                          <span className="text-xs font-black italic underline underline-offset-4" style={{ color: '#ff8a3c' }}>{quote.riskLevel}</span>
                       </div>
                       <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3" style={{ color: '#ECEAE3' }}>
                             <div className="p-2 rounded-lg" style={{ backgroundColor: '#241a52' }}><Zap className="h-4 w-4" style={{ color: '#ff8a3c' }} /></div>
                             <span className="text-[11px] font-medium leading-tight">Secondary Impact Waiver Included</span>
                          </div>
                          <div className="flex items-center gap-3" style={{ color: '#ECEAE3' }}>
                             <div className="p-2 rounded-lg" style={{ backgroundColor: '#241a52' }}><Flame className="h-4 w-4" style={{ color: '#ff8a3c' }} /></div>
                             <span className="text-[11px] font-medium leading-tight">Heat-Vision Fire Coverage</span>
                          </div>
                       </div>
                    </div>

                    <Button
                      onClick={triggerBlast}
                      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest transition-transform active:scale-95 hover:opacity-90"
                      style={{ backgroundColor: '#ff8a3c', color: '#0c0824' }}
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
           { title: "Shield Waiver", txt: "Optional coverage for Vibranium or Adamanitum incidents.", icon: ShieldCheck },
           { title: "Collateral Aid", txt: "Emergency relocation if your home becomes a boss fight.", icon: Building },
           { title: "Gadget Guard", txt: "Insure high-tech bunkers against EMP or hacking.", icon: Hammer },
           { title: "Speed Claim", txt: "Instant payout for supersonic-boom window damage.", icon: Zap }
         ].map((item, idx) => (
           <Card key={idx} className="p-5 border-[#4a3f7a] hover:border-[#ff8a3c] transition-all cursor-default group" style={{ backgroundColor: '#1d1442' }}>
              <item.icon className="w-5 h-5 mb-3 group-hover:scale-110 transition-transform" style={{ color: '#ff8a3c' }} />
              <div className="font-black text-[10px] uppercase tracking-widest mb-1" style={{ color: '#ECEAE3' }}>{item.title}</div>
              <p className="text-[9px] font-medium leading-tight" style={{ color: '#b3aae0' }}>{item.txt}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
