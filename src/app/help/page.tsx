import Link from "next/link"

export const metadata = {
  title: "Help & FAQ | Docket One",
  description: "Get help with Docket One calculators. Answers to common questions and troubleshooting.",
}

export default function HelpPage() {
  return (
    <div className="almanac"><div className="almanac-page">
      <div className="almanac-top"><Link className="almanac-back" href="/">← home</Link><span>Docket One</span></div>

      <header className="almanac-masthead">
        <div className="almanac-eyebrow">Help</div>
        <h1 className="almanac-h1 sm">Help & FAQ</h1>
        <p className="almanac-sub">
          Find answers to common questions and get the most out of your calculator experience.
        </p>
      </header>

      <div className="almanac-prose">
        <p>
          Welcome to the Docket One help center. Docket One is a free collection of smart, practical, and playful calculators covering everything from your daily caffeine and sleep to retirement planning, classic ciphers, and the physics of chaos. This page gathers the most common questions in one place so you can get the most out of every tool, troubleshoot the occasional hiccup, and understand exactly how our calculators reach their results.
        </p>
        <p>
          Using a calculator is simple: choose one from any category, type your details into the input fields, and watch the results update instantly as you go. Every calculator page also explains the method behind it and answers the questions people ask most, so you always understand the number rather than just reading it. If you cannot find what you need below, our contact, bug-report, and calculator-request pages are only a click away, and we read every message.
        </p>
      </div>

      <div className="almanac-quicklinks">
        <a className="almanac-quick" href="/contact"><span className="qi">💬</span><span className="qt">Contact Support</span><span className="qs">Get in touch with our team</span></a>
        <a className="almanac-quick" href="/bug-report"><span className="qi">🐛</span><span className="qt">Report a Bug</span><span className="qs">Found something broken?</span></a>
        <a className="almanac-quick" href="/request"><span className="qi">💡</span><span className="qt">Request Calculator</span><span className="qs">Submit your idea</span></a>
      </div>

      <div className="almanac-prose"><h2>Getting Started</h2></div>
      <div className="almanac-faq">
        <details>
          <summary>What is Docket One?</summary>
          <div className="ans">
            Docket One is where calculators get fun! We&apos;ve created an entertaining collection of both practical life calculators and delightfully quirky themed tools. From figuring out car costs to zombie apocalypse survival, we bridge the gap between useful math and creative curiosity.
          </div>
        </details>
        <details>
          <summary>Are the calculators free?</summary>
          <div className="ans">
            <strong>Yes!</strong> All calculators on Docket One are completely free to use. No registration, subscription, or payment required.
          </div>
        </details>
        <details>
          <summary>How do I use a calculator?</summary>
          <div className="ans">
            Pick a calculator from any category, then enter your details in the input fields. Results update instantly as you type, so you can experiment freely and watch the numbers change. Every calculator page also includes a short explainer of how the math works and a set of frequently asked questions, so you can understand the result rather than just read it.
          </div>
        </details>
        <details>
          <summary>Do I need to create an account?</summary>
          <div className="ans">
            No. There are no accounts, logins, or sign-ups anywhere on Docket One. Open any calculator and start using it immediately. Because nothing is saved to an account, simply revisit or bookmark a calculator&apos;s page to use it again.
          </div>
        </details>
      </div>

      <div className="almanac-prose"><h2>Technical Support</h2></div>
      <div className="almanac-faq">
        <details>
          <summary>The calculator isn&apos;t working properly</summary>
          <div className="ans">
            <ul>
              <li><strong>Refresh the page:</strong> Sometimes a simple reload fixes glitches.</li>
              <li><strong>Clear cache:</strong> Try clearing your browser cache.</li>
              <li><strong>Check Ad Blockers:</strong> Some blockers might interfere with scripts.</li>
              <li><strong>Enable JavaScript:</strong> Our tools require JS to run locally in your browser.</li>
            </ul>
          </div>
        </details>
        <details>
          <summary>Mobile issues (keyboard/scrolling)</summary>
          <div className="ans">
            If the mobile keyboard doesn&apos;t appear, tap directly on the input field. If results aren&apos;t visible, scroll down or try rotating your device to landscape mode.
          </div>
        </details>
      </div>

      <div className="almanac-prose"><h2>Accuracy &amp; Trust</h2></div>
      <div className="almanac-faq">
        <details>
          <summary>How accurate are the results?</summary>
          <div className="ans">
            Each calculator is built on an established formula or a documented model, and many pages show that method in a &quot;How the Math Works&quot; section so you can check it yourself. That said, several tools deliberately produce informed <strong>estimates</strong> rather than exact measurements, because real-world results vary from person to person. When a number is an approximation, we say so and explain what affects it.
          </div>
        </details>
        <details>
          <summary>Can I rely on these for medical or financial decisions?</summary>
          <div className="ans">
            Our health, fitness, and finance calculators are designed for education and curiosity, not as a replacement for professional advice. Use them to learn, plan, and explore, but please consult a qualified doctor, dietitian, or financial professional before making significant decisions about your health or money.
          </div>
        </details>
        <details>
          <summary>Where does the underlying data come from?</summary>
          <div className="ans">
            We base our tools on well-established public sources and standard models, such as the Mifflin&ndash;St Jeor equation for metabolism, recognised inflation and interest formulas, and widely published reference values. We aim to keep figures reasonable and clearly labelled, and we welcome corrections if you ever spot something that looks off.
          </div>
        </details>
      </div>

      <div className="almanac-callout">
        <h2>Privacy First</h2>
        <p>
          All calculations happen in your browser. We never see or store your input data or results. When you close the calculator, your data is gone forever.
        </p>
        <p><a href="/privacy">Read Privacy Policy →</a></p>
      </div>

      <div className="almanac-foot"><span>© 2026 Docket One</span><Link href="/">Home →</Link></div>
    </div></div>
  )
}
