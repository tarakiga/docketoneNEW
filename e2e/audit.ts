/**
 * WCAG contrast audit, run inside the page.
 *
 * Two things here are easy to get wrong and were got wrong before:
 *
 * 1. Colour parsing. Tailwind v4 emits lab()/oklch(), so a regex that assumes
 *    rgb() reads those three numbers as RGB and produces nonsense. Painting to
 *    a 1x1 canvas makes the browser do the colour-space conversion instead.
 *
 * 2. Opacity. The colour that matters is the one after the element's own
 *    opacity (and its ancestors') has been composited over the real backdrop.
 *    Comparing a raw computed colour against a composited one invents failures
 *    that do not exist, and hides ones that do.
 */
export type Finding = {
  text: string
  ratio: number
  required: number
  /** raw computed colour, before opacity */
  color: string
  /** the backdrop it was composited over */
  background: string
  effectiveOpacity: number
  selector: string
}

export function auditContrast(scope: string): Finding[] {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!

  const toRGBA = (css: string): [number, number, number, number] => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#000'
    ctx.fillStyle = css
    ctx.globalCompositeOperation = 'copy'
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }

  const composite = (
    fg: [number, number, number, number],
    bg: [number, number, number, number],
  ): [number, number, number, number] =>
    fg[3] >= 1
      ? fg
      : [
          Math.round(fg[0] * fg[3] + bg[0] * (1 - fg[3])),
          Math.round(fg[1] * fg[3] + bg[1] * (1 - fg[3])),
          Math.round(fg[2] * fg[3] + bg[2] * (1 - fg[3])),
          1,
        ]

  const channel = (v: number) => {
    v /= 255
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const luminance = (c: number[]) =>
    0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2])
  const ratio = (a: number[], b: number[]) => {
    const [l1, l2] = [luminance(a), luminance(b)]
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  const effectiveOpacity = (el: Element) => {
    let o = 1
    let n: Element | null = el
    while (n && n !== document.documentElement) {
      o *= parseFloat(getComputedStyle(n).opacity)
      n = n.parentElement
    }
    return o
  }

  const pageBg = toRGBA(getComputedStyle(document.body).backgroundColor)

  // Walk up compositing translucent layers until an opaque one is reached.
  const backdropOf = (el: Element): [number, number, number, number] => {
    const stack: [number, number, number, number][] = []
    let n: Element | null = el
    while (n && n !== document.documentElement) {
      const c = toRGBA(getComputedStyle(n).backgroundColor)
      if (c[3] > 0) {
        stack.push(c)
        if (c[3] >= 1) break
      }
      n = n.parentElement
    }
    let acc = stack.length && stack[stack.length - 1][3] >= 1 ? stack.pop()! : pageBg
    while (stack.length) acc = composite(stack.pop()!, acc)
    return acc
  }

  const describe = (el: Element) => {
    const cls = (el.className || '').toString().trim().split(/\s+/).slice(0, 2).join('.')
    return cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase()
  }

  const findings: Finding[] = []

  document.querySelectorAll(`${scope} *`).forEach(el => {
    const text = el.textContent?.trim()
    if (!text) return
    // only elements owning a text node, so a wrapper is not blamed for its child
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent?.trim())) return

    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none') return
    if (el.closest('[aria-hidden="true"]')) return

    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    // outlined display type is defined by its stroke, not its fill
    if (parseFloat(s.webkitTextStrokeWidth) > 0) return

    const op = effectiveOpacity(el)
    if (op === 0) return

    const raw = toRGBA(s.color)
    const bg = backdropOf(el)
    const fg = composite([raw[0], raw[1], raw[2], raw[3] * op], bg)

    const size = parseFloat(s.fontSize)
    const bold = parseInt(s.fontWeight) >= 700
    const isLarge = size >= 24 || (size >= 18.66 && bold)
    const required = isLarge ? 3 : 4.5

    const r = ratio(fg, bg)
    if (r < required) {
      findings.push({
        text: text.replace(/\s+/g, ' ').slice(0, 40),
        ratio: Math.round(r * 100) / 100,
        required,
        color: s.color,
        background: `rgb(${bg.slice(0, 3).join(', ')})`,
        effectiveOpacity: Math.round(op * 100) / 100,
        selector: describe(el),
      })
    }
  })

  return findings
}
