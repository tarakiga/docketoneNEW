import Link from "next/link"

const STATS = [
    { v: "65+", l: "Calculators" },
    { v: "7", l: "Collections" },
    { v: "100%", l: "Free forever" },
    { v: "0", l: "Sign-ups" },
]

export function HeroSection() {
    return (
        <header className="almanac-hero">
            <div className="almanac-eyebrow">Calculators that actually matter</div>
            <h1>
                Calculate,<br />
                <span style={{ color: "var(--accent)" }}>don&apos;t guess.</span>
            </h1>
            <p className="almanac-sub">
                From the true cost of car ownership to the odds of surviving a zombie apocalypse,
                we build smart, free tools for life&apos;s practical and playful questions.
            </p>
            <div className="almanac-cta">
                <Link className="almanac-btn almanac-btn-lg" href="#categories">Explore calculators →</Link>
                <Link className="almanac-btn almanac-btn-ghost almanac-btn-lg" href="#universal">Quick converter</Link>
            </div>
            <div className="almanac-stats">
                {STATS.map(s => (
                    <div className="almanac-stat" key={s.l}>
                        <div className="v">{s.v}</div>
                        <div className="l">{s.l}</div>
                    </div>
                ))}
            </div>
        </header>
    )
}
