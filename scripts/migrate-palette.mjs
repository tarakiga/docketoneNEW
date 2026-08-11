/**
 * Arcade -> Saturday Morning palette migration.
 *
 * The arcade identity was hardcoded as 12 hex literals scattered across the
 * calculator widgets and a few chrome components. This rewrites them to the
 * --dk-* design tokens declared in globals.css, so a future re-skin is a token
 * edit rather than a 74-file sweep.
 *
 * It is PROPERTY-AWARE on purpose. Two hexes carry more than one semantic role:
 *
 *   #4a3f7a  324x as a background, 160x as a border. In the arcade palette both
 *            were the same purple; in Saturday Morning a surface is cream and a
 *            border is near-black ink. A flat swap would fill 160 borders with
 *            panel colour.
 *   #ffd23c  102x as text. Yellow text on cream fails WCAG badly, so accent-as-
 *            text resolves to a darkened --dk-*-ink token instead of the fill.
 *
 * Usage:  node scripts/migrate-palette.mjs [--dry]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, 'src');
const DRY = process.argv.includes('--dry');

// Files we rewrote by hand — the codemod must not touch them.
const SKIP = ['globals.css'];

/**
 * role -> token, per hex. `fill` means text/fill/stroke.
 * `on` is text that sits ON a bright accent chip; it must stay dark in BOTH
 * themes, because accent fills stay bright in both.
 */
const MAP = {
  '#160e33': { bg: '--dk-sunk',    border: '--dk-line',      fill: '--dk-on-fill',  shadow: '--dk-shadow' },
  '#1d1442': { bg: '--dk-surface', border: '--dk-line',      fill: '--dk-ink',      shadow: '--dk-shadow' },
  '#0c0824': { bg: '--dk-sunk',    border: '--dk-line',      fill: '--dk-on-fill',  shadow: '--dk-shadow' },
  '#241a52': { bg: '--dk-raised',  border: '--dk-line',      fill: '--dk-ink',      shadow: '--dk-shadow' },
  '#4a3f7a': { bg: '--dk-mute',    border: '--dk-line',      fill: '--dk-ink-soft', shadow: '--dk-shadow' },
  '#b3aae0': { bg: '--dk-mute',    border: '--dk-line-soft', fill: '--dk-ink-soft', shadow: '--dk-shadow-soft' },
  '#c9c2f0': { bg: '--dk-mute',    border: '--dk-line-soft', fill: '--dk-ink-soft', shadow: '--dk-shadow-soft' },
  '#ECEAE3': { bg: '--dk-surface', border: '--dk-line',      fill: '--dk-ink',      shadow: '--dk-shadow' },
  '#29e0ff': { bg: '--dk-tea',     border: '--dk-tea-ink',   fill: '--dk-tea-ink',  shadow: '--dk-tea' },
  '#ff3ca6': { bg: '--dk-pnk',     border: '--dk-pnk-ink',   fill: '--dk-pnk-ink',  shadow: '--dk-pnk' },
  '#b6ff3c': { bg: '--dk-lim',     border: '--dk-lim-ink',   fill: '--dk-lim-ink',  shadow: '--dk-lim' },
  '#ffd23c': { bg: '--dk-yel',     border: '--dk-yel-ink',   fill: '--dk-yel-ink',  shadow: '--dk-yel' },

  // Second wave: ad-hoc colours the widgets reached for beyond the core 12.
  // The long tail is 48 distinct hexes but these five are 85% of the volume,
  // and each has a clear semantic — three category accents, two status colours.
  '#ff8a3c': { bg: '--dk-org',     border: '--dk-org-ink',   fill: '--dk-org-ink',  shadow: '--dk-org' },
  '#b388ff': { bg: '--dk-pur',     border: '--dk-pur-ink',   fill: '--dk-pur-ink',  shadow: '--dk-pur' },
  '#5bf0c0': { bg: '--dk-tea',     border: '--dk-tea-ink',   fill: '--dk-tea-ink',  shadow: '--dk-tea' },
  '#86efac': { bg: '--dk-pos',     border: '--dk-pos-ink',   fill: '--dk-pos-ink',  shadow: '--dk-pos' },
  '#ff8a8a': { bg: '--dk-neg',     border: '--dk-neg-ink',   fill: '--dk-neg-ink',  shadow: '--dk-neg' },
};

const FONT_MAP = {
  '--font-bungee': '--font-fredoka',
  '--font-press': '--font-space-mono',
};

// Trailing quote/bracket tolerance matters: the slice ends at the `#`, so a
// JSX attribute reads `fill="` and an object literal reads `background: '`.
const Q = `\\s*[:=]?\\s*["'\`]?\\s*$`;
const RE_BG     = new RegExp(`(backgroundColor|background|bg)${Q}|(bg|from|to|via)-\\[$`, 'i');
const RE_BORDER = new RegExp(`(border[A-Za-z]*Color|borderTop|borderBottom|borderLeft|borderRight|border|outlineColor|outline)${Q}|(border|ring|outline|divide)-\\[$`, 'i');
const RE_SHADOW = new RegExp(`(boxShadow|shadow|textShadow)${Q}|shadow-\\[$`, 'i');
const RE_FILL   = new RegExp(`(color|fill|stroke|caretColor|textDecorationColor)${Q}|(text|fill|stroke|decoration)-\\[$`, 'i');

// Canvas/JS colour sinks cannot resolve var() — flag, never rewrite.
const RE_CANVAS = /(fillStyle|strokeStyle|shadowColor|createLinearGradient|addColorStop|ctx\.)/;

function roleOfProp(p) {
  p = p.toLowerCase();
  if (/shadow/.test(p)) return 'shadow';
  if (/border|outline|ring|divide|stroke(?!-width)/.test(p)) return 'border';
  if (/background|^bg$|gradient|from|to|via/.test(p)) return 'bg';
  if (/colou?r|fill|caret|decoration|text/.test(p)) return 'fill';
  return null;
}

// The almanac-scoped CSS vars a widget may assign directly; the name is the role.
const VAR_ROLE = {
  '--card': 'bg', '--paper': 'bg', '--paper-2': 'bg', '--accent-tint': 'bg',
  '--ink': 'fill', '--ink-soft': 'fill', '--accent': 'fill', '--accent-2': 'fill',
  '--line': 'border',
};

function tryClassify(tail) {
  // Assignment to an almanac CSS var: the var name carries the role.
  const v = tail.match(/(--[a-z0-9-]+)['"\]\s]*(?:as\s+string)?['"\]\s]*:\s*['"`]?\s*$/i);
  if (v && VAR_ROLE[v[1].toLowerCase()]) return VAR_ROLE[v[1].toLowerCase()];

  if (RE_SHADOW.test(tail)) return 'shadow';
  if (RE_BORDER.test(tail)) return 'border';
  if (RE_BG.test(tail))     return 'bg';
  if (RE_FILL.test(tail))   return 'fill';

  // Tailwind arbitrary value: divide-[#..], ring-[#..], text-[#..].
  const tw = tail.match(/([a-z]+(?:-[a-z]+)*)-\[[^\]]*$/i);
  if (tw) { const r = roleOfProp(tw[1]); if (r) return r; }

  // Nearest preceding property in a declaration list or JSX attribute.
  const m = tail.match(/([A-Za-z-]+)\s*[:=]\s*[^:;{}=]*$/);
  if (m) { const r = roleOfProp(m[1]); if (r) return r; }

  return null;
}

function classify(before) {
  const tail = before.slice(-140);

  // Prefer the property sitting immediately before the value — including when
  // it lives inside a ternary branch (`? { backgroundColor: '#...' }`).
  const direct = tryClassify(tail);
  if (direct) return direct;

  // Only when that finds nothing is this a bare ternary branch
  // (`on ? '#29e0ff' : '#b3aae0'`) whose property precedes the `?`.
  const q = tail.lastIndexOf('?');
  if (q > 0) return tryClassify(tail.slice(0, q));

  return null;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p, out); continue; }
    if (!['.tsx', '.ts', '.css', '.jsx', '.js'].includes(extname(p))) continue;
    if (SKIP.includes(name)) continue;
    out.push(p);
  }
  return out;
}

const files = walk(SRC);
let changedFiles = 0, totalSwaps = 0, unresolved = [], canvasHits = [];
const byToken = {};

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const lines = original.split('\n');
  let touched = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (RE_CANVAS.test(line) && /#[0-9a-f]{6}/i.test(line)) {
      for (const hex of Object.keys(MAP)) {
        if (line.toLowerCase().includes(hex.toLowerCase())) {
          canvasHits.push(`${relative(ROOT, file)}:${i + 1}  ${line.trim().slice(0, 100)}`);
          break;
        }
      }
      continue; // never rewrite a JS colour sink
    }

    for (const [hex, roles] of Object.entries(MAP)) {
      let idx = 0;
      for (;;) {
        const found = line.toLowerCase().indexOf(hex.toLowerCase(), idx);
        if (found < 0) break;
        const role = classify(line.slice(0, found));
        if (!role) {
          unresolved.push(`${relative(ROOT, file)}:${i + 1}  ${hex}  ${line.trim().slice(0, 90)}`);
          idx = found + hex.length;
          continue;
        }
        const token = roles[role];
        const replacement = `var(${token})`;
        line = line.slice(0, found) + replacement + line.slice(found + hex.length);
        byToken[token] = (byToken[token] || 0) + 1;
        totalSwaps++; touched = true;
        idx = found + replacement.length;
      }
    }

    for (const [from, to] of Object.entries(FONT_MAP)) {
      if (line.includes(from)) { line = line.split(from).join(to); touched = true; }
    }

    lines[i] = line;
  }

  if (touched) {
    changedFiles++;
    if (!DRY) writeFileSync(file, lines.join('\n'), 'utf8');
  }
}

console.log(`\n${DRY ? 'DRY RUN — nothing written' : 'Migration applied'}`);
console.log(`  files changed : ${changedFiles} / ${files.length} scanned`);
console.log(`  hex -> token  : ${totalSwaps}`);
console.log('\n  by token:');
for (const [t, n] of Object.entries(byToken).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${t.padEnd(18)} ${n}`);
}
if (canvasHits.length) {
  console.log(`\n  CANVAS / JS COLOUR SINKS — left alone, need manual handling (${canvasHits.length}):`);
  canvasHits.slice(0, 40).forEach(h => console.log(`    ${h}`));
  if (canvasHits.length > 40) console.log(`    ... and ${canvasHits.length - 40} more`);
}
if (unresolved.length) {
  console.log(`\n  UNRESOLVED — property role could not be determined (${unresolved.length}):`);
  unresolved.slice(0, 40).forEach(h => console.log(`    ${h}`));
  if (unresolved.length > 40) console.log(`    ... and ${unresolved.length - 40} more`);
}
console.log('');
