"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export function ChaosExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generations, setGenerations] = useState(150)
  const [zoom, setZoom] = useState(1) // 1x .. 10x

  // A genuine zoom: at 1x we see the whole diagram [2.4, 4.0]; as zoom rises the
  // window narrows AND re-centres onto the heart of the chaotic region (~3.7),
  // revealing the self-similar fine structure (period-doubling, the period-3 window).
  const { minR, maxR } = useMemo(() => {
    const t = (zoom - 1) / 9 // 0 .. 1
    const center = 3.2 + (3.7 - 3.2) * t // 3.2 -> 3.7
    const half = 0.8 + (0.06 - 0.8) * t // 0.8 -> 0.06
    return { minR: center - half, maxR: center + half }
  }, [zoom])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height

    ctx.fillStyle = "#0a0f1a"
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = "rgba(56, 189, 248, 0.5)"

    // Logistic map: x_{n+1} = r·x_n·(1 − x_n). r on X axis, settled x on Y axis.
    const burnIn = 250 // discard transient before plotting (more = cleaner under zoom)
    for (let px = 0; px < w; px++) {
      const r = minR + (px / w) * (maxR - minR)
      let val = 0.5
      for (let i = 0; i < burnIn; i++) val = r * val * (1 - val)
      for (let i = 0; i < generations; i++) {
        val = r * val * (1 - val)
        const py = h - val * h
        if (py >= 0 && py < h) ctx.fillRect(px, py, 1, 1)
      }
    }
  }, [generations, minR, maxR])

  useEffect(() => {
    draw()
  }, [draw])

  const MONO_K = "font-mono text-[10px] uppercase tracking-[0.18em] text-[#b3aae0]"

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
        <span className={MONO_K + " flex items-center gap-2"} style={{ fontFamily: "var(--font-bungee), cursive" }}>
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "#ff3ca6" }} /> Math Magik · Bifurcation
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#ECEAE3] leading-tight mt-1">
          Where order tips into <em className="italic" style={{ color: "#ff3ca6" }}>chaos</em>
        </h2>
        <p className="text-[#b3aae0] text-sm mt-1 mb-6 max-w-2xl">
          The logistic map — one tiny equation that models populations. Crank the growth rate and watch a single
          stable outcome split into 2, 4, 8… then dissolve into chaos.
        </p>

        <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
          {/* ── canvas ──────────────────────────── */}
          <div className="min-w-0 order-1">
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#4a3f7a", backgroundColor: "#0c0824" }}>
              <canvas ref={canvasRef} width={800} height={500} className="w-full h-auto block" />
            </div>
            {/* r-axis */}
            <div className="flex justify-between font-mono text-[11px] mt-2 px-1" style={{ color: "#b3aae0" }}>
              <span>r = {minR.toFixed(3)}</span>
              <span className="text-[#b3aae0]">growth rate →</span>
              <span>r = {maxR.toFixed(3)}</span>
            </div>
          </div>

          {/* ── controls ────────────────────────── */}
          <div className="min-w-0 order-2 space-y-4">
            <div className="rounded-2xl border p-4 space-y-5" style={{ borderColor: "#4a3f7a", backgroundColor: "#0c0824" }}>
              <div>
                <div className="flex justify-between text-[13px] text-[#ECEAE3]">
                  <span>Generations</span>
                  <span className="font-mono" style={{ color: "#ff3ca6" }}>{generations}</span>
                </div>
                <Slider value={[generations]} onValueChange={([v]) => setGenerations(v)} min={50} max={500} step={10} className="mt-2 [&_[data-slot=slider-range]]:bg-[#ff3ca6] [&_[data-slot=slider-thumb]]:border-[#ff3ca6]" />
                <p className="text-[11px] text-[#b3aae0] mt-1.5">More points = denser, sharper bands.</p>
              </div>

              <div>
                <div className="flex justify-between text-[13px] text-[#ECEAE3]">
                  <span>Zoom</span>
                  <span className="font-mono" style={{ color: "#ff3ca6" }}>{zoom.toFixed(1)}×</span>
                </div>
                <Slider value={[zoom]} onValueChange={([v]) => setZoom(v)} min={1} max={10} step={0.1} className="mt-2 [&_[data-slot=slider-range]]:bg-[#ff3ca6] [&_[data-slot=slider-thumb]]:border-[#ff3ca6]" />
                <p className="text-[11px] text-[#b3aae0] mt-1.5">
                  Dive into the chaotic region near r ≈ 3.7 to see fractal, self-similar detail.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border p-4" style={{ borderColor: "#4a3f7a", backgroundColor: "#241a52" }}>
              <h4 className="font-semibold mb-1.5 text-sm" style={{ color: "#ff3ca6" }}>What am I looking at?</h4>
              <p className="text-[12px] text-[#b3aae0] leading-relaxed">
                Each vertical slice settles the equation at one growth rate. One line = one stable population. Two
                lines = it oscillates between two values. The fuzzy clouds are <strong className="text-[#ECEAE3]">chaos</strong> —
                deterministic, yet impossible to predict.
              </p>
            </div>

            <ShareResult
              title="Exploring Chaos"
              text="I'm exploring the Logistic Map bifurcation diagram — where simple rules birth pure chaos. 🌀"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
