import { TypographyH1, TypographyH2, TypographyH3, TypographyP } from "@/components/ui/typography"

export const metadata = {
  title: "Cookies Policy | Docket One",
  description: "Information about how Docket One uses cookies.",
}

export default function CookiesPage() {
  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/5 via-background to-background" />

        <div className="container py-16 md:py-24 max-w-4xl mx-auto">
            <header className="mb-12 text-center text-muted-foreground">
                <TypographyH1 className="text-foreground text-gradient mb-4">Cookies Policy</TypographyH1>
                <p>Effective Date: December 15, 2024</p>
            </header>

            <div className="space-y-12 prose prose-invert max-w-none">
                <section>
                    <TypographyP>
                        This section explains how Docket One ("we," "our," or "us") uses cookies and similar tracking technologies on our website.
                    </TypographyP>
                    <TypographyH2>What are Cookies?</TypographyH2>
                    <TypographyP>
                        Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide unique functionality.
                    </TypographyP>
                </section>

                <section>
                    <TypographyH2>Types of Cookies We Use</TypographyH2>
                    
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-xl border-white/10">
                            <TypographyH3>Analytics Cookies (Google Analytics)</TypographyH3>
                            <TypographyP>
                                We use these to understand how our Service is used. They collect anonymous info like popular pages, device types, and session duration. This data is anonymized.
                            </TypographyP>
                        </div>

                        <div className="glass-card p-6 rounded-xl border-white/10">
                            <TypographyH3>Advertising Cookies</TypographyH3>
                            <TypographyP>
                                Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. This enables them to provide relevant ads to you.
                            </TypographyP>
                        </div>
                    </div>
                </section>

                <section>
                    <TypographyH2>Your Choices</TypographyH2>
                    <TypographyP>You have control over your cookie settings:</TypographyP>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Browser Settings:</strong> You can block or delete cookies through your browser preferences.</li>
                        <li><strong>Google Analytics Opt-Out:</strong> Use the official browser add-on to prevent your data from being used by Google Analytics.</li>
                        <li><strong>Ad Personalization:</strong> Visit Google's Ad Settings to opt out of personalized advertising.</li>
                    </ul>
                </section>
            </div>
        </div>
    </main>
  )
}
