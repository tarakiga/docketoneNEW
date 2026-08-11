import { CATEGORY_META } from "@/data/calculators"
import { accentFor } from "@/data/category-palette"
import Link from "next/link"

export function CategoryGrid() {
    return (
        <section id="categories" className="almanac-section">
            <div className="home-centerhead">
                <div className="almanac-eyebrow">Seven worlds</div>
                <h2>Where do you want to play?</h2>
                <p>Every collection is its own little universe of calculators.</p>
            </div>
            <div className="home-tiles">
                {CATEGORY_META.map(cat => {
                    const c = accentFor(cat.id)
                    return (
                        <Link
                            key={cat.id}
                            href={`/calculators/${cat.id}/`}
                            className="home-tile"
                            style={{ background: c.fill, color: c.on, borderColor: "var(--dk-line)" }}
                        >
                            <span className="e">{cat.emoji}</span>
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>
                            <span className="go">Explore tools →</span>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
