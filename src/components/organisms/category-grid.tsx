import { CATEGORY_META } from "@/data/calculators"
import Link from "next/link"

// Per-collection tile palette (tint bg / border / text), echoing each category's accent.
const TILE: Record<string, { bg: string; bd: string; tx: string }> = {
    lifehacks: { bg: "#1d1442", bd: "#b6ff3c", tx: "#ECEAE3" },
    mathmagik: { bg: "#1d1442", bd: "#ff3ca6", tx: "#ECEAE3" },
    bigkidmath: { bg: "#1d1442", bd: "#29e0ff", tx: "#ECEAE3" },
    cipherlab: { bg: "#1d1442", bd: "#b388ff", tx: "#ECEAE3" },
    geekgalaxy: { bg: "#1d1442", bd: "#ff8a3c", tx: "#ECEAE3" },
    otakuops: { bg: "#1d1442", bd: "#ffd23c", tx: "#ECEAE3" },
    brainmodes: { bg: "#1d1442", bd: "#5bf0c0", tx: "#ECEAE3" },
}

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
                    const c = TILE[cat.id] || TILE.lifehacks
                    return (
                        <Link
                            key={cat.id}
                            href={`/calculators/${cat.id}/`}
                            className="home-tile"
                            style={{ borderColor: c.bd }}
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
