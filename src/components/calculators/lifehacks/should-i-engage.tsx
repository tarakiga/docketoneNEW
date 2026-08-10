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
    // Decision-tree logic. Verdict bands: score > 8 (Engage), score < -5 (Abort), else Caution.
    // Every factor records {delta, reason}; the displayed reason is the strongest driver.
    let score = 5
    const factors: { delta: number; reason: string }[] = []
    const apply = (delta: number, reason: string) => { score += delta; factors.push({ delta, reason }) }

    // Topic
    if (topic === "politics") apply(-10, "Politics is a trap. Abort.")
    else if (topic === "ex_partner") apply(-8, "Do not mention the ex. Ever.")
    else if (topic === "money") apply(-3, "Money talk is risky.")
    else if (topic === "gossip") apply(-2, "Gossip is fun, but it always travels.")
    else if (topic === "hobbies") apply(5, "Hobbies are great common ground.")

    // Mood
    if (mood === "angry") apply(-20, "You are angry. You will regret this.")
    else if (mood === "tired") apply(-5, "You're too tired to make sense.")
    else if (mood === "sad") apply(-4, "You're low right now - be gentle with yourself.")
    else if (mood === "happy") apply(2, "Good mood, good odds.")

    // Relationship
    if (relationship === "nemesis") apply(-15, "It's your mortal enemy. Nothing good comes of this.")
    else if (relationship === "boss") apply(-5, "Professional boundary check required.")
    else if (relationship === "crush") apply(-2, "High stakes with a crush. Don't be weird.")
    else if (relationship === "stranger") apply(-3, "A stranger - read the room first.")
    else if (relationship === "bestie") apply(10, "It's your bestie, anything goes.")

    // Caffeine
    if (caffeine === "too_much") apply(-5, "You're vibrating. You'll overshare.")
    else if (caffeine === "none") apply(-2, "Brain fog warning.")

    // Dominant reason = the factor with the largest absolute impact.
    const reason = factors.length
      ? factors.reduce((a, b) => (Math.abs(b.delta) > Math.abs(a.delta) ? b : a)).reason
      : "Seems safe enough."

    // Verdict pills: bright fill + DARK ink for AA contrast on the dark arcade theme.
    let advice = "PROCEED WITH CAUTION"
    let color = "bg-yellow-400 text-[var(--dk-on-fill)]"
    let icon = <ShieldAlert className="w-12 h-12" />

    if (score > 8) {
       advice = "ENGAGE IMMEDIATELY"
       color = "bg-green-400 text-[var(--dk-on-fill)]"
       icon = <ThumbsUp className="w-12 h-12" />
    } else if (score < -5) {
       advice = "ABORT MISSION / RUN AWAY"
       color = "bg-red-500 text-white"
       icon = <ShieldAlert className="w-12 h-12 animate-bounce" />
    }

    return { advice, color, reason, score, icon }
  }, [topic, mood, relationship, caffeine])

  return (
    <div
      className="almanac space-y-8 animate-in fade-in duration-700"
      style={{
        ["--card" as string]: "var(--dk-surface)",
        ["--ink" as string]: "var(--dk-ink)",
        ["--ink-soft" as string]: "var(--dk-ink-soft)",
        ["--accent" as string]: "var(--dk-lim-ink)",
        ["--line" as string]: "var(--dk-line)",
      }}
    >
      <Card className="bg-[var(--dk-surface)] border-4 border-[var(--dk-line)] text-[var(--dk-ink)] shadow-[8px_8px_0px_0px_rgba(12,8,36,1)]">
        <CardHeader className="bg-[var(--dk-sunk)] text-[var(--dk-ink)] py-6 border-b-4 border-[var(--dk-line)]">
           <CardTitle className="text-3xl font-display flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-[var(--dk-lim-ink)]" />
              Should I Engage?
           </CardTitle>
           <CardDescription className="text-[var(--dk-ink-soft)]">
              A tactical decision engine for social interaction.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-[var(--dk-ink-soft)] tracking-widest">Topic of Conversation</Label>
                    <Select value={topic} onValueChange={setTopic}>
                       <SelectTrigger className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] focus:ring-[var(--dk-lim-ink)] focus:border-[var(--dk-lim-ink)]"><SelectValue/></SelectTrigger>
                       <SelectContent className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)]">
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
                    <Label className="uppercase text-xs font-bold text-[var(--dk-ink-soft)] tracking-widest">Your Current Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                       <SelectTrigger className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] focus:ring-[var(--dk-lim-ink)] focus:border-[var(--dk-lim-ink)]"><SelectValue/></SelectTrigger>
                       <SelectContent className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)]">
                          <SelectItem value="happy">Happy / Energetic</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="tired">Tired / Groggy</SelectItem>
                          <SelectItem value="sad">Sad / Emo</SelectItem>
                          <SelectItem value="angry">Angry / Rage</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-[var(--dk-ink-soft)] tracking-widest">Wait, who is this?</Label>
                    <Select value={relationship} onValueChange={setRelationship}>
                       <SelectTrigger className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] focus:ring-[var(--dk-lim-ink)] focus:border-[var(--dk-lim-ink)]"><SelectValue/></SelectTrigger>
                       <SelectContent className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)]">
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
                    <Label className="uppercase text-xs font-bold text-[var(--dk-ink-soft)] tracking-widest">Caffeine Level</Label>
                    <Select value={caffeine} onValueChange={setCaffeine}>
                       <SelectTrigger className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] focus:ring-[var(--dk-lim-ink)] focus:border-[var(--dk-lim-ink)]"><SelectValue/></SelectTrigger>
                       <SelectContent className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)]">
                          <SelectItem value="none">None (Decaf)</SelectItem>
                          <SelectItem value="adequate">Adequate (Functioning)</SelectItem>
                          <SelectItem value="too_much">Too Much (Vibrating)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-6 p-6 bg-[var(--dk-raised)] rounded-xl border-dashed border-2 border-[var(--dk-line)]">

                 <div className={`w-40 h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${result.color}`}>
                    {result.icon}
                 </div>

                 <div className="text-center space-y-2 animate-in slide-in-from-bottom-5">
                    <div className="text-3xl font-black uppercase tracking-tighter text-[var(--dk-ink)]">{result.advice}</div>
                    <div className="text-lg font-medium text-[var(--dk-ink-soft)] bg-[var(--dk-sunk)] px-4 py-2 rounded-lg border border-[var(--dk-line)]">
                       &quot;{result.reason}&quot;
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
