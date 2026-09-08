// Generate logo, favicons and the default Open Graph image from the original brand PNGs
// (LogoV2 + Group-505 icon from the WordPress media library, cached in .migrate-cache/).
import sharp from 'sharp';
import fs from 'node:fs';

const logo = '.migrate-cache/logo.png';
const icon = '.migrate-cache/icon.png';
for (const f of [logo, icon]) if (!fs.existsSync(f)) throw new Error(`missing ${f} – download LogoV2.png / Group-505.png first`);

// Header logo (trimmed, 2x for retina) + footer mark
await sharp(logo).trim().png({ compressionLevel: 9 }).toFile('public/logo.png');
await sharp(icon).trim().png({ compressionLevel: 9 }).toFile('public/logo-mark.png');

// Favicons: the roof mark on a transparent square (browser tab) and on white (Apple / PWA).
const markBuf = await sharp(icon).trim().toBuffer();
async function square(size, background, pad = 0.14) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(markBuf).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } }).composite([{ input: m, gravity: 'centre' }]).png();
}
await (await square(64, { r: 0, g: 0, b: 0, alpha: 0 }, 0.06)).toFile('public/icon.png');
await (await square(180, { r: 255, g: 255, b: 255, alpha: 1 })).toFile('public/apple-icon.png');
await (await square(512, { r: 255, g: 255, b: 255, alpha: 1 })).toFile('public/icon-512.png');
for (const f of ['public/icon.svg', 'public/favicon-48.png']) if (fs.existsSync(f)) fs.unlinkSync(f);

// OG image 1200x630: photo right, real logo + headline left.
const W = 1200, H = 630;
const photo = await sharp('public/images/wp/2021-01-auto-und-marco2.webp').resize(620, H, { fit: 'cover', position: 'centre' }).toBuffer();
const logoOg = await sharp(logo).trim().resize({ width: 300 }).toBuffer();
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.45" stop-color="#0c1a12" stop-opacity="1"/><stop offset="0.7" stop-color="#0c1a12" stop-opacity="0.35"/><stop offset="1" stop-color="#0c1a12" stop-opacity="0.15"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="72" y="72" width="330" height="112" rx="20" fill="#ffffff"/>
  <text x="72" y="290" font-family="Georgia, serif" font-size="64" fill="#ffffff">Wohnungsauflösung &amp;</text>
  <text x="72" y="368" font-family="Georgia, serif" font-size="64" fill="#ffffff">Entrümpelung</text>
  <text x="72" y="446" font-family="Georgia, serif" font-size="64" fill="#6cc456">zum Festpreis.</text>
  <text x="72" y="516" font-family="Arial, Helvetica, sans-serif" font-size="25" fill="#cfdad1">Kostenlose Besichtigung · Wertanrechnung · in ganz NRW · seit 2010</text>
  <rect x="72" y="550" width="380" height="44" rx="22" fill="#ffffff" fill-opacity="0.1"/>
  <text x="96" y="580" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#ffffff">★★★★★  4,97 Sehr Gut · 137 Bewertungen</text>
</svg>`);
await sharp({ create: { width: W, height: H, channels: 3, background: '#0c1a12' } })
  .composite([{ input: photo, left: W - 620, top: 0 }, { input: overlay, left: 0, top: 0 }, { input: logoOg, left: 87, top: 86 }])
  .jpeg({ quality: 86 }).toFile('public/images/og-default.jpg');
console.log('brand assets written');
