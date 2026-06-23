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

  const results = useMemo(() => {
    const lifeExpectancy = 80
    const remainingYears = Math.max(0, lifeExpectancy - age)
    const DAYS = 365.25 // account for leap years

    const wastedHours = hoursPerDay * DAYS * remainingYears
    // "% of waking life" => compare against ~16 waking hours/day, not 24h calendar.
    const wakingHoursRemaining = remainingYears * DAYS * 16

    const yearsWasted = wastedHours / 24 / DAYS

    // Equivalents
    const booksRead = Math.round(wastedHours / 10) // ~10 hours per book
    const skillsLearned = Math.round(wastedHours / 500) // ~500 hours to genuine competence
    const walksAroundEarth = (wastedHours * 5) / 40075 // 5km/h walking speed

    const percentOfLife = wakingHoursRemaining > 0 ? (wastedHours / wakingHoursRemaining) * 100 : 0

    return {
      yearsWasted: yearsWasted.toFixed(1),
      percentOfLife: percentOfLife.toFixed(1),
      booksRead,
      skillsLearned,
      walksAroundEarth: walksAroundEarth.toFixed(1)
    }
  }, [hoursPerDay, age])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="border-[#4a3f7a] text-[#ECEAE3]" style={{ backgroundColor: "#1d1442" }}>
        <CardHeader className="border-b border-[#4a3f7a] pb-6">
          <CardTitle className="text-3xl font-display text-[#ECEAE3] flex items-center gap-3">
             <Smartphone className="h-8 w-8 text-[#b6ff3c]" />
             The Scroll of Doom
          </CardTitle>
          <CardDescription className="text-[#b3aae0]">
             Calculate how much of your remaining life belongs to the algorithm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between font-bold text-sm text-[#b3aae0] uppercase">
                       <Label>Daily Screen Time (Hours)</Label>
                       <span className="text-[#ECEAE3]">{hoursPerDay}h</span>
                    </div>
                    <Slider value={[hoursPerDay]} onValueChange={([v]) => setHoursPerDay(v)} min={0.5} max={16} step={0.5} className="[&_[data-slot=slider-track]]:bg-[#0c0824] [&_[data-slot=slider-range]]:bg-[#b6ff3c] [&_[data-slot=slider-thumb]]:border-[#b6ff3c]" />
                    <p className="text-xs text-[#b3aae0]">Be honest. Check your phone&apos;s settings.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between font-bold text-sm text-[#b3aae0] uppercase">
                       <Label>Current Age</Label>
                       <span className="text-[#ECEAE3]">{age}</span>
                    </div>
                    <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={10} max={90} step={1} className="[&_[data-slot=slider-track]]:bg-[#0c0824] [&_[data-slot=slider-range]]:bg-[#b6ff3c] [&_[data-slot=slider-thumb]]:border-[#b6ff3c]" />
                 </div>

                 <div className="p-4 border border-[#4a3f7a] rounded-xl space-y-2" style={{ backgroundColor: "#241a52" }}>
                    <h4 className="font-bold text-[#b6ff3c] flex items-center gap-2"><Ghost className="w-4 h-4"/> Scary Stat</h4>
                    <p className="text-sm text-[#ECEAE3]">
                       You will spend <span className="text-[#b6ff3c] font-black">{results.percentOfLife}%</span> of your waking life looking at a rectangle.
                    </p>
                 </div>
              </div>

              <div className="relative h-[300px] rounded-xl overflow-hidden border border-[#4a3f7a] flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: "#0c0824" }}>

                 {/* Infinite Scroll Animation Background */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none space-y-4 p-4 animate-slide-up">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#4a3f7a]"></div>
                          <div className="space-y-2 flex-1">
                             <div className="h-4 w-3/4 bg-[#4a3f7a] rounded"></div>
                             <div className="h-24 w-full bg-[#241a52] rounded"></div>
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="relative z-10 space-y-2 p-6 rounded-2xl border border-[#4a3f7a]" style={{ backgroundColor: "#1d1442" }}>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#b3aae0]">Total Time Lost</div>
                    <div className="text-6xl font-black" style={{ fontFamily: "var(--font-bungee), cursive", color: "#b6ff3c" }}>
                       {results.yearsWasted}
                    </div>
                    <div className="text-xl font-bold text-[#ECEAE3]">YEARS</div>
                 </div>

              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 rounded-lg border border-[#4a3f7a] text-center space-y-1" style={{ backgroundColor: "#241a52" }}>
                  <div className="text-xs uppercase text-[#b3aae0]">Could have read</div>
                  <div className="text-2xl font-black text-[#ECEAE3]">{results.booksRead}</div>
                  <div className="text-sm text-[#b3aae0]">Books 📚</div>
               </div>
               <div className="p-4 rounded-lg border border-[#4a3f7a] text-center space-y-1" style={{ backgroundColor: "#241a52" }}>
                  <div className="text-xs uppercase text-[#b3aae0]">Could have learned</div>
                  <div className="text-2xl font-black text-[#ECEAE3]">{results.skillsLearned}</div>
                  <div className="text-sm text-[#b3aae0]">New Skills 🎸</div>
               </div>
               <div className="p-4 rounded-lg border border-[#4a3f7a] text-center space-y-1" style={{ backgroundColor: "#241a52" }}>
                  <div className="text-xs uppercase text-[#b3aae0]">Walked around Earth</div>
                  <div className="text-2xl font-black text-[#ECEAE3]">{results.walksAroundEarth}x</div>
                  <div className="text-sm text-[#b3aae0]">Times 🌍</div>
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
