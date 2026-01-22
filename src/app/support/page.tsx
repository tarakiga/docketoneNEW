import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { Bug, FileQuestion, HelpCircle, LifeBuoy, Lightbulb, MessageSquare } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Support Center | Docket One",
  description: "Get support for Docket One calculators",
}

export default function SupportPage() {
  const options = [
      {
          icon: <HelpCircle className="w-8 h-8 text-cyan-400" />,
          title: "Help & FAQ",
          desc: "Common questions and troubleshooting guides.",
          href: "/help",
          color: "border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10"
      },
      {
        icon: <MessageSquare className="w-8 h-8 text-indigo-400" />,
        title: "Contact Us",
        desc: "General inquiries and feedback.",
        href: "/contact",
        color: "border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10"
      },
      {
        icon: <Bug className="w-8 h-8 text-red-400" />,
        title: "Report a Bug",
        desc: "Found something broken? Let us know.",
        href: "/bug-report",
        color: "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
      },
      {
        icon: <Lightbulb className="w-8 h-8 text-amber-400" />,
        title: "Request Calculator",
        desc: "Got a brilliant idea? We want to hear it!",
        href: "/request",
        color: "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
      },
      {
          icon: <LifeBuoy className="w-8 h-8 text-emerald-400" />,
          title: "Accessibility",
          desc: "Our commitment to inclusive design.",
          href: "/accessibility",
          color: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
      },
      {
          icon: <FileQuestion className="w-8 h-8 text-slate-400" />,
          title: "Legal Center",
          desc: "Privacy, Terms, and Cookies info.",
          href: "/privacy",
          color: "border-slate-500/20 bg-slate-500/5 hover:bg-slate-500/10"
      }
  ]

  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />

        <div className="container py-16 md:py-24 max-w-5xl mx-auto">
            <header className="text-center space-y-6 mb-16">
                <TypographyH1 className="text-gradient">Support Center</TypographyH1>
                <TypographyP className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    How can we help you today? Select an option below.
                </TypographyP>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {options.map((opt, i) => (
                    <Link 
                        key={i} 
                        href={opt.href}
                        className={`p-8 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${opt.color} group`}
                    >
                        <div className="mb-4 p-3 bg-background/50 rounded-lg w-fit group-hover:scale-110 transition-transform">{opt.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{opt.title}</h3>
                        <p className="text-muted-foreground text-sm">{opt.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    </main>
  )
}
