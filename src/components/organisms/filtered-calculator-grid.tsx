"use client"

import { Calculator } from "@/data/calculators"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useMemo, useState } from "react"

interface FilteredCalculatorGridProps {
    calculators: Calculator[]
}

export function FilteredCalculatorGrid({ calculators }: FilteredCalculatorGridProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    const allTags = useMemo(() => {
        const tags = new Set<string>()
        calculators.forEach(calc => calc.tags?.forEach(tag => tags.add(tag)))
        return Array.from(tags).sort()
    }, [calculators])

    const filteredCalculators = useMemo(() => {
        if (!selectedTag) return calculators
        return calculators.filter(calc => calc.tags?.includes(selectedTag))
    }, [calculators, selectedTag])

    if (calculators.length === 0) {
        return (
            <div className="almanac-empty">
                <div style={{ fontSize: 34, marginBottom: 10 }}>📭</div>
                <strong>No tools here yet</strong>
                <p>We haven&apos;t added any calculators to this collection. Check back soon.</p>
            </div>
        )
    }

    return (
        <div>
            {allTags.length > 0 && (
                <div className="almanac-filters">
                    <button
                        className="almanac-pill"
                        data-active={selectedTag === null}
                        onClick={() => setSelectedTag(null)}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className="almanac-pill"
                            data-active={selectedTag === tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="almanac-grid">
                <AnimatePresence mode="popLayout">
                    {filteredCalculators.map((calc, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4), ease: [0.2, 0.8, 0.2, 1] }}
                            key={calc.id}
                        >
                            <Link href={`/calculators/${calc.category}/${calc.slug}/`} className="almanac-card">
                                <span className="almanac-num">{String(i + 1).padStart(2, "0")}</span>
                                <span className="almanac-ico">{calc.icon}</span>
                                <h3>{calc.title}</h3>
                                <p>{calc.description}</p>
                                <span className="almanac-open">Open tool →</span>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredCalculators.length === 0 && (
                <div className="almanac-empty">
                    <div style={{ fontSize: 34, marginBottom: 10 }}>🔍</div>
                    <strong>No results</strong>
                    <p>Try a different filter.</p>
                </div>
            )}
        </div>
    )
}
