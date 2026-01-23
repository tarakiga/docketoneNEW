"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Bandage,
    Biohazard,
    Box,
    Brain,
    Dumbbell,
    HeartPulse,
    Leaf,
    ShieldAlert,
    Swords,
    Target,
    User,
    Users
} from "lucide-react"
import { useEffect, useState } from "react"

export function ZombieSurvivalCalculator() {
  const [fitness, setFitness] = useState<string>("2")
  const [skills, setSkills] = useState({
    melee: false,
    ranged: false,
    firstAid: false,
    foraging: false
  })
  const [groupSize, setGroupSize] = useState<string>("small")
  const [zombieType, setZombieType] = useState<string>("slow")
  const [location, setLocation] = useState<string>("suburb")
  
  const [result, setResult] = useState<any>(null)

  const calculateSurvival = () => {
    let combat = 0
    let resource = 0
    let security = 0

    // Fitness (1=Couch, 2=Average, 3=Athlete)
    const fitVal = parseInt(fitness)
    combat += fitVal * 10
    resource += fitVal * 5

    // Skills
    if (skills.melee) combat += 20
    if (skills.ranged) combat += 30
    if (skills.firstAid) resource += 20
    if (skills.foraging) resource += 15

    // Group Size
    if (groupSize === 'small') {
      security += 15
      resource += 10
      combat += 5
    } else if (groupSize === 'large') {
      security += 25
      resource -= 10 // more mouths to feed
    } else { // alone
      security -= 10
      resource += 5 // easier to stay hidden
    }

    // Zombie Type Modifiers
    const zombieMods: Record<string, number> = { slow: 1, fast: 0.7, smart: 0.5, mutated: 0.4 }
    const mod = zombieMods[zombieType]
    combat *= mod
    security *= mod

    // Location
    const locScores: Record<string, any> = {
      city: { combat: 5, resource: 15, security: -30 },
      suburb: { combat: 0, resource: 5, security: 0 },
      rural: { combat: -5, resource: -15, security: 25 },
      bunker: { combat: 10, resource: -25, security: 50 },
    }
    const loc = locScores[location]
    combat += loc.combat
    resource += loc.resource
    security += loc.security

    // Clamp (0-100)
    const finalCombat = Math.max(0, Math.min(100, Math.round(combat)))
    const finalResource = Math.max(0, Math.min(100, Math.round(resource)))
    const finalSecurity = Math.max(0, Math.min(100, Math.round(security)))

    // Overall Chance
    const chance = Math.round((finalCombat * 0.4) + (finalResource * 0.3) + (finalSecurity * 0.3))

    // Profile & Tips
    let profile = ""
    if (chance >= 80) profile = "Apocalypse Legend"
    else if (chance >= 65) profile = "Hardened Survivor"
    else if (chance >= 45) profile = "Scrappy Fighter"
    else if (chance >= 25) profile = "Zombie Bait"
    else profile = "First Course"

    const strategies = []
    if (finalCombat > 70) strategies.push("You are a formidable fighter. Take the lead on supply runs.")
    if (finalSecurity > 70) strategies.push("Your shelter is your greatest asset. Fortify it further.")
    if (finalResource > 60) strategies.push("Your resourcefulness is key. Focus on scavenging and first aid.")
    if (groupSize !== 'alone') strategies.push("Leverage your group's strength for defense and scouting.")
    if (zombieType === 'smart') strategies.push("The infected are intelligent. Vary your routines and avoid patterns.")

    const weaknesses = []
    if (finalCombat < 40) weaknesses.push("Your combat skills are lacking. Prioritize stealth and avoidance.")
    if (finalSecurity < 40) weaknesses.push("Your location is a deathtrap. Find a more secure shelter immediately.")
    if (finalResource < 40) weaknesses.push("You'll run out of supplies quickly. Scavenging must be a top priority.")
    if (groupSize === 'large') weaknesses.push("A large group attracts attention and consumes resources rapidly.")
    if (groupSize === 'alone' && finalCombat < 60) weaknesses.push("Being alone makes you vulnerable. Consider finding trustworthy allies.")

    if (strategies.length === 0) strategies.push("Your situation is balanced but has no clear advantage. Adaptability is your only hope.")
    if (weaknesses.length === 0) weaknesses.push("You are well-rounded, but overconfidence can be your downfall. Stay vigilant.")

    setResult({
      chance,
      profile,
      subScores: { combat: finalCombat, resource: finalResource, security: finalSecurity },
      strategies,
      weaknesses
    })
  }

  useEffect(() => {
    calculateSurvival()
  }, [fitness, skills, groupSize, zombieType, location])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="white-glass-card shadow-xl shadow-red-500/5">
        <CardHeader className="border-b border-slate-100 bg-white/50">
          <CardTitle className="text-3xl font-display text-red-600 flex items-center gap-2">
            <Biohazard className="h-8 w-8 animate-pulse text-red-500" />
            Outbreak Analysis
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">Configure your survivor profile and calculated threat level.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-10 md:grid-cols-2 p-8">
          
          {/* Controls */}
          <div className="space-y-8">
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-[10px]"><HeartPulse className="h-4 w-4" /> Physical Condition</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "1", label: "Couch Potato", icon: "🛋️" },
                  { val: "2", label: "Average", icon: "🚶" },
                  { val: "3", label: "Athlete", icon: "🏃‍♂️" }
                ].map((opt) => (
                  <Button
                    key={opt.val}
                    variant={fitness === opt.val ? "destructive" : "outline"}
                    className={`h-auto flex-col py-4 gap-2 border-slate-200 hover:bg-red-50 transition-all ${fitness === opt.val ? "shadow-md shadow-red-100 ring-1 ring-red-500" : ""}`}
                    onClick={() => setFitness(opt.val)}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-bold">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-amber-600 font-bold uppercase tracking-widest text-[10px]"><Dumbbell className="h-4 w-4" /> Survival Skillset</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'melee', label: 'Melee Combat', icon: Swords },
                  { key: 'ranged', label: 'Ranged Weapons', icon: Target },
                  { key: 'firstAid', label: 'First Aid', icon: Bandage },
                  { key: 'foraging', label: 'Foraging', icon: Leaf }
                ].map((skill) => {
                  const Icon = skill.icon;
                  const isActive = (skills as any)[skill.key];
                  return (
                    <Button
                      key={skill.key}
                      variant={isActive ? "default" : "outline"}
                      className={`justify-start gap-3 py-6 rounded-xl border-slate-200 transition-all ${isActive ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-100 border-amber-600" : "bg-white hover:bg-amber-50"}`}
                      onClick={() => setSkills(s => ({...s, [skill.key]: !isActive}))}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-amber-500"}`} /> 
                      <span className="font-bold text-xs">{skill.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px]"><Users className="h-4 w-4" /> Social Strategy</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "alone", label: "Solo", icon: <User className="h-5 w-5"/> },
                  { val: "small", label: "Tactical Cell", icon: <Users className="h-5 w-5"/> },
                  { val: "large", label: "Colony", icon: <Box className="h-5 w-5"/> }
                ].map((opt) => (
                  <Button
                    key={opt.val}
                    variant={groupSize === opt.val ? "secondary" : "outline"}
                    className={`h-auto flex-col py-4 gap-2 border-slate-200 hover:bg-blue-50 transition-all ${groupSize === opt.val ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 ring-1 ring-blue-600" : "bg-white"}`}
                    onClick={() => setGroupSize(opt.val)}
                  >
                    {opt.icon}
                    <span className="text-xs font-bold">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Zombie Variant</Label>
                <Select value={zombieType} onValueChange={setZombieType}>
                  <SelectTrigger className="bg-white border-slate-200 h-10 rounded-xl font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="slow" className="font-medium">Slow Shamblers</SelectItem>
                    <SelectItem value="fast" className="font-medium">Fast Runners (Rage)</SelectItem>
                    <SelectItem value="smart" className="font-medium">Smart Hunters</SelectItem>
                    <SelectItem value="mutated" className="font-medium">Mutated Abominations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-purple-600 font-bold uppercase tracking-widest text-[10px]">Safe Zone Type</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-white border-slate-200 h-10 rounded-xl font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="city" className="font-medium">Urban Apartment</SelectItem>
                    <SelectItem value="suburb" className="font-medium">Suburban House</SelectItem>
                    <SelectItem value="rural" className="font-medium">Isolated Farm</SelectItem>
                    <SelectItem value="bunker" className="font-medium">Fortified Bunker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {/* Results */}
          <div className="space-y-8 rounded-2xl bg-slate-50 p-8 border border-slate-100 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            
            {result && (
              <>
                <div className="text-center space-y-3 relative z-10">
                  <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">Causal Probability</h3>
                  <div className="text-7xl font-black flex items-center justify-center gap-2 tracking-tighter">
                    <span className={result.chance > 60 ? "text-emerald-600" : result.chance > 30 ? "text-amber-500" : "text-rose-600"}>
                      {result.chance}%
                    </span>
                  </div>
                  <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 uppercase tracking-tight">
                    {result.profile}
                  </div>
                </div>

                <div className="space-y-5 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-600">
                      <span>Combat Readiness</span>
                      <span>{result.subScores.combat}%</span>
                    </div>
                    <Progress value={result.subScores.combat} className="h-2.5 bg-red-100 rounded-full" indicatorClassName="bg-red-600" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-600">
                      <span>Resourcefulness</span>
                      <span>{result.subScores.resource}%</span>
                    </div>
                    <Progress value={result.subScores.resource} className="h-2.5 bg-amber-100 rounded-full" indicatorClassName="bg-amber-600" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-600">
                      <span>Security Density</span>
                      <span>{result.subScores.security}%</span>
                    </div>
                    <Progress value={result.subScores.security} className="h-2.5 bg-blue-100 rounded-full" indicatorClassName="bg-blue-600" />
                  </div>
                </div>

                <div className="grid gap-4 text-sm relative z-10">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm">
                    <h4 className="font-black text-emerald-700 mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest"><Brain className="h-3 w-3"/> Mission Logistics</h4>
                     <ul className="space-y-1.5 text-slate-600 font-bold text-xs list-disc pl-4 leading-relaxed">
                       {result.strategies.map((s: string, i: number) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 shadow-sm">
                    <h4 className="font-black text-rose-700 mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest"><ShieldAlert className="h-3 w-3"/> Tactical Deficit</h4>
                     <ul className="space-y-1.5 text-slate-600 font-bold text-xs list-disc pl-4 leading-relaxed">
                       {result.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                </div>

                <div className="pt-4 relative z-10">
                  <ShareResult 
                    title="Zombie Survival Profile"
                    text={`I have a ${result.chance}% chance of surviving the zombie apocalypse as a ${result.profile}. Can you survive better?`}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
