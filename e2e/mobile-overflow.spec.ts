import { test, expect } from '@playwright/test'
import { calculatorRoutes } from './routes'
import { auditOverflow, type Overflow } from './overflow'

/**
 * Every calculator at 375px, in its initial state AND after selecting each
 * option.
 *
 * The interaction pass is the point. cost-of-war looked fine on load and only
 * clipped once an expensive munition was selected — the figure went from
 * $200,000 to $82,500,000 and the layout had never been sized for the long
 * one. A load-only check would have passed it.
 */
const MOBILE = { width: 375, height: 812 }

const SKIP_LABEL = /share|copy|download|tweet|close|dismiss|accept|reject/i

function report(where: string, findings: Overflow[]) {
  return (
    `\n  ${where}\n` +
    findings
      .map(
        f =>
          `    [${f.kind}] ${f.selector} — over by ${f.overflowBy}px` +
          ` (${f.width}px box, ${f.scrollWidth}px content, min-width:${f.minWidth})\n` +
          `      "${f.text}"`,
      )
      .join('\n')
  )
}

test.use({ viewport: MOBILE })

test.describe('mobile overflow @375px', () => {
  for (const c of calculatorRoutes()) {
    test(`${c.category}/${c.slug}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
      await page.goto(c.path, { waitUntil: 'networkidle' })
      await page.locator('.almanac-screen *').first().waitFor({ timeout: 15_000 })

      const problems: string[] = []

      const onLoad = await page.evaluate(auditOverflow, '.almanac-screen')
      if (onLoad.length) problems.push(report('on load', onLoad))

      // Click through the widget's options. Capped so a widget with a long
      // list does not dominate the run; the cap is reported, never silent.
      const buttons = page.locator('.almanac-screen button')
      const total = await buttons.count()
      const CAP = 8
      const toClick = Math.min(total, CAP)

      for (let i = 0; i < toClick; i++) {
        const btn = buttons.nth(i)
        const label = ((await btn.textContent()) || '').trim()
        if (SKIP_LABEL.test(label)) continue
        if (!(await btn.isVisible()) || !(await btn.isEnabled())) continue

        await btn.click({ timeout: 5000 }).catch(() => {})
        // let any enter/exit animation settle before measuring
        await page.waitForTimeout(450)

        const after = await page.evaluate(auditOverflow, '.almanac-screen')
        if (after.length) problems.push(report(`after clicking "${label.slice(0, 40)}"`, after))
      }

      if (total > CAP) {
        console.log(`  note: ${c.slug} has ${total} buttons, only the first ${CAP} were exercised`)
      }

      expect(problems.join('\n'), problems.join('\n')).toBe('')
    })
  }
})
