"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function FireCalculator() {
  const [expenses, setExpenses] = useState(40000)
  const [savings, setSavings] = useState(100000)
  const [contribution, setContribution] = useState(20000) // Annual
  const [rate, setRate] = useState(7) // Growth rate %
  const [swr, setSwr] = useState(4) // Safe withdrawal rate %

  const calc = useMemo(() => {
    const multiple = swr > 0 ? 100 / swr : 0
    const fireNumber = swr > 0 ? expenses / (swr / 100) : 0
    const reached = fireNumber > 0 && savings >= fireNumber

    let current = savings
    let years = 0
    const data: { year: string; amount: number; target: number }[] = []
    while (current < fireNumber && years < 50) {
      data.push({ year: `Year ${years}`, amount: Math.round(current), target: Math.round(fireNumber) })
      current = current * (1 + rate / 100) + contribution
      years++
    }
    data.push({ year: `Year ${years}`, amount: Math.round(current), target: Math.round(fireNumber) })

    const progress = fireNumber > 0 ? Math.min(100, (savings / fireNumber) * 100) : 0
    return { fireNumber, multiple, years, data, reached, progress }
  }, [expenses, savings, contribution, rate, swr])

  const multLabel = Number.isInteger(calc.multiple) ? `${calc.multiple}` : calc.multiple.toFixed(1)
  const MONO_K = "font-mono text-[10px] uppercase tracking-[0.18em] text-[#b3aae0]"
  const fieldCls =
    "w-full min-w-0 bg-[#0c0824] border border-[#4a3f7a] rounded-lg text-[#ECEAE3] font-mono text-sm pl-7 pr-2 py-2 outline-none focus:border-[#ff3ca6]"

  return (
    <motion.div
      className="w-full rounded-3xl p-5 md:p-8 border border-[#4a3f7a] shadow-2xl relative overflow-hidden"
      style={{
        background: "#1d1442",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-10">
        <span className={MONO_K + " flex items-center gap-2"}>
          <span className="h-2 w-2 rounded-full bg-[#ff3ca6] animate-pulse" /> Math Magik · F.I.R.E.
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#ECEAE3] leading-tight mt-1">
          When can you <em className="italic text-[#ff3ca6]">stop working?</em>
        </h2>
        <p className="text-[#b3aae0] text-sm mt-1 mb-6 max-w-2xl">
          Financial Independence, Retire Early — your freedom number is the pot that funds your life forever.
        </p>

        <div className="grid lg:grid-cols-[320px_1fr] gap-5 items-start">
          {/* ── inputs ──────────────────────────── */}
          <div className="min-w-0 rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-4 space-y-4">
            {([
              ["Annual expenses", expenses, setExpenses],
              ["Current savings", savings, setSavings],
              ["Annual contribution", contribution, setContribution],
            ] as const).map(([label, val, setter]) => (
              <label key={label} className="block">
                <span className="font-mono text-[9px] uppercase tracking-wide text-[#b3aae0]">{label}</span>
                <div className="relative mt-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#ff3ca6] text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={val}
                    onChange={(e) => setter(Math.max(0, Number(e.target.value)))}
                    className={fieldCls}
                  />
                </div>
              </label>
            ))}

            <div className="pt-1">
              <div className="flex justify-between text-[13px] text-[#ECEAE3]">
                <span>Investment return</span>
                <span className="font-mono text-[#ff3ca6]">{rate}%</span>
              </div>
              <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={1} max={15} step={0.5} className="mt-2 [&_[data-slot=slider-range]]:bg-[#ff3ca6] [&_[data-slot=slider-thumb]]:border-[#ff3ca6]" />
            </div>

            <div>
              <div className="flex justify-between text-[13px] text-[#ECEAE3]">
                <span>Safe withdrawal rate</span>
                <span className="font-mono text-[#ff3ca6]">{swr}%</span>
              </div>
              <Slider value={[swr]} onValueChange={([v]) => setSwr(v)} min={2} max={6} step={0.1} className="mt-2 [&_[data-slot=slider-range]]:bg-[#ff3ca6] [&_[data-slot=slider-thumb]]:border-[#ff3ca6]" />
              <p className="text-[11px] text-[#b3aae0] mt-1.5">Standard rule is 4% — i.e. {multLabel}× your expenses.</p>
            </div>
          </div>

          {/* ── results ─────────────────────────── */}
          <div className="min-w-0 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-5">
                <div className={MONO_K}>Your freedom number</div>
                <div
                  className="text-3xl md:text-4xl font-bold mt-1 break-words"
                  style={{ fontFamily: "var(--font-bungee), cursive", color: "#ff3ca6" }}
                >
                  ${Math.round(calc.fireNumber).toLocaleString()}
                </div>
                <div className="text-sm text-[#b3aae0] mt-1">({multLabel}× expenses)</div>
              </div>
              <div className="rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-5">
                <div className={MONO_K}>Time to freedom</div>
                {calc.reached ? (
                  <>
                    <div className="font-mono text-3xl md:text-4xl font-bold text-[#86efac] mt-1">You&apos;re free 🎉</div>
                    <div className="text-sm text-[#b3aae0] mt-1">Already past your number</div>
                  </>
                ) : (
                  <>
                    <div className="font-mono text-3xl md:text-4xl font-bold text-[#ECEAE3] mt-1">
                      {calc.years >= 50 ? "50+" : calc.years} <span className="text-lg text-[#ff3ca6] font-normal">yrs</span>
                    </div>
                    <div className="text-sm text-[#b3aae0] mt-1">
                      {calc.years >= 50 ? "Tune the dials to get there" : `by ${new Date().getFullYear() + calc.years}`}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* progress to freedom */}
            <div className="rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-5">
              <div className="flex justify-between items-baseline mb-2">
                <div className={MONO_K}>Progress to freedom</div>
                <div className="font-mono text-[#ff3ca6] font-bold text-sm">{calc.progress.toFixed(1)}%</div>
              </div>
              <div className="h-3 rounded-full bg-[#0c0824] border border-[#4a3f7a] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${calc.progress}%`, background: "#ff3ca6" }}
                />
              </div>
              <p className="text-[12px] text-[#b3aae0] mt-2">
                You&apos;ve already banked {calc.progress.toFixed(0)}% of the pot that buys back your time.
              </p>
            </div>

            {/* growth chart */}
            <div className="h-[260px] w-full rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calc.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a3f7a" vertical={false} />
                  <XAxis dataKey="year" hide />
                  <YAxis hide domain={[0, "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0824", borderColor: "#4a3f7a", color: "#ECEAE3", borderRadius: 8 }}
                    itemStyle={{ color: "#ECEAE3" }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Savings"]}
                    labelStyle={{ color: "#b3aae0" }}
                  />
                  <Bar dataKey="amount" fill="#ff3ca6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ShareResult
              title="My FIRE Plan"
              text={
                calc.reached
                  ? `I've already hit my FIRE number of $${(calc.fireNumber / 1_000_000).toFixed(2)}M. Financially free! 📈`
                  : `I'm on track to reach Financial Independence in ${calc.years} years — target $${(calc.fireNumber / 1_000_000).toFixed(2)}M. 📈`
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
