/**
 * Generates the favicon and Open Graph image from the brand logo.
 *
 * The source logo is not a vector — it is a bitmap wrapped in an SVG container
 * (two base64 <image> tags, ~800KB, 1954x2048 portrait). So it cannot be
 * dropped straight in: a favicon has to be square and an OG card has to be
 * 1200x630 landscape. This extracts the raster, restores its alpha, and
 * composes the real assets.
 *
 * Run:  npm run brand:assets      (or pass a path to use a different logo)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = process.argv[2] ?? join(process.cwd(), 'brand', 'docketOneLogo.svg')
const APP = join(process.cwd(), 'src', 'app')

// Saturday Morning ground, so the marks sit on brand rather than white.
const YELLOW = { r: 0xff, g: 0xd9, b: 0x3b, alpha: 1 }
const INK = '#17161A'

const svg = readFileSync(SRC, 'utf8')
const embedded = [...svg.matchAll(/href="data:image\/([a-z]+);base64,([^"]+)"/gi)]
if (!embedded.length) throw new Error('no embedded raster found in ' + SRC)

/**
 * The exporter does not store transparency in the PNG. It emits two rasters of
 * identical size — a 3-channel RGB colour layer, and a 1-channel greyscale
 * layer referenced by an SVG <mask> — and lets the renderer combine them.
 * Taking the larger file gives you the colour layer with an opaque ground
 * (which rendered as a black box). The alpha has to be joined back on.
 */
const rasters = await Promise.all(
  embedded.map(async m => {
    const buf = Buffer.from(m[2], 'base64')
    const meta = await sharp(buf).metadata()
    return { buf, meta }
  }),
)

const colour = rasters.find(r => r.meta.channels >= 3)
const mask = rasters.find(r => r.meta.channels === 1)
if (!colour) throw new Error('no colour raster found')

let logo
if (mask && mask.meta.width === colour.meta.width && mask.meta.height === colour.meta.height) {
  logo = await sharp(colour.buf).joinChannel(mask.buf).png().toBuffer()
  console.log(`combined ${colour.meta.width}x${colour.meta.height} colour + greyscale mask -> RGBA`)
} else {
  logo = colour.buf
  console.warn('WARNING: no matching mask found; logo will keep its opaque ground')
}

const meta = await sharp(logo).metadata()
const stats = await sharp(logo).stats()
console.log(`logo: ${meta.width}x${meta.height} ch=${meta.channels} opaque=${stats.isOpaque}`)
if (stats.isOpaque) console.warn('WARNING: logo is still opaque — it will render as a solid block')

const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 }

// The logo has a transparent ground, so it sits directly on the brand yellow
// rather than needing a tile behind it.
async function square(size, pad) {
  const inner = Math.round(size * (1 - pad * 2))
  const scaled = await sharp(logo)
    .resize(inner, inner, { fit: 'contain', background: CLEAR })
    .toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: YELLOW },
  })
    .composite([{ input: scaled, gravity: 'centre' }])
    .png()
    .toBuffer()
}

writeFileSync(join(APP, 'icon.png'), await square(512, 0.1))
writeFileSync(join(APP, 'apple-icon.png'), await square(180, 0.08))
console.log('wrote src/app/icon.png (512) and src/app/apple-icon.png (180)')

// ---- Open Graph: 1200x630, logo left, wordmark right ----
const OG_W = 1200
const OG_H = 630
const logoBox = 300
const logoX = 108
const logoY = Math.round((OG_H - logoBox) / 2)
const textX = 520

const ogLogo = await sharp(logo)
  .resize(logoBox, logoBox, { fit: 'contain', background: CLEAR })
  .toBuffer()

// Type is drawn as SVG rather than rasterised, so it stays crisp at whatever
// size a scraper renders the card. Sizes are set so the longest line (the
// tagline) clears the right edge — an earlier pass ran off the card.
const overlay = Buffer.from(`
<svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textX}" y="272" font-family="Verdana,DejaVu Sans,sans-serif" font-size="78" font-weight="bold" fill="${INK}">docket one</text>
  <text x="${textX}" y="330" font-family="Verdana,DejaVu Sans,sans-serif" font-size="27" fill="${INK}" opacity="0.8">65+ interactive visual calculators</text>
  <rect x="${textX}" y="368" width="260" height="8" rx="4" fill="${INK}"/>
  <text x="${textX}" y="428" font-family="Verdana,DejaVu Sans,sans-serif" font-size="25" fill="${INK}" opacity="0.62">free · no sign-up · shows its working</text>
</svg>`)

const og = await sharp({
  create: { width: OG_W, height: OG_H, channels: 4, background: YELLOW },
})
  .composite([
    { input: ogLogo, top: logoY, left: logoX },
    { input: overlay, top: 0, left: 0 },
  ])
  .png()
  .toBuffer()

writeFileSync(join(APP, 'opengraph-image.png'), og)
writeFileSync(join(APP, 'twitter-image.png'), og)
console.log(`wrote src/app/opengraph-image.png and twitter-image.png (${OG_W}x${OG_H}, ${og.length} bytes)`)
