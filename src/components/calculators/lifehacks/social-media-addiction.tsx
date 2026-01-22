"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Ghost, Smartphone } from "lucide-react"
import { useMemo, useState } from "react"

export function SocialMediaAddiction() {
  const [hoursPerDay, setHoursPerDay] = useState(3)
  const [age, setAge] = useState(25)
  const [platform, setPlatform] = useState('Generic Scrolling')

  const results = useMemo(() => {
    const lifeExpectancy = 80
    const remainingYears = Math.max(0, lifeExpectancy - age)
    
    const totalHoursRemaining = remainingYears * 365 * 24
    const wastedHours = hoursPerDay * 365 * remainingYears
    
    const yearsWasted = wastedHours / 24 / 365
    
    // Equivalent to
    const booksRead = Math.round(wastedHours / 10) // 10 hours per book
    const skillsLearned = Math.round(wastedHours / 500) // 500 hours to competence
    const walksAroundEarth = (wastedHours * 5) / 40075 // 5km/h walking speed
    
    return {
      yearsWasted: yearsWasted.toFixed(1),
      percentOfLife: ((wastedHours / totalHoursRemaining) * 100).toFixed(1),
      booksRead,
      skillsLearned,
      walksAroundEarth: walksAroundEarth.toFixed(1)
    }
  }, [hoursPerDay, age])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <CardHeader className="border-b border-zinc-800 pb-6">
          <CardTitle className="text-3xl font-display text-zinc-100 flex items-center gap-3">
             <Smartphone className="h-8 w-8 text-indigo-500" />
             The Scroll of Doom
          </CardTitle>
          <CardDescription className="text-zinc-400">
             Calculate how much of your remaining life belongs to the algorithm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between font-bold text-sm text-zinc-400 uppercase">
                       <Label>Daily Screen Time (Hours)</Label>
                       <span className="text-white">{hoursPerDay}h</span>
                    </div>
                    <Slider value={[hoursPerDay]} onValueChange={([v]) => setHoursPerDay(v)} min={0.5} max={16} step={0.5} className="[&_.range-thumb]:bg-indigo-500" />
                    <p className="text-xs text-zinc-500">Be honest. Check your phone's settings.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between font-bold text-sm text-zinc-400 uppercase">
                       <Label>Current Age</Label>
                       <span className="text-white">{age}</span>
                    </div>
                    <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={10} max={90} step={1} className="[&_.range-thumb]:bg-indigo-500" />
                 </div>
                 
                 <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                    <h4 className="font-bold text-indigo-400 flex items-center gap-2"><Ghost className="w-4 h-4"/> Scary Stat</h4>
                    <p className="text-sm">
                       You will spend <span className="text-white font-black">{results.percentOfLife}%</span> of your waking life looking at a rectangle.
                    </p>
                 </div>
              </div>

              <div className="relative h-[300px] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                 
                 {/* Infinite Scroll Animation Background */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none space-y-4 p-4 animate-slide-up">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-zinc-600"></div>
                          <div className="space-y-2 flex-1">
                             <div className="h-4 w-3/4 bg-zinc-700 rounded"></div>
                             <div className="h-24 w-full bg-zinc-800 rounded"></div>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="relative z-10 space-y-2 bg-zinc-950/80 p-6 rounded-2xl backdrop-blur-sm border border-zinc-700">
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Time Lost</div>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500">
                       {results.yearsWasted}
                    </div>
                    <div className="text-xl font-bold text-white">YEARS</div>
                 </div>

              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-center space-y-1">
                  <div className="text-xs uppercase text-zinc-500">Could have read</div>
                  <div className="text-2xl font-black text-white">{results.booksRead}</div>
                  <div className="text-sm text-zinc-400">Books 📚</div>
               </div>
               <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-center space-y-1">
                  <div className="text-xs uppercase text-zinc-500">Could have learned</div>
                  <div className="text-2xl font-black text-white">{results.skillsLearned}</div>
                  <div className="text-sm text-zinc-400">New Skills 🎸</div>
               </div>
               <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-center space-y-1">
                  <div className="text-xs uppercase text-zinc-500">Walked around Earth</div>
                  <div className="text-2xl font-black text-white">{results.walksAroundEarth}x</div>
                  <div className="text-sm text-zinc-400">Times 🌍</div>
               </div>
           </div>

           <div className="flex justify-center pt-4">
              <ShareResult 
                 title="I'm addicted to scrolling" 
                 text={`I'm on track to waste ${results.yearsWasted} years of my life on social media. I could have learned ${results.skillsLearned} skills instead. Help. 📱`} 
              />
           </div>

        </CardContent>
      </Card>
      
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .animate-slide-up {
          animation: slide-up 10s linear infinite;
        }
      `}</style>
    </div>
  )
}
