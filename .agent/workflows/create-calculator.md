---
description: How to create a new calculator page from scratch and ensure it is fully integrated — data registration, component, registry, sitemap, category listing, and deployment.
---

# /create-calculator — New Calculator Workflow

This workflow covers the complete process of adding a new calculator to the Docket One site. Follow every step in order. Do NOT skip steps — each one feeds into the next.

---

## Phase 1: Planning & Content

### Step 1 — Identify Category

Choose the correct category from the existing list. The category determines where the calculator appears on the landing page.

| Category ID     | Display Name   | Theme                                 |
|-----------------|----------------|---------------------------------------|
| `bigkidmath`    | Big Kid Math   | Real adulting decisions               |
| `cipherlab`     | Cipher Lab     | Codes, encryption, & security         |
| `geekgalaxy`    | Geek Galaxy    | Sci-fi scenarios & pop culture        |
| `lifehacks`     | Life Hacks     | Everyday optimization                 |
| `mathmagik`     | Math Magik     | Fun with numbers & patterns           |
| `otakuops`      | Otaku Ops      | Anime, manga, & gaming               |
| `brainmodes`    | Brain Modes    | Neurodivergence validation            |

If a new category is required, it must also be added to `CATEGORY_META` in `calculators.ts`, the category type union, the `[category]/page.tsx` name mappings, and the `related-calculators.tsx` style map.

### Step 2 — Define Slug & ID

- The `slug` and `id` should be the same value.
- Use lowercase kebab-case: `data-weight`, `coffee-code`, `zombie-survival`.
- Must be unique across ALL calculators (not just within the category).

### Step 3 — Write Rich Content

Every calculator MUST have ALL of the following fields populated:

```typescript
{
  id: "my-calculator",                    // Required. Same as slug.
  title: "My Calculator Title",            // Required. User-facing title.
  description: "One-line description.",     // Required. Shown on cards.
  category: "geekgalaxy",                  // Required. One of the category IDs.
  slug: "my-calculator",                   // Required. URL segment.
  icon: "⚖️",                             // Required. Emoji for cards & OG image.
  origin: "Why this exists...",            // Required. Shown in '📜 The Origins' card.
  howTo: "How to use it...",               // Required. Shown in '🚀 Master the Tool' card.
  tips: [                                  // Required. Min 3 tips for 'Pro Tips' section.
    "Tip 1...",
    "Tip 2...",
    "Tip 3...",
  ],
  tags: ["Science", "Tech"],               // Required. Used for tag-based filtering on category page.
  content: `                               // Required. Markdown article body for SEO content.
## Main Heading

Rich markdown content explaining the science, context, or lore.
Use sub-headings (###), bullet lists, and inline math ($E = mc^2$) for depth.
  `,
  faq: [                                   // Required. Min 3 Q&A pairs for FAQ accordion + JSON-LD schema.
    { question: "...", answer: "..." },
    { question: "...", answer: "..." },
    { question: "...", answer: "..." },
  ],
  relatedCalculators: ["slug-1", "slug-2", "slug-3"]  // Required. 3 related calculator slugs.
}
```

> **Quality standard**: Content should be educational, entertaining, and SEO-rich. Write like a human who is genuinely excited about the topic. Avoid corporate tone. Reference real science, history, or lore where applicable.

---

## Phase 2: Data Registration

### Step 4 — Add entry to `src/data/calculators.ts`

Open the `calculators` array in `src/data/calculators.ts` and add the new calculator object.

**Placement rule**: Add the entry within the section for its category (they are grouped in the array). Find the comment or grouping for the target category and insert the new entry there.

**File**: `src/data/calculators.ts`
**Location**: Inside the `export const calculators: Calculator[]` array
**Category type**: If using a new category, also update the `Calculator.category` union type on line 5.

---

## Phase 3: Component Creation

### Step 5 — Create the calculator component

Create the interactive React component file:

**File**: `src/components/calculators/{category}/{slug}.tsx`

Follow this exact skeleton pattern:

```tsx
"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SomeIcon } from "lucide-react"
import { useMemo, useState } from "react"

// Constants / Config objects go here (crystals, presets, etc.)

export function MyCalculator() {
  // State (inputs)
  const [inputA, setInputA] = useState(50)
  const [inputB, setInputB] = useState(5)

  // Derived calculation (useMemo)
  const result = useMemo(() => {
    // Core calculation logic
    return computedValue
  }, [inputA, inputB])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="bg-slate-950 border-slate-800 overflow-hidden relative">
        {/* Optional: Ambient glow or background effects */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: '...' }} />

        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-display text-slate-100 flex items-center gap-2">
            <SomeIcon className="h-6 w-6" />
            Calculator Title
          </CardTitle>
          <CardDescription>Subtitle or instruction text.</CardDescription>
        </CardHeader>

        <CardContent className="grid lg:grid-cols-2 gap-12 relative z-10">
          {/* LEFT: Controls (Sliders, Selectors, Inputs) */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-slate-300">Input Label</Label>
                <span className="text-xs text-slate-500 font-mono">{inputA}</span>
              </div>
              <Slider value={[inputA]} onValueChange={([v]) => setInputA(v)} min={0} max={100} step={1} />
            </div>
            {/* ... more sliders/controls */}
          </div>

          {/* RIGHT: Visualization / Results */}
          <div className="flex flex-col items-center justify-center space-y-8 bg-black/40 rounded-xl p-6 border border-white/5">
            {/* Primary result display */}
            <div className="text-center space-y-2">
              <div className="text-5xl font-black text-white">{result}</div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">Result Label</div>
            </div>

            {/* Stat cards (optional) */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-3 rounded text-center border border-white/5">
                <div className="text-xs text-slate-500 mb-1">Stat Label</div>
                <div className="font-mono text-white">Value</div>
              </div>
            </div>

            {/* Share button */}
            <ShareResult
              title="Calculator Title"
              text={`My result is ${result}! Try it yourself.`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Component Rules

1. **Must be `"use client"`** — All calculators use client-side interactivity.
2. **Export the function** with a descriptive PascalCase name: `DataWeightCalculator`, `LightsaberBatteryCalculator`.
3. **Use `useMemo`** for derived calculations to avoid unnecessary re-renders.
4. **Use `useState`** for all input state, controlled by Slider or custom selectors.
5. **Include `ShareResult`** at the bottom of the visualization area for social sharing.
6. **Dark theme card** — Use `bg-slate-950 border-slate-800` as the base card. This matches the site-wide premium dark aesthetic.
7. **Two-column layout** — Controls on the left (`lg:grid-cols-2`), visualization/results on the right.
8. **Animations** — Use `animate-in fade-in duration-700` on the wrapper for entry animation.
9. **No external API calls** — All calculations must happen client-side in the browser. Data never leaves the user's device.

---

## Phase 4: Registry

### Step 6 — Register the component in `registry.tsx`

**File**: `src/components/calculators/registry.tsx`

Two changes are required:

#### 6a. Add the import (at the top, grouped by category)

```tsx
import { MyCalculator } from "./{category}/{slug}"
```

#### 6b. Add to the `CALCULATOR_COMPONENTS` map (grouped by category)

```tsx
export const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  // ... existing entries ...

  // {category}
  "{slug}": MyCalculator,
}
```

> **Critical**: The key in `CALCULATOR_COMPONENTS` MUST exactly match the `slug` from `calculators.ts`. If they don't match, the page will render `<NotFoundComponent />` instead of the calculator.

---

## Phase 5: Verification

### Step 7 — Verify data linkage

Run this mental checklist (or grep for it):

| Check | How |
|---|---|
| `calculators.ts` has entry with matching `id` and `slug` | `grep "id: \"my-slug\"" src/data/calculators.ts` |
| `registry.tsx` import exists | `grep "my-slug" src/components/calculators/registry.tsx` |
| `registry.tsx` map entry exists | Same grep as above — both import AND map key should match |
| Component file exists | `ls src/components/calculators/{category}/{slug}.tsx` |
| Component exports named function | `grep "export function" src/components/calculators/{category}/{slug}.tsx` |

### Step 8 — Build and check for errors

// turbo
```
npm run build
```

**What to check in build output:**
- ✅ No TypeScript errors
- ✅ The route `/calculators/{category}/{slug}` appears in the build output route list
- ✅ The category route `/calculators/{category}` appears (it's auto-generated from `generateStaticParams`)
- ✅ `sitemap.xml` is generated (opens in browser to verify URLs)

> The static export system (`output: 'export'`) will **automatically**:
> - Generate the page at `/calculators/{category}/{slug}/index.html`
> - Include it in `sitemap.xml` (via `src/app/sitemap.ts` which reads from `calculators` array)
> - Generate an OpenGraph image via `opengraph-image.tsx`
> - Include it on the category listing page (via `[category]/page.tsx` filtering)

---

## Phase 6: Auto-Generated Pages (No Action Needed)

These pages are **automatically handled** by the existing dynamic route architecture. No manual edits required:

| Page | How It Works | File |
|---|---|---|
| **Calculator detail page** | `[slug]/page.tsx` reads from `calculators.ts` → finds by slug → renders via `RichCalculatorPage` template wrapping the registered component | `src/app/calculators/[category]/[slug]/page.tsx` |
| **Category listing page** | `[category]/page.tsx` filters `calculators` array by category → renders `FilteredCalculatorGrid` | `src/app/calculators/[category]/page.tsx` |
| **Sitemap** | `sitemap.ts` maps ALL entries in `calculators` array to URLs (with trailing slashes) | `src/app/sitemap.ts` |
| **OpenGraph image** | `opengraph-image.tsx` reads `calculators.ts` → generates dynamic OG card with icon, title, and description | `src/app/calculators/[category]/[slug]/opengraph-image.tsx` |
| **JSON-LD schema** | `calculator-layout.tsx` auto-generates `SoftwareApplication` + `FAQPage` structured data from the calculator's data object | `src/components/templates/calculator-layout.tsx` |
| **Related calculators** | `related-calculators.tsx` auto-shows 3 other calculators from the same category at the bottom of every page | `src/components/organisms/related-calculators.tsx` |
| **Landing page cards** | The homepage `CategoryGrid` links to category pages; calculators appear when their category is visited | `src/components/organisms/category-grid.tsx` |

---

## Phase 7: Deployment

### Step 9 — Build the production bundle

// turbo
```
npm run build
```

### Step 10 — Deploy to Hostinger via Git push

// turbo
```
.\deploy_build.ps1
```

This script:
1. Enters the `out/` directory (static export)
2. Initializes git (if needed)
3. Commits all files
4. Force-pushes to `https://github.com/tarakiga/docketoneBUILD` on the `main` branch
5. Hostinger auto-deploys from this repo

---

## Phase 8: Post-Deploy Verification

### Step 11 — Verify live pages

After deployment completes, verify:

1. **Calculator page**: `https://docket.one/calculators/{category}/{slug}/` — loads the interactive calculator
2. **Category listing**: `https://docket.one/calculators/{category}/` — new calculator appears as a card
3. **Sitemap**: `https://docket.one/sitemap.xml` — new URL is listed
4. **OG image**: Share the calculator URL on social media or use [opengraph.xyz](https://www.opengraph.xyz/) to preview
5. **JSON-LD**: Use [Google Rich Results Test](https://search.google.com/test/rich-results) on the calculator URL

---

## Quick Reference: File Touchpoints

For every new calculator, you touch exactly **3 files** (and create 1 new file):

| Action | File |
|---|---|
| **Create** | `src/components/calculators/{category}/{slug}.tsx` |
| **Edit** | `src/data/calculators.ts` — add data entry |
| **Edit** | `src/components/calculators/registry.tsx` — add import + map entry |
| **Run** | `npm run build` + `.\deploy_build.ps1` |

Everything else (sitemap, category page, OG image, schema, related calculators) is **automatic**.

---

## Common Mistakes & Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Calculator Component Not Found" on the live page | `slug` in `calculators.ts` doesn't match the key in `registry.tsx` | Ensure both use the exact same string |
| Calculator doesn't appear on category page | `category` field is misspelled in `calculators.ts` | Check against the `Calculator["category"]` union type |
| Build error: "Module not found" | Import path in `registry.tsx` doesn't match the actual file location | Verify `./category/slug` matches the created file path |
| Page shows 404 after deploy | Route wasn't generated during build | Check that `generateStaticParams` output includes the new slug (it reads from `calculators.ts` automatically) |
| Missing from sitemap | The calculator object is not in the `calculators` array | Add it to `calculators.ts` |
| OG image shows generic "Docket One" | `slug` + `category` combo doesn't match any entry in `calculators.ts` | Fix the slug/category to match |
| Related calculators broken | `relatedCalculators` array contains slugs that don't exist | Verify all referenced slugs exist in `calculators.ts` |
