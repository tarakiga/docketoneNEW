import { Calculator, Github, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="almanac-footer">
      <div className="almanac-footer-inner">
        <div className="almanac-footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" className="almanac-footer-brand">
              <Calculator className="h-6 w-6" style={{ color: "var(--accent)" }} />
              Docket One
            </Link>
            <p className="almanac-footer-tag">
              Premium calculators for modern life. We blend powerful mathematics with beautiful design to help you make better decisions, faster.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h4>Calculators</h4>
            <ul>
              <li><Link href="/calculators/bigkidmath/">Big Kid Math</Link></li>
              <li><Link href="/calculators/cipherlab/">Cipher Lab</Link></li>
              <li><Link href="/calculators/geekgalaxy/">Geek Galaxy</Link></li>
              <li><Link href="/calculators/lifehacks/">Life Hacks</Link></li>
              <li><Link href="/calculators/mathmagik/">Math Magik</Link></li>
              <li><Link href="/calculators/otakuops/">Otaku Ops</Link></li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h4>Support &amp; Info</h4>
            <ul>
              <li><Link href="/about/">About Us</Link></li>
              <li><Link href="/help/">Help &amp; FAQ</Link></li>
              <li><Link href="/privacy/">Privacy Policy</Link></li>
              <li><Link href="/cookies/">Cookies Policy</Link></li>
              <li><Link href="/terms/">Terms of Service</Link></li>
              <li><Link href="/disclaimer/">Disclaimer</Link></li>
              <li><Link href="/accessibility/">Accessibility</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <ul>
              <li><Link href="/contact/">Contact Us</Link></li>
              <li><Link href="/support/">Get Support</Link></li>
              <li><Link href="/bug-report/">Report Bug</Link></li>
              <li><Link href="/request/">Request Calculator</Link></li>
            </ul>
          </div>
        </div>

        <div className="almanac-footer-bottom">
          <p className="almanac-footer-copy">© {new Date().getFullYear()} Docket One. All rights reserved.</p>
          <div className="almanac-footer-social">
            <Link href="https://x.com/docket_one" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
            <Link href="https://github.com/docket-one" aria-label="GitHub"><Github className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
