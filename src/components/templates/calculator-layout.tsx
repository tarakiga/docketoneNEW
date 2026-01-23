import { BackgroundBlobs } from "@/components/atoms/background-blobs"
import { RelatedCalculators } from "@/components/organisms/related-calculators"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { ReactNode } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface CalculatorLayoutProps {
  title: string
  description: string
  children: ReactNode
  understanding?: ReactNode
  origin?: string
  howTo?: string
  tips?: string[]
  faq: FAQItem[]
  slug: string
  category: string
}

export function CalculatorLayout({ title, description, children, understanding, origin, howTo, tips = [], faq, slug, category }: CalculatorLayoutProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://docket.one/${slug}`

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      <BackgroundBlobs />
      
      <div className="container py-8 space-y-12 relative z-10">
        {/* Premium Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <TypographyH1 className="text-slate-900 tracking-tighter">{title}</TypographyH1>
          <TypographyP className="text-xl text-slate-600 font-medium">{description}</TypographyP>
        </div>

        {/* Dynamic Content Sections */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Origin / Story Section */}
          {(origin || understanding) && (
            <section className="space-y-4 white-glass-card p-6 rounded-2xl flex flex-col group hover:shadow-primary/5 transition-all duration-500">
              <h2 className="text-xl font-bold tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2 text-slate-900">
                📜 The Origins
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed flex-1">
                  {origin ? <p>{origin}</p> : understanding}
              </div>
            </section>
          )}

          {/* How To Use Section */}
          {howTo && (
            <section className="space-y-4 white-glass-card p-6 rounded-2xl flex flex-col bg-white/95 group hover:shadow-primary/5 transition-all duration-500">
              <h2 className="text-xl font-bold tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2 text-slate-900">
                🚀 Master the Tool
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed flex-1">
                  <p>{howTo}</p>
              </div>
            </section>
          )}
        </div>

        {/* Calculator Content */}
        <div className="min-h-[400px]">
          {children}
        </div>

        {/* Tips Section */}
        {tips.length > 0 && (
          <section className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pro Tips</h2>
            <div className="grid sm:grid-cols-2 gap-6">
                {tips.map((tip, index) => (
                    <div key={index} className="p-5 rounded-2xl white-glass-card hover:bg-white transition-all duration-300 flex gap-4 group">
                        <span className="text-primary font-black text-lg opacity-40 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                        <span className="text-slate-600 text-sm font-medium pt-1">{tip}</span>
                    </div>
                ))}
            </div>
          </section>
        )}

        {/* FAQ Accordion */}
        <section className="space-y-6 max-w-4xl mx-auto pb-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">The Fine Print (FAQ)</h2>
          <Accordion type="single" collapsible className="w-full">
              {faq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-slate-200">
                      <AccordionTrigger className="text-left text-lg text-slate-900 hover:text-primary transition-colors py-6 font-bold">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed text-base pb-6">
                          {item.answer}
                      </AccordionContent>
                  </AccordionItem>
              ))}
          </Accordion>
        </section>

        <RelatedCalculators currentCategory={category} currentSlug={slug} />
      </div>
    </div>
  )
}
