import { FilteredCalculatorGrid } from "@/components/organisms/filtered-calculator-grid"
import { calculators, CATEGORY_META, NOINDEX_CATEGORIES } from "@/data/calculators"
import { categoryDescriptions } from "@/data/categoryDescriptions"
import { Metadata } from "next"
import Link from "next/link"

export function generateStaticParams() {
    const categories = Array.from(new Set(calculators.map(c => c.category)))
    return categories.map(category => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params
    const meta = CATEGORY_META.find(m => m.id.toLowerCase() === category.toLowerCase())
    const categoryName = meta?.name || category.charAt(0).toUpperCase() + category.slice(1)

    return {
        title: `${categoryName} Calculators`,
        description: `Explore our collection of ${categoryName} tools. From fun simulations to practical utilities.`,
        alternates: {
            canonical: `https://docket.one/calculators/${category}/`,
        },
        ...(NOINDEX_CATEGORIES.has(category)
            ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }
            : {}),
    }
}

// Calm per-category accents for the Almanac theme (each keeps its own identity)
const ACCENTS: Record<string, { a: string; a2: string; tint: string }> = {
    bigkidmath: { a: "#29e0ff", a2: "#ffd23c", tint: "rgba(255,255,255,.06)" },
    cipherlab: { a: "#b388ff", a2: "#29e0ff", tint: "rgba(255,255,255,.06)" },
    geekgalaxy: { a: "#ff8a3c", a2: "#29e0ff", tint: "rgba(255,255,255,.06)" },
    lifehacks: { a: "#b6ff3c", a2: "#ff3ca6", tint: "rgba(255,255,255,.06)" },
    mathmagik: { a: "#ff3ca6", a2: "#ffd23c", tint: "rgba(255,255,255,.06)" },
    otakuops: { a: "#ffd23c", a2: "#ff3ca6", tint: "rgba(255,255,255,.06)" },
    brainmodes: { a: "#5bf0c0", a2: "#ffd23c", tint: "rgba(255,255,255,.06)" },
}

interface CategoryPageProps {
    params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params
    const key = category.toLowerCase()

    const categoryCalculators = calculators.filter(c => c.category.toLowerCase() === key)
    const meta = CATEGORY_META.find(m => m.id.toLowerCase() === key)
    const about = categoryDescriptions[key]
    const acc = ACCENTS[key] || ACCENTS.lifehacks

    const categoryName = meta?.name || category
        .split(/(?=[A-Z])|_/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

    return (
        <div
            className="almanac"
            style={{
                // @ts-expect-error CSS custom properties
                "--accent": acc.a, "--accent-2": acc.a2, "--accent-tint": acc.tint,
            }}
        >
            <div className="almanac-wrap">
                <div className="almanac-top">
                    <Link className="almanac-back" href="/#categories">← all collections</Link>
                    <span>Docket One</span>
                </div>

                <header className="almanac-masthead">
                    {meta?.tagline && <div className="almanac-eyebrow">{meta.tagline}</div>}
                    <h1 className="almanac-h1">
                        {categoryName}
                        {meta?.emoji && <span className="almanac-mark">{meta.emoji}</span>}
                    </h1>
                    {meta?.description && <p className="almanac-tagline">{meta.description}</p>}
                </header>

                <div className="almanac-rule">
                    <span><b>{categoryCalculators.length}</b> {categoryCalculators.length === 1 ? "tool" : "tools"} in this collection</span>
                    <span>Free · no sign-up</span>
                </div>

                <FilteredCalculatorGrid calculators={categoryCalculators} />

                {about && (
                    <section className="almanac-about">
                        <h2>{about.title}</h2>
                        <div className="almanac-body">{about.content}</div>
                    </section>
                )}

                <div className="almanac-foot">
                    <span>© 2026 Docket One</span>
                    <Link href="/#categories">View all collections →</Link>
                </div>
            </div>
        </div>
    )
}
