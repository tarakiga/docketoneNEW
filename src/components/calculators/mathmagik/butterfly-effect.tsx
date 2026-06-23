"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"
import {
    ArrowRight,
    Brain,
    CloudRain,
    GitBranch,
    Orbit,
    RefreshCcw,
    Sparkles,
    Wind
} from "lucide-react"
import { useMemo, useState } from "react"
import { ShareResult } from "@/components/molecules/share-result"

const LIFE_CHOICES = [
  { id: 'coffee', label: 'Switched Coffee Order', consequence: "Met a future business partner in the lineup.", branch: "Wealth +40%" },
  { id: 'lane', label: 'Changed Driving Lane', consequence: "Avoided a minor fender-bender that would have made you late.", branch: "Stress -15%" },
  { id: 'umbrella', label: 'Forgot Umbrella', consequence: "Took a shortcut and found a $20 bill on the ground.", branch: "Luck +5%" },
  { id: 'greet', label: 'Smiled at a Stranger', consequence: "They decided not to quit their stressful job that day.", branch: "Global Harmony +0.0001%" },
  { id: 'book', label: 'Read a Specific Page', consequence: "Obsessed over a new hobby that became your career.", branch: "Purpose +90%" }
]

export function ButterflyEffect() {
  const [activeChoice, setActiveChoice] = useState<string | null>(null)
  
  const choice = useMemo(() => {
    return LIFE_CHOICES.find(c => c.id === activeChoice) || null
  }, [activeChoice])

  return (
    <div className="almanac max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700" style={{ ['--card' as string]: '#1d1442', ['--ink' as string]: '#ECEAE3', ['--ink-soft' as string]: '#b3aae0', ['--accent' as string]: '#ff3ca6', ['--line' as string]: '#4a3f7a' }}>
      <Card className="bg-[#1d1442] border-[#4a3f7a] shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
        {/* Animated Background Nodes */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#ff3ca6] blur-[80px] rounded-full animate-pulse" />
           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#241a52] blur-[80px] rounded-full animate-pulse delay-700" />
        </div>

        <CardHeader className="text-center p-8 border-b border-[#4a3f7a] relative z-10 bg-[#0c0824]/50 backdrop-blur-md">
           <div className="space-y-1">
             <CardTitle className="text-4xl font-black text-[#ECEAE3] tracking-tighter flex items-center justify-center gap-4">
               <div className="bg-[#ff3ca6] p-2 rounded-2xl shadow-lg">
                  <Orbit className="h-6 w-6 text-[#0c0824]" />
               </div>
               The Butterfly Effect Simulator
             </CardTitle>
             <CardDescription className="text-[#b3aae0] font-bold uppercase text-[10px] tracking-[0.4em] pt-2">
               Visualizing Chaos Theory in Human Decision Logic.
             </CardDescription>
           </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative z-10 grid lg:grid-cols-12 min-h-[450px]">
           
           {/* Decision Column */}
           <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-[#4a3f7a] flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b3aae0] pl-1">Primary Variable</Label>
                 <div className="flex flex-col gap-3">
                    {LIFE_CHOICES.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => setActiveChoice(choice.id)}
                        className={`group p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                          activeChoice === choice.id
                            ? "bg-[#ff3ca6] border-[#ff3ca6] text-[#0c0824] shadow-xl -translate-y-1"
                            : "bg-[#241a52] border-[#4a3f7a] text-[#b3aae0] hover:border-[#ff3ca6]"
                        }`}
                      >
                         <span className={`font-black uppercase text-[11px] tracking-tight ${activeChoice === choice.id ? 'text-[#0c0824]' : 'text-[#ECEAE3] group-hover:text-white'}`}>
                            {choice.label}
                         </span>
                         <GitBranch className={`h-4 w-4 ${activeChoice === choice.id ? 'text-[#0c0824]' : 'text-[#b3aae0] opacity-0 group-hover:opacity-100 transition-opacity'}`} />
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-[#4a3f7a] space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="bg-[#241a52] p-2 rounded-xl">
                       <Brain className="h-4 w-4 text-[#ff3ca6]" />
                    </div>
                    <div className="space-y-1">
                       <div className="text-[10px] font-black text-[#ECEAE3] uppercase tracking-widest leading-none">Quantum Variance</div>
                       <div className="text-xs text-[#b3aae0] font-bold font-mono">σ² = 0.001712...</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Visualization Column */}
           <div className="lg:col-span-8 bg-[#0c0824]/40 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                 {choice ? (
                   <motion.div 
                     key={choice.id}
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -30 }}
                     className="w-full max-w-xl space-y-12 text-center"
                   >
                      <div className="relative">
                         <motion.div 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-[#4a3f7a]"
                         />
                         <div className="flex justify-center gap-8 relative z-10">
                            <div className="bg-[#241a52] p-6 rounded-full border-2 border-[#4a3f7a] shadow-xl">
                               <RefreshCcw className="h-8 w-8 text-[#b3aae0]" />
                            </div>
                            <div className="bg-[#ff3ca6] p-6 rounded-full shadow-2xl">
                               <ArrowRight className="h-8 w-8 text-[#0c0824]" />
                            </div>
                            <div className="bg-[#241a52] p-6 rounded-full border-2 border-[#4a3f7a] shadow-xl">
                               <Sparkles className="h-8 w-8 text-[#ff3ca6]" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="inline-block px-4 py-1.5 rounded-full bg-[#241a52] border border-[#ff3ca6] text-[9px] md:text-[10px] font-black text-[#ff3ca6] uppercase tracking-[0.4em] mb-4">
                            Phase Shift Detected
                         </div>
                         <h2 className="text-3xl md:text-6xl font-black text-[#ECEAE3] tracking-tighter drop-shadow-sm leading-tight">
                            {choice.consequence}
                         </h2>
                         <div className="text-sm md:text-xl font-black text-[#ff3ca6] italic underline decoration-[#ff3ca6]/40 underline-offset-8">
                            Global Impact: {choice.branch}
                         </div>
                         <div className="flex justify-center mt-6">
                            <ShareResult title="Butterfly Effect" text={`A tiny change → ${choice.branch}. Chaos theory in action. 🦋`} />
                         </div>
                      </div>

                      <div className="pt-8">
                        <p className="text-sm text-[#b3aae0] font-medium font-mono leading-relaxed italic max-w-md mx-auto">
                           &quot;Chaos: When the present determines the future, but the approximate present does not approximately determine the future.&quot;
                        </p>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="space-y-6 text-center"
                   >
                      <Wind className="mx-auto h-16 w-16 text-[#4a3f7a] animate-pulse" />
                      <div className="text-xs font-black text-[#b3aae0] uppercase tracking-[0.5em]">Waiting for initial variable input...</div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

        </CardContent>
      </Card>

      {/* Insight Section */}
      <div className="grid md:grid-cols-3 gap-6">
         {[
           { title: "Non-Linearity", desc: "Small initial conditions can lead to vastly different outcomes.", icon: GitBranch, color: "text-[#a78bfa]" },
           { title: "Weather Logic", desc: "Inspired by Edward Lorenz's model of atmospheric unpredictability.", icon: CloudRain, color: "text-[#ff3ca6]" },
           { title: "The Life Path", desc: "Every micro-choice creates a new reality in the causal landscape.", icon: RefreshCcw, color: "text-[#34d399]" }
         ].map((item, idx) => (
           <Card key={idx} className="bg-[#1d1442] p-6 border-[#4a3f7a] group hover:border-[#ff3ca6] transition-all">
              <item.icon className={`h-6 w-6 ${item.color} mb-4 transition-transform group-hover:rotate-12`} />
              <h3 className="font-black text-[10px] uppercase tracking-widest text-[#ECEAE3] mb-2">{item.title}</h3>
              <p className="text-[10px] text-[#b3aae0] leading-relaxed font-medium font-mono lowercase">{item.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  )
}
