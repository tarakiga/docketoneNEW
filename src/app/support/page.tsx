import Link from "next/link"

export const metadata = {
  title: "Support Center | Docket One",
  description: "Get support for Docket One calculators",
}

export default function SupportPage() {
  const options = [
      {
          icon: "❓",
          title: "Help & FAQ",
          desc: "Common questions and troubleshooting guides.",
          href: "/help",
      },
      {
        icon: "💬",
        title: "Contact Us",
        desc: "General inquiries and feedback.",
        href: "/contact",
      },
      {
        icon: "🐛",
        title: "Report a Bug",
        desc: "Found something broken? Let us know.",
        href: "/bug-report",
      },
      {
        icon: "💡",
        title: "Request Calculator",
        desc: "Got a brilliant idea? We want to hear it!",
        href: "/request",
      },
      {
          icon: "🛟",
          title: "Accessibility",
          desc: "Our commitment to inclusive design.",
          href: "/accessibility",
      },
      {
          icon: "📄",
          title: "Legal Center",
          desc: "Privacy, Terms, and Cookies info.",
          href: "/privacy",
      }
  ]

  return (
    <div className="almanac">
      <div className="almanac-page">
        <div className="almanac-top">
          <Link href="/" className="almanac-back">← Home</Link>
        </div>

        <header className="almanac-masthead">
          <div className="almanac-eyebrow">Docket One</div>
          <h1 className="almanac-h1 sm">Support Center</h1>
          <p className="almanac-sub">How can we help you today? Select an option below.</p>
        </header>

        <div className="almanac-quicklinks">
          {options.map((opt, i) => (
            <Link key={i} href={opt.href} className="almanac-quick">
              <span className="qi">{opt.icon}</span>
              <span className="qt">{opt.title}</span>
              <span className="qs">{opt.desc}</span>
            </Link>
          ))}
        </div>

        <div className="almanac-foot">
          <span>© 2026 Docket One</span>
          <Link href="/">Home →</Link>
        </div>
      </div>
    </div>
  )
}
