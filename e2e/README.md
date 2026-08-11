# Contrast sweep

WCAG AA contrast across every calculator, both themes.

```bash
npm run build          # the spec tests out/, not the dev server
npm run test:contrast
```

133 tests, ~3 minutes. Each failure prints the element, its ratio, the raw
colour, the effective opacity and the backdrop it sits on — enough to fix
without re-diagnosing.

## Why it exists

This replaces hand-auditing through a browser session, which failed three
separate ways: results silently mixed light and dark, setting `data-theme`
after load returned half-updated computed styles, and readings varied with
viewport. Those are structural problems with driving QA interactively. The
spec avoids all three:

- theme is set via `addInitScript`, **before** the page's own theme-init runs
- real navigations, so computed styles are settled
- fixed 1280x900 viewport, because contrast results are viewport-dependent

Two details in `audit.ts` are easy to get wrong and were got wrong before:

1. **Colour parsing.** Tailwind v4 emits `lab()`/`oklch()`. A regex that
   assumes `rgb()` reads those three numbers as RGB and produces nonsense.
   Painting to a 1x1 canvas makes the browser do the conversion.
2. **Opacity.** What matters is the colour after the element's own opacity
   (and its ancestors') is composited over the real backdrop. Comparing a raw
   computed colour against a composited one invents failures and hides real
   ones.

## Pending — 29 failing pages

Last run: **102 pass, 31 fail**. The failures are consistent per page across
runs, which is the signature of real defects rather than flakiness.

### Failing in BOTH themes (12) — start here

| Category | Tool |
|---|---|
| bigkidmath | `caffeine-half-life`, `cost-of-war` |
| cipherlab | `caesar-cipher`, `morse-code`, `nato-phonetic`, `ogham-translator` |
| geekgalaxy | `ai-doomsday`, `beskar-armor`, `data-weight`, `potion-brewer`, `space-travel` |
| otakuops | `anime-training` |

**Start with cipherlab.** Four of its eight tools fail together, which through
this whole redesign has meant one shared cause rather than four bugs. Every
clustered failure so far traced back to a single root:

- three separate bugs came from a `.dark` class the site never applies
  (the shadcn token block, the footer background, the `dark:` utility variant)
- one from a token doing two jobs (`--accent` as both fill and text)
- one from a colour the codemod could not see (a hex inside a `hover:` prefix)

### Failing in light only (17)

The above plus `decibel-detective`, `pizza-pi`, `superhero-insurance`,
`zombie-survival`, `coffee-code`, and others — see a full run for the list.

### Known harness issue

A minority of failures surface as a `data-theme` assertion timeout rather than
a contrast result. Worth settling so every failure reports the same way, but it
is not masking the list above — those pages fail on contrast when run
individually.

## Scope note

`.almanac-screen` only. Page chrome (nav, footer, prose, hero) is covered by
the `home` and `category` tests, which pass in both themes.
