import Link from "next/link"

export const metadata = {
  title: "Cookies Policy | Docket One",
  description: "Information about how Docket One uses cookies.",
}

export default function CookiesPage() {
  return (
    <div className="almanac"><div className="almanac-page">
      <div className="almanac-top"><Link className="almanac-back" href="/">← home</Link><span>Docket One</span></div>
      <header className="almanac-masthead">
        <div className="almanac-eyebrow">Legal</div>
        <h1 className="almanac-h1 sm">Cookies Policy</h1>
        <p className="almanac-sub">Effective Date: December 15, 2024</p>
      </header>
      <div className="almanac-prose">
        <p>
          This section explains how Docket One (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar tracking technologies on our website.
        </p>
        <h2>What are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide unique functionality.
        </p>

        <h2>Types of Cookies We Use</h2>
        <h3>Analytics Cookies (Hotjar)</h3>
        <p>
          We use these to understand how our Service is used. They collect anonymized info like popular pages, device types, and interaction patterns to improve usability.
        </p>
        <h3>Advertising Cookies (Google AdSense)</h3>
        <p>
          Third-party vendors, including Google, use cookies to deliver and measure ads and to provide more relevant advertising based on your visits.
        </p>

        <h2>Your Choices</h2>
        <p>You have control over your cookie settings:</p>
        <ul>
          <li><strong>Browser Settings:</strong> You can block or delete cookies through your browser preferences.</li>
          <li><strong>Hotjar Opt-Out:</strong> You can opt out of Hotjar tracking using their opt-out mechanism.</li>
          <li><strong>Ad Personalization:</strong> Visit Google&apos;s Ad Settings to opt out of personalized advertising.</li>
        </ul>
      </div>
      <div className="almanac-foot"><span>© 2026 Docket One</span><Link href="/">Home →</Link></div>
    </div></div>
  )
}
