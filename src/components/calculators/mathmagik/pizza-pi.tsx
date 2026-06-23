"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

type Pie = { id: string; size: number; price: number; name: string; color: string }

const COLORS = ["#e3552f", "#7ea372", "#f4b43c", "#6f9fd8", "#c0497a"]
const MAX_PX = 300 // largest pizza renders at this diameter in the stage

export function PizzaPiCalculator() {
  const [pizzas, setPizzas] = useState<Pie[]>([
    { id: "1", size: 12, price: 15, name: "Medium", color: COLORS[0] },
    { id: "2", size: 14, price: 20, name: "Large", color: COLORS[1] },
    { id: "3", size: 18, price: 28, name: "X-Large", color: COLORS[2] },
  ])
  const nextIdRef = useRef(4)

  // Scale the stage so the largest pizza fits whatever width the arena actually has.
  const arenaRef = useRef<HTMLDivElement>(null)
  const [arenaW, setArenaW] = useState(MAX_PX)
  useEffect(() => {
    const el = arenaRef.current
    if (!el) return
    const update = () => setArenaW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const maxPx = Math.max(120, Math.min(MAX_PX, arenaW - 12))

  const stats = useMemo(
    () =>
      pizzas.map((p) => {
        const r = p.size / 2
        const area = Math.PI * r * r
        const ratio = p.price > 0 ? area / p.price : 0 // in² per $
        const ppin = area > 0 ? p.price / area : 0 // $ per in²
        return { ...p, area, ratio, ppin }
      }),
    [pizzas]
  )

  const valid = stats.filter((s) => s.size > 0 && s.price > 0)
  const best = valid.length ? valid.reduce((a, b) => (b.ratio > a.ratio ? b : a)) : null
  const worst = valid.length ? valid.reduce((a, b) => (b.ratio < a.ratio ? b : a)) : null
  const maxSize = Math.max(...stats.map((s) => s.size), 1)

  // Pi-trap insight: smallest vs largest pizza by diameter
  const bySize = [...valid].sort((a, b) => a.size - b.size)
  const small = bySize[0]
  const large = bySize[bySize.length - 1]
  const hasSpread = small && large && large.size > small.size
  const widthInc = hasSpread ? (large.size / small.size - 1) * 100 : 0
  const areaInc = hasSpread ? ((large.size / small.size) ** 2 - 1) * 100 : 0
  const equivCount = hasSpread ? large.area / small.area : 0

  const pctMore = best && worst && worst.ratio > 0 ? (best.ratio / worst.ratio - 1) * 100 : 0
  const pctCheaper = best && worst && worst.ppin > 0 ? (1 - best.ppin / worst.ppin) * 100 : 0

  const addPizza = () => {
    const id = String(nextIdRef.current++)
    setPizzas([
      ...pizzas,
      { id, size: 16, price: 22, name: `Pizza ${pizzas.length + 1}`, color: COLORS[pizzas.length % COLORS.length] },
    ])
  }
  const removePizza = (id: string) => setPizzas(pizzas.filter((p) => p.id !== id))
  const updatePizza = (id: string, field: "name" | "size" | "price", value: string | number) =>
    setPizzas(pizzas.map((p) => (p.id === id ? { ...p, [field]: value } : p)))

  const MONO_K = "font-mono text-[10px] uppercase tracking-[0.18em] text-[#b3aae0]"
  // Render rings largest-first so smaller pizzas paint on top and stay visible.
  const rings = [...stats].filter((s) => s.size > 0).sort((a, b) => b.size - a.size)

  return (
    <motion.div
      className="w-full rounded-3xl p-5 md:p-8 border shadow-2xl relative overflow-hidden"
      style={{
        background: "#1d1442",
        borderColor: "#4a3f7a",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-10">
        {/* header */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <span className={MONO_K + " flex items-center gap-2"}>
            <span className="h-2 w-2 rounded-full bg-[#ff3ca6] animate-pulse" /> Math Magik · Pizza Pi
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#ECEAE3] leading-tight">
          How much pizza are you <em className="italic text-[#ff3ca6]">actually</em> buying?
        </h2>
        <p className="text-[#b3aae0] text-sm mt-1 mb-6 max-w-2xl">
          Every pie drawn to true relative scale. Bigger diameters don&apos;t add area — they multiply it.
        </p>

        <div className="grid lg:grid-cols-[320px_1fr] gap-5 items-start">
          {/* ── control panel ───────────────────────── */}
          <div className="min-w-0 rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-4">
            <h3 className={MONO_K + " mb-3"}>Your options</h3>
            <div className="flex flex-col">
              {stats.map((p) => {
                const isBest = best?.id === p.id && valid.length > 1
                return (
                  <div
                    key={p.id}
                    className="py-3 border-b border-dashed border-[#4a3f7a] last:border-0"
                    style={isBest ? { borderColor: "#ff3ca6" } : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-3.5 w-3.5 rounded-full flex-none" style={{ background: p.color }} />
                      <input
                        value={p.name}
                        onChange={(e) => updatePizza(p.id, "name", e.target.value)}
                        className="font-serif text-[15px] font-semibold text-[#ECEAE3] bg-transparent border border-transparent hover:border-[#4a3f7a] focus:border-[#ff3ca6] rounded-md px-1.5 py-0.5 flex-1 min-w-0 outline-none"
                      />
                      {isBest && <span className="text-[11px]">🏆</span>}
                      {pizzas.length > 1 && (
                        <button
                          onClick={() => removePizza(p.id)}
                          aria-label={`Remove ${p.name}`}
                          className="text-[#b3aae0] hover:text-[#ff3ca6] transition-colors text-sm leading-none px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="flex items-end gap-2 mt-2.5 flex-wrap">
                      <label className="flex flex-col gap-1 flex-1 min-w-[60px]">
                        <span className="font-mono text-[9px] uppercase tracking-wide text-[#b3aae0]">Inches</span>
                        <input
                          type="number"
                          min={1}
                          value={p.size}
                          onChange={(e) => updatePizza(p.id, "size", Number(e.target.value))}
                          className="w-full min-w-0 bg-[#0c0824] border border-[#4a3f7a] rounded-lg text-[#ECEAE3] font-mono text-sm px-2 py-1.5 text-center outline-none focus:border-[#ff3ca6]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 flex-1 min-w-[60px]">
                        <span className="font-mono text-[9px] uppercase tracking-wide text-[#b3aae0]">Price $</span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={p.price}
                          onChange={(e) => updatePizza(p.id, "price", Number(e.target.value))}
                          className="w-full min-w-0 bg-[#0c0824] border border-[#4a3f7a] rounded-lg text-[#ECEAE3] font-mono text-sm px-2 py-1.5 text-center outline-none focus:border-[#ff3ca6]"
                        />
                      </label>
                      <div className="ml-auto text-right leading-tight shrink-0 self-end pb-1">
                        <div className="font-mono text-[13px] font-bold" style={{ color: isBest ? "#ff3ca6" : "#ECEAE3" }}>
                          {p.ratio > 0 ? p.ratio.toFixed(2) : "—"}
                        </div>
                        <div className="font-mono text-[8px] uppercase tracking-wide text-[#b3aae0]">in² / $</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {pizzas.length < 5 && (
              <button
                onClick={addPizza}
                className="mt-3 w-full border-2 border-dashed border-[#4a3f7a] hover:border-[#ff3ca6] text-[#b3aae0] hover:text-[#ECEAE3] rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                + Add a pizza
              </button>
            )}
          </div>

          {/* ── stage ───────────────────────────────── */}
          <div
            className="min-w-0 rounded-2xl border border-[#4a3f7a] p-4 flex flex-col"
            style={{ background: "#0c0824" }}
          >
            <div className={MONO_K + " text-center"}>Area, to scale</div>
            <div ref={arenaRef} className="relative flex-1 min-h-[300px] sm:min-h-[340px] my-2">
              {rings.map((p) => {
                const px = (p.size / maxSize) * maxPx
                const isBest = best?.id === p.id && valid.length > 1
                return (
                  <div
                    key={p.id}
                    className="absolute left-1/2 rounded-full flex items-start justify-center"
                    style={{
                      width: px,
                      height: px,
                      bottom: 24,
                      transform: "translateX(-50%)",
                      border: isBest ? `2px solid #ff3ca6` : `2px solid ${p.color}`,
                      background: `${p.color}22`,
                      boxShadow: "none",
                    }}
                  >
                    <span
                      className="font-mono text-[11px] font-bold mt-1 px-1.5 py-0.5 rounded-md whitespace-nowrap"
                      style={{ background: "#0c0824", color: p.color }}
                    >
                      {p.size}″ · {Math.round(p.area)} in²
                    </span>
                  </div>
                )
              })}
            </div>

            {/* insight */}
            <div className="rounded-xl border border-[#4a3f7a] bg-[#0c0824] px-4 py-3 text-[13px] text-[#b3aae0] leading-relaxed">
              {hasSpread ? (
                <>
                  🍕 <b className="text-[#ff3ca6]">The pi trap:</b> going {small.size}″→{large.size}″ is only{" "}
                  <span className="font-semibold text-[#ECEAE3]">+{Math.round(widthInc)}% wider</span>, but{" "}
                  <span className="font-bold text-[#ff3ca6]">+{Math.round(areaInc)}% more pizza</span>. One {large.name} packs
                  about <span className="font-bold text-[#ff3ca6]">{equivCount.toFixed(1)}× </span>
                  the area of one {small.name}.
                </>
              ) : (
                <>🍕 Add a second pizza of a different size to see the geometry trap in action.</>
              )}
            </div>
          </div>

          {/* ── verdict ─────────────────────────────── */}
          <div
            className="lg:col-span-2 rounded-2xl border border-[#4a3f7a] p-5 flex items-center gap-4 flex-wrap"
            style={{ background: "#241a52" }}
          >
            <div className="text-4xl">🏆</div>
            <div className="flex-1 min-w-[200px]">
              {best && valid.length > 1 ? (
                <>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#ECEAE3]">
                    Best value: the <em className="italic" style={{ fontFamily: "var(--font-bungee), cursive", color: "#ff3ca6" }}>{best.name}</em>
                  </h3>
                  <p className="text-[#b3aae0] text-[13px] mt-0.5">
                    {pctMore > 0.5 ? (
                      <>
                        <span className="text-[#ff3ca6] font-semibold">{Math.round(pctMore)}% more pizza per dollar</span> than the{" "}
                        {worst?.name} · {Math.round(pctCheaper)}% cheaper per square inch
                      </>
                    ) : (
                      <>All your options are nearly identical value — order whichever you&apos;ll enjoy most.</>
                    )}
                  </p>
                </>
              ) : (
                <h3 className="font-serif text-xl font-semibold text-[#ECEAE3]">Enter at least two pizzas to find the winner.</h3>
              )}
            </div>
            {best && (
              <div className="text-right font-mono">
                <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-bungee), cursive", color: "#ff3ca6" }}>{best.ratio.toFixed(2)}</div>
                <div className="text-[10px] uppercase tracking-wide text-[#b3aae0]">in² / $</div>
              </div>
            )}
            {best && valid.length > 1 && (
              <div className="w-full">
                <ShareResult
                  title="Pizza Pi Maths"
                  text={`The ${best.name} (${best.size}″) gives ${best.ratio.toFixed(
                    1
                  )} sq inches of pizza per dollar 🍕 — the mathematically superior order. Don't let geometry fool you!`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
