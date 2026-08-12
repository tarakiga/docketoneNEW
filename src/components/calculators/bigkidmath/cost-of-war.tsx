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
    const fundedSeconds = taxContribution / DEFENSE_BUDGET_SEC
    return { fundedSeconds: fundedSeconds.toFixed(3) }
  }, [taxContribution, DEFENSE_BUDGET_SEC])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="border-[var(--dk-line)] shadow-2xl relative overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(var(--dk-tea) 1px, transparent 1px)',
               backgroundSize: '24px 24px'
             }}>
        </div>

        <CardHeader className="border-b border-[var(--dk-line)] relative z-10 p-8" style={{ backgroundColor: 'var(--dk-raised)' }}>
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-1 text-center md:text-left">
                <CardTitle className="text-4xl font-display flex items-center justify-center md:justify-start gap-4" style={{ color: 'var(--ink)' }}>
                  <span className="p-2 rounded-lg" style={{ backgroundColor: 'var(--dk-tea)', color: 'var(--dk-on-fill)' }}><Crosshair className="h-6 w-6"/></span>
                  The Cost of War
                </CardTitle>
                <CardDescription className="font-medium max-w-lg" style={{ color: 'var(--ink-soft)' }}>
                  Educational comparison of military procurement costs and societal opportunity benefits.
                </CardDescription>
              </div>
              <div className="border border-[var(--dk-line)] rounded-2xl p-4 flex items-center gap-4 shadow-sm" style={{ backgroundColor: 'var(--dk-sunk)' }}>
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: 'var(--ink-soft)' }}>Global Impact</div>
                    <div className="text-xl font-black text-[var(--dk-neg-ink)]">$2.4T+ / yr</div>
                 </div>
                 <Globe className="h-8 w-8 text-[var(--dk-neg-ink)] animate-pulse" />
              </div>
           </div>
        </CardHeader>
        
        <CardContent className="p-0 relative z-10">
           {/* min-w-0 on the grid and its children: grid items default to
               min-width:auto, so a wide child (the cost figure, the weapon
               labels) refuses to shrink and pushes the track past the card,
               which then clips it. */}
           <div className="grid lg:grid-cols-2 min-w-0">
              
              {/* Tactical Pane */}
              <div className="min-w-0 p-4 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--dk-line)] space-y-8 sm:space-y-10">
                 <div className="space-y-5 sm:space-y-6">
                    <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]" style={{ color: 'var(--ink-soft)' }}>Weapon Selection</Label>
                    <div className="grid grid-cols-1 gap-3">
                       {MUNITIONS.map((m, idx) => (
                         <button
                           key={m.id}
                           onClick={() => setSelectedIndex(idx)}
                          className="flex items-center justify-between p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-3xl border-2 transition-all group gap-3 sm:gap-4 min-h-[64px]"
                          style={
                            selectedIndex === idx
                              ? { backgroundColor: 'var(--dk-tea)', borderColor: 'var(--dk-tea-ink)', color: 'var(--dk-on-fill)' }
                              : { backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)', color: 'var(--ink-soft)' }
                          }
                         >
                            <div className="text-left flex-1 min-w-0">
                               <div className="font-black text-[11px] sm:text-[12px] md:text-sm uppercase tracking-tight whitespace-normal break-words" style={{ color: selectedIndex === idx ? 'var(--dk-on-fill)' : 'var(--ink)' }}>
                                  {m.name}
                               </div>
                               <div className="text-[8px] sm:text-[9px] md:text-[10px] font-medium opacity-60 truncate">{m.desc}</div>
                            </div>
                            <div className="text-right shrink-0">
                               <div className="font-mono text-xs sm:text-sm md:text-lg font-bold tabular-nums" style={{ color: selectedIndex === idx ? 'var(--dk-on-fill)' : 'var(--ink-soft)' }}>
                                  ${(m.cost / 1000).toLocaleString()}k
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-[var(--dk-line)] space-y-5 sm:space-y-6 shadow-inner" style={{ backgroundColor: 'var(--dk-sunk)' }}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                       <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink-soft)' }}>Your Annual Tax Contribution</Label>
                       <span className="text-lg sm:text-xl font-black text-[var(--dk-tea-ink)]">${taxContribution.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[taxContribution]}
                      onValueChange={([v]) => setTaxContribution(v)}
                      min={1000}
                      max={100000}
                      step={500}
                      className="[&_.range-thumb]:bg-[var(--dk-tea)]"
                    />
                    <div className="pt-4 border-t border-[var(--dk-line)]">
                       <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-1.5 sm:p-2 rounded-xl mt-1" style={{ backgroundColor: 'var(--dk-raised)' }}>
                             <ShieldAlert className="h-4 w-4 text-[var(--dk-pos-ink)]" />
                          </div>
                          <div className="space-y-1">
                             <div className="text-base sm:text-lg font-black leading-none" style={{ color: 'var(--ink)' }}>
                                {stats.fundedSeconds} SECONDS
                             </div>
                             <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-soft)' }}>
                                OF THE U.S. DEFENSE BUDGET FUNDED BY YOU
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Opportunity Pane */}
              {/* p-8 was 32px of padding on a 375px screen; the result panel
                  needs the width more than the breathing room */}
              <div className="min-w-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-center gap-8 sm:gap-12 relative" style={{ backgroundColor: 'var(--card)' }}>
                 <div className="text-center space-y-2 relative z-10">
                    <div className="text-[var(--dk-neg-ink)] font-black uppercase text-[10px] md:text-xs tracking-[0.5em] mb-4 flex items-center justify-center gap-3">
                       <Flame className="h-4 w-4 animate-bounce" /> The Destruction
                    </div>
                    {/* fluid, because the figure ranges from $200,000 to
                        $82,500,000 — a fixed 48px would fit the short one and
                        overflow the long one */}
                    <div className="text-[clamp(1.9rem,8.5vw,4.5rem)] font-black tracking-tighter leading-none break-words" style={{ color: 'var(--ink)' }}>
                       ${(activeMunition.cost).toLocaleString()}
                    </div>
                    <div className="font-bold uppercase text-[9px] md:text-[10px] tracking-widest" style={{ color: 'var(--ink-soft)' }}>Per unit procurement cost</div>
                 </div>

                 {/* min-w-0 has to run the whole chain: the text wrapper below
                     already had it, but these grids and the card row did not,
                     so the constraint was broken before it reached there */}
                 <div className="grid gap-4 relative z-10 min-w-0">
                    <div className="flex items-center gap-4 px-2">
                       <div className="h-px flex-1 bg-[var(--dk-mute)]" />
                       <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--ink-soft)' }}>Socio-Economic Value</div>
                       <div className="h-px flex-1 bg-[var(--dk-mute)]" />
                    </div>

                    <AnimatePresence mode="wait">
                       <motion.div 
                         key={activeMunition.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -20 }}
                         className="grid gap-4 min-w-0"
                       >
                          {activeMunition.equivalents.map((eq, i) => (
                             <div key={i} className="flex items-center min-w-0 gap-3 md:gap-6 p-3 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-[var(--dk-line)] shadow-xl group hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'var(--dk-sunk)' }}>
                                <div className="p-3 md:p-4 rounded-xl md:rounded-3xl transition-colors shrink-0" style={{ backgroundColor: 'var(--dk-raised)' }}>
                                   <eq.icon className="h-6 w-6 md:h-8 md:w-8 text-[var(--dk-pos-ink)]" />
                                </div>
                                <div className="min-w-0">
                                   <div className="text-2xl md:text-4xl font-black tracking-tighter text-[var(--dk-tea-ink)]">
                                      {eq.val}x
                                   </div>
                                   <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest truncate" style={{ color: 'var(--ink-soft)' }}>
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
                      resultValue={`1 ${activeMunition.name} = ${activeMunition.equivalents[0].val}x ${activeMunition.equivalents[0].label}`}
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
           { title: "Opportunity Cost", desc: "Every dollar spent on munitions is a dollar that cannot be used for healthcare, housing, or education.", icon: Heart, color: "text-[var(--dk-neg-ink)]" },
           { title: "The Industrial Cycle", desc: "Military spending is often locked into multi-decade contracts that persist regardless of peace.", icon: ShieldAlert, color: "text-[var(--dk-yel-ink)]" },
           { title: "Long-term Debt", desc: "Wars are rarely funded by current taxes; they are funded by borrowing against future generations.", icon: DollarSign, color: "text-[var(--dk-pos-ink)]" }
         ].map((item, idx) => (
           <Card key={idx} className="p-6 border-[var(--dk-line)] hover:shadow-lg transition-all group" style={{ backgroundColor: 'var(--card)' }}>
              <div className={`${item.color} mb-4 flex justify-between items-center`}>
                 <item.icon className="h-6 w-6" />
                 <span className="text-[10px] font-black uppercase" style={{ color: 'var(--ink-soft)' }}>Section 0{idx+1}</span>
              </div>
              <h3 className="font-black text-sm uppercase tracking-tight mb-2" style={{ color: 'var(--ink)' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed font-medium font-mono italic" style={{ color: 'var(--ink-soft)' }}>{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
