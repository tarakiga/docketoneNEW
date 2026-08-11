/**
 * Read a --dk-* design token at runtime.
 *
 * Canvas colour sinks (ctx.fillStyle, ctx.strokeStyle, gradient stops) are
 * plain strings handed to the 2D context, not CSS — `var(--dk-ink)` there is
 * silently ignored and the shape renders transparent black. Anything drawn to a
 * canvas has to resolve the token itself, which is what this does.
 *
 * Pass the canvas (or any element inside .almanac) so the value picks up the
 * active theme and any category accent scoped above it.
 */
export function token(name: string, el?: Element | null, fallback = '#17161A'): string {
  if (typeof window === 'undefined') return fallback
  const target = el ?? document.documentElement
  const value = getComputedStyle(target).getPropertyValue(name).trim()
  return value || fallback
}
