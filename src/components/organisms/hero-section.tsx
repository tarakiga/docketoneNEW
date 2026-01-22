import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background -z-10" />
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                🎯 Calculators That Actually Matter
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
                Calculate, <span className="text-gradient">Don't Guess</span>
            </h1>
            
            <p className="max-w-[700px] text-lg text-muted-foreground mx-auto">
                From the true cost of car ownership to the odds of surviving a zombie apocalypse. 
                We build smart, free online calculators for life's practical and playful questions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-lg" asChild>
                    <Link href="#categories">
                        Explore Calculators <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg glass" asChild>
                    <Link href="#universal">
                        Quick Converter
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 text-sm font-medium text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-foreground">30+</span>
                    <span>Fun Calculators</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-foreground">6</span>
                    <span>Themed Categories</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-foreground">100%</span>
                    <span>Free Forever</span>
                </div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-foreground">24/7</span>
                    <span>No Downtime</span>
                </div>
            </div>
        </div>
    </section>
  )
}
