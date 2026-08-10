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
      <Card className="border-[var(--dk-line)] text-[var(--dk-ink)]" style={{ backgroundColor: "var(--dk-surface)" }}>
        <CardHeader className="border-b border-[var(--dk-line)] pb-6">
          <CardTitle className="text-3xl font-display text-[var(--dk-ink)] flex items-center gap-3">
             <Smartphone className="h-8 w-8 text-[var(--dk-lim-ink)]" />
             The Scroll of Doom
          </CardTitle>
          <CardDescription className="text-[var(--dk-ink-soft)]">
             Calculate how much of your remaining life belongs to the algorithm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between font-bold text-sm text-[var(--dk-ink-soft)] uppercase">
                       <Label>Daily Screen Time (Hours)</Label>
                       <span className="text-[var(--dk-ink)]">{hoursPerDay}h</span>
                    </div>
                    <Slider value={[hoursPerDay]} onValueChange={([v]) => setHoursPerDay(v)} min={0.5} max={16} step={0.5} className="[&_[data-slot=slider-track]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-range]]:bg-[var(--dk-lim)] [&_[data-slot=slider-thumb]]:border-[var(--dk-lim-ink)]" />
                    <p className="text-xs text-[var(--dk-ink-soft)]">Be honest. Check your phone&apos;s settings.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between font-bold text-sm text-[var(--dk-ink-soft)] uppercase">
                       <Label>Current Age</Label>
                       <span className="text-[var(--dk-ink)]">{age}</span>
                    </div>
                    <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={10} max={90} step={1} className="[&_[data-slot=slider-track]]:bg-[var(--dk-sunk)] [&_[data-slot=slider-range]]:bg-[var(--dk-lim)] [&_[data-slot=slider-thumb]]:border-[var(--dk-lim-ink)]" />
                 </div>

                 <div className="p-4 border border-[var(--dk-line)] rounded-xl space-y-2" style={{ backgroundColor: "var(--dk-raised)" }}>
                    <h4 className="font-bold text-[var(--dk-lim-ink)] flex items-center gap-2"><Ghost className="w-4 h-4"/> Scary Stat</h4>
                    <p className="text-sm text-[var(--dk-ink)]">
                       You will spend <span className="text-[var(--dk-lim-ink)] font-black">{results.percentOfLife}%</span> of your waking life looking at a rectangle.
                    </p>
                 </div>
              </div>

              <div className="relative h-[300px] rounded-xl overflow-hidden border border-[var(--dk-line)] flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: "var(--dk-sunk)" }}>

                 {/* Infinite Scroll Animation Background */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none space-y-4 p-4 animate-slide-up">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-[var(--dk-mute)]"></div>
                          <div className="space-y-2 flex-1">
                             <div className="h-4 w-3/4 bg-[var(--dk-mute)] rounded"></div>
                             <div className="h-24 w-full bg-[var(--dk-raised)] rounded"></div>
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="relative z-10 space-y-2 p-6 rounded-2xl border border-[var(--dk-line)]" style={{ backgroundColor: "var(--dk-surface)" }}>
                    <div className="text-xs font-bold uppercase tracking-widest text-[var(--dk-ink-soft)]">Total Time Lost</div>
                    <div className="text-6xl font-black" style={{ fontFamily: "var(--font-fredoka), cursive", color: "var(--dk-lim-ink)" }}>
                       {results.yearsWasted}
                    </div>
                    <div className="text-xl font-bold text-[var(--dk-ink)]">YEARS</div>
                 </div>

              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 rounded-lg border border-[var(--dk-line)] text-center space-y-1" style={{ backgroundColor: "var(--dk-raised)" }}>
                  <div className="text-xs uppercase text-[var(--dk-ink-soft)]">Could have read</div>
                  <div className="text-2xl font-black text-[var(--dk-ink)]">{results.booksRead}</div>
                  <div className="text-sm text-[var(--dk-ink-soft)]">Books 📚</div>
               </div>
               <div className="p-4 rounded-lg border border-[var(--dk-line)] text-center space-y-1" style={{ backgroundColor: "var(--dk-raised)" }}>
                  <div className="text-xs uppercase text-[var(--dk-ink-soft)]">Could have learned</div>
                  <div className="text-2xl font-black text-[var(--dk-ink)]">{results.skillsLearned}</div>
                  <div className="text-sm text-[var(--dk-ink-soft)]">New Skills 🎸</div>
               </div>
               <div className="p-4 rounded-lg border border-[var(--dk-line)] text-center space-y-1" style={{ backgroundColor: "var(--dk-raised)" }}>
                  <div className="text-xs uppercase text-[var(--dk-ink-soft)]">Walked around Earth</div>
                  <div className="text-2xl font-black text-[var(--dk-ink)]">{results.walksAroundEarth}x</div>
                  <div className="text-sm text-[var(--dk-ink-soft)]">Times 🌍</div>
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
