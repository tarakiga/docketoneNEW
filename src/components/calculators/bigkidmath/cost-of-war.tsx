"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AnimatePresence, motion } from "framer-motion"
import {
    Crosshair,
    DollarSign,
    Droplets,
    Flame,
    Globe,
    GraduationCap,
    Heart,
    Home,
    ShieldAlert,
    Stethoscope
} from "lucide-react"
import { useMemo, useState } from "react"

const MUNITIONS = [
  { 
    id: 'stinger', 
    name: 'Stinger Missile', 
    cost: 480000, 
    desc: 'Surface-to-air defense system.',
    equivalents: [
      { label: 'Surgeon Salaries', val: 1.5, icon: Stethoscope },
      { label: 'Primary Schools Built', val: 0.1, icon: Home },
      { label: 'Scholarships Provided', val: 48, icon: GraduationCap }
    ]
  },
  { 
    id: 'javelin', 
    name: 'Javelin Anti-Tank', 
    cost: 200000, 
    desc: 'Top-attack anti-armor weapon.',
    equivalents: [
      { label: 'Teacher Salaries', val: 4, icon: GraduationCap },
      { label: 'Emergency Room Shifts', val: 85, icon: Stethoscope },
      { label: 'Low-Income Housing Units', val: 1, icon: Home }
    ]
  },
  { 
    id: 'tomahawk', 
    name: 'Tomahawk Cruise Missile', 
    cost: 2000000, 
    desc: 'Long-range tactical strike.',
    equivalents: [
      { label: 'Community Clinics Built', val: 0.5, icon: Stethoscope },
      { label: 'Years of Clean Water (Small City)', val: 2, icon: Droplets },
      { label: 'Public Library Collection', val: 1, icon: Home }
    ]
  },
  { 
    id: 'patriot', 
    name: 'Patriot PAC-3', 
    cost: 4000000, 
    desc: 'Advanced interceptor missile.',
    equivalents: [
      { label: 'Elementary School Annual Budget', val: 1, icon: GraduationCap },
      { label: 'Nurses Trained', val: 120, icon: Stethoscope },
      { label: 'Disaster Relief Kits', val: 10000, icon: ShieldAlert }
    ]
  },
  { 
    id: 'f35', 
    name: 'F-35 Lightning II', 
    cost: 82500000, 
    desc: '5th Generation stealth fighter.',
    equivalents: [
      { label: 'Kidney Transplants', val: 330, icon: Heart },
      { label: 'Water Wells in Developing Nations', val: 15000, icon: Droplets },
      { label: 'Homeless Shelters Built', val: 12, icon: Home }
    ]
  },
]

export function CostOfWar() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [taxContribution, setTaxContribution] = useState(15000)
  const activeMunition = MUNITIONS[selectedIndex]

  // US Defense Budget reference (~$850B)
  const DEFENSE_BUDGET_SEC = 850000000000 / (365 * 24 * 60 * 60) // $26,953 per second
  
  const stats = useMemo(() => {
    const taxShare = taxContribution / 850000000000
    const fundedSeconds = (taxContribution / DEFENSE_BUDGET_SEC)
    
    return {
      taxShare,
      fundedSeconds: fundedSeconds.toFixed(6)
    }
  }, [taxContribution, DEFENSE_BUDGET_SEC])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="white-glass-card border-slate-200/60 shadow-2xl relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#002244 1px, transparent 1px)',
               backgroundSize: '24px 24px'
             }}>
        </div>

        <CardHeader className="border-b border-slate-100 bg-white/50 relative z-10 p-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-1 text-center md:text-left">
                <CardTitle className="text-4xl font-display text-slate-900 flex items-center justify-center md:justify-start gap-4">
                  <span className="bg-slate-950 text-white p-2 rounded-lg"><Crosshair className="h-6 w-6"/></span>
                  The Cost of War
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium max-w-lg">
                  Visualizing the opportunity cost of modern military investment vs. societal benefit.
                </CardDescription>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Global Impact</div>
                    <div className="text-xl font-black text-rose-600">$2.4T+ / yr</div>
                 </div>
                 <Globe className="h-8 w-8 text-rose-400 animate-pulse" />
              </div>
           </div>
        </CardHeader>
        
        <CardContent className="p-0 relative z-10">
           <div className="grid lg:grid-cols-2">
              
              {/* Tactical Pane */}
              <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-10">
                 <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Weapon Selection</Label>
                    <div className="grid grid-cols-1 gap-3">
                       {MUNITIONS.map((m, idx) => (
                         <button
                           key={m.id}
                           onClick={() => setSelectedIndex(idx)}
                           className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${
                             selectedIndex === idx 
                               ? "bg-slate-950 border-slate-950 text-white shadow-xl -translate-y-1" 
                               : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                           }`}
                         >
                            <div className="text-left">
                               <div className={`font-black text-sm uppercase tracking-tight ${selectedIndex === idx ? 'text-white' : 'text-slate-900 group-hover:text-black'}`}>
                                  {m.name}
                               </div>
                               <div className={`text-[10px] font-medium opacity-60`}>{m.desc}</div>
                            </div>
                            <div className="text-right">
                               <div className={`font-mono text-lg font-bold ${selectedIndex === idx ? 'text-rose-400' : 'text-slate-400'}`}>
                                  ${(m.cost / 1000).toLocaleString()}k
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 space-y-6 shadow-inner">
                    <div className="flex justify-between items-end">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Annual Tax Contribution</Label>
                       <span className="text-xl font-black text-slate-900">${taxContribution.toLocaleString()}</span>
                    </div>
                    <Slider 
                      value={[taxContribution]} 
                      onValueChange={([v]) => setTaxContribution(v)} 
                      min={1000} 
                      max={100000} 
                      step={500}
                      className="[&_.range-thumb]:bg-slate-950"
                    />
                    <div className="pt-4 border-t border-slate-200">
                       <div className="flex items-start gap-4">
                          <div className="bg-slate-950 p-2 rounded-xl mt-1">
                             <ShieldAlert className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div className="space-y-1">
                             <div className="text-lg font-black text-slate-900 leading-none">
                                {stats.fundedSeconds} SECONDS
                             </div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                OF THE GLOBAL DEFENSE ENGINE FUNDED BY YOU
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Opportunity Pane */}
              <div className="p-8 lg:p-12 bg-white flex flex-col justify-center gap-12 relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-indigo-500/[0.03] pointer-events-none" />
                 
                 <div className="text-center space-y-2 relative z-10">
                    <div className="text-rose-600 font-black uppercase text-xs tracking-[0.5em] mb-4 flex items-center justify-center gap-3">
                       <Flame className="h-4 w-4 animate-bounce" /> The Destruction
                    </div>
                    <div className="text-7xl font-black text-slate-950 tracking-tighter drop-shadow-sm">
                       ${(activeMunition.cost).toLocaleString()}
                    </div>
                    <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Per unit procurement cost</div>
                 </div>

                 <div className="grid gap-4 relative z-10">
                    <div className="flex items-center gap-4 px-2">
                       <div className="h-px flex-1 bg-slate-100" />
                       <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Equivalent Socio-Economic Value</div>
                       <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <AnimatePresence mode="wait">
                       <motion.div 
                         key={activeMunition.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -20 }}
                         className="grid gap-4"
                       >
                          {activeMunition.equivalents.map((eq, i) => (
                             <div key={i} className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 group hover:scale-[1.02] transition-transform">
                                <div className="bg-emerald-50 p-4 rounded-3xl group-hover:bg-emerald-100 transition-colors">
                                   <eq.icon className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                   <div className="text-4xl font-black text-slate-900 tracking-tighter">
                                      {eq.val}x
                                   </div>
                                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                      {eq.label}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </motion.div>
                    </AnimatePresence>
                 </div>

                 <div className="pt-6 relative z-10">
                    <ShareResult 
                      title="The Cost of War Calculator"
                      text={`I just discovered that 1 ${activeMunition.name} costs $${activeMunition.cost.toLocaleString()}, which could fund ${activeMunition.equivalents[0].val}x ${activeMunition.equivalents[0].label}. See the real price of conflict at #DocketOne.`}
                    />
                 </div>
              </div>

           </div>
        </CardContent>
      </Card>
      
      {/* Educational Footer */}
      <div className="grid md:grid-cols-3 gap-6">
         {[
           { title: "Opportunity Cost", desc: "Every dollar spent on munitions is a dollar that cannot be used for healthcare, housing, or education.", icon: Heart, color: "text-rose-500" },
           { title: "The Industrial Cycle", desc: "Military spending is often locked into multi-decade contracts that persist regardless of peace.", icon: ShieldAlert, color: "text-amber-500" },
           { title: "Long-term Debt", desc: "Wars are rarely funded by current taxes; they are funded by borrowing against future generations.", icon: DollarSign, color: "text-emerald-500" }
         ].map((item, idx) => (
           <Card key={idx} className="white-glass-card p-6 border-slate-100 hover:shadow-lg transition-all group">
              <div className={`${item.color} mb-4 flex justify-between items-center`}>
                 <item.icon className="h-6 w-6" />
                 <span className="text-[10px] font-black uppercase text-slate-300">Section 0{idx+1}</span>
              </div>
              <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium font-mono italic">{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
