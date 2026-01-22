import { TypographyH1, TypographyH2, TypographyH4, TypographyP } from "@/components/ui/typography"

export const metadata = {
  title: "Accessibility Statement | Docket One",
  description: "Docket One Accessibility Statement - Our commitment to making calculators accessible to all users.",
}

export default function AccessibilityPage() {
  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/5 via-background to-background" />

        <div className="container py-16 md:py-24 max-w-4xl mx-auto">
            <header className="mb-12 text-center text-muted-foreground">
                <TypographyH1 className="text-foreground text-gradient mb-4">Accessibility Statement</TypographyH1>
                <p>Last Updated: December 15, 2024</p>
                <TypographyP className="max-w-2xl mx-auto mt-4">
                    Our commitment to making calculators accessible to everyone, regardless of ability or technology used.
                </TypographyP>
            </header>

            <div className="space-y-12 prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                
                <section className="glass-card p-8 rounded-xl border-white/10">
                    <TypographyH2>🌟 Our Commitment</TypographyH2>
                    <TypographyP>
                        Docket One is committed to ensuring digital accessibility for all users, including people with disabilities. We strive to provide an inclusive experience that allows everyone to access and benefit from our calculator tools regardless of their abilities or the technologies they use.
                    </TypographyP>
                    <TypographyP>We work to ensure our website meets or exceeds the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</TypographyP>
                </section>

                <section>
                    <TypographyH2>Accessibility Features</TypographyH2>
                    <div className="grid md:grid-cols-2 gap-6 not-prose">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <TypographyH4 className="mb-2">⌨️ Keyboard Navigation</TypographyH4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                                <li>Full keyboard support</li>
                                <li>Logical tab order</li>
                                <li>Skip links</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <TypographyH4 className="mb-2">👁️ Screen Reader Support</TypographyH4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                                <li>ARIA labels and descriptions</li>
                                <li>Semantic HTML structure</li>
                                <li>Alt text for images</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <TypographyH4 className="mb-2">🎨 Visual Accessibility</TypographyH4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                                <li>High contrast text</li>
                                <li>Color-independent info</li>
                                <li>Scalable text</li>
                            </ul>
                        </div>
                         <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <TypographyH4 className="mb-2">🧪 Compatible Tools</TypographyH4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                                <li>NVDA, JAWS (Windows)</li>
                                <li>VoiceOver (macOS/iOS)</li>
                                <li>TalkBack (Android)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <TypographyH2>Known Issues & Feedback</TypographyH2>
                    <TypographyP>
                       We are actively working to address limitations with some third-party chart libraries and complex formula explanations.
                    </TypographyP>
                    <TypographyP>
                        If you encounter accessibility barriers, please contact us at <a href="mailto:accessibility@docket.one">accessibility@docket.one</a>. We aim to respond to accessibility inquiries within 3 business days.
                    </TypographyP>
                </section>
            </div>
        </div>
    </main>
  )
}
