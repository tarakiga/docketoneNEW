import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyP } from "@/components/ui/typography"

export const metadata = {
  title: "Terms of Service | Docket One",
  description: "Terms of Service for Docket One calculators. Learn about acceptable use, user responsibilities, and our service terms.",
}

export default function TermsPage() {
  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-background to-background" />

        <div className="container py-16 md:py-24 max-w-4xl mx-auto">
            <header className="mb-12 text-center text-muted-foreground">
                <TypographyH1 className="text-foreground text-gradient mb-4">Terms of Service</TypographyH1>
                <p>Effective Date: December 15, 2024</p>
            </header>

            <div className="space-y-12 prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                
                <section className="glass-card p-8 rounded-xl border-white/10">
                    <TypographyH2>Agreement to Terms</TypographyH2>
                    <TypographyP>
                        Welcome to Docket One. These Terms of Service ("Terms") govern your use of our website located at docket.one and our calculator services (collectively, the "Service") operated by Docket One ("we," "us," or "our").
                    </TypographyP>
                    <TypographyP>
                        <strong>By accessing or using our Service, you agree to be bound by these Terms.</strong> If you disagree with any part of these Terms, you may not access the Service.
                    </TypographyP>
                </section>

                <section className="space-y-6">
                    <TypographyH2>Description of Service</TypographyH2>
                    <TypographyH3>What We Provide</TypographyH3>
                    <TypographyP>Docket One offers a collection of specialized online calculators organized into themed categories.</TypographyP>
                    
                    <TypographyH3>How Our Calculators Work</TypographyH3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>All calculations are performed locally in your web browser</li>
                        <li>No data is transmitted to or stored on our servers</li>
                        <li>Results are generated in real-time based on your inputs</li>
                    </ul>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-lg my-6">
                        <TypographyH3 className="text-amber-500 mt-0">⚠️ Important: What We Don't Provide</TypographyH3>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                            <li>Professional advice (financial, legal, medical, etc.)</li>
                            <li>Guaranteed accuracy for real-world decision making</li>
                            <li>Data storage or account management</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-6">
                    <TypographyH2>Acceptable Use</TypographyH2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-lg">
                            <TypographyH4 className="text-green-500 mt-0">✅ You May Use Our Service To:</TypographyH4>
                            <ul className="list-disc pl-6 mt-4 space-y-2 text-sm text-muted-foreground">
                                <li>Calculate, explore, and learn</li>
                                <li>Teaching or learning activities</li>
                                <li>Inform business decisions (with disclaimers)</li>
                                <li>Share results and links</li>
                            </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-lg">
                            <TypographyH4 className="text-red-500 mt-0">❌ You May NOT Use Our Service To:</TypographyH4>
                            <ul className="list-disc pl-6 mt-4 space-y-2 text-sm text-muted-foreground">
                                <li>Illegal Activities</li>
                                <li>Create or promote offensive content</li>
                                <li>Disrupt or hack our Service</li>
                                <li>Redistribute our calculators commercially</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <TypographyH2>Intellectual Property</TypographyH2>
                    <TypographyP>Docket One and its licensors own all intellectual property rights in the Service, including calculator algorithms, design, code, and branding.</TypographyP>
                    <TypographyP>We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, educational, or professional purposes, provided you do not modify or copy our underlying code.</TypographyP>
                </section>

                <section className="space-y-6">
                    <TypographyH2>Disclaimers</TypographyH2>
                    <TypographyP>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee accuracy, completeness, or reliability.</TypographyP>
                </section>

                <section className="space-y-6">
                    <TypographyH2>Contact Information</TypographyH2>
                    <TypographyP>For questions about these Terms:</TypographyP>
                    <TypographyP>
                        <a href="mailto:legal@docket.one" className="text-primary hover:underline">legal@docket.one</a>
                    </TypographyP>
                </section>
            </div>
        </div>
    </main>
  )
}
