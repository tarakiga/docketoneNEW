"use client"

import { calculators, type Calculator } from "@/data/calculators"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CalculatorOfTheDay() {
    const [calc, setCalc] = useState<Calculator | null>(null)
    const [opening, setOpening] = useState(false)

    // Computed in the browser so it actually advances every day without a redeploy.
    // Date-index, in order, cycling through the entire calculator set.
    useEffect(() => {
        if (calculators.length === 0) return
        const dayNumber = Math.floor(Date.now() / 86_400_000)
        setCalc(calculators[dayNumber % calculators.length])
    }, [])

    if (!calc) {
        return (
            <div className="home-cotd" aria-hidden="true">
                <div className="home-cotd-ico">🎲</div>
                <div className="home-cotd-mid">
                    <div className="home-cotd-k">⭐ Calculator of the day</div>
                    <h3 style={{ opacity: 0.55 }}>Picking today&apos;s tool…</h3>
                </div>
            </div>
        )
    }

    return (
        <Link
            href={`/calculators/${calc.category}/${calc.slug}/`}
            className="home-cotd"
            aria-busy={opening}
            onClick={() => setOpening(true)}
            style={opening ? { cursor: "wait" } : undefined}
        >
            <div className="home-cotd-ico">{calc.icon || "🎲"}</div>
            <div className="home-cotd-mid">
                <div className="home-cotd-k">⭐ Calculator of the day</div>
                <h3>{calc.title}</h3>
                <p>{calc.description}</p>
            </div>
            <span className="home-cotd-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {opening ? (
                    <><span className="inline-block animate-spin rounded-full" style={{ width: 13, height: 13, border: "2px solid #241F1A", borderTopColor: "transparent" }} /> Opening…</>
                ) : (
                    <>Open tool →</>
                )}
            </span>
        </Link>
    )
}
