import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculators } from "@/data/calculators"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function generateStaticParams() {
    const categories = Array.from(new Set(calculators.map(c => c.category)))
    return categories.map(category => ({ category }))
}

interface CategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params
    
    const categoryCalculators = calculators.filter(c => c.category === category)
    
    if (categoryCalculators.length === 0) {
        // or return empty state
         // notFound() 
         // Allow empty categories if defined in routing but no calculators yet?
    }

    const categoryName = category.replace(/_/g, ' ')

    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground hover:text-primary">
                    <Link href="/#categories">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                    </Link>
                </Button>
                <h1 className="text-4xl font-bold tracking-tight text-gradient mb-2">{categoryName}</h1>
                <p className="text-xl text-muted-foreground">
                    Explore our collection of {categoryName} tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCalculators.map(calc => (
                    <Link key={calc.id} href={`/calculators/${calc.category}/${calc.slug}`} className="no-underline group">
                        <Card className="h-full glass-card hover:shadow-xl transition-all duration-300 border-white/10 group-hover:border-primary/50 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl select-none pointer-events-none">
                                {calc.icon}
                             </div>
                             <CardHeader>
                                <div className="text-4xl mb-2">{calc.icon}</div>
                                <CardTitle className="group-hover:text-primary transition-colors">{calc.title}</CardTitle>
                             </CardHeader>
                             <CardContent>
                                <CardDescription>{calc.description}</CardDescription>
                             </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            
            {categoryCalculators.length === 0 && (
                <div className="text-center py-24 glass-card rounded-xl">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-xl font-bold">No calculators found</h3>
                    <p className="text-muted-foreground">We haven't added any tools to this category yet. Check back soon!</p>
                </div>
            )}
        </div>
    )
}
