"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const CATEGORIES = [
  {
    id: "bigkidmath",
    name: "Big Kid Math",
    icon: "🧠",
    description: "Real adulting decisions focused calculators.",
    tagline: "Adult Life Tools",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/50"
  },
  {
    id: "cipherlab",
    name: "Cipher Lab",
    icon: "🔐",
    description: "Tools for encryption, codes, and digital security.",
    tagline: "Codes & Security",
    color: "from-green-500/20 to-emerald-500/20",
    border: "group-hover:border-green-500/50"
  },
  {
    id: "geekgalaxy",
    name: "Geek Galaxy",
    icon: "🧛",
    description: "Sci-fi scenarios and pop culture survival tools.",
    tagline: "Sci-Fi & Survival",
    color: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50"
  },
  {
    id: "lifehacks",
    name: "Life Hacks",
    icon: "🧬",
    description: "Optimization tools for everyday efficiency.",
    tagline: "Optimize Life",
    color: "from-yellow-500/20 to-orange-500/20",
    border: "group-hover:border-yellow-500/50"
  },
  {
    id: "mathmagik",
    name: "Math Magik",
    icon: "🔮",
    description: "Playful exploration of numbers and patterns.",
    tagline: "Fun with Numbers",
    color: "from-indigo-500/20 to-violet-500/20",
    border: "group-hover:border-indigo-500/50"
  },
  {
    id: "otakuops",
    name: "Otaku Ops",
    icon: "🐱‍👤",
    description: "Calculators for anime, manga, and gaming fans.",
    tagline: "Anime & Gaming",
    color: "from-red-500/20 to-rose-500/20",
    border: "group-hover:border-red-500/50"
  }
]

export function CategoryGrid() {
  return (
    <section id="categories" className="py-24 container">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
          Six Worlds of Calculation
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each category designed for different aspects of modern life, from practical adulting to pure entertainment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={`/calculators/${cat.id}`} className="group no-underline">
            <Card className={`h-full glass-card transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl border-white/10 ${cat.border} relative overflow-hidden`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                    <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                    <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm border-white/10">{cat.tagline}</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{cat.name}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base">
                  {cat.description}
                </CardDescription>
                <div className="mt-4 text-primary font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Explore Category →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
