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
      <Card className="border-red-900/50 bg-black/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-red-500 flex items-center gap-2">
            <Biohazard className="h-8 w-8 animate-pulse" />
            Survival Analysis
          </CardTitle>
          <CardDescription>Configure your survivor profile and threat level.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          
          {/* Controls */}
          <div className="space-y-6">
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-red-400"><HeartPulse className="h-4 w-4" /> Physical Condition</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: "1", label: "Couch Potato", icon: "🛋️" },
                  { val: "2", label: "Average", icon: "🚶" },
                  { val: "3", label: "Athlete", icon: "🏃‍♂️" }
                ].map((opt) => (
                  <Button
                    key={opt.val}
                    variant={fitness === opt.val ? "destructive" : "outline"}
                    className="h-auto flex-col py-3 gap-2 border-red-900/30 hover:bg-red-900/20"
                    onClick={() => setFitness(opt.val)}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-yellow-400"><Dumbbell className="h-4 w-4" /> Acquired Skills</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={skills.melee ? "default" : "outline"}
                  className={`justify-start gap-2 ${skills.melee ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}`}
                  onClick={() => setSkills(s => ({...s, melee: !s.melee}))}
                >
                  <Swords className="h-4 w-4" /> Melee Combat
                </Button>
                <Button
                  variant={skills.ranged ? "default" : "outline"}
                  className={`justify-start gap-2 ${skills.ranged ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}`}
                  onClick={() => setSkills(s => ({...s, ranged: !s.ranged}))}
                >
                  <Target className="h-4 w-4" /> Ranged Weapons
                </Button>
                <Button
                  variant={skills.firstAid ? "default" : "outline"}
                  className={`justify-start gap-2 ${skills.firstAid ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}`}
                  onClick={() => setSkills(s => ({...s, firstAid: !s.firstAid}))}
                >
                  <Bandage className="h-4 w-4" /> First Aid
                </Button>
                <Button
                  variant={skills.foraging ? "default" : "outline"}
                  className={`justify-start gap-2 ${skills.foraging ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}`}
                  onClick={() => setSkills(s => ({...s, foraging: !s.foraging}))}
                >
                  <Leaf className="h-4 w-4" /> Foraging
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-blue-400"><Users className="h-4 w-4" /> Group Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: "alone", label: "Alone", icon: <User className="h-5 w-5"/> },
                  { val: "small", label: "Small Team", icon: <Users className="h-5 w-5"/> },
                  { val: "large", label: "Large Colony", icon: <Box className="h-5 w-5"/> }
                ].map((opt) => (
                  <Button
                    key={opt.val}
                    variant={groupSize === opt.val ? "secondary" : "outline"}
                    className={`h-auto flex-col py-3 gap-2 ${groupSize === opt.val ? "bg-blue-900/50 text-blue-100 border-blue-500" : ""}`}
                    onClick={() => setGroupSize(opt.val)}
                  >
                    {opt.icon}
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-green-400">Outbreak Type</Label>
                <Select value={zombieType} onValueChange={setZombieType}>
                  <SelectTrigger className="border-green-800/50 bg-black/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow Shamblers</SelectItem>
                    <SelectItem value="fast">Fast Runners (Rage)</SelectItem>
                    <SelectItem value="smart">Smart Hunters</SelectItem>
                    <SelectItem value="mutated">Mutated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-purple-400">Shelter</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="border-purple-800/50 bg-black/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">Urban Apartment</SelectItem>
                    <SelectItem value="suburb">Suburban House</SelectItem>
                    <SelectItem value="rural">Isolated Farm</SelectItem>
                    <SelectItem value="bunker">Fortified Bunker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {/* Results */}
          <div className="space-y-6 rounded-xl bg-gray-900/50 p-6 border border-white/10">
            {result && (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-gray-400 uppercase text-xs tracking-widest">Calculated Survival Probability</h3>
                  <div className="text-6xl font-black text-white flex items-center justify-center gap-2">
                    <span className={result.chance > 60 ? "text-green-500" : result.chance > 30 ? "text-yellow-500" : "text-red-600"}>
                      {result.chance}%
                    </span>
                  </div>
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    {result.profile}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs uppercase tracking-wider text-red-400">
                      <span>Combat Readiness</span>
                      <span>{result.subScores.combat}%</span>
                    </div>
                    <Progress value={result.subScores.combat} className="h-2 bg-red-950" indicatorClassName="bg-red-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs uppercase tracking-wider text-yellow-400">
                      <span>Resourcefulness</span>
                      <span>{result.subScores.resource}%</span>
                    </div>
                    <Progress value={result.subScores.resource} className="h-2 bg-yellow-950" indicatorClassName="bg-yellow-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs uppercase tracking-wider text-blue-400">
                      <span>Security</span>
                      <span>{result.subScores.security}%</span>
                    </div>
                    <Progress value={result.subScores.security} className="h-2 bg-blue-950" indicatorClassName="bg-blue-600" />
                  </div>
                </div>

                <div className="grid gap-4 text-sm">
                  <div className="p-3 rounded bg-green-950/30 border-l-2 border-green-500">
                    <h4 className="font-bold text-green-400 mb-1 flex items-center gap-2"><Brain className="h-3 w-3"/> Strategic Advice</h4>
                     <ul className="space-y-1 text-green-100/80 list-disc pl-4">
                       {result.strategies.map((s: string, i: number) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                  <div className="p-3 rounded bg-red-950/30 border-l-2 border-red-500">
                    <h4 className="font-bold text-red-400 mb-1 flex items-center gap-2"><ShieldAlert className="h-3 w-3"/> Critical Weaknesses</h4>
                     <ul className="space-y-1 text-red-100/80 list-disc pl-4">
                       {result.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                </div>

                <ShareResult 
                  title="Zombie Survival Profile"
                  text={`I have a ${result.chance}% chance of surviving the zombie apocalypse as a ${result.profile}. Beat that!`}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
