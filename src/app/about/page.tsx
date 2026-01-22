import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography"

export const metadata = {
  title: "About Us | Docket One",
  description: "Learn about the mission and team behind Docket One, the place for fun, practical calculators for modern life.",
}

export default function AboutPage() {
  return (
    <main className="flex-1 bg-background relative selection:bg-primary/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />
      
      <div className="container py-16 md:py-24 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <TypographyH1 className="text-gradient">About Docket One</TypographyH1>
          <TypographyP className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We build smart, fun, and practical calculators for modern life's many questions.
          </TypographyP>
        </div>

        {/* Content Cards */}
        <div className="grid gap-8">
          <section className="glass-card p-8 rounded-xl border-white/10 space-y-6">
            <TypographyH2>Our Mission</TypographyH2>
            <TypographyP>
              In a world full of data, we believe that the right tools can make all the difference. Our mission is to provide calculators that are not only functional but also fun and engaging. We want to help you make smarter decisions, whether you're figuring out the true cost of car ownership, planning for a zombie apocalypse, or just trying to understand your caffeine intake.
            </TypographyP>
            <TypographyP>
              We're committed to creating high-quality, well-researched, and easy-to-use tools that are accessible to everyone. We believe that "adulting" is hard enough, and our calculators are here to make it a little bit easier (and more entertaining).
            </TypographyP>
          </section>

          <section className="glass-card p-8 rounded-xl border-white/10 space-y-6">
            <TypographyH2>Our Story</TypographyH2>
            <TypographyP>
              Docket One started as a small passion project by a group of friends who were tired of using boring, generic calculators. We wanted to create tools that were tailored to the unique challenges and interests of modern life. From late-night coding sessions fueled by coffee to lively debates about the probability of alien communication, we've poured our hearts and minds into creating a collection of calculators that we're proud of.
            </TypographyP>
            <TypographyP>
              Our goal is to continue to grow our library of calculators, always keeping our focus on quality, accuracy, and a great user experience. We're excited to have you on this journey with us!
            </TypographyP>
          </section>
        </div>
      </div>
    </main>
  )
}
