import { CALCULATOR_COMPONENTS } from "@/components/calculators/registry"
import { RichCalculatorPage } from "@/components/templates/rich-calculator-page"
import { calculators, isIndexable } from "@/data/calculators"
import { Metadata } from "next"
import { notFound } from "next/navigation"

const NotFoundComponent = () => <div>Calculator Component Not Found</div>

// Emulate static generation for known paths (required for 'export')
export function generateStaticParams() {
   return calculators.map(calc => ({
       category: calc.category,
       slug: calc.slug
   }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category, slug } = await params
    const calculatorData = calculators.find(c => c.slug === slug && c.category.toLowerCase() === category.toLowerCase())
    
    if (!calculatorData) return {}

    return {
        title: calculatorData.title,
        description: calculatorData.description,
        keywords: calculatorData.tags?.join(', '),
        openGraph: {
            title: `${calculatorData.title} | Docket One`,
            description: calculatorData.description,
            type: 'website',
            url: `https://docket.one/calculators/${category}/${slug}/`,
            siteName: 'Docket One',
        },
        alternates: {
            canonical: `https://docket.one/calculators/${category}/${slug}/`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${calculatorData.title} | Docket One`,
            description: calculatorData.description,
        },
        ...(isIndexable(calculatorData)
            ? {}
            : { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }),
    }
}

interface PageProps {
    params: Promise<{
        category: string
        slug: string
    }>
}

export default async function CalculatorPage({ params }: PageProps) {
    const { category, slug } = await params
    
    const calculatorData = calculators.find(c => c.slug === slug && c.category.toLowerCase() === category.toLowerCase())
    
    if (!calculatorData) {
        notFound()
    }

    const Component = CALCULATOR_COMPONENTS[slug] || NotFoundComponent

    return (
        <RichCalculatorPage calculator={calculatorData}>
            <Component />
        </RichCalculatorPage>
    )
}
