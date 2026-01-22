import { CALCULATOR_COMPONENTS } from "@/components/calculators/registry"
import { CalculatorLayout } from "@/components/templates/calculator-layout"
import { calculators } from "@/data/calculators"
import { notFound } from "next/navigation"

// Emulate static generation for known paths (optional but good for 'export')
export function generateStaticParams() {
   return calculators.map(calc => ({
       category: calc.category,
       slug: calc.slug
   }))
}

interface PageProps {
    params: Promise<{
        category: string
        slug: string
    }>
}

export default async function CalculatorPage({ params }: PageProps) {
    // Await params in Next.js 15
    const { category, slug } = await params
    
    const calculatorData = calculators.find(c => c.slug === slug && c.category === category)
    
    if (!calculatorData) {
        notFound()
    }

    const Component = CALCULATOR_COMPONENTS[slug] || (() => <div>Calculator Component Not Found</div>)

    // Placeholder content for Layout props - In a real app, this should come from a CMS or separate data file per calculator
    const tips = [
        "Experiment with different values to see how they affect the result.",
        "Bookmark this page for quick access.",
        "Share your results with friends!"
    ]
    
    const faq = [
        { question: "Is this accurate?", answer: "We use standard scientific formulas, but individual results may vary." },
        { question: "Is my data saved?", answer: "No, all calculations happen in your browser. We don't store your personal data." }
    ]

    return (
        <CalculatorLayout 
            title={calculatorData.title}
            description={calculatorData.description}
            slug={calculatorData.slug}
            understanding={<p>This calculator helps you understand {calculatorData.title.toLowerCase()} using standard models.</p>}
            tips={tips}
            faq={faq}
        >
            <Component />
        </CalculatorLayout>
    )
}
