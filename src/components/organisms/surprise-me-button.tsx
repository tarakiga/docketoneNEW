"use client"

import { calculators } from "@/data/calculators"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SurpriseMeButton({ className }: { className?: string }) {
    const router = useRouter()
    const [rolling, setRolling] = useState(false)

    const surprise = () => {
        if (rolling || calculators.length === 0) return
        setRolling(true)
        window.dispatchEvent(new Event("docket:navstart"))
        const pick = calculators[Math.floor(Math.random() * calculators.length)]
        router.push(`/calculators/${pick.category}/${pick.slug}/`)
    }

    return (
        <button
            type="button"
            onClick={surprise}
            disabled={rolling}
            aria-busy={rolling}
            className={className}
            style={rolling ? { opacity: 0.85, cursor: "wait" } : undefined}
        >
            {rolling ? (
                <><span className="inline-block animate-spin" style={{ lineHeight: 1 }}>🎲</span> Rolling…</>
            ) : (
                <>Surprise me 🎲</>
            )}
        </button>
    )
}
