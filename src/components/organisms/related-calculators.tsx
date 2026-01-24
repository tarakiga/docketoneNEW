"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculators } from "@/data/calculators"
import Link from "next/link"

const CATEGORY_STYLES: Record<string, { color: string, border: string }> = {
  "bigkidmath": {
    color: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/50"
  },
  "cipherlab": {
    color: "from-green-500/20 to-emerald-500/20",
    border: "group-hover:border-green-500/50"
  },
  "geekgalaxy": {
    color: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50"
  },
  "lifehacks": {
    color: "from-yellow-500/20 to-orange-500/20",
    border: "group-hover:border-yellow-500/50"
  },
  "mathmagik": {
    color: "from-indigo-500/20 to-violet-500/20",
    border: "group-hover:border-indigo-500/50"
  },
  "otakuops": {
    color: "from-red-500/20 to-rose-500/20",
    border: "group-hover:border-red-500/50"
  }
}

interface RelatedCalculatorsProps {
  currentCategory: string
  currentSlug: string
}

export function RelatedCalculators({ currentCategory, currentSlug }: RelatedCalculatorsProps) {
  const related = calculators
    .filter(calc => calc.category === currentCategory && calc.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  const style = CATEGORY_STYLES[currentCategory] || CATEGORY_STYLES["bigkidmath"]

  return (
    <section className="py-24 border-t border-white/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">More from {currentCategory}</h2>
                <p className="text-muted-foreground">Continue your journey through the {currentCategory} world.</p>
            </div>
            <Link 
                href={`/calculators/${currentCategory}`}
                className="text-primary font-medium hover:underline flex items-center gap-2"
            >
                View Category Archive →
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((calc) => (
            <Link key={calc.slug} href={`/calculators/${calc.category}/${calc.slug}`} className="group no-underline">
              <Card className={`h-full white-glass-card hover:bg-white/90 transition-all duration-500 relative overflow-hidden flex flex-col`}>
                {/* Decorative Blob */}
                <div className={`absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br ${style.color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                <CardHeader className="relative pb-2 z-10">
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">{calc.icon || "🧮"}</span>
                  </div>
                  <CardTitle className="text-lg text-slate-900 group-hover:text-primary transition-colors">{calc.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 flex-1 flex flex-col">
                  <CardDescription className="text-sm text-slate-600 line-clamp-2 flex-1">
                    {calc.description}
                  </CardDescription>
                  <div className="mt-4 text-primary font-bold text-xs flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Access Interstellar Tool →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
