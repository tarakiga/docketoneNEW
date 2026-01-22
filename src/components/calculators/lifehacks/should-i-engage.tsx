"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, ShieldAlert, ThumbsUp } from "lucide-react"
import { useMemo, useState } from "react"

export function ShouldIEngage() {
  const [topic, setTopic] = useState("casual")
  const [mood, setMood] = useState("neutral")
  const [relationship, setRelationship] = useState("friend")
  const [caffeine, setCaffeine] = useState("adequate")

  const result = useMemo(() => {
    // Decision Tree Logic
    // Scores: > 5 (Engage), < 0 (Run), 0-5 (Proceed with Caution)
    
    let score = 5
    let reason = "Seems safe enough."
    
    // Topic Modifiers
    if (topic === "politics") { score -= 10; reason = "Politics is a trap. Abort." }
    if (topic === "ex_partner") { score -= 8; reason = "Do not mention the ex. Ever." }
    if (topic === "money") { score -= 3; reason = "Money talk is risky." }
    if (topic === "hobbies") { score += 5; reason = "Hobbies are great common ground." }
    
    // Mood Modifiers
    if (mood === "angry") { score -= 20; reason = "You are angry. You will regret this." }
    if (mood === "tired") { score -= 5; reason = "You're too tired to make sense." }
    if (mood === "happy") { score += 2; }
    
    // Relationship
    if (relationship === "crush") { score -= 2; reason = "High stakes with a crush. Don't be weird." }
    if (relationship === "boss") { score -= 5; reason = "Professional boundary check required." }
    if (relationship === "bestie") { score += 10; reason = "It's your bestie, anything goes." }
    
    // Caffeine
    if (caffeine === "too_much") { score -= 5; reason = "You're vibrating. You'll overshare." }
    if (caffeine === "none") { score -= 2; reason = "Brain fog warning." }

    let advice = "PROCEED WITH CAUTION"
    let color = "bg-yellow-500"
    let icon = <ShieldAlert className="w-12 h-12" />

    if (score > 8) {
       advice = "ENGAGE IMMEDIATELY"
       color = "bg-green-500"
       icon = <ThumbsUp className="w-12 h-12" />
    } else if (score < -5) {
       advice = "ABORT MISSION / RUN AWAY"
       color = "bg-red-600"
       icon = <ShieldAlert className="w-12 h-12 animate-bounce" />
    }

    return { advice, color, reason, score, icon }
  }, [topic, mood, relationship, caffeine])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-50 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        <CardHeader className="bg-slate-900 text-white py-6">
           <CardTitle className="text-3xl font-display flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-yellow-400" />
              Should I Engage?
           </CardTitle>
           <CardDescription className="text-slate-400">
              A tactical decision engine for social interaction.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-slate-500 tracking-widest">Topic of Conversation</Label>
                    <Select value={topic} onValueChange={setTopic}>
                       <SelectTrigger><SelectValue/></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="casual">Casual / Small Talk</SelectItem>
                          <SelectItem value="hobbies">Shared Hobbies</SelectItem>
                          <SelectItem value="money">Money / Debt</SelectItem>
                          <SelectItem value="politics">Politics / Religion</SelectItem>
                          <SelectItem value="ex_partner">An Ex-Partner</SelectItem>
                          <SelectItem value="gossip">Juicy Gossip</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-slate-500 tracking-widest">Your Current Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                       <SelectTrigger><SelectValue/></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="happy">Happy / Energetic</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="tired">Tired / Groggy</SelectItem>
                          <SelectItem value="sad">Sad / Emo</SelectItem>
                          <SelectItem value="angry">Angry / Rage</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-slate-500 tracking-widest">Wait, who is this?</Label>
                    <Select value={relationship} onValueChange={setRelationship}>
                       <SelectTrigger><SelectValue/></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="stranger">Stranger</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="bestie">Best Friend (Ride or Die)</SelectItem>
                          <SelectItem value="crush">Crush / Date</SelectItem>
                          <SelectItem value="boss">Boss / Coworker</SelectItem>
                          <SelectItem value="nemesis">Mortal Enemy</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-slate-500 tracking-widest">Caffeine Level</Label>
                    <Select value={caffeine} onValueChange={setCaffeine}>
                       <SelectTrigger><SelectValue/></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="none">None (Decaf)</SelectItem>
                          <SelectItem value="adequate">Adequate (Functioning)</SelectItem>
                          <SelectItem value="too_much">Too Much (Vibrating)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-6 p-6 bg-slate-100 rounded-xl border-dashed border-2 border-slate-300">
                 
                 <div className={`w-40 h-40 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-500 ${result.color}`}>
                    {result.icon}
                 </div>

                 <div className="text-center space-y-2 animate-in slide-in-from-bottom-5">
                    <div className="text-3xl font-black uppercase tracking-tighter">{result.advice}</div>
                    <div className="text-lg font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200">
                       "{result.reason}"
                    </div>
                 </div>

              </div>
           </div>

           <div className="flex justify-center">
              <ShareResult 
                 title="Tactical Social Decision" 
                 text={`Should I talk about ${topic} with my ${relationship}? The algorithm says: ${result.advice}. "${result.reason}" 🤖`} 
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
