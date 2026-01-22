import { calculators } from "@/data/calculators"
import { MetadataRoute } from "next"

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://docket.one'

    // Static pages
    const routes = [
        '',
        '/about',
        '/contact',
        '/help',
        '/support',
        '/bug-report',
        '/request',
        '/accessibility',
        '/privacy',
        '/terms',
        '/cookies',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Calculator pages
    const calculatorRoutes = calculators.map((calc) => ({
        url: `${baseUrl}/calculators/${calc.category}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Category pages
    const categories = Array.from(new Set(calculators.map(c => c.category)))
    const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/calculators/${cat}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...categoryRoutes, ...calculatorRoutes]
}
