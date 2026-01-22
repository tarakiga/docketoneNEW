import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography"
import Link from "next/link"

export const metadata = {
  title: "Help & FAQ | Docket One",
  description: "Get help with Docket One calculators. Answers to common questions and troubleshooting.",
}

export default function HelpPage() {
  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-background to-background" />

        <div className="container py-16 md:py-24 max-w-4xl mx-auto space-y-16">
            <header className="text-center space-y-4">
                <TypographyH1 className="text-gradient">Help & FAQ</TypographyH1>
                <TypographyP className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Find answers to common questions and get the most out of your calculator experience.
                </TypographyP>
            </header>

            {/* Quick Links */}
             <div className="grid md:grid-cols-3 gap-6">
                <Link href="/contact" className="glass-card p-6 rounded-xl border-white/10 hover:bg-white/5 transition-colors text-center group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">💬</div>
                    <div className="font-bold text-white mb-2">Contact Support</div>
                    <div className="text-sm text-muted-foreground">Get in touch with our team</div>
                </Link>
                <Link href="/bug-report" className="glass-card p-6 rounded-xl border-white/10 hover:bg-white/5 transition-colors text-center group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🐛</div>
                    <div className="font-bold text-white mb-2">Report a Bug</div>
                    <div className="text-sm text-muted-foreground">Found something broken?</div>
                </Link>
                 <Link href="/request" className="glass-card p-6 rounded-xl border-white/10 hover:bg-white/5 transition-colors text-center group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">💡</div>
                    <div className="font-bold text-white mb-2">Request Calculator</div>
                    <div className="text-sm text-muted-foreground">Submit your idea</div>
                </Link>
            </div>

            {/* Getting Started */}
            <section className="space-y-6">
                <TypographyH2>🚀 Getting Started</TypographyH2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-white/10">
                        <AccordionTrigger className="text-lg">What is Docket One?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Docket One is where calculators get fun! We've created an entertaining collection of both practical life calculators and delightfully quirky themed tools. From figuring out car costs to zombie apocalypse survival, we bridge the gap between useful math and creative curiosity.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-2" className="border-white/10">
                        <AccordionTrigger className="text-lg">Are the calculators free?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            <strong>Yes!</strong> All calculators on Docket One are completely free to use. No registration, subscription, or payment required.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

             {/* Technical Support */}
            <section className="space-y-6">
                <TypographyH2>🔧 Technical Support</TypographyH2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="tech-1" className="border-white/10">
                        <AccordionTrigger className="text-lg">The calculator isn't working properly</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                           <ul className="list-disc pl-4 space-y-2">
                               <li><strong>Refresh the page:</strong> Sometimes a simple reload fixes glitches.</li>
                               <li><strong>Clear cache:</strong> Try clearing your browser cache.</li>
                               <li><strong>Check Ad Blockers:</strong> Some blockers might interfere with scripts.</li>
                               <li><strong>Enable JavaScript:</strong> Our tools require JS to run locally in your browser.</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="tech-2" className="border-white/10">
                        <AccordionTrigger className="text-lg">Mobile issues (keyboard/scrolling)</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            If the mobile keyboard doesn't appear, tap directly on the input field. If results aren't visible, scroll down or try rotating your device to landscape mode.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* Privacy */}
            <section className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-8 text-center">
                 <TypographyH2 className="text-indigo-400">🔒 Privacy First</TypographyH2>
                 <TypographyP>
                     All calculations happen in your browser. We never see or store your input data or results. When you close the calculator, your data is gone forever.
                 </TypographyP>
                 <Link href="/privacy" className="text-sm font-bold text-white hover:underline mt-4 inline-block">Read Privacy Policy →</Link>
            </section>
        </div>
    </main>
  )
}
