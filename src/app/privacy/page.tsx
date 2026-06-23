import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Docket One",
  description: "Docket One Privacy Policy - Learn how we protect your privacy and handle your data.",
  alternates: {
    canonical: "https://docket.one/privacy/",
  },
}

export default function PrivacyPage() {
  return (
    <main>
      <div className="almanac">
        <div className="almanac-page">
          <div className="almanac-top">
            <Link className="almanac-back" href="/">← home</Link>
            <span>Docket One</span>
          </div>

          <header className="almanac-masthead">
            <div className="almanac-eyebrow">Legal</div>
            <h1 className="almanac-h1 sm">Privacy Policy</h1>
            <p className="almanac-sub">
              Your privacy matters to us. We believe in transparency, and here&apos;s exactly how we protect your data.
            </p>
          </header>

          <div className="almanac-prose">
            <p>Effective Date: December 15, 2024</p>

            <h3>✅ What We DO Collect</h3>
            <ul>
              <li>Anonymous usage analytics (Hotjar)</li>
              <li>Basic technical info (Browser type, device)</li>
              <li>General geographic region</li>
              <li>Performance metrics</li>
            </ul>

            <h3>❌ What We DON&apos;T Collect</h3>
            <ul>
              <li>Your calculation inputs (processed locally)</li>
              <li>Personal identifying information</li>
              <li>Financial account details</li>
              <li>Detailed location/GPS data</li>
            </ul>

            <h2>Introduction</h2>
            <p>
              At Docket One (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit docket.one.
            </p>

            <h2>Information We Collect</h2>
            <h3>1. Information You Provide Directly</h3>
            <p>
              <strong>Calculator Inputs:</strong> When you use our calculators, you input data locally. <strong>Important: All calculation data is processed locally in your browser and is never transmitted to our servers.</strong>
            </p>
            <p>
              <strong>Communication:</strong> If you contact us via email, we collect your email address and message content to respond to you.
            </p>

            <h3>2. Information Collected Automatically</h3>
            <p>
              We use Hotjar to collect anonymized, aggregated insights about usage patterns such as popular pages, device types, and session behavior. This helps us improve the Service without collecting your calculation inputs. For more information, please see <a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank">Hotjar&apos;s Privacy Policy</a>.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption for all data transmission and secure server configurations. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>Advertising</h2>
            <p>
              We partner with Google AdSense to display ads on our website. Google uses cookies (including DoubleClick cookies) and similar technologies to serve personalized ads based on your prior visits to our website or other websites.
            </p>
            <p>
              You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank">Google&apos;s Ad Settings</a>. For more information on how Google uses your data, please see <a href="https://policies.google.com/privacy" target="_blank">Google&apos;s Privacy Policy</a>.
            </p>

            <h2>Cookies</h2>
            <p>
              We use cookies for analytics, site functionality, and advertising measurement. For detailed information, please see our <Link href="/cookies/">Cookies Policy</Link>.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location (CCPA for California, GDPR for EU/UK), you have rights regarding your data, including the right to know what we collect, request deletion, and opt-out of certain processing.
            </p>
            <p>
              Contact us at <a href="mailto:privacy@docket.one">privacy@docket.one</a> to exercise these rights.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact our Privacy Team at <a href="mailto:privacy@docket.one">privacy@docket.one</a>.
            </p>
          </div>

          <div className="almanac-foot">
            <span>© 2026 Docket One</span>
            <Link href="/">Home →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
