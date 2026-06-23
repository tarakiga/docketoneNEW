import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Docket One",
  description: "Terms of Service for Docket One calculators. Learn about acceptable use, user responsibilities, and our service terms.",
}

export default function TermsPage() {
  return (
    <div className="almanac"><div className="almanac-page">
      <div className="almanac-top"><Link className="almanac-back" href="/">← home</Link><span>Docket One</span></div>
      <header className="almanac-masthead"><div className="almanac-eyebrow">Legal</div><h1 className="almanac-h1 sm">Terms of Service</h1><p className="almanac-sub">Effective Date: December 15, 2024</p></header>
      <div className="almanac-prose">

        <h2>Agreement to Terms</h2>
        <p>
          Welcome to Docket One. These Terms of Service (&quot;Terms&quot;) govern your use of our website located at docket.one and our calculator services (collectively, the &quot;Service&quot;) operated by Docket One (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
        </p>
        <p>
          <strong>By accessing or using our Service, you agree to be bound by these Terms.</strong> If you disagree with any part of these Terms, you may not access the Service.
        </p>

        <h2>Description of Service</h2>
        <h3>What We Provide</h3>
        <p>Docket One offers a collection of specialized online calculators organized into themed categories.</p>

        <h3>How Our Calculators Work</h3>
        <ul>
          <li>All calculations are performed locally in your web browser</li>
          <li>No data is transmitted to or stored on our servers</li>
          <li>Results are generated in real-time based on your inputs</li>
        </ul>

        <h3>⚠️ Important: What We Don&apos;t Provide</h3>
        <ul>
          <li>Professional advice (financial, legal, medical, etc.)</li>
          <li>Guaranteed accuracy for real-world decision making</li>
          <li>Data storage or account management</li>
        </ul>

        <h2>Acceptable Use</h2>
        <h4>✅ You May Use Our Service To:</h4>
        <ul>
          <li>Calculate, explore, and learn</li>
          <li>Teaching or learning activities</li>
          <li>Inform business decisions (with disclaimers)</li>
          <li>Share results and links</li>
        </ul>
        <h4>❌ You May NOT Use Our Service To:</h4>
        <ul>
          <li>Illegal Activities</li>
          <li>Create or promote offensive content</li>
          <li>Disrupt or hack our Service</li>
          <li>Redistribute our calculators commercially</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>Docket One and its licensors own all intellectual property rights in the Service, including calculator algorithms, design, code, and branding.</p>
        <p>We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, educational, or professional purposes, provided you do not modify or copy our underlying code.</p>

        <h2>Disclaimers</h2>
        <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. We do not guarantee accuracy, completeness, or reliability.</p>

        <h2>Contact Information</h2>
        <p>For questions about these Terms:</p>
        <p>
          <a href="mailto:legal@docket.one">legal@docket.one</a>
        </p>
      </div>
      <div className="almanac-foot"><span>© 2026 Docket One</span><Link href="/">Home →</Link></div>
    </div></div>
  )
}
