# Calorie Deficit Calculator — Design Spec

**Date:** 2026-06-08
**Status:** Approved design, pending implementation plan
**Category:** Life Hacks · **Slug:** `calorie-deficit` · **Route:** `/calculators/lifehacks/calorie-deficit/`

## 1. Purpose

A fun-but-practical "calories in vs calories out" calculator. The user logs what they
ate (quick-add common foods) and a few body/activity facts, and the tool returns their
net daily energy balance — a deficit or surplus — plus what that means for weight over time.

It is **approximate by design**, consistent with the rest of the Docket One catalogue.
It is not a medical or precise nutrition tool, and the UI/article say so plainly.

## 2. Where it lives (architecture)

This is a Next.js App Router site with `output: 'export'` (static export). The deployed
`docketoneBUILD` repo is **generated build output** and is never hand-edited.

**All work happens in the source repo:** `CALCULATOR/web-app`.
Pipeline: edit source → `npm run build` → `out/` → `deploy_build.ps1` pushes `out/` to
`github.com/tarakiga/docketoneBUILD`.

Calculators follow a fixed three-part pattern. A new calculator = three changes:

| File | Change |
|---|---|
| `src/components/calculators/lifehacks/calorie-deficit.tsx` | **New** `"use client"` component, exported as `CalorieDeficitCalculator` |
| `src/components/calculators/registry.tsx` | **Edit** — import the component and add `"calorie-deficit": CalorieDeficitCalculator` to the `CALCULATOR_COMPONENTS` map |
| `src/data/calculators.ts` | **Edit** — add one data object in the Life Hacks block |

Everything else is automatic and requires no extra wiring:
- The dynamic route `src/app/calculators/[category]/[slug]/page.tsx` looks up the data object
  by `slug` + `category`, renders `<RichCalculatorPage calculator={data}>` and injects the
  registry component as its child.
- `generateStaticParams()` emits the static path from the data object.
- `generateMetadata()` builds title/description/keywords/OG/Twitter/canonical from the data object.
- Sitemap entry, OpenGraph image, category-hub listing, and JSON-LD all derive from the data object.

## 3. Data object (`src/data/calculators.ts`)

Added inside the Life Hacks group, matching the existing shape exactly:

```ts
{
  id: "calorie-deficit",
  title: "Calorie Deficit Calculator",
  description: "Compare the calories you eat against the calories you burn.",
  category: "lifehacks",
  slug: "calorie-deficit",
  icon: "🔥",
  origin: "<The Origins card — energy balance: weight change is governed by calories in vs out>",
  howTo: "<The Master the Tool card — log foods, enter body basics + activity, read your net balance>",
  tips: [
    "Your BMR (just existing) burns far more than a day of walking — ~1,500–1,800 kcal.",
    "A ~3,500 kcal deficit ≈ 1 lb of fat, but real-world loss is slower and non-linear.",
    "Small consistent deficits beat crash diets for keeping the weight off."
  ],
  tags: ["Health", "Fitness"],
  content: `<long-form markdown article — see Section 6>`,
  faq: [ { question, answer }, ... 4–5 entries — see Section 6 ],
  relatedCalculators: ["sleep-cycle", "caffeine-half-life", "stress-ice-cream"]
}
```

Field → page-section mapping (rendered by `RichCalculatorPage`):
`origin` → "📜 The Origins" card · `howTo` → "🚀 Master the Tool" card · `tips` → Pro Tips ·
`content` → article · `faq` → FAQ accordion + `FAQPage` JSON-LD · `relatedCalculators` → Related.

## 4. Component (`calorie-deficit.tsx`)

A single `"use client"` component, `CalorieDeficitCalculator`, following the conventions of
existing widgets (e.g. `lifehacks/sleep-cycle.tsx`): `useState` for inputs, `useMemo` for
derived results, shadcn `ui/` primitives, lucide icons, and `ShareResult` at the bottom.

UI primitives used (all already present in `src/components/ui/`):
`tabs`, `select`, `input`, `slider`, `button`, `card`, `label`, `badge`.

### 4.1 Static preset data (plain `const` arrays at top of file)

```ts
type FoodItem = { name: string; kcal: number }
const FOODS: Record<'Breakfast'|'Mains'|'Sides & Salads'|'Snacks'|'Drinks', FoodItem[]> = { ... }
// ~50 common items total, e.g. { name: "Ham sandwich", kcal: 350 },
//   { name: "Garden salad", kcal: 150 }, { name: "Soda (can)", kcal: 140 }
```

No external API or database (the site is a static export). Values are rounded approximations.

### 4.2 Calories In (food side)

- A `Tabs` strip across the five food groups; each tab shows clickable chips
  (`Name · kcal`). Clicking adds the item to a "Today's plate" list.
- Each added row has a quantity stepper (−/+, min 1). Same item clicked twice → qty 2.
- A **"+ Custom food"** row: a name `Input` + a kcal `Input` + Add button, for anything
  not in the presets.
- `caloriesIn = Σ (item.kcal × qty)`.

### 4.3 Calories Out (burn side)

Inputs:
- **Sex** (Select: male/female) — required for BMR constant.
- **Age** (Input, years).
- **Weight** + **Height** with a **metric/imperial toggle** (kg/cm ↔ lb/ft+in).
  Conversions done inline in the component; `weight` and `length` factors also exist in
  `src/hooks/use-unit-converter.ts` if reuse is preferred — decided at implementation time.
- **Lifestyle multiplier** (Select), labeled *"your baseline day — **not** counting the steps
  you log below"*:
  - Sedentary (desk job) ×1.2
  - Lightly active ×1.375
  - Moderately active ×1.55
  - Very active ×1.725
- **Steps** (Input or Slider, default 0).

Formulas:
- **BMR (Mifflin–St Jeor)**, computed in metric (kg, cm):
  - Male: `10·kg + 6.25·cm − 5·age + 5`
  - Female: `10·kg + 6.25·cm − 5·age − 161`
- **Step burn:** `steps × 0.04 × (kg / 70)` (≈0.04 kcal/step at 70 kg, scaled by body weight).
- **Calories Out:** `BMR × lifestyleMultiplier + stepBurn`.

**Double-count resolution:** the lifestyle multiplier is explicitly labeled as the non-step
baseline, and step burn is added separately on top. The default is Sedentary so that logged
steps are the visible movement contribution. The approximation is acknowledged in the article.

### 4.4 Result

- **Net balance:** `net = caloriesIn − caloriesOut`. Headline number with colored verdict:
  - `net < −50` → "Deficit" (green)
  - `net > +50` → "Surplus" (amber)
  - within ±50 → "≈ Maintenance" (neutral)
- **Weight projection:** `lbPerWeek = (net / 3500) × 7`, shown as e.g. "≈ −3.4 lb / week at
  this rate", with a caveat that real-world change is slower and non-linear.
- **Breakdown visualization** (pure CSS/SVG, no chart library):
  - An In-vs-Out comparison (two bars or a paired bar).
  - The "Out" split into BMR vs steps; the "In" split by food category.
- **`ShareResult`** button with a summary string of the net result.

### 4.5 Worked example (sanity check)

Ham sandwich (350) + garden salad (150) + soda (140) = **640 in**.
Male, 30, 80 kg, 180 cm → BMR ≈ 1,780; Sedentary ×1.2 ≈ 2,136; +4,000 steps
(`4000×0.04×80/70 ≈ 183`) → **≈ 2,319 out**. Net ≈ **−1,679 kcal** → large deficit
(one light eating day < a full day's existence burn). Projection ≈ −3.4 lb/week.

## 5. Honesty / safety guardrails

- A visible "Estimates only — not medical or nutritional advice" line in the widget.
- The article explains the approximations: BMR formula variance between individuals, the
  3,500-kcal-per-pound rule of thumb and its limits, and why steps are a rounding error
  next to BMR.

## 6. Page copy (to be authored in the data object)

- **`content` article** outline: *The Energy Balance Equation* → *What BMR really is* →
  *Why your steps are a rounding error* → *Deficit vs Surplus (and why slow wins)*.
  Uses `##`/`###` headings; markdown is rendered by the existing pipeline.
- **`faq`** (4–5): "What's a calorie deficit?", "How accurate is this?", "Why is BMR so big
  compared to my steps?", "How fast can I safely lose weight?", "Is the 3,500-calorie rule real?"

## 7. Out of scope (YAGNI)

- No food-database search / external nutrition API.
- No saved history, accounts, or multi-day tracking.
- No macro (protein/carb/fat) breakdown.
- No new category — it lives in the existing Life Hacks.
- No exercise-preset menu (the lifestyle multiplier covers general activity; steps cover walking).

## 8. Verification

- `npm run build` succeeds (static export emits the new path).
- Route renders the widget; inputs compute the worked example above within rounding.
- Metric/imperial toggle round-trips. Deficit/surplus/maintenance thresholds behave.
- Calculator appears on the Life Hacks hub and in the sitemap; JSON-LD (`SoftwareApplication`
  + `FAQPage`) present in page source.
- Deploy via existing `deploy_build.ps1` (separate, user-initiated step).
