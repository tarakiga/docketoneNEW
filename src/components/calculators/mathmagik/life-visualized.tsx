"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

type Mode = "years" | "months" | "weeks"

export function LifeVisualized() {
  const [birthday, setBirthday] = useState("1995-01-01")
  const [expectancy, setExpectancy] = useState(80)
  const [viewMode, setViewMode] = useState<Mode>("weeks")
  const modes: Mode[] = ["years", "months", "weeks"]

  const data = useMemo(() => {
    const birthMs = new Date(birthday).getTime()
    const validDate = Number.isFinite(birthMs)
    const now = Date.now()
    const diffTime = validDate ? Math.max(0, now - birthMs) : 0

    // Guard the expectancy input: blank/0/NaN/absurd values can't break the math.
    const years = Number.isFinite(expectancy) && expectancy > 0 ? Math.min(150, Math.floor(expectancy)) : 0

    let totalUnits = 0
    let livedUnits = 0
    let label = "Weeks"
    let gridRows: number[] = []

    if (viewMode === "years") {
      totalUnits = years
      livedUnits = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
      label = "Years"
      gridRows = Array.from({ length: years }, (_, i) => i)
    } else if (viewMode === "months") {
      totalUnits = years * 12
      livedUnits = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))
      label = "Months"
      gridRows = Array.from({ length: years }, (_, i) => i)
    } else {
      totalUnits = years * 52
      livedUnits = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
      label = "Weeks"
      gridRows = Array.from({ length: years }, (_, i) => i)
    }

    const livedClamped = Math.min(livedUnits, totalUnits)
    const remaining = Math.max(0, totalUnits - livedUnits)
    const pct = totalUnits > 0 ? Math.min(100, Math.round((livedUnits / totalUnits) * 100)) : 0
    const overLived = totalUnits > 0 && livedUnits > totalUnits
    return { livedUnits, livedClamped, remaining, totalUnits, label, gridRows, pct, overLived, validDate, years }
  }, [birthday, expectancy, viewMode])

  const MONO_K = "font-mono text-[10px] uppercase tracking-[0.18em] text-[#b3aae0]"
  const cols = viewMode === "months" ? 12 : 52
  const fieldCls =
    "w-full min-w-0 bg-[#0c0824] border border-[#4a3f7a] rounded-lg text-[#ECEAE3] font-mono text-sm px-3 py-2 outline-none focus:border-[#ff3ca6] [color-scheme:dark]"

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
          <span className="h-2 w-2 rounded-full bg-[#ff3ca6]" /> Math Magik · Memento Mori
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#ECEAE3] leading-tight mt-1">
          Your whole life, in <em className="italic text-[#ff3ca6]">{data.label.toLowerCase()}</em>
        </h2>
        <p className="text-[#b3aae0] text-sm mt-1 mb-6 max-w-2xl">
          Every box is one {data.label.toLowerCase().replace(/s$/, "")} of an {data.years || "-"}-year life. The filled
          ones are spent. Make the empty ones count.
        </p>

        {/* controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-6">
          <label className="block flex-1 min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-wide text-[#b3aae0]">Date of birth</span>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className={fieldCls + " mt-1"} />
          </label>
          <label className="block flex-1 min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-wide text-[#b3aae0]">Life expectancy (yrs)</span>
            <input
              type="number"
              min={1}
              max={150}
              value={expectancy}
              onChange={(e) => setExpectancy(Number(e.target.value))}
              className={fieldCls + " mt-1"}
            />
          </label>
          <div className="flex bg-[#0c0824] border border-[#4a3f7a] rounded-lg p-1 shrink-0">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 text-[13px] font-semibold rounded-md capitalize transition-all ${
                  viewMode === m ? "bg-[#ff3ca6] text-[#160e33]" : "text-[#b3aae0] hover:text-[#ECEAE3]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {data.years === 0 ? (
          <div className="rounded-2xl border border-[#4a3f7a] bg-[#0c0824] p-8 text-center text-[#b3aae0]">
            Enter a life expectancy to draw your grid.
          </div>
        ) : (
          <>
            {/* legend */}
            <div className="flex gap-5 text-[12px] font-mono text-[#b3aae0] justify-center mb-3">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[2px]" style={{ background: "#ff3ca6" }} /> Lived
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[2px] border border-[#4a3f7a]" style={{ background: "#241a52" }} /> Remaining
              </span>
            </div>

            {/* grid */}
            <div className="overflow-x-auto pb-3">
              {viewMode === "years" ? (
                <div className="flex flex-wrap gap-1 justify-center max-w-[640px] mx-auto">
                  {Array.from({ length: data.totalUnits }, (_, i) => {
                    const lived = i < data.livedUnits
                    return (
                      <div
                        key={i}
                        title={`Age ${i}`}
                        className="w-5 h-5 rounded-[2px] transition-transform hover:scale-125"
                        style={{ background: lived ? "#ff3ca6" : "#241a52", border: lived ? "none" : "1px solid #4a3f7a" }}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2 px-2">
                <div className="min-w-[560px] space-y-1">
                  {data.gridRows.map((rowKey) => (
                    <div key={rowKey} className={`flex gap-1 items-center ${viewMode === "months" ? "h-5" : "h-2.5"}`}>
                      <div className="w-7 text-[9px] font-mono text-right pr-1.5 shrink-0" style={{ color: "#b3aae0" }}>
                        {rowKey % 5 === 0 ? rowKey : ""}
                      </div>
                      {Array.from({ length: cols }, (_, k) => {
                        const unitIndex = rowKey * cols + k
                        const lived = unitIndex < data.livedUnits
                        return (
                          <div
                            key={k}
                            title={`Age ${rowKey}, ${viewMode === "months" ? "Month" : "Week"} ${k + 1}`}
                            className="flex-1 h-full rounded-[1px] transition-transform hover:scale-150"
                            style={{ background: lived ? "#ff3ca6" : "#241a52", border: lived ? "none" : "1px solid #4a3f7a" }}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
                </div>
              )}
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 max-w-md mx-auto">
              {[
                ["Lived", data.livedClamped.toLocaleString(), "#ff3ca6"],
                ["Remaining", data.remaining.toLocaleString(), "#b3aae0"],
                ["Complete", `${data.pct}%`, "#ff3ca6"],
              ].map(([k, v, c]) => (
                <div key={k} className="rounded-xl border border-[#4a3f7a] bg-[#0c0824] p-3 text-center">
                  <div className="text-xl font-bold" style={{ color: c as string, fontFamily: "var(--font-bungee), cursive" }}>
                    {v}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wide text-[#b3aae0] mt-0.5">{k}</div>
                </div>
              ))}
            </div>

            {data.overLived && (
              <p className="text-center text-[12px] text-[#ff3ca6] mt-3">
                You&apos;ve already outlived this estimate - every box from here is a bonus. 🍀
              </p>
            )}

            <p className="text-center text-[#b3aae0] italic max-w-lg mx-auto mt-4 text-sm">
              “It is not that we have a short time to live, but that we waste a lot of it.” - Seneca
            </p>

            <div className="mt-4">
              <ShareResult
                title="Life Check"
                text={`I've lived ${data.livedClamped.toLocaleString()} ${data.label.toLowerCase()} of my expected ${data.totalUnits.toLocaleString()} (${data.pct}%). Time to make them count. ⌛`}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
