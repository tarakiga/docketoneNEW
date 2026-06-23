import { AdUnit } from "@/components/molecules/consent-scripts"
import { RelatedCalculators } from "@/components/organisms/related-calculators"
import { CalculatorSchema } from "@/components/seo/CalculatorSchema"
import { CATEGORY_META } from "@/data/calculators"
import Link from "next/link"
import { ReactNode } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface CalculatorLayoutProps {
  title: string
  description: string
  children: ReactNode
  understanding?: ReactNode
  origin?: string
  howTo?: string
  tips?: string[]
  faq: FAQItem[]
  slug: string
  category: string
  articleContent?: ReactNode
}

// Calm per-category accents (mirrors the category landing pages)
const ACCENTS: Record<string, { a: string; a2: string; tint: string }> = {
  bigkidmath: { a: "#29e0ff", a2: "#ffd23c", tint: "rgba(255,255,255,.06)" },
  cipherlab: { a: "#b388ff", a2: "#29e0ff", tint: "rgba(255,255,255,.06)" },
  geekgalaxy: { a: "#ff8a3c", a2: "#29e0ff", tint: "rgba(255,255,255,.06)" },
  lifehacks: { a: "#b6ff3c", a2: "#ff3ca6", tint: "rgba(255,255,255,.06)" },
  mathmagik: { a: "#ff3ca6", a2: "#ffd23c", tint: "rgba(255,255,255,.06)" },
  otakuops: { a: "#ffd23c", a2: "#ff3ca6", tint: "rgba(255,255,255,.06)" },
  brainmodes: { a: "#5bf0c0", a2: "#ffd23c", tint: "rgba(255,255,255,.06)" },
}

export function CalculatorLayout({ title, description, children, understanding, origin, howTo, tips = [], faq, slug, category, articleContent }: CalculatorLayoutProps) {
  const key = category.toLowerCase()
  const meta = CATEGORY_META.find(m => m.id.toLowerCase() === key)
  const catName = meta?.name || category
  const acc = ACCENTS[key] || ACCENTS.lifehacks

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
          <Link className="almanac-back" href={`/calculators/${key}/`}>← {catName}</Link>
          <span>Docket One</span>
        </div>

        <header className="almanac-calc-masthead">
          <div className="almanac-eyebrow">{catName}</div>
          <h1>{title}</h1>
          <p className="almanac-sub direct-answer">{description}</p>
        </header>

        {(origin || understanding || howTo) && (
          <div className="almanac-infocards">
            {(origin || understanding) && (
              <section className="almanac-infocard">
                <h2>📜 The Origins</h2>
                {origin ? <p>{origin}</p> : understanding}
              </section>
            )}
            {howTo && (
              <section className="almanac-infocard">
                <h2>🚀 Master the Tool</h2>
                <p>{howTo}</p>
              </section>
            )}
          </div>
        )}

        {/* Interactive widget */}
        <div className="almanac-toollabel">
          <div className="almanac-eyebrow">The calculator</div>
        </div>
        <div className="almanac-screen min-h-[400px]">
          {children}
        </div>

        {articleContent && (
          <article className="almanac-article almanac-prose">
            {articleContent}
          </article>
        )}

        <AdUnit className="max-w-3xl mx-auto almanac-block" />

        {tips.length > 0 && (
          <section className="almanac-block" style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            <div className="almanac-eyebrow">Pro tips</div>
            <div className="almanac-tips">
              {tips.map((tip, index) => (
                <div key={index} className="almanac-tip">
                  <span className="n">{String(index + 1).padStart(2, "0")}</span>
                  <span className="x">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {faq.length > 0 && (
          <section className="almanac-block" style={{ maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            <h2 className="almanac-h2">The Fine Print (FAQ)</h2>
            <div className="almanac-faq">
              {faq.map((item, index) => (
                <details key={index}>
                  <summary>{item.question}</summary>
                  <div className="ans">{item.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="almanac-block">
          <RelatedCalculators currentCategory={category} currentSlug={slug} />
        </div>

        <CalculatorSchema title={title} description={description} faq={faq} slug={slug} category={category} />
      </div>
    </div>
  )
}
