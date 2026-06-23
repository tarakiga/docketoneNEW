import Link from "next/link"

export const metadata = {
  title: "Accessibility Statement | Docket One",
  description: "Docket One Accessibility Statement - Our commitment to making calculators accessible to all users.",
  alternates: {
    canonical: "https://docket.one/accessibility/",
  },
}

export default function AccessibilityPage() {
  return (
    <div className="almanac"><div className="almanac-page">
      <div className="almanac-top"><Link className="almanac-back" href="/">← home</Link><span>Docket One</span></div>
      <header className="almanac-masthead">
        <div className="almanac-eyebrow">Commitment</div>
        <h1 className="almanac-h1 sm">Accessibility</h1>
        <p className="almanac-sub">Our commitment to making calculators accessible to everyone, regardless of ability or technology used.</p>
      </header>
      <div className="almanac-prose">
        <p>Last Updated: December 15, 2024</p>

        <h2>🌟 Our Commitment</h2>
        <p>
          Docket One is committed to ensuring digital accessibility for all users, including people with disabilities. We strive to provide an inclusive experience that allows everyone to access and benefit from our calculator tools regardless of their abilities or the technologies they use.
        </p>
        <p>We work to ensure our website meets or exceeds the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</p>

        <h2>Accessibility Features</h2>

        <h3>⌨️ Keyboard Navigation</h3>
        <ul>
          <li>Full keyboard support</li>
          <li>Logical tab order</li>
          <li>Skip links</li>
        </ul>

        <h3>👁️ Screen Reader Support</h3>
        <ul>
          <li>ARIA labels and descriptions</li>
          <li>Semantic HTML structure</li>
          <li>Alt text for images</li>
        </ul>

        <h3>🎨 Visual Accessibility</h3>
        <ul>
          <li>High contrast text</li>
          <li>Color-independent info</li>
          <li>Scalable text</li>
        </ul>

        <h3>🧪 Compatible Tools</h3>
        <ul>
          <li>NVDA, JAWS (Windows)</li>
          <li>VoiceOver (macOS/iOS)</li>
          <li>TalkBack (Android)</li>
        </ul>

        <h2>Known Issues & Feedback</h2>
        <p>
          We are actively working to address limitations with some third-party chart libraries and complex formula explanations.
        </p>
        <p>
          If you encounter accessibility barriers, please contact us at <a href="mailto:accessibility@docket.one">accessibility@docket.one</a>. We aim to respond to accessibility inquiries within 3 business days.
        </p>
      </div>
      <div className="almanac-foot"><span>© 2026 Docket One</span><Link href="/">Home →</Link></div>
    </div></div>
  )
}
