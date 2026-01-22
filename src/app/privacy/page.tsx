import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyP } from "@/components/ui/typography"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Docket One",
  description: "Docket One Privacy Policy - Learn how we protect your privacy and handle your data.",
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/5 via-background to-background" />

        <div className="container py-16 md:py-24 max-w-4xl mx-auto">
            <header className="mb-12 text-center text-muted-foreground">
                <TypographyH1 className="text-foreground text-gradient mb-4">Privacy Policy</TypographyH1>
                <p>Effective Date: December 15, 2024</p>
                <TypographyP className="max-w-2xl mx-auto mt-4">
                    Your privacy matters to us. We believe in transparency—here's exactly how we protect your data.
                </TypographyP>
            </header>

            <div className="space-y-12 prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                
                {/* Highlights */}
                <section className="grid md:grid-cols-2 gap-6 not-prose">
                    <div className="glass-card p-6 rounded-xl border-white/10">
                        <TypographyH4 className="text-green-500 mb-4">✅ What We DO Collect</TypographyH4>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                            <li>Anonymous usage analytics (Google Analytics)</li>
                            <li>Basic technical info (Browser type, device)</li>
                            <li>General geographic region</li>
                            <li>Performance metrics</li>
                        </ul>
                    </div>
                    <div className="glass-card p-6 rounded-xl border-white/10">
                        <TypographyH4 className="text-red-500 mb-4">❌ What We DON'T Collect</TypographyH4>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                            <li>Your calculation inputs (processed locally)</li>
                            <li>Personal identifying information</li>
                            <li>Financial account details</li>
                            <li>Detailed location/GPS data</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <TypographyH2>Introduction</TypographyH2>
                    <TypographyP>
                        At Docket One ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit docket.one.
                    </TypographyP>
                </section>

                <section>
                    <TypographyH2>Information We Collect</TypographyH2>
                    <TypographyH3>1. Information You Provide Directly</TypographyH3>
                    <TypographyP>
                        <strong>Calculator Inputs:</strong> When you use our calculators, you input data locally. <strong>Important: All calculation data is processed locally in your browser and is never transmitted to our servers.</strong>
                    </TypographyP>
                    <TypographyP>
                        <strong>Communication:</strong> If you contact us via email, we collect your email address and message content to respond to you.
                    </TypographyP>

                    <TypographyH3>2. Information Collected Automatically</TypographyH3>
                    <TypographyP>
                        We use Google Analytics to collect anonymous, aggregated data about usage, such as popular pages, device types, and page load times. This helps us improve the Service. IP addresses are anonymized before processing.
                    </TypographyP>
                </section>

                <section>
                    <TypographyH2>Data Security</TypographyH2>
                    <TypographyP>
                        We implement industry-standard security measures including HTTPS encryption for all data transmission and secure server configurations. However, no method of transmission over the internet is 100% secure.
                    </TypographyP>
                </section>

                <section>
                    <TypographyH2>Cookies</TypographyH2>
                    <TypographyP>
                        We use cookies for analytics and site functionality. For detailed information, please see our <Link href="/cookies">Cookies Policy</Link>.
                    </TypographyP>
                </section>

                <section>
                    <TypographyH2>Your Rights</TypographyH2>
                    <TypographyP>
                        Depending on your location (CCPA for California, GDPR for EU/UK), you have rights regarding your data, including the right to know what we collect, request deletion, and opt-out of certain processing.
                    </TypographyP>
                    <TypographyP>
                        Contact us at <a href="mailto:privacy@docket.one">privacy@docket.one</a> to exercise these rights.
                    </TypographyP>
                </section>

                <section>
                    <TypographyH2>Contact Us</TypographyH2>
                    <TypographyP>
                        If you have questions about this Privacy Policy, please contact our Privacy Team at <a href="mailto:privacy@docket.one">privacy@docket.one</a>.
                    </TypographyP>
                </section>
            </div>
        </div>
    </main>
  )
}
