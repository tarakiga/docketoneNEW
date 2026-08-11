"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bug, Coffee, Terminal } from "lucide-react"
import { useMemo, useState } from "react"

export function CoffeeToCode() {
  const [cups, setCups] = useState(3)
  const [complexity, setComplexity] = useState(5) // 1-10

  const result = useMemo(() => {
    // Yerkes-Dodson / "Ballmer Peak" inverted-U.
    // Focus is a Gaussian over cups, peaking at OPTIMAL, in [0, 1].
    const OPTIMAL = 2
    const SIGMA = 1.6
    const BASE = 220 // peak LOC scaling before complexity

    const safeCups = Number.isFinite(cups) ? cups : 0
    const safeComplexity = Number.isFinite(complexity) ? complexity : 1
    const complexityFactor = safeComplexity / 10 // 0.1 .. 1.0

    const focus = Math.exp(-((safeCups - OPTIMAL) ** 2) / (2 * SIGMA ** 2)) // 0..1

    // Productivity: smooth inverted-U, rises to a peak then falls off both sides.
    const lines = Math.round(BASE * complexityFactor * focus)

    // Jitter: rises monotonically with cups, clamped 0-100.
    const jitter = Math.min(100, Math.max(0, Math.round(safeCups * 11)))

    // Bugs: rise smoothly as you deviate from optimal (too few OR too many),
    // scaled by complexity. Continuous, no discontinuous jump.
    const bugs = Math.round((1 - focus) * safeComplexity * 1.2)

    // Flavor only: are we sitting right on the peak? No non-physical spike.
    const isBallmerPeak = safeCups === OPTIMAL

    return { lines, bugs, jitter, isBallmerPeak, focus }
  }, [cups, complexity])

  return (
    <div className="almanac space-y-8 animate-in fade-in duration-700" style={{ ['--card' as string]: 'var(--dk-surface)', ['--ink' as string]: 'var(--dk-ink)', ['--ink-soft' as string]: 'var(--dk-ink-soft)', ['--accent' as string]: 'var(--dk-lim-ink)', ['--line' as string]: 'var(--dk-line)' }}>
      <Card className="border shadow-xl" style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}>
        <CardHeader className="border-b" style={{ borderColor: 'var(--dk-line)', backgroundColor: 'var(--dk-raised)' }}>
           <CardTitle className="text-3xl font-display flex items-center gap-3" style={{ color: 'var(--dk-ink)' }}>
              <Coffee className="h-8 w-8 animate-pulse" style={{ color: 'var(--dk-lim-ink)' }} />
              Coffee to Code Output
           </CardTitle>
           <CardDescription className="font-medium" style={{ color: 'var(--dk-ink-soft)' }}>
              Real-time caffeine conversion and productivity analysis.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 sm:space-y-10 p-5 sm:p-10">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center">
              <div className="space-y-8 min-w-0">
                 <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase text-[10px] tracking-widest" style={{ color: 'var(--dk-lim-ink)' }}>
                       <Label>Caffeine Intake</Label>
                       <span>{cups} Cups</span>
                    </div>
                    <Slider value={[cups]} onValueChange={([v]) => setCups(v)} min={0} max={12} step={1} className="[&_.range-thumb]:bg-[var(--dk-lim)]" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase text-[10px] tracking-widest" style={{ color: 'var(--dk-ink-soft)' }}>
                       <Label>Task Complexity</Label>
                       <span>{complexity}/10</span>
                    </div>
                    <Slider value={[complexity]} onValueChange={([v]) => setComplexity(v)} min={1} max={10} step={1} className="[&_.range-thumb]:bg-[var(--dk-mute)]" />
                 </div>

                 <div className="p-5 rounded-2xl space-y-3 border shadow-inner" style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)' }}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--dk-lim-ink)' }}>
                       <span>Neural Jitter</span>
                       <span>{result.jitter}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--dk-raised)' }}>
                       <div className="h-full transition-all duration-500 ease-out" style={{ width: `${result.jitter}%`, backgroundColor: 'var(--dk-lim)' }}></div>
                    </div>
                 </div>
              </div>

              <div className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-4 font-mono text-sm shadow-2xl relative overflow-hidden group min-w-0" style={{ backgroundColor: 'var(--dk-sunk)', borderColor: 'var(--dk-line)' }}>
                 {/* Decorative code scan line */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--dk-lim)]/5 to-transparent h-1/2 w-full animate-pulse top-0" />

                 {result.isBallmerPeak && (
                    <div className="absolute inset-0 z-0 animate-pulse flex items-center justify-center pointer-events-none" style={{ backgroundColor: 'rgba(182,255,60,0.10)' }}>
                       <span className="text-4xl sm:text-7xl font-black opacity-20 rotate-12 uppercase tracking-tighter" style={{ color: 'var(--dk-lim-ink)' }}>Peak State</span>
                    </div>
                 )}

                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--dk-lim-ink)' }}>
                       <Terminal className="w-4 h-4" /> <span className="text-xs">compiler@dev-machine:~$ ./compute</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--dk-ink-soft)' }}>Injected Caffeine -&gt; Synthesizing Logic...</div>

                    <div className="py-6 space-y-6 text-center">
                       <div className="space-y-1">
                          <div className="text-4xl sm:text-6xl font-black tracking-tighter group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--dk-lim-ink)' }}>{result.lines}</div>
                          <div className="text-[10px] uppercase font-black tracking-[0.2em]" style={{ color: 'var(--dk-ink-soft)' }}>Synthesized LOC</div>
                       </div>

                       <div className="flex justify-center items-center gap-2" style={{ color: '#ff7a90' }}>
                          <Bug className="w-4 h-4"/>
                          <span className="font-black text-xs uppercase tracking-widest">{result.bugs} Entropy Units (Bugs)</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t text-[10px] font-bold flex justify-between gap-2 uppercase tracking-tighter" style={{ borderColor: 'var(--dk-line)', color: 'var(--dk-ink-soft)' }}>
                       <span className="min-w-0 truncate">Focus: {result.focus > 0.85 ? 'PEAK ZONE' : result.focus > 0.5 ? 'Productive' : result.jitter > 60 ? 'Over-Caffeinated' : 'Under-Caffeinated'}</span>
                       <span className="shrink-0">Input: {cups}c</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex justify-center pt-4">
              <ShareResult
                 title="Caffeine-to-Code Matrix"
                 text={`At ${cups} ${cups === 1 ? 'cup' : 'cups'} my focus sits at ${Math.round(result.focus * 100)}% of peak: ${result.lines} lines of code and ${result.bugs} ${result.bugs === 1 ? 'bug' : 'bugs'}. ${result.isBallmerPeak ? 'Right on the Ballmer Peak! 🚀' : 'Tuning my caffeine dial up the Yerkes-Dodson curve ☕'}`}
              />
           </div>

        </CardContent>
      </Card>
    </div>
  )
}
