/**
 * One accent per category, for the whole site.
 *
 * This used to be three near-identical maps — ACCENTS in calculator-layout.tsx,
 * ACCENTS again in app/calculators/[category]/page.tsx, and TILE in
 * category-grid.tsx — which drifted apart. They all read from here now.
 *
 * Values are --dk-* tokens rather than hex, so the palette flips with the theme
 * and a re-skin stays a single edit in globals.css.
 *
 *   fill  the saturated colour, for a filled chip or tile
 *   ink   the same hue darkened for AA contrast on a light surface — use for
 *         accent-coloured TEXT or hairlines, never `fill`
 *   on    text that sits ON `fill`; stays dark in both themes because the
 *         accent fills stay bright in both
 */
export type CategoryAccent = {
  fill: string
  ink: string
  on: string
  tint: string
}

export const CATEGORY_ACCENT: Record<string, CategoryAccent> = {
  bigkidmath: { fill: 'var(--dk-org)', ink: 'var(--dk-org-ink)', on: 'var(--dk-on-org)', tint: 'var(--dk-raised)' },
  cipherlab:  { fill: 'var(--dk-tea)', ink: 'var(--dk-tea-ink)', on: 'var(--dk-on-tea)', tint: 'var(--dk-raised)' },
  lifehacks:  { fill: 'var(--dk-lim)', ink: 'var(--dk-lim-ink)', on: 'var(--dk-on-lim)', tint: 'var(--dk-raised)' },
  mathmagik:  { fill: 'var(--dk-pur)', ink: 'var(--dk-pur-ink)', on: 'var(--dk-on-pur)', tint: 'var(--dk-raised)' },
  brainmodes: { fill: 'var(--dk-sky)', ink: 'var(--dk-sky-ink)', on: 'var(--dk-on-sky)', tint: 'var(--dk-raised)' },
  geekgalaxy: { fill: 'var(--dk-pnk)', ink: 'var(--dk-pnk-ink)', on: 'var(--dk-on-pnk)', tint: 'var(--dk-raised)' },
  // amber, not yellow: the page ground is yellow, so a --dk-yel tile would
  // disappear into it
  otakuops:   { fill: 'var(--dk-amb)', ink: 'var(--dk-amb-ink)', on: 'var(--dk-on-amb)', tint: 'var(--dk-raised)' },
}

export const DEFAULT_ACCENT: CategoryAccent = CATEGORY_ACCENT.bigkidmath

export function accentFor(categoryId: string): CategoryAccent {
  return CATEGORY_ACCENT[categoryId] ?? DEFAULT_ACCENT
}
