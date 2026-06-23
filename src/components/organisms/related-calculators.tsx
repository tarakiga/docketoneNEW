import { CATEGORY_META, calculators } from "@/data/calculators"
import Link from "next/link"

interface RelatedCalculatorsProps {
  currentCategory: string
  currentSlug: string
}

export function RelatedCalculators({ currentCategory, currentSlug }: RelatedCalculatorsProps) {
  const related = calculators
    .filter(calc => calc.category === currentCategory && calc.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  const catName = CATEGORY_META.find(m => m.id.toLowerCase() === currentCategory.toLowerCase())?.name || currentCategory

  return (
    <section>
      <div className="almanac-section-head">
        <div>
          <div className="almanac-eyebrow">Keep exploring</div>
          <h2 className="almanac-h2">More from {catName}</h2>
        </div>
        <Link className="almanac-btn almanac-btn-ghost" href={`/calculators/${currentCategory}/`}>View all →</Link>
      </div>

      <div className="almanac-related">
        {related.map(calc => (
          <Link key={calc.slug} href={`/calculators/${calc.category}/${calc.slug}/`} className="almanac-card">
            <span className="almanac-ico">{calc.icon || "🧮"}</span>
            <h3>{calc.title}</h3>
            <p>{calc.description}</p>
            <span className="almanac-open">Open tool →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
