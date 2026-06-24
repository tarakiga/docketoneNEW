import { CATEGORY_META, calculators, isIndexable, NOINDEX_CATEGORIES } from "@/data/calculators"

export const dynamic = "force-static"

// Generates /llms.txt - a curated, machine-readable map of the site for LLMs
// (https://llmstxt.org). Lists only indexable content, mirroring sitemap.ts.
export function GET() {
    const base = "https://docket.one"
    const L: string[] = []

    L.push("# Docket One")
    L.push("")
    L.push("> Free online calculators that are smart, fun, and genuinely useful - from real adulting decisions to math, codes, and everyday life optimization. No sign-up, no paywall.")
    L.push("")
    L.push("Docket One is a collection of free, single-purpose web calculators. Each tool shows its working and the formula behind the result, alongside a plain-language explainer and FAQ. The site is static and ad-supported; some playful novelty tools are intentionally excluded from this list.")
    L.push("")

    for (const cat of CATEGORY_META) {
        if (NOINDEX_CATEGORIES.has(cat.id)) continue
        const calcs = calculators.filter((c) => c.category === cat.id && isIndexable(c))
        if (!calcs.length) continue

        L.push(`## ${cat.name}`)
        L.push("")
        L.push(`${cat.description}`)
        L.push("")
        L.push(`- [${cat.name} - all tools](${base}/calculators/${cat.id}/): ${cat.tagline}`)
        for (const c of calcs) {
            L.push(`- [${c.title}](${base}/calculators/${c.category}/${c.slug}/): ${c.description}`)
        }
        L.push("")
    }

    L.push("## About")
    L.push("")
    L.push(`- [About Docket One](${base}/about/): What the site is and who builds it`)
    L.push(`- [Help & FAQ](${base}/help/): How the calculators work`)
    L.push(`- [Accessibility](${base}/accessibility/): Accessibility statement`)
    L.push(`- [Privacy Policy](${base}/privacy/): How data and cookies are handled`)
    L.push(`- [Terms of Service](${base}/terms/)`)
    L.push("")

    return new Response(L.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
