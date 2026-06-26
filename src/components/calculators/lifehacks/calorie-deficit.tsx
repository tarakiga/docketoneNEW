"use client"

import { useMemo, useState } from "react"
import { Flame, Plus, Minus, Trash2, Utensils, Footprints } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShareResult } from "@/components/molecules/share-result"
import {
  bmrMifflinStJeor,
  stepBurn,
  caloriesOut as calcCaloriesOut,
  netBalance,
  verdict,
  lbPerWeek,
  lbToKg,
  ftInToCm,
  LIFESTYLE_MULTIPLIERS,
  type Sex,
  type LifestyleKey,
  type UnitSystem,
} from "@/lib/calorie-deficit"

type FoodItem = { name: string; kcal: number }
type PlateItem = FoodItem & { qty: number }

const FOOD_GROUPS: Record<string, FoodItem[]> = {
  Breakfast: [
    { name: "Scrambled eggs (2)", kcal: 180 },
    { name: "Oatmeal bowl", kcal: 150 },
    { name: "Pancakes (2)", kcal: 350 },
    { name: "Bacon (2 strips)", kcal: 90 },
    { name: "Toast w/ butter", kcal: 130 },
    { name: "Greek yogurt", kcal: 120 },
    { name: "Banana", kcal: 105 },
    { name: "Croissant", kcal: 270 },
    { name: "Bagel w/ cream cheese", kcal: 360 },
    { name: "Cereal w/ milk", kcal: 200 },
  ],
  Mains: [
    { name: "Ham sandwich", kcal: 350 },
    { name: "Cheeseburger", kcal: 500 },
    { name: "Pizza (slice)", kcal: 285 },
    { name: "Grilled chicken breast", kcal: 280 },
    { name: "Spaghetti bolognese", kcal: 670 },
    { name: "Caesar wrap", kcal: 450 },
    { name: "Sushi roll (8 pc)", kcal: 350 },
    { name: "Burrito", kcal: 580 },
    { name: "Tuna sandwich", kcal: 330 },
    { name: "Fried rice", kcal: 530 },
  ],
  "Sides & Salads": [
    { name: "Garden salad", kcal: 150 },
    { name: "French fries (medium)", kcal: 365 },
    { name: "Garlic bread", kcal: 200 },
    { name: "Coleslaw", kcal: 150 },
    { name: "Mashed potatoes", kcal: 210 },
    { name: "Steamed veggies", kcal: 80 },
    { name: "Side soup", kcal: 120 },
    { name: "Onion rings", kcal: 410 },
  ],
  Snacks: [
    { name: "Potato chips (bag)", kcal: 150 },
    { name: "Chocolate bar", kcal: 230 },
    { name: "Apple", kcal: 95 },
    { name: "Granola bar", kcal: 120 },
    { name: "Mixed nuts (handful)", kcal: 170 },
    { name: "Popcorn (bowl)", kcal: 100 },
    { name: "Cookies (2)", kcal: 160 },
    { name: "Ice cream scoop", kcal: 140 },
    { name: "Donut", kcal: 250 },
    { name: "String cheese", kcal: 80 },
  ],
  Drinks: [
    { name: "Soda (can)", kcal: 140 },
    { name: "Orange juice", kcal: 110 },
    { name: "Latte", kcal: 190 },
    { name: "Black coffee", kcal: 5 },
    { name: "Beer (pint)", kcal: 210 },
    { name: "Glass of wine", kcal: 125 },
    { name: "Energy drink", kcal: 160 },
    { name: "Smoothie", kcal: 250 },
    { name: "Sweet tea", kcal: 90 },
    { name: "Water", kcal: 0 },
  ],
}

const GROUP_NAMES = Object.keys(FOOD_GROUPS)

export function CalorieDeficitCalculator() {
  // --- Food state ---
  const [plate, setPlate] = useState<PlateItem[]>([])
  const [customName, setCustomName] = useState("")
  const [customKcal, setCustomKcal] = useState("")

  // --- Body / activity state ---
  const [units, setUnits] = useState<UnitSystem>("metric")
  const [sex, setSex] = useState<Sex>("male")
  const [age, setAge] = useState("30")
  const [weight, setWeight] = useState("80")     // kg or lb depending on units
  const [heightCm, setHeightCm] = useState("180")
  const [heightFt, setHeightFt] = useState("5")
  const [heightIn, setHeightIn] = useState("11")
  const [lifestyle, setLifestyle] = useState<LifestyleKey>("sedentary")
  const [steps, setSteps] = useState("4000")

  function addFood(item: FoodItem) {
    setPlate((prev) => {
      const existing = prev.find((p) => p.name === item.name)
      if (existing) {
        return prev.map((p) => (p.name === item.name ? { ...p, qty: p.qty + 1 } : p))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function changeQty(name: string, delta: number) {
    setPlate((prev) =>
      prev
        .map((p) => (p.name === name ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0)
    )
  }

  function removeFood(name: string) {
    setPlate((prev) => prev.filter((p) => p.name !== name))
  }

  function addCustom() {
    const kcal = parseFloat(customKcal)
    const name = customName.trim()
    if (!name || isNaN(kcal) || kcal <= 0) return
    addFood({ name, kcal })
    setCustomName("")
    setCustomKcal("")
  }

  const results = useMemo(() => {
    const caloriesIn = plate.reduce((sum, p) => sum + p.kcal * p.qty, 0)

    const ageNum = parseFloat(age) || 0
    const stepsNum = parseFloat(steps) || 0
    const kg =
      units === "metric"
        ? parseFloat(weight) || 0
        : lbToKg(parseFloat(weight) || 0)
    const cm =
      units === "metric"
        ? parseFloat(heightCm) || 0
        : ftInToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0)

    const bmr = bmrMifflinStJeor(sex, kg, cm, ageNum)
    const multiplier = LIFESTYLE_MULTIPLIERS[lifestyle].value
    const burnFromSteps = stepBurn(stepsNum, kg)
    const caloriesOutTotal = calcCaloriesOut(bmr, multiplier, stepsNum, kg)
    const net = netBalance(caloriesIn, caloriesOutTotal)

    return {
      caloriesIn,
      bmr,
      burnFromSteps,
      caloriesOutTotal,
      net,
      verdict: verdict(net),
      lbWeek: lbPerWeek(net),
    }
  }, [plate, units, sex, age, weight, heightCm, heightFt, heightIn, lifestyle, steps])

  const verdictColor =
    results.verdict === "deficit"
      ? "text-[#86efac]"
      : results.verdict === "surplus"
      ? "text-[#ffd23c]"
      : "text-[#b3aae0]"

  const verdictLabel =
    results.verdict === "deficit"
      ? "Deficit"
      : results.verdict === "surplus"
      ? "Surplus"
      : "≈ Maintenance"

  const barMax = Math.max(results.caloriesIn, results.caloriesOutTotal, 1)
  const inPct = (results.caloriesIn / barMax) * 100
  const outPct = (results.caloriesOutTotal / barMax) * 100

  return (
    <div className="space-y-8 animate-in fade-in duration-700 almanac-darktool">
      <Card className="bg-[#1d1442] border-[#4a3f7a]">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-[#b6ff3c] flex items-center gap-2">
            <Flame className="h-8 w-8 text-[#b6ff3c]" />
            Calorie Deficit Calculator
          </CardTitle>
          <CardDescription className="text-[#b3aae0]">
            Log what you ate and a few body basics. We compare calories in vs calories out.
            Estimates only, not medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-4 sm:p-6 md:p-8">

          {/* ===== Calories In ===== */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#b3aae0] flex items-center gap-2">
              <Utensils className="h-4 w-4" /> What did you eat?
            </h3>
            <Tabs defaultValue={GROUP_NAMES[0]} className="w-full">
              <TabsList className="flex flex-wrap h-auto">
                {GROUP_NAMES.map((g) => (
                  <TabsTrigger key={g} value={g} className="text-xs">{g}</TabsTrigger>
                ))}
              </TabsList>
              {GROUP_NAMES.map((g) => (
                <TabsContent key={g} value={g} className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {FOOD_GROUPS[g].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => addFood(item)}
                        className="px-3 py-2 rounded-lg bg-[#241a52] border border-[#4a3f7a] text-sm text-[#ECEAE3] hover:border-[#b6ff3c] hover:text-white transition-all"
                      >
                        {item.name} <span className="text-[#b6ff3c] font-bold">{item.kcal}</span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Custom food */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
              <div className="flex-1">
                <Label className="text-xs text-[#b3aae0]">Custom food</Label>
                <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Mom's lasagna" className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
              </div>
              <div className="w-full sm:w-28">
                <Label className="text-xs text-[#b3aae0]">Calories</Label>
                <Input type="number" value={customKcal} onChange={(e) => setCustomKcal(e.target.value)} placeholder="kcal" className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
              </div>
              <Button onClick={addCustom} variant="secondary" className="shrink-0 bg-[#0c0824] border border-[#4a3f7a] text-[#ECEAE3] hover:bg-[#241a52]">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Today's plate */}
            {plate.length > 0 && (
              <div className="space-y-2 bg-[#0c0824] rounded-xl border border-[#4a3f7a] p-4">
                {plate.map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-[#ECEAE3] flex-1 truncate">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <button aria-label={`Decrease ${p.name}`} onClick={() => changeQty(p.name, -1)} className="p-1 rounded bg-[#241a52] hover:bg-[#4a3f7a]"><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center font-bold text-white">{p.qty}</span>
                      <button aria-label={`Increase ${p.name}`} onClick={() => changeQty(p.name, 1)} className="p-1 rounded bg-[#241a52] hover:bg-[#4a3f7a]"><Plus className="h-3 w-3" /></button>
                      <span className="w-16 text-right text-[#b6ff3c] font-bold">{p.kcal * p.qty}</span>
                      <button aria-label={`Remove ${p.name}`} onClick={() => removeFood(p.name)} className="p-1 rounded text-[#b3aae0] hover:text-[#ff8a8a]"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===== Calories Out ===== */}
          <section className="space-y-4 bg-[#0c0824] rounded-xl border border-[#4a3f7a] p-4 sm:p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#b3aae0] flex items-center gap-2">
              <Footprints className="h-4 w-4" /> What did you burn?
            </h3>

            {/* Unit toggle */}
            <div className="flex gap-1 p-1 bg-[#1d1442] rounded-lg w-fit border border-[#4a3f7a]">
              {(["metric", "imperial"] as UnitSystem[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${units === u ? "bg-[#b6ff3c] text-[#160e33]" : "text-[#b3aae0] hover:text-white"}`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 [&>div]:min-w-0">
              <div>
                <Label className="text-xs text-[#b3aae0]">Sex</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
                  <SelectTrigger className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus:ring-[#b6ff3c]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#b3aae0]">Age</Label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
              </div>
              <div>
                <Label className="text-xs text-[#b3aae0]">Weight ({units === "metric" ? "kg" : "lb"})</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
              </div>

              {units === "metric" ? (
                <div>
                  <Label className="text-xs text-[#b3aae0]">Height (cm)</Label>
                  <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-xs text-[#b3aae0]">Height (ft)</Label>
                    <Input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
                  </div>
                  <div>
                    <Label className="text-xs text-[#b3aae0]">Height (in)</Label>
                    <Input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
                  </div>
                </>
              )}

              <div>
                <Label className="text-xs text-[#b3aae0]">Daily activity</Label>
                <Select value={lifestyle} onValueChange={(v) => setLifestyle(v as LifestyleKey)}>
                  <SelectTrigger className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus:ring-[#b6ff3c]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(LIFESTYLE_MULTIPLIERS) as LifestyleKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{LIFESTYLE_MULTIPLIERS[k].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#b3aae0]">Steps walked</Label>
                <Input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} className="bg-[#0c0824] border-[#4a3f7a] text-[#ECEAE3] focus-visible:ring-[#b6ff3c]" />
              </div>
            </div>
            <p className="text-xs text-[#b3aae0]">
              Pick your baseline day above. It should <strong>not</strong> count the steps you log here; those are added on top.
            </p>
          </section>

          {/* ===== Result ===== */}
          <section className="space-y-5 bg-[#0c0824] rounded-xl border border-[#4a3f7a] p-4 sm:p-6">
            <div className="text-center space-y-1">
              <div className="text-xs uppercase tracking-widest text-[#b3aae0]">Net daily balance</div>
              <div className={`text-5xl font-black ${verdictColor}`} style={{ fontFamily: 'var(--font-bungee), cursive' }}>
                {results.net > 0 ? "+" : ""}{Math.round(results.net)} <span className="text-2xl">kcal</span>
              </div>
              <div className={`text-sm font-bold uppercase tracking-wide ${verdictColor}`}>{verdictLabel}</div>
              <div className="text-[#ECEAE3] text-sm pt-1">
                ≈ <strong>{results.lbWeek > 0 ? "+" : ""}{results.lbWeek.toFixed(1)} lb / week</strong> at this rate
                <span className="block text-xs text-[#b3aae0]">(real-world change is slower &amp; non-linear)</span>
              </div>
            </div>

            {/* In vs Out bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-[#b3aae0] mb-1"><span>Calories In</span><span>{Math.round(results.caloriesIn)}</span></div>
                <div className="h-3 bg-[#241a52] rounded-full overflow-hidden"><div className="h-full bg-[#ffd23c]" style={{ width: `${inPct}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between gap-2 text-xs text-[#b3aae0] mb-1">
                  <span className="min-w-0">Calories Out (BMR {Math.round(results.bmr)} × activity + {Math.round(results.burnFromSteps)} steps)</span>
                  <span className="shrink-0">{Math.round(results.caloriesOutTotal)}</span>
                </div>
                <div className="h-3 bg-[#241a52] rounded-full overflow-hidden"><div className="h-full bg-[#b6ff3c]" style={{ width: `${outPct}%` }} /></div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <ShareResult
                title="My Calorie Balance"
                text={`I ate ${Math.round(results.caloriesIn)} kcal and burned ~${Math.round(results.caloriesOutTotal)}, a ${Math.round(results.net)} kcal ${results.verdict}! 🔥`}
              />
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  )
}
