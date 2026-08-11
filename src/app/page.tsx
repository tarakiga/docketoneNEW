import { NewsletterForm } from "@/components/molecules/newsletter-form"
import { BoringDrawer } from "@/components/organisms/boring-drawer"
import { CalculatorOfTheDay } from "@/components/organisms/calculator-of-the-day"
import { CategoryGrid } from "@/components/organisms/category-grid"
import { SurpriseMeButton } from "@/components/organisms/surprise-me-button"
import { UniversalCalculator } from "@/components/organisms/universal-calculator"
import { getLatestPosts, sanitizeBlogText } from "@/lib/blog"
import Image from "next/image"
import Link from "next/link"

// Deliberately mixed: two things you'd genuinely look up on a Tuesday, one
// uncomfortable truth, one that is pure nonsense. The spread is the point —
// it shows what kind of place this is faster than a paragraph could.
const HERO_QUESTIONS = [
  { q: "when does my 2pm coffee wear off?", href: "/calculators/bigkidmath/caffeine-half-life/" },
  { q: "when should I sleep to wake at 6?", href: "/calculators/lifehacks/sleep-cycle/" },
  { q: "how much life has Instagram had?", href: "/calculators/lifehacks/social-media-addiction/" },
  { q: "how long to Proxima Centauri?", href: "/calculators/geekgalaxy/space-travel/" },
]

const TRENDING = [
  { href: "/calculators/bigkidmath/caffeine-half-life/", e: "☕", t: "Caffeine Half-Life" },
  { href: "/calculators/lifehacks/calorie-deficit/", e: "🔥", t: "Calorie Deficit" },
  { href: "/calculators/bigkidmath/billionaire-buyout/", e: "💸", t: "Billionaire Buyout" },
  { href: "/calculators/lifehacks/sleep-cycle/", e: "🌙", t: "Sleep Cycle" },
  { href: "/calculators/bigkidmath/car-vs-uber/", e: "🚗", t: "Car vs Uber" },
  { href: "/calculators/bigkidmath/lightning-life/", e: "⚡", t: "Lightning Life" },
]

export default async function Home() {
  const latestPosts = await getLatestPosts(3)

  return (
    <div className="almanac">
      {/* Hero — full-bleed yellow band, so it sits outside the page wrap.
          The Calculator of the Day is the card on the right rather than a
          separate strip below, so the claim and the proof share one screen. */}
      <header className="home-hero">
        <div className="almanac-wrap">
          <div className="home-hero-grid">
          <div>
            <div className="home-pill">🎲 <b>65+</b> Interactive visual calculators</div>
            <h1 className="home-h1">Ask a<br />weird<br /><span className="w1">question</span>.</h1>
            <p className="home-sub">Every calculator here shows its working and explains the formula. We&apos;re dead serious about deeply unserious questions.</p>
            <div className="home-cta">
              <Link className="home-btn home-btn-clay" href="#categories">Browse all 64 →</Link>
              <SurpriseMeButton className="home-btn home-btn-ink" />
            </div>
          </div>
          <CalculatorOfTheDay />
          </div>

          {/* Real questions, deliberately spanning practical to absurd, so the
              range of the collection is legible before anyone clicks. Full width
              under the grid so they lay out in one row instead of stacking, and
              every one is a genuine route — navigation, not decoration. */}
          <div className="home-asks">
            <p className="home-asks-l">People come here asking</p>
            <div className="home-ask-row">
              {HERO_QUESTIONS.map(q => (
                <Link key={q.href} className="home-ask" href={q.href}>{q.q}</Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="almanac-wrap">
        {/* Collections */}
        <CategoryGrid />

        {/* Trending */}
        <section className="almanac-section">
          <div className="home-centerhead">
            <div className="almanac-eyebrow">Hot right now</div>
            <h2>Trending calculators 🔥</h2>
          </div>
          <div className="home-chips">
            {TRENDING.map(c => (
              <Link key={c.href} href={c.href} className="home-chip"><span className="e">{c.e}</span> {c.t}</Link>
            ))}
          </div>
        </section>

        {/* Universal converter - tucked into the drawer */}
        <section className="almanac-section">
          <div className="home-lead">
            <div className="eb">The boring department</div>
            <h2>Just need to convert units? 🥱</h2>
            <p>The plain, sensible calculator is filed away in this drawer. Pull it open if you really must.</p>
          </div>
          <BoringDrawer>
            <UniversalCalculator />
          </BoringDrawer>
        </section>

        {/* Blog */}
        {latestPosts.length > 0 && (
          <section className="almanac-section">
            <div className="almanac-section-head">
              <div>
                <div className="almanac-eyebrow">From the blog</div>
                <h2>Latest writing</h2>
                <p>Insights, tips, and stories from our calculator desk.</p>
              </div>
              <Link className="almanac-btn almanac-btn-ghost" href="https://blog.docket.one">View all posts →</Link>
            </div>
            <div className="almanac-grid">
              {latestPosts.map(post => (
                <Link key={post.id} href={post.link} className="almanac-card">
                  {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <span className="almanac-card-media">
                      <Image
                        src={post._embedded["wp:featuredmedia"][0].source_url}
                        alt={sanitizeBlogText(post.title.rendered)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </span>
                  )}
                  <h3>{sanitizeBlogText(post.title.rendered)}</h3>
                  <p>{sanitizeBlogText(post.excerpt.rendered)}</p>
                  <span className="almanac-open">Read article →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO rich content */}
        <section className="almanac-section">
          <div className="almanac-prose dk-read">
            <h2>Why Docket One is your ultimate calculation engine</h2>
            <p>
              Welcome to <strong>Docket One</strong>, one of the web&apos;s most comprehensive and genuinely useful
              collections of free online calculators. Whether you&apos;re working out the true cost of car ownership,
              the biological half-life of your morning coffee, or the real price of an Uber habit versus owning a car,
              our tools give you instant, mathematically grounded answers.
            </p>
            <p>
              Making good decisions takes good data. That&apos;s why we&apos;ve gone beyond the usual mortgage and loan
              calculators to build highly specific lifestyle, finance, health, and playful &quot;geek&quot; tools.
              Instead of opening a spreadsheet, you can use a clean, fast interface to run the numbers in seconds.
            </p>
            <h3>Built for clarity, accuracy, and insight</h3>
            <p>
              Every tool is built for real accuracy paired with a human touch. We don&apos;t just hand you a number; we
              show the working in a plain-language &quot;How the Math Works&quot; section, so you understand the formula
              behind the result, from the Mifflin&ndash;St Jeor equation to compound interest.
            </p>
            <ul>
              <li><strong>Financial independence:</strong> track your FIRE number, inflation&apos;s bite, and the true cost of big purchases.</li>
              <li><strong>Health &amp; productivity:</strong> optimise your sleep cycles, caffeine timing, and focus.</li>
              <li><strong>Everyday life hacks:</strong> settle the elevator dilemma or see how many hours of your life that new phone really costs.</li>
            </ul>
            <p>
              Our goal is to make useful, transparent math available to everyone, for free, so you can make smarter,
              faster, more confident decisions every day. Explore the collections above to find your next tool.
            </p>
          </div>
        </section>

        {/* Newsletter */}
        <section className="almanac-section" style={{ paddingBottom: 72 }}>
          <NewsletterForm dark />
        </section>
      </div>
    </div>
  )
}
