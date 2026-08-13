/**
 * Horizontal overflow audit, run inside the page.
 *
 * Two distinct failures, both of which have shipped before:
 *
 *  - `clipped`  an element is wider than its own content box, so a container
 *               with overflow:hidden cuts it off. This is the one that is easy
 *               to miss, because the page itself does not scroll sideways — it
 *               just silently trims. Almost always a grid or flex item
 *               defaulting to min-width:auto, where the widest child sets the
 *               track and refuses to shrink.
 *  - `pastViewport` an element extends beyond the viewport edge, which usually
 *               shows up as a horizontally scrolling page.
 */
export type Overflow = {
  kind: 'clipped' | 'pastViewport'
  selector: string
  text: string
  width: number
  scrollWidth: number
  overflowBy: number
  minWidth: string
}

export function auditOverflow(scope: string): Overflow[] {
  const vw = document.documentElement.clientWidth
  const found: Overflow[] = []

  const describe = (el: Element) => {
    const cls = (el.className || '').toString().trim().split(/\s+/).slice(0, 3).join('.')
    return cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase()
  }

  document.querySelectorAll(`${scope} *`).forEach(el => {
    // scrollWidth/clientWidth are not meaningful inside SVG — chart tick labels
    // report scrollWidth === width and read as permanently clipped. The chart's
    // own container is still checked, which is what actually matters.
    if (el instanceof SVGElement) return

    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return

    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none') return
    // deliberately scrollable regions are not defects
    if (s.overflowX === 'auto' || s.overflowX === 'scroll') return
    // An element that declares its own overflow:hidden has opted into clipping
    // — decorative blur meshes, masked art, deliberate crops. The defect this
    // audit is after is the opposite: content overflowing an element that never
    // asked to clip, which some *ancestor* then trims.
    if (s.overflowX === 'hidden' || s.overflowX === 'clip') return
    // `truncate` clips on purpose and shows an ellipsis, so scrollWidth always
    // exceeds clientWidth. That is a design decision, not a layout failure —
    // whether the truncation is *appropriate* is a separate judgement.
    if (s.textOverflow === 'ellipsis') return

    const base = {
      selector: describe(el),
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 32),
      width: Math.round(r.width),
      scrollWidth: el.scrollWidth,
      minWidth: s.minWidth,
    }

    const clipped = el.scrollWidth - el.clientWidth
    if (clipped > 1) found.push({ ...base, kind: 'clipped', overflowBy: clipped })

    const past = Math.round(r.right - vw)
    if (past > 1) found.push({ ...base, kind: 'pastViewport', overflowBy: past })
  })

  return found
}

/**
 * Buttons that change what the widget displays. Share/copy controls open
 * modals or write to the clipboard, so they are skipped.
 */
export function optionButtons(scope: string): number {
  return document.querySelectorAll(
    `${scope} button:not([aria-haspopup]):not([data-skip-overflow])`,
  ).length
}
