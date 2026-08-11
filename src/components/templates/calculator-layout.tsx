import { AdUnit } from "@/components/molecules/consent-scripts"
import { RelatedCalculators } from "@/components/organisms/related-calculators"
import { CalculatorSchema } from "@/components/seo/CalculatorSchema"
import { CATEGORY_META } from "@/data/calculators"
import { accentFor } from "@/data/category-palette"
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

export function CalculatorLayout({ title, description, children, understanding, origin, howTo, tips = [], faq, slug, category, articleContent }: CalculatorLayoutProps) {
  const key = category.toLowerCase()
  const meta = CATEGORY_META.find(m => m.id.toLowerCase() === key)
  const catName = meta?.name || category
  const acc = accentFor(key)

  return (
    <div
      className="almanac"
      style={{
        // @ts-expect-error CSS custom properties
        // --accent is a text/hairline colour in the base layer, so it takes the
        // ink variant; --dk-cat carries the fill for anything that needs it.
        "--accent": acc.ink, "--accent-2": acc.ink, "--accent-tint": acc.tint,
        "--dk-cat": acc.fill, "--dk-cat-ink": acc.ink, "--dk-cat-on": acc.on,
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
