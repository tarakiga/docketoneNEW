import { MarkdownRenderer } from "@/components/molecules/markdown-renderer"
import { CalculatorLayout } from "@/components/templates/calculator-layout"
import { Calculator } from "@/data/calculators"
import React from "react"

interface RichCalculatorPageProps {
  calculator: Calculator
  children: React.ReactNode
}

export function RichCalculatorPage({ calculator, children }: RichCalculatorPageProps) {
  
  // Decide what to render as the main article content
  const articleContent = calculator.content ? (
    <MarkdownRenderer content={calculator.content} />
  ) : null

  // Fallback tips and FAQ if not present in data (to avoid empty sections)
  // Although the goal is to MOVE these to data, we keep fallbacks for now.
  const tips = calculator.tips || []
  const faq = calculator.faq || []

  return (
    <CalculatorLayout
      title={calculator.title}
      description={calculator.description}
      slug={calculator.slug}
      category={calculator.category}
      origin={calculator.origin}
      howTo={calculator.howTo}
      tips={tips}
      faq={faq}
      articleContent={articleContent}
    >
      {children}
    </CalculatorLayout>
  )
}
