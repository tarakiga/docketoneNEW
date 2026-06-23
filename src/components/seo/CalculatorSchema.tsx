import React from "react"

interface FAQItem {
  question: string
  answer: string
}

interface CalculatorSchemaProps {
  title: string
  description: string
  faq?: FAQItem[]
  slug: string
  category: string
}

export function CalculatorSchema({ title, description, faq = [], slug, category }: CalculatorSchemaProps) {
  // Construct absolute URL (assumes docket.one is the production domain)
  const absoluteUrl = `https://docket.one/calculators/${category}/${slug}/`

  const schema = {
    "@context": "https://schema.org",
    // We add WebApplication, Calculator, and FAQPage (if faqs exist) to maximize semantic relevance for AI engines.
    "@type": ["SoftwareApplication", "WebApplication", faq.length > 0 ? "FAQPage" : undefined].filter(Boolean),
    "name": title,
    "description": description,
    "url": absoluteUrl,
    "applicationCategory": "UtilitiesApplication, EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    // Adding the specific FAQ questions and answers is crucial for AEO (Answer Engine Optimization)
    ...(faq.length > 0 && {
        "mainEntity": faq.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
