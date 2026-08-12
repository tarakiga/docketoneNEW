import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(__dirname, '..', 'out', 'calculators')

export type Route = { category: string; slug: string; path: string }

/**
 * Routes come from the built output rather than the source data, so the specs
 * test exactly what ships — including whether a route was generated at all.
 */
export function calculatorRoutes(): Route[] {
  if (!existsSync(OUT)) return []
  return readdirSync(OUT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .flatMap(cat =>
      readdirSync(join(OUT, cat.name), { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('__next'))
        .map(slug => ({
          category: cat.name,
          slug: slug.name,
          path: `/calculators/${cat.name}/${slug.name}/`,
        })),
    )
}
