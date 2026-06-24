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
import { useMemo, useState } from "react"

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
  
  const result = useMemo(() => {
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
    const locScores: Record<string, { combat: number; resource: number; security: number }> = {
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

    return {
      chance,
      profile,
      subScores: { combat: finalCombat, resource: finalResource, security: finalSecurity },
      strategies,
      weaknesses
    }
  }, [fitness, skills, groupSize, zombieType, location])

  return (
    <div className="almanac space-y-8 animate-in fade-in duration-500" style={{
      ['--card' as string]: '#1d1442',
      ['--ink' as string]: '#ECEAE3',
      ['--ink-soft' as string]: '#b3aae0',
      ['--accent' as string]: '#ff8a3c',
      ['--line' as string]: '#4a3f7a',
    }}>
      <Card className="shadow-xl" style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
        <CardHeader className="border-b" style={{ borderColor: 'var(--line)', background: '#0c0824' }}>
          <CardTitle className="text-3xl font-display flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <Biohazard className="h-8 w-8 animate-pulse" style={{ color: 'var(--accent)' }} />
            Outbreak Analysis
          </CardTitle>
          <CardDescription className="font-medium" style={{ color: 'var(--ink-soft)' }}>Educational, fictional scenario tool to model survivor profiles and outbreak threat levels.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-10 md:grid-cols-2 p-8">
          
          {/* Controls */}
          <div className="space-y-8">
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]" style={{ color: 'var(--accent)' }}><HeartPulse className="h-4 w-4" /> Physical Condition</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "1", label: "Couch Potato", icon: "🛋️" },
                  { val: "2", label: "Average", icon: "🚶" },
                  { val: "3", label: "Athlete", icon: "🏃‍♂️" }
                ].map((opt) => {
                  const isActive = fitness === opt.val
                  return (
                  <Button
                    key={opt.val}
                    variant="outline"
                    className="h-auto flex-col py-4 gap-2 px-1 whitespace-normal min-w-0 transition-all"
                    style={isActive
                      ? { background: 'var(--accent)', color: '#0c0824', borderColor: 'var(--accent)' }
                      : { background: '#241a52', color: 'var(--ink)', borderColor: 'var(--line)' }}
                    onClick={() => setFitness(opt.val)}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-bold text-center leading-tight break-words">{opt.label}</span>
                  </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]" style={{ color: 'var(--accent)' }}><Dumbbell className="h-4 w-4" /> Survival Skillset</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'melee', label: 'Melee Combat', icon: Swords },
                  { key: 'ranged', label: 'Ranged Weapons', icon: Target },
                  { key: 'firstAid', label: 'First Aid', icon: Bandage },
                  { key: 'foraging', label: 'Foraging', icon: Leaf }
                ].map((skill) => {
                  const Icon = skill.icon;
                  const isActive = skills[skill.key as keyof typeof skills];
                  return (
                    <Button
                      key={skill.key}
                      variant="outline"
                      className="justify-start gap-2 py-6 px-3 rounded-xl whitespace-normal min-w-0 transition-all"
                      style={isActive
                        ? { background: 'var(--accent)', color: '#0c0824', borderColor: 'var(--accent)' }
                        : { background: '#241a52', color: 'var(--ink)', borderColor: 'var(--line)' }}
                      onClick={() => setSkills(s => ({...s, [skill.key]: !isActive}))}
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? '#0c0824' : 'var(--accent)' }} />
                      <span className="font-bold text-xs leading-tight text-left min-w-0">{skill.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]" style={{ color: 'var(--accent)' }}><Users className="h-4 w-4" /> Social Strategy</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "alone", label: "Solo", icon: <User className="h-5 w-5"/> },
                  { val: "small", label: "Tactical Cell", icon: <Users className="h-5 w-5"/> },
                  { val: "large", label: "Colony", icon: <Box className="h-5 w-5"/> }
                ].map((opt) => {
                  const isActive = groupSize === opt.val
                  return (
                  <Button
                    key={opt.val}
                    variant="outline"
                    className="h-auto flex-col py-4 gap-2 px-1 whitespace-normal min-w-0 transition-all"
                    style={isActive
                      ? { background: 'var(--accent)', color: '#0c0824', borderColor: 'var(--accent)' }
                      : { background: '#241a52', color: 'var(--ink)', borderColor: 'var(--line)' }}
                    onClick={() => setGroupSize(opt.val)}
                  >
                    {opt.icon}
                    <span className="text-xs font-bold text-center leading-tight break-words">{opt.label}</span>
                  </Button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 min-w-0">
                <Label className="font-bold uppercase tracking-widest text-[10px]" style={{ color: 'var(--accent)' }}>Zombie Variant</Label>
                <Select value={zombieType} onValueChange={setZombieType}>
                  <SelectTrigger className="h-10 rounded-xl font-bold text-xs" style={{ background: '#241a52', borderColor: 'var(--line)', color: 'var(--ink)' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
                    <SelectItem value="slow" className="font-medium">Slow Shamblers</SelectItem>
                    <SelectItem value="fast" className="font-medium">Fast Runners (Rage)</SelectItem>
                    <SelectItem value="smart" className="font-medium">Smart Hunters</SelectItem>
                    <SelectItem value="mutated" className="font-medium">Mutated Abominations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 min-w-0">
                <Label className="font-bold uppercase tracking-widest text-[10px]" style={{ color: 'var(--accent)' }}>Safe Zone Type</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-10 rounded-xl font-bold text-xs" style={{ background: '#241a52', borderColor: 'var(--line)', color: 'var(--ink)' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
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
          <div className="space-y-8 rounded-2xl p-8 border relative overflow-hidden flex flex-col justify-center" style={{ background: '#0c0824', borderColor: 'var(--line)' }}>

            {result && (
              <>
                <div className="text-center space-y-3 relative z-10">
                  <h3 className="uppercase text-[10px] font-black tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>Causal Probability</h3>
                  <div className="text-7xl font-black flex items-center justify-center gap-2 tracking-tighter">
                    <span style={{ color: result.chance > 60 ? '#86efac' : result.chance > 30 ? '#ff8a3c' : '#ff8a8a' }}>
                      {result.chance}%
                    </span>
                  </div>
                  <div className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--accent)' }}>
                    {result.profile}
                  </div>
                </div>

                <div className="space-y-5 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                      <span>Combat Readiness</span>
                      <span>{result.subScores.combat}%</span>
                    </div>
                    <Progress value={result.subScores.combat} className="h-2.5 rounded-full" style={{ background: '#241a52' }} indicatorClassName="bg-[#ff8a3c]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                      <span>Resourcefulness</span>
                      <span>{result.subScores.resource}%</span>
                    </div>
                    <Progress value={result.subScores.resource} className="h-2.5 rounded-full" style={{ background: '#241a52' }} indicatorClassName="bg-[#ff8a3c]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                      <span>Security Density</span>
                      <span>{result.subScores.security}%</span>
                    </div>
                    <Progress value={result.subScores.security} className="h-2.5 rounded-full" style={{ background: '#241a52' }} indicatorClassName="bg-[#ff8a3c]" />
                  </div>
                </div>

                <div className="grid gap-4 text-sm relative z-10">
                  <div className="p-4 rounded-xl border" style={{ background: '#1d1442', borderColor: 'var(--line)' }}>
                    <h4 className="font-black mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: '#86efac' }}><Brain className="h-3 w-3"/> Mission Logistics</h4>
                     <ul className="space-y-1.5 font-bold text-xs list-disc pl-4 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                       {result.strategies.map((s: string, i: number) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ background: '#1d1442', borderColor: 'var(--line)' }}>
                    <h4 className="font-black mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: '#ff8a8a' }}><ShieldAlert className="h-3 w-3"/> Tactical Deficit</h4>
                     <ul className="space-y-1.5 font-bold text-xs list-disc pl-4 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
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
