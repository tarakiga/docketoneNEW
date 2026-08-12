import { test, expect } from '@playwright/test'
import { auditContrast, type Finding } from './audit'
import { calculatorRoutes } from './routes'

/**
 * Every calculator, both themes, checked for WCAG AA contrast.
 *
 * Routes come from the built output rather than the source data, so this tests
 * exactly what ships — including the fact that a route was generated at all.
 *
 * The theme is applied with addInitScript, which runs BEFORE the page's own
 * theme-init script. Setting it after load is what produced half-updated
 * computed styles in earlier attempts at this.
 */
const CALCULATORS = calculatorRoutes()

const PAGES = [
  { name: 'home', path: '/', scope: '.almanac' },
  { name: 'category:lifehacks', path: '/calculators/lifehacks/', scope: '.almanac' },
]

const THEMES = ['light', 'dark'] as const

function report(findings: Finding[]) {
  return findings
    .map(f => `      ${f.selector} "${f.text}" — ${f.ratio}:1 (needs ${f.required}:1)\n` +
              `        colour ${f.color} @ opacity ${f.effectiveOpacity} on ${f.background}`)
    .join('\n')
}

test.describe('contrast', () => {
  test('the build produced calculator routes', () => {
    expect(CALCULATORS.length, 'no routes found in out/ — run `npm run build` first').toBeGreaterThan(0)
  })

  for (const theme of THEMES) {
    for (const page_ of PAGES) {
      test(`${page_.name} [${theme}]`, async ({ page }) => {
        // Both paths must agree: theme-init reads localStorage first, but falls
        // back to prefers-color-scheme. Emulating the media query too makes the
        // applied theme deterministic instead of racy.
        await page.emulateMedia({ colorScheme: theme })
        await page.addInitScript(t => localStorage.setItem('theme', t), theme)
        await page.goto(page_.path, { waitUntil: 'networkidle' })
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        const findings = await page.evaluate(auditContrast, page_.scope)
        expect(findings, `\n${report(findings)}\n`).toEqual([])
      })
    }

    for (const c of CALCULATORS) {
      test(`${c.category}/${c.slug} [${theme}]`, async ({ page }) => {
        // Both paths must agree: theme-init reads localStorage first, but falls
        // back to prefers-color-scheme. Emulating the media query too makes the
        // applied theme deterministic instead of racy.
        await page.emulateMedia({ colorScheme: theme })
        await page.addInitScript(t => localStorage.setItem('theme', t), theme)
        await page.goto(c.path, { waitUntil: 'networkidle' })
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        // the widget renders client-side; wait for it rather than guessing a delay
        await page.locator('.almanac-screen *').first().waitFor({ timeout: 15_000 })
        const findings = await page.evaluate(auditContrast, '.almanac-screen')
        expect(findings, `\n${report(findings)}\n`).toEqual([])
      })
    }
  }
})
