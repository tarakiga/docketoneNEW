"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { Eye } from "lucide-react"
import { useMemo, useState } from "react"

// Famous cases, with the conspirator counts Dr. Grimes used in his 2016 paper.
const PRESETS = [
  { name: "Moon-Landing Hoax", n: 411000 },
  { name: "Climate-Change Fraud", n: 405000 },
  { name: "Vaccine Cover-Up", n: 22000 },
  { name: "Suppressed Cancer Cure", n: 714000 },
  { name: "Small Cell", n: 12 },
]

export function ConspiracyTheoryCalculator() {
  const [theory, setTheory] = useState("Birds Are Drones")
  const [conspirators, setConspirators] = useState(411000)
  const [years, setYears] = useState(50)
  const [leakMicro, setLeakMicro] = useState(4) // p in millionths/person/year; Grimes ≈ 4×10⁻⁶

  const result = useMemo(() => {
    const p = leakMicro * 1e-6 // per-person, per-year intrinsic leak probability
    const lambda = p * conspirators // expected leak "rate"
    // Grimes' core relation: chance the secret has leaked by year t = 1 − e^(−p·N·t)
    const exposure = 1 - Math.exp(-lambda * years)
    const meanYears = lambda > 0 ? 1 / lambda : Infinity // expected time to first leak
    const halfLife = lambda > 0 ? Math.log(2) / lambda : Infinity // years to 50% odds

    const verdict =
      exposure >= 0.95 ? "TOO BIG TO HIDE" :
      exposure >= 0.5 ? "LIKELY EXPOSED" :
      exposure >= 0.15 ? "CRACKS SHOWING" :
      "COULD STAY BURIED"

    return { exposurePct: Math.round(exposure * 1000) / 10, meanYears, halfLife, verdict }
  }, [conspirators, years, leakMicro])

  const fmtYears = (y: number) =>
    !Number.isFinite(y) ? "∞" : y >= 1000 ? `${Math.round(y).toLocaleString()}` : y >= 1 ? Math.round(y).toString() : "<1"

  const tone =
    result.exposurePct >= 50 ? "text-[#ff8a8a] border-[#ff8a8a]" :
    result.exposurePct >= 15 ? "text-[var(--dk-yel-ink)] border-[var(--dk-yel-ink)]" :
    "text-[#86efac] border-[#86efac]"

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-serif">
      <div className="bg-[var(--dk-surface)] border-[var(--dk-line)] border-2 shadow-2xl relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }} />

        {/* header */}
        <div className="border-b-2 border-[var(--dk-line)] pb-6 pt-6 px-4 sm:px-8 relative z-10">
          <div className="absolute top-2 right-2 sm:right-4 rotate-12 border-4 border-[#ff8a8a] text-sm sm:text-xl font-black text-[#ff8a8a] px-2 sm:px-4 py-1 sm:py-2 opacity-80 rounded-sm pointer-events-none">
            TOP SECRET
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--dk-ink)] text-center uppercase tracking-widest flex items-center justify-center gap-2">
            <Eye className="w-7 h-7 text-[var(--dk-yel-ink)]" /> Dept. of Truth
          </h2>
          <p className="text-center font-mono text-[var(--dk-ink-soft)] text-sm mt-1">
            CASE FILE: {theory || "-"} · GRIMES PROTOCOL
          </p>
        </div>

        <div className="p-4 sm:p-8 relative z-10 space-y-8">
          {/* theory name */}
          <div className="space-y-2">
            <label className="font-bold text-xs uppercase tracking-widest text-[var(--dk-ink-soft)]">Subject / Theory Name</label>
            <input
              type="text"
              value={theory}
              onChange={(e) => setTheory(e.target.value)}
              className="w-full min-w-0 bg-[var(--dk-sunk)] border-2 border-[var(--dk-line)] rounded px-3 py-2 font-mono text-lg sm:text-xl focus:outline-none focus:border-[var(--dk-yel-ink)] transition-colors text-[var(--dk-ink)] placeholder:text-[var(--dk-ink-soft)]/60"
              placeholder="e.g. The Moon Is Cheese"
            />
          </div>

          {/* presets */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((pre) => (
              <button
                key={pre.name}
                onClick={() => { setTheory(pre.name); setConspirators(pre.n) }}
                className={`text-[11px] font-mono uppercase tracking-wide px-3 py-1.5 rounded border transition-colors ${
                  conspirators === pre.n ? "bg-[var(--dk-yel)] text-[var(--dk-on-fill)] border-[var(--dk-yel-ink)]" : "bg-[var(--dk-sunk)] text-[var(--dk-ink-soft)] border-[var(--dk-line)] hover:border-[var(--dk-yel-ink)]"
                }`}
              >
                {pre.name} · {pre.n.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 bg-[var(--dk-sunk)] p-6 rounded shadow-sm border border-[var(--dk-line)]">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[var(--dk-ink-soft)]"><span>People In On It</span><span className="font-bold text-[var(--dk-ink)]">{conspirators.toLocaleString()}</span></div>
              <input
                type="number"
                min={1}
                value={conspirators}
                onChange={(e) => { const v = Math.floor(Number(e.target.value)); setConspirators(Number.isFinite(v) && v > 0 ? v : 1) }}
                className="w-full min-w-0 bg-[var(--dk-surface)] border-2 border-[var(--dk-line)] rounded px-3 py-2 font-mono text-base focus:outline-none focus:border-[var(--dk-yel-ink)] text-[var(--dk-ink)]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[var(--dk-ink-soft)]"><span>Years To Stay Hidden</span><span className="font-bold text-[var(--dk-ink)]">{years}y</span></div>
              <Slider value={[years]} min={1} max={200} step={1} onValueChange={([v]) => setYears(v)} className="[&_[data-slot=slider-track]]:bg-[var(--dk-surface)] [&_[data-slot=slider-range]]:bg-[var(--dk-yel)] [&_[data-slot=slider-thumb]]:border-[var(--dk-yel-ink)]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[var(--dk-ink-soft)]"><span>Leakiness / Person·Yr</span><span className="font-bold text-[var(--dk-ink)]">{leakMicro}×10⁻⁶</span></div>
              <Slider value={[leakMicro]} min={1} max={20} step={1} onValueChange={([v]) => setLeakMicro(v)} className="[&_[data-slot=slider-track]]:bg-[var(--dk-surface)] [&_[data-slot=slider-range]]:bg-[var(--dk-yel)] [&_[data-slot=slider-thumb]]:border-[var(--dk-yel-ink)]" />
              <p className="text-[10px] text-[var(--dk-ink-soft)] font-mono">Grimes calibrated this at 4×10⁻⁶ from real leaks.</p>
            </div>
          </div>

          {/* result */}
          <div className="border-t-4 border-double border-[var(--dk-line)] pt-8 text-center space-y-6">
            <div className="relative inline-block">
              <div className={`text-5xl sm:text-6xl font-black ${tone.split(" ")[0]}`}>{result.exposurePct}%</div>
              <div className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--dk-ink-soft)] mt-2">Chance The Secret Has Leaked</div>
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 px-3 sm:px-4 py-1 sm:py-2 text-base sm:text-2xl font-black uppercase tracking-widest opacity-90 pointer-events-none whitespace-nowrap ${tone}`}>
                {result.verdict}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm font-mono text-[var(--dk-ink)]">
              <div className="bg-[var(--dk-sunk)] border border-[var(--dk-line)] rounded p-3">
                <div className="text-lg font-bold text-[var(--dk-ink)]">{fmtYears(result.halfLife)}</div>
                <div className="text-[10px] uppercase tracking-wide text-[var(--dk-ink-soft)]">Years to 50/50 odds</div>
              </div>
              <div className="bg-[var(--dk-sunk)] border border-[var(--dk-line)] rounded p-3">
                <div className="text-lg font-bold text-[var(--dk-ink)]">{fmtYears(result.meanYears)}</div>
                <div className="text-[10px] uppercase tracking-wide text-[var(--dk-ink-soft)]">Avg. years to first leak</div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[var(--dk-ink-soft)] max-w-md mx-auto">
              Grimes&apos; equation: P(leak) = 1 − e<sup>−p·N·t</sup>, with p = per-person yearly leak chance, N = conspirators, t = years.
            </p>

            <div className="flex justify-center">
              <ShareResult
                title="Conspiracy Analysis"
                text={`"${theory}" would need ${conspirators.toLocaleString()} people to stay quiet for ${years} years. Grimes' equation says there's a ${result.exposurePct}% chance it has already leaked. Verdict: ${result.verdict}.`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
