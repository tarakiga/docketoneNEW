import Link from "next/link"

export const metadata = {
  title: "About Us | Docket One",
  description: "Learn about the mission and team behind Docket One, the place for fun, practical calculators for modern life.",
  alternates: {
    canonical: "https://docket.one/about/",
  },
}

export default function AboutPage() {
  return (
    <div className="almanac"><div className="almanac-page">
      <div className="almanac-top"><Link className="almanac-back" href="/">← home</Link><span>Docket One</span></div>
      <header className="almanac-masthead"><div className="almanac-eyebrow">About</div><h1 className="almanac-h1 sm">About Docket One</h1><p className="almanac-sub">We build smart, fun, and practical calculators for modern life&apos;s many questions.</p></header>
      <div className="almanac-prose">
        <h2>Our Mission</h2>
        <p>
          In a world full of data, we believe that the right tools can make all the difference. Our mission is to provide calculators that are not only functional but also fun and engaging. We want to help you make smarter decisions, whether you&apos;re figuring out the true cost of car ownership, planning for a zombie apocalypse, or just trying to understand your caffeine intake.
        </p>
        <p>
          We&apos;re committed to creating high-quality, well-researched, and easy-to-use tools that are accessible to everyone. We believe that &quot;adulting&quot; is hard enough, and our calculators are here to make it a little bit easier (and more entertaining).
        </p>

        <h2>Our Story</h2>
        <p>
          Docket One started as a small passion project by a group of friends who were tired of using boring, generic calculators. We wanted to create tools that were tailored to the unique challenges and interests of modern life. From late-night coding sessions fueled by coffee to lively debates about the probability of alien communication, we&apos;ve poured our hearts and minds into creating a collection of calculators that we&apos;re proud of.
        </p>
        <p>
          Our goal is to continue to grow our library of calculators, always keeping our focus on quality, accuracy, and a great user experience. We&apos;re excited to have you on this journey with us!
        </p>

        <h2>What You&apos;ll Find Here</h2>
        <p>
          Our library is organised into focused collections so you can find the right tool fast. <strong>Big Kid Math</strong> tackles real adulting decisions, from the true cost of owning a car versus taking rideshares to how much caffeine is still in your system at midnight. <strong>Math Magik</strong> turns big financial and scientific ideas into something you can actually picture, covering everything from your FIRE retirement number to the chaos hiding inside a double pendulum. <strong>Life Hacks</strong> helps with the small daily decisions, like the best time to fall asleep or whether that purchase is really worth the hours of your life it costs.
        </p>
        <p>
          <strong>Cipher Lab</strong> is a hands-on playground for codes and writing systems, from the Caesar cipher and Morse code to the ancient Irish Ogham alphabet. <strong>Brain Modes</strong> explores the quirks of perception, like the highest pitch your ears can still hear. And for pure fun, our themed collections turn pop-culture questions into real math. Every tool is built to be genuinely useful or genuinely entertaining, and usually both.
        </p>

        <h2>How We Build Our Calculators</h2>
        <p>
          We care about getting the math right. Each calculator is built on an established formula or a documented model, whether that is the Mifflin&ndash;St Jeor equation for estimating your metabolism, the Scoville scale for chili heat, or the standard exponential-decay model used for caffeine. Wherever a tool relies on a method, we explain it in plain language in a &quot;How the Math Works&quot; section, so you are never asked to trust a number you cannot check yourself.
        </p>
        <p>
          At the same time, we are honest about limits. Many of our tools produce informed estimates rather than precise measurements, because the real world is full of individual variation. Our health, fitness, and finance calculators are designed for education and curiosity, not as a substitute for professional medical or financial advice. When a result is an approximation, we say so clearly and explain what affects it.
        </p>

        <h2>Free, Private, and Open to Everyone</h2>
        <p>
          Every calculator on Docket One is completely free, with no account, subscription, or paywall. Just as importantly, your inputs stay yours: our tools run entirely in your own browser, so the numbers you type are never sent to us or stored on a server. When you close the tab, your data is gone.
        </p>
        <p>
          We also work to keep the site usable for everyone, with readable typography, keyboard-friendly controls, and clear results. If you ever spot a calculation that looks off, a tool that misbehaves, or an idea for one we should build next, we genuinely want to hear it. You can reach us any time through our contact, bug-report, and calculator-request pages.
        </p>
      </div>
      <div className="almanac-foot"><span>© 2026 Docket One</span><Link href="/">Home →</Link></div>
    </div></div>
  )
}
