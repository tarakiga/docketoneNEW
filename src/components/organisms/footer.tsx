import { Calculator, Github, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t-2 border-transparent bg-clip-border" style={{ borderImage: "linear-gradient(to right, #c084fc, #ec4899) 1" }}>
      <div className="container px-4 md:px-6 py-12 md:py-20 text-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                <Calculator className="h-6 w-6 text-indigo-400" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Docket One</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed w-full md:w-3/4">
              Premium calculators for modern life. We blend powerful mathematics with beautiful design to help you make better decisions, faster.
            </p>
          </div>
          
          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-white/50">Calculators</h4>
            <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/calculators/BigKidMath" className="text-slate-400 hover:text-indigo-400 transition-colors">Big Kid Math</Link></li>
                <li><Link href="/calculators/CipherLab" className="text-slate-400 hover:text-indigo-400 transition-colors">Cipher Lab</Link></li>
                <li><Link href="/calculators/GeekGalaxy" className="text-slate-400 hover:text-indigo-400 transition-colors">Geek Galaxy</Link></li>
                <li><Link href="/calculators/LifeHacks" className="text-slate-400 hover:text-indigo-400 transition-colors">Life Hacks</Link></li>
                <li><Link href="/calculators/Math_Magik" className="text-slate-400 hover:text-indigo-400 transition-colors">Math Magik</Link></li>
                <li><Link href="/calculators/Otaku_Ops" className="text-slate-400 hover:text-indigo-400 transition-colors">Otaku Ops</Link></li>
            </ul>
          </div>

          {/* Support Column 1 */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-white/50">Support & Info</h4>
            <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/about" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link href="/help" className="text-slate-400 hover:text-indigo-400 transition-colors">Help & FAQ</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-slate-400 hover:text-indigo-400 transition-colors">Cookies Policy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="text-slate-400 hover:text-indigo-400 transition-colors">Disclaimer</Link></li>
                <li><Link href="/accessibility" className="text-slate-400 hover:text-indigo-400 transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* Support Column 2 */}
          <div className="space-y-6 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
             <h4 className="md:hidden text-sm font-bold tracking-widest uppercase text-white/50">Contact</h4>
             <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/support" className="text-slate-400 hover:text-indigo-400 transition-colors">Get Support</Link></li>
                <li><Link href="/bug-report" className="text-slate-400 hover:text-indigo-400 transition-colors">Report Bug</Link></li>
                <li><Link href="/request" className="text-slate-400 hover:text-indigo-400 transition-colors">Request Calculator</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500 font-medium">
                © {new Date().getFullYear()} Docket One. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
                <Link href="#" className="text-slate-500 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-slate-500 hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </Link>
            </div>
        </div>
      </div>
    </footer>
  )
}
