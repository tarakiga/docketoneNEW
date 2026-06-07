# Calorie Deficit Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Calorie Deficit Calculator" to the Life Hacks category that compares calories eaten (quick-add foods) against calories burned (BMR + lifestyle + steps) and reports the net balance, a verdict, and a weight projection.

**Architecture:** Follow the site's fixed three-part calculator pattern — a `"use client"` widget component, a registry entry mapping slug→component, and a content data object. Extract all numeric logic into a pure `src/lib/calorie-deficit.ts` module so the component stays presentational and the math is isolatable.

**Tech Stack:** Next.js App Router (static export, `output: 'export'`), React, TypeScript, Tailwind, shadcn `ui/` primitives (Tabs, Select, Input, Button, Card, Label), lucide-react icons. No test runner exists in this repo; verification is `npm run build` + `eslint` + browser check of the worked example.

**Working directory:** `D:\work\Tar\PROJECTS\CALCULATOR\web-app` (the source repo — NOT the generated `docketoneBUILD` repo).

**Spec:** `docs/superpowers/specs/2026-06-08-calorie-deficit-calculator-design.md`

> **Testing note (deliberate deviation from TDD):** This repo has no unit-test runner and its calculators have no tests; it is validated by build + lint + manual browser checks. Adding a test framework is out of scope (YAGNI). The math is therefore extracted into `src/lib/calorie-deficit.ts` (pure functions) and verified against the spec's worked example in the browser. If a runner (e.g. vitest) is added later, that module is ready to unit-test with no refactor.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/calorie-deficit.ts` | **Create.** Pure functions + constants: unit conversion, Mifflin–St Jeor BMR, step burn, calories-out, net, verdict, weight projection. No React. |
| `src/components/calculators/lifehacks/calorie-deficit.tsx` | **Create.** `"use client"` component `CalorieDeficitCalculator`: food presets, all inputs, result + breakdown UI. Imports the lib for math. |
| `src/components/calculators/registry.tsx` | **Modify.** Import the component; add `"calorie-deficit": CalorieDeficitCalculator` to `CALCULATOR_COMPONENTS`. |
| `src/data/calculators.ts` | **Modify.** Add one data object in the Life Hacks block (drives route, meta, page sections, JSON-LD). |

Everything else (route, page shell, sitemap, OG image, hub listing) is automatic.

---

## Task 1: Pure calculation module

**Files:**
- Create: `src/lib/calorie-deficit.ts`

- [ ] **Step 1: Create the module with constants, types, and pure functions**

```ts
// src/lib/calorie-deficit.ts
// Pure, framework-free calorie math. No React imports.

export type Sex = "male" | "female"
export type UnitSystem = "metric" | "imperial"

export const LIFESTYLE_MULTIPLIERS = {
  sedentary: { label: "Sedentary (desk job)", value: 1.2 },
  light: { label: "Lightly active", value: 1.375 },
  moderate: { label: "Moderately active", value: 1.55 },
  very: { label: "Very active", value: 1.725 },
} as const

export type LifestyleKey = keyof typeof LIFESTYLE_MULTIPLIERS

// --- Unit conversion (imperial -> metric) ---
export function lbToKg(lb: number): number {
  return lb * 0.45359237
}

export function ftInToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54
}

// --- Energy expenditure ---
// Mifflin-St Jeor BMR, inputs in metric (kg, cm).
export function bmrMifflinStJeor(sex: Sex, kg: number, cm: number, age: number): number {
  const base = 10 * kg + 6.25 * cm - 5 * age
  return sex === "male" ? base + 5 : base - 161
}

// ~0.04 kcal per step at 70 kg, scaled linearly by body weight.
export function stepBurn(steps: number, kg: number): number {
  return steps * 0.04 * (kg / 70)
}

// Total daily burn = BMR x lifestyle multiplier + step burn.
export function caloriesOut(bmr: number, multiplier: number, steps: number, kg: number): number {
  return bmr * multiplier + stepBurn(steps, kg)
}

// --- Balance & projection ---
export function netBalance(caloriesIn: number, caloriesOutTotal: number): number {
  return caloriesIn - caloriesOutTotal
}

export type Verdict = "deficit" | "surplus" | "maintenance"

export function verdict(net: number): Verdict {
  if (net < -50) return "deficit"
  if (net > 50) return "surplus"
  return "maintenance"
}

// 3,500 kcal ~= 1 lb of fat; convert a daily net into lb/week.
export function lbPerWeek(net: number): number {
  return (net / 3500) * 7
}
```

- [ ] **Step 2: Type-check & lint the new module**

Run: `npx tsc --noEmit` then `npx eslint src/lib/calorie-deficit.ts`
Expected: no errors.

- [ ] **Step 3: Verify the worked example numerically (throwaway check)**

Create a temporary file `scratch-verify.mjs` in the repo root with a JS mirror of the formulas and assert the spec's worked example, then delete it:

```js
// scratch-verify.mjs  (temporary — delete after running)
const bmr = (sex, kg, cm, age) => 10*kg + 6.25*cm - 5*age + (sex === "male" ? 5 : -161)
const stepBurn = (steps, kg) => steps * 0.04 * (kg / 70)
const out = bmr("male", 80, 180, 30) * 1.2 + stepBurn(4000, 80)
const inCal = 350 + 150 + 140
const net = inCal - out
console.log({ bmr: bmr("male",80,180,30), out: Math.round(out), inCal, net: Math.round(net), lbWeek: ((net/3500)*7).toFixed(1) })
// Expected approx: bmr 1780, out 2319, inCal 640, net -1679, lbWeek -3.4
```

Run: `node scratch-verify.mjs`
Expected output approximately: `{ bmr: 1780, out: 2319, inCal: 640, net: -1679, lbWeek: '-3.4' }`
Then: `rm scratch-verify.mjs` (Windows: `Remove-Item scratch-verify.mjs`)

- [ ] **Step 4: Commit**

```bash
git add src/lib/calorie-deficit.ts
git commit -m "feat(calorie-deficit): add pure calorie math module"
```

---

## Task 2: Content data object

**Files:**
- Modify: `src/data/calculators.ts` (Life Hacks block — insert after the `sleep-cycle` object)

- [ ] **Step 1: Insert the data object**

Find the `sleep-cycle` object (its `slug: "sleep-cycle"` line) and insert this object immediately after its closing `},` so it sits inside the Life Hacks group:

```ts
  {
    id: "calorie-deficit",
    title: "Calorie Deficit Calculator",
    description: "Compare the calories you eat against the calories you burn.",
    category: "lifehacks",
    slug: "calorie-deficit",
    icon: "🔥",
    origin: "Your weight is governed by one stubborn equation: energy in versus energy out. Eat less than you burn and you lose weight; eat more and you gain. This tool makes that invisible balance visible.",
    howTo: "Tap to add what you ate from the quick menu (or add a custom item), then enter a few body basics and your steps. We estimate the calories you burned and subtract them from what you ate to reveal your daily surplus or deficit.",
    tips: [
      "Your BMR — the energy you burn just existing — dwarfs a day of walking (roughly 1,500–1,800 kcal vs ~180 for 4,000 steps).",
      "About 3,500 kcal is often quoted as one pound of fat, but real-world loss is slower and non-linear.",
      "Small, consistent deficits are far easier to sustain than crash diets — and you keep the results."
    ],
    tags: ["Health", "Fitness"],
    content: `
## The Energy Balance Equation

Weight change is not magic or willpower — it is arithmetic. Every day your body spends a
certain number of calories, and you take a certain number in through food and drink. The
difference is everything:

*   Eat **fewer** calories than you burn → a **deficit** → you lose weight over time.
*   Eat **more** than you burn → a **surplus** → you gain.
*   Match them → **maintenance**.

## What BMR Really Is

The single biggest number on the "out" side isn't exercise — it's your **Basal Metabolic
Rate (BMR)**: the energy your body burns just keeping you alive (heart, brain, breathing,
staying warm). We estimate it with the **Mifflin–St Jeor** equation, the modern standard,
using your sex, age, weight, and height. For most people BMR is 1,500–1,800 kcal a day
*before you move a muscle*.

### Why Your Steps Are a Rounding Error

Walking 4,000 steps burns only ~180 kcal — barely a tenth of your BMR. That is why this
tool leads with BMR and a lifestyle multiplier, then adds your steps on top. Movement
matters for health, but you cannot reliably out-walk your fork.

## Deficit vs Surplus (and Why Slow Wins)

A modest daily deficit of 300–500 kcal points toward roughly 0.5–1 lb of loss per week —
sustainable and gentle. Aggressive deficits trigger hunger, muscle loss, and rebound. The
calculator shows your projected weekly change so you can aim for a pace you can actually keep.
`,
    faq: [
      { question: "What is a calorie deficit?", answer: "It's when you consume fewer calories than your body burns in a day. Sustained over time, a deficit is what causes weight loss." },
      { question: "How accurate is this calculator?", answer: "It's a solid estimate, not a lab measurement. BMR formulas, food calorie values, and step-burn rates all vary between individuals, so treat the result as a well-informed ballpark rather than an exact figure." },
      { question: "Why is my BMR so much bigger than my steps?", answer: "Because simply staying alive is metabolically expensive. Your organs run 24/7, which costs far more energy than a walk. That's why tweaking food intake usually moves the needle more than adding steps." },
      { question: "How fast can I safely lose weight?", answer: "Most guidance points to about 0.5–1 lb per week, from a daily deficit of roughly 300–500 calories. Faster than that tends to cost muscle and rarely sticks." },
      { question: "Is the 3,500-calories-per-pound rule real?", answer: "It's a useful rule of thumb, not a law. Real bodies adapt — metabolism shifts as you lose weight — so actual loss is slower and less linear than the simple math suggests." }
    ],
    relatedCalculators: ["sleep-cycle", "caffeine-half-life", "stress-ice-cream"]
  },
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (the object must match the existing calculator type used elsewhere in the file).

- [ ] **Step 3: Commit**

```bash
git add src/data/calculators.ts
git commit -m "feat(calorie-deficit): add calculator content data object"
```

---

## Task 3: The calculator component

**Files:**
- Create: `src/components/calculators/lifehacks/calorie-deficit.tsx`

- [ ] **Step 1: Create the component file**

```tsx
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
    const kcal = parseInt(customKcal, 10)
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
      ? "text-emerald-400"
      : results.verdict === "surplus"
      ? "text-amber-400"
      : "text-slate-300"

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
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-900 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-orange-400 flex items-center gap-2">
            <Flame className="h-8 w-8 text-orange-500 fill-orange-500/20" />
            Calorie Deficit Calculator
          </CardTitle>
          <CardDescription className="text-orange-200/60">
            Log what you ate and a few body basics. We compare calories in vs calories out —
            estimates only, not medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6 md:p-8">

          {/* ===== Calories In ===== */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-200 flex items-center gap-2">
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
                        className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:border-orange-500 hover:text-white transition-all"
                      >
                        {item.name} <span className="text-orange-400 font-bold">{item.kcal}</span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Custom food */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
              <div className="flex-1">
                <Label className="text-xs text-slate-400">Custom food</Label>
                <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Mom's lasagna" />
              </div>
              <div className="w-full sm:w-28">
                <Label className="text-xs text-slate-400">Calories</Label>
                <Input type="number" value={customKcal} onChange={(e) => setCustomKcal(e.target.value)} placeholder="kcal" />
              </div>
              <Button onClick={addCustom} variant="secondary" className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Today's plate */}
            {plate.length > 0 && (
              <div className="space-y-2 bg-slate-950 rounded-xl border border-slate-800 p-4">
                {plate.map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-200 flex-1 truncate">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(p.name, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700"><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center font-bold text-white">{p.qty}</span>
                      <button onClick={() => changeQty(p.name, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700"><Plus className="h-3 w-3" /></button>
                      <span className="w-16 text-right text-orange-400 font-bold">{p.kcal * p.qty}</span>
                      <button onClick={() => removeFood(p.name)} className="p-1 rounded text-slate-500 hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===== Calories Out ===== */}
          <section className="space-y-4 bg-slate-950 rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-200 flex items-center gap-2">
              <Footprints className="h-4 w-4" /> What did you burn?
            </h3>

            {/* Unit toggle */}
            <div className="flex gap-1 p-1 bg-slate-900 rounded-lg w-fit border border-slate-800">
              {(["metric", "imperial"] as UnitSystem[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${units === u ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-slate-400">Sex</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400">Age</Label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Weight ({units === "metric" ? "kg" : "lb"})</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>

              {units === "metric" ? (
                <div>
                  <Label className="text-xs text-slate-400">Height (cm)</Label>
                  <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-xs text-slate-400">Height (ft)</Label>
                    <Input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Height (in)</Label>
                    <Input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
                  </div>
                </>
              )}

              <div>
                <Label className="text-xs text-slate-400">Daily activity</Label>
                <Select value={lifestyle} onValueChange={(v) => setLifestyle(v as LifestyleKey)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(LIFESTYLE_MULTIPLIERS) as LifestyleKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{LIFESTYLE_MULTIPLIERS[k].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400">Steps walked</Label>
                <Input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Pick your baseline day above — it should <strong>not</strong> count the steps you log here; those are added on top.
            </p>
          </section>

          {/* ===== Result ===== */}
          <section className="space-y-5 bg-slate-950 rounded-xl border border-orange-900/40 p-6">
            <div className="text-center space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-400">Net daily balance</div>
              <div className={`text-5xl font-black ${verdictColor}`}>
                {results.net > 0 ? "+" : ""}{Math.round(results.net)} <span className="text-2xl">kcal</span>
              </div>
              <div className={`text-sm font-bold uppercase tracking-wide ${verdictColor}`}>{verdictLabel}</div>
              <div className="text-slate-300 text-sm pt-1">
                ≈ <strong>{results.lbWeek > 0 ? "+" : ""}{results.lbWeek.toFixed(1)} lb / week</strong> at this rate
                <span className="block text-xs text-slate-500">(real-world change is slower &amp; non-linear)</span>
              </div>
            </div>

            {/* In vs Out bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Calories In</span><span>{Math.round(results.caloriesIn)}</span></div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500" style={{ width: `${inPct}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Calories Out (BMR {Math.round(results.bmr)} × activity + {Math.round(results.burnFromSteps)} steps)</span>
                  <span>{Math.round(results.caloriesOutTotal)}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500" style={{ width: `${outPct}%` }} /></div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <ShareResult
                title="My Calorie Balance"
                text={`I ate ${Math.round(results.caloriesIn)} kcal and burned ~${Math.round(results.caloriesOutTotal)} — a ${Math.round(results.net)} kcal ${results.verdict}! 🔥`}
              />
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Type-check & lint**

Run: `npx tsc --noEmit` then `npx eslint src/components/calculators/lifehacks/calorie-deficit.tsx`
Expected: no errors. If `ShareResult`'s prop names differ, open `src/components/molecules/share-result.tsx` and match its actual props (it is used in `sleep-cycle.tsx` with `title` and `text`).

- [ ] **Step 3: Commit**

```bash
git add src/components/calculators/lifehacks/calorie-deficit.tsx
git commit -m "feat(calorie-deficit): add calculator widget component"
```

---

## Task 4: Register the component

**Files:**
- Modify: `src/components/calculators/registry.tsx`

- [ ] **Step 1: Add the import**

In the Life Hacks import group (near `import { SleepCycleCalculator } from "./lifehacks/sleep-cycle"`), add:

```tsx
import { CalorieDeficitCalculator } from "./lifehacks/calorie-deficit"
```

- [ ] **Step 2: Add the map entry**

In the `CALCULATOR_COMPONENTS` object (near `"sleep-cycle": SleepCycleCalculator,`), add:

```tsx
  "calorie-deficit": CalorieDeficitCalculator,
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/calculators/registry.tsx
git commit -m "feat(calorie-deficit): register calculator in component registry"
```

---

## Task 5: Build & browser verification

**Files:** none (verification only)

- [ ] **Step 1: Production build (static export)**

Run: `npm run build`
Expected: build succeeds and the output includes the new static path
`calculators/lifehacks/calorie-deficit` (check `out/calculators/lifehacks/calorie-deficit/index.html` exists).

- [ ] **Step 2: Lint the whole project**

Run: `npm run lint`
Expected: no new errors from the added files.

- [ ] **Step 3: Browser-verify the worked example**

Run: `npm run dev`, open `http://localhost:3000/calculators/lifehacks/calorie-deficit/`.
- Add: Ham sandwich, Garden salad, Soda (can) → Calories In shows **640**.
- Set metric, Male, age 30, weight 80, height 180, Sedentary, steps 4000.
- Expected: Calories Out ≈ **2,319**, Net ≈ **−1,679 kcal**, verdict **Deficit** (green), ≈ **−3.4 lb/week**.
- Toggle to Imperial: weight 176 lb, height 5 ft 11 in → results stay within ~1–2% of the metric figures.
- Confirm the calculator appears on the Life Hacks hub (`/calculators/lifehacks/`) and that page source contains `FAQPage` JSON-LD.

- [ ] **Step 4: Final commit (if any build-time adjustments were needed)**

```bash
git add -A
git commit -m "chore(calorie-deficit): verify build and static export"
```

> **Deploy (separate, user-initiated):** running `deploy_build.ps1` pushes `out/` to the `docketoneBUILD` repo. Do NOT run it as part of this plan unless the user asks.

---

## Self-Review

**Spec coverage:**
- Three-part pattern (component / registry / data) → Tasks 2–4. ✅
- Food quick-add by group + qty + custom (§4.1–4.2) → Task 3 `FOOD_GROUPS`, `addFood`, `changeQty`, `addCustom`. ✅
- BMR / lifestyle / steps + metric-imperial (§4.3) → Task 1 lib + Task 3 inputs. ✅
- Double-count resolution (multiplier labeled non-step + additive steps) → Task 3 helper text + `caloriesOut`. ✅
- Net + verdict + weight projection + breakdown bars (§4.4) → Task 3 result section. ✅
- Honesty guardrails (§5) → CardDescription disclaimer + article/FAQ in Task 2. ✅
- Article + FAQ + tips + related (§6) → Task 2 data object. ✅
- Out-of-scope items (§7) → none implemented. ✅
- Verification (§8) → Task 5. ✅

**Placeholder scan:** No TBD/TODO; all code blocks complete; food list fully enumerated; article and FAQ copy written in full.

**Type consistency:** `caloriesOut` (lib) imported aliased as `calcCaloriesOut` to avoid shadowing the local `caloriesOutTotal`; `Sex`, `LifestyleKey`, `UnitSystem` types shared from the lib and used consistently in component state setters; `LIFESTYLE_MULTIPLIERS` keys drive both the Select and the math. Slug `"calorie-deficit"` identical across data object, registry map, and route.
