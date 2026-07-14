/**
 * Generates public/og-image.png (1200x630) — the social/share preview image
 * referenced by the Open Graph and Twitter Card meta tags. Self-contained:
 * encodes a PNG with Node's zlib, drawing the "MO Intelligence" wordmark and tagline
 * using a built-in 5x7 bitmap font. Run with: node scripts/gen-og.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1200;
const H = 630;

// 5x7 uppercase bitmap font (rows top->bottom, bits left->right).
const FONT = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '11110', '10001', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  E: ['11111', '10000', '11110', '10000', '10000', '10000', '11111'],
  F: ['11111', '10000', '11110', '10000', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '11111', '10001', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  K: ['10001', '10010', '11100', '10100', '10010', '10001', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  '&': ['01100', '10010', '10010', '01100', '10101', '10010', '01101'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

// RGBA framebuffer
const buf = Buffer.alloc(W * H * 4);
function setPx(x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
}
function fill(r, g, b) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) setPx(x, y, r, g, b);
}
function rect(x0, y0, w, h, r, g, b) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) setPx(x, y, r, g, b);
}

function textWidth(str, scale) {
  return str.length * (5 + 1) * scale - scale;
}
function drawText(str, x, y, scale, r, g, b) {
  let cx = x;
  for (const ch of str.toUpperCase()) {
    const glyph = FONT[ch] || FONT[' '];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row][col] === '1') rect(cx + col * scale, y + row * scale, scale, scale, r, g, b);
      }
    }
    cx += (5 + 1) * scale;
  }
}
function drawCentered(str, y, scale, r, g, b) {
  drawText(str, Math.round((W - textWidth(str, scale)) / 2), y, scale, r, g, b);
}

// Brand background (#0d0d12) with a subtle top accent bar.
fill(0x0d, 0x0d, 0x12);
rect(0, 0, W, 8, 0xff, 0xff, 0xff);

// Wordmark + tagline + descriptor, centered.
drawCentered('MO INTELLIGENCE', 215, 22, 0xff, 0xff, 0xff);
rect(Math.round((W - 360) / 2), 410, 360, 4, 0x55, 0x55, 0x66);
drawCentered('INTELLIGENCE THAT WORKS', 450, 7, 0xcf, 0xcf, 0xda);
drawCentered('AI SOLUTIONS  MAURITIUS & AFRICA', 510, 6, 0x88, 0x88, 0x99);

/* ── PNG encode ──────────────────────────────────────────────────── */
function crc32(b) {
  let c = ~0;
  for (let i = 0; i < b.length; i++) {
    c ^= b[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;   // bit depth
ihdr[9] = 6;   // color type RGBA
// 10,11,12 = 0 (deflate, adaptive filter, no interlace)

// Add per-scanline filter byte (0 = none).
const raw = Buffer.alloc(H * (W * 4 + 1));
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0;
  buf.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
}
const idat = deflateSync(raw, { level: 9 });

const png = Buffer.concat([
  sig,
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = join(__dirname, '..', 'public', 'og-image.png');
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes, ${W}x${H})`);
