"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BookOpen, Brain, DollarSign, GraduationCap, Sparkles, Trophy } from "lucide-react"
import { useMemo, useState } from "react"

export function UnspentPotentialTax() {
  const [hoursPerDay, setHoursPerDay] = useState(3)
  const [hourlyValue, setHourlyValue] = useState(25)

  const result = useMemo(() => {
    const safeHours = Number.isFinite(hoursPerDay) ? Math.max(0, hoursPerDay) : 0
    const safeRate = Number.isFinite(hourlyValue) ? Math.max(0, hourlyValue) : 0

    const annualHours = Math.round(safeHours * 365)

    return {
      annualHours,
      skillsStarted: Math.floor(annualHours / 20),       // ~20h to learn the basics
      skillsCompetent: Math.floor(annualHours / 100),    // ~100h to get genuinely decent
      skillsProficient: Math.floor(annualHours / 500),   // ~500h toward real proficiency
      books: Math.floor(annualHours / 10),               // ~10h per book
      money: Math.round(annualHours * safeRate),
    }
  }, [hoursPerDay, hourlyValue])

  const tiles = [
    { icon: Sparkles, label: "New skills to START", sub: "~20 hrs each", value: result.skillsStarted, accent: "#b6ff3c" },
    { icon: Brain, label: "Skills to get COMPETENT at", sub: "~100 hrs each", value: result.skillsCompetent, accent: "#b6ff3c" },
    { icon: Trophy, label: "Skills toward REAL PROFICIENCY", sub: "~500 hrs each", value: result.skillsProficient, accent: "#b6ff3c" },
    { icon: BookOpen, label: "Books you could READ", sub: "~10 hrs each", value: result.books, accent: "#b6ff3c" },
  ]

  const moneyFormatted = result.money.toLocaleString("en-US")
  const annualFormatted = result.annualHours.toLocaleString("en-US")

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <Card className="border-[#4a3f7a] bg-[#1d1442] text-[#ECEAE3] shadow-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#241a52] ring-1 ring-[#4a3f7a] flex items-center justify-center mb-4 text-[#b6ff3c]">
            <GraduationCap className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-display tracking-tight text-[#ECEAE3]">
            The Unspent Potential Tax
          </CardTitle>
          <CardDescription className="text-[#b3aae0] font-medium">
            See what your idle hours could become over a single year.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-8 space-y-8">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end gap-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#b3aae0]">
                  Wasted / idle hours per day
                </Label>
                <span className="text-2xl font-black text-[#b6ff3c] shrink-0">{hoursPerDay}h</span>
              </div>
              <Slider
                value={[hoursPerDay]}
                onValueChange={([v]) => setHoursPerDay(v)}
                min={0}
                max={12}
                step={0.5}
                className="[&_.range-thumb]:bg-[#b6ff3c]"
              />
              <p className="text-xs text-[#b3aae0]">
                Scrolling, autoplay, anxious avoidance. The in-between time that just leaks away.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#b3aae0]">
                Value of your time (per hour)
              </Label>
              <div className="flex items-center gap-2 rounded-lg bg-[#0c0824] ring-1 ring-[#4a3f7a] px-3 h-12">
                <DollarSign className="h-4 w-4 text-[#86efac] shrink-0" />
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={hourlyValue}
                  onChange={(e) => setHourlyValue(Number(e.target.value))}
                  className="min-w-0 flex-1 border-0 bg-transparent text-lg font-bold text-[#ECEAE3] focus-visible:ring-0 px-0"
                />
                <span className="text-xs text-[#b3aae0] shrink-0">/ hr</span>
              </div>
              <p className="text-xs text-[#b3aae0]">Optional — to also see the money left on the table.</p>
            </div>
          </div>

          {/* Hero number */}
          <div className="rounded-3xl bg-[#0c0824] ring-1 ring-[#4a3f7a] p-6 sm:p-8 text-center">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-[#b6ff3c] mb-2">
              Your annual time budget
            </div>
            <div
              className="text-5xl sm:text-6xl font-black tracking-tighter tabular-nums"
              style={{ fontFamily: "var(--font-bungee), cursive", color: "#b6ff3c" }}
            >
              {annualFormatted}
              <span className="text-2xl sm:text-3xl font-bold text-[#b3aae0] ml-2">hours</span>
            </div>
            <p className="text-sm text-[#b3aae0] mt-3 max-w-md mx-auto">
              That is {hoursPerDay}h a day, reclaimed across a full year — hours genuinely available to redirect.
            </p>
            {result.money > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#241a52] ring-1 ring-[#4a3f7a] px-4 py-2">
                <DollarSign className="h-4 w-4 text-[#86efac]" />
                <span className="text-sm font-bold text-[#86efac] tabular-nums">
                  ${moneyFormatted} of your time left on the table
                </span>
              </div>
            )}
          </div>

          {/* What it could become */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#b3aae0] mb-4">
              What that time could become
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiles.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#241a52] ring-1 ring-[#4a3f7a] p-5 flex flex-col gap-2 transition-transform hover:-translate-y-1"
                >
                  <t.icon className="h-5 w-5" style={{ color: t.accent }} />
                  <div className="text-4xl font-black text-[#ECEAE3] tabular-nums leading-none">{t.value}</div>
                  <div className="text-xs font-bold text-[#ECEAE3] leading-snug">{t.label}</div>
                  <div className="text-[11px] text-[#b3aae0]">{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <ShareResult
              title="My Unspent Potential Tax"
              text={`I waste about ${hoursPerDay}h a day — that's ${annualFormatted} hours a year. Enough to start ${result.skillsStarted} new skills, get competent at ${result.skillsCompetent}, or read ${result.books} books. Time to spend that potential on purpose. ⚖️`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Footnotes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "20 Hours", desc: "Roughly what it takes to go from total beginner to passably competent at a new skill.", icon: Sparkles, color: "#b6ff3c" },
          { title: "Opportunity Cost", desc: "The real price of an idle hour is the book, project, or walk you traded it for.", icon: Brain, color: "#b6ff3c" },
          { title: "It Compounds", desc: "One reclaimed hour a day is ~365 hours a year — over nine 40-hour work weeks.", icon: Trophy, color: "#b6ff3c" },
        ].map((item, idx) => (
          <Card key={idx} className="bg-[#1d1442] border-[#4a3f7a] p-5">
            <item.icon className="h-6 w-6 mb-3" style={{ color: item.color }} />
            <h3 className="font-black text-xs uppercase tracking-widest text-[#ECEAE3] mb-1">{item.title}</h3>
            <p className="text-xs text-[#b3aae0] leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
