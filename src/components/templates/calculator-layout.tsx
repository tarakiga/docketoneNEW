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
  understanding: ReactNode
  tips: string[]
  faq: FAQItem[]
  slug: string
}

export function CalculatorLayout({ title, description, children, understanding, tips, faq, slug }: CalculatorLayoutProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://docket.one/${slug}`

  return (
    <div className="container py-8 space-y-12">
      {/* Premium Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <TypographyH1>{title}</TypographyH1>
        <TypographyP className="text-xl text-muted-foreground">{description}</TypographyP>
      </div>

      {/* Calculator Content */}
      <div className="min-h-[400px]">
        {children}
      </div>

      {/* Understanding Section */}
      <section className="space-y-6 max-w-4xl mx-auto glass-card p-8 rounded-xl border-white/10">
        <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">Understanding {title}</h2>
        <div className="prose prose-invert max-w-none text-muted-foreground">
            {understanding}
        </div>
      </section>

      {/* Tips Section */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight">Tips & Tricks</h2>
        <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
                <div key={index} className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors">
                    <span className="text-primary font-bold mr-2">Tip {index + 1}:</span>
                    <span className="text-muted-foreground">{tip}</span>
                </div>
            ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
            {faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-left text-lg hover:text-primary transition-colors">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </section>
    </div>
  )
}
