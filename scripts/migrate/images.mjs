// Collect every image referenced by the WordPress export, download it once,
// convert to WebP (max 1600px wide) and record dimensions in content/images.json.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import * as cheerio from 'cheerio';
import { localImagePath, fullSizeUrl } from './lib.mjs';

const pages = JSON.parse(fs.readFileSync('.migrate-cache/pages.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('.migrate-cache/posts.json', 'utf8'));
const media = JSON.parse(fs.readFileSync('.migrate-cache/media.json', 'utf8'));

const urls = new Map(); // full url -> local path
function add(u) {
  if (!u || u.startsWith('data:')) return;
  const full = fullSizeUrl(u.trim());
  urls.set(full, localImagePath(full));
}
for (const p of [...pages, ...posts]) {
  const $ = cheerio.load(p.content.rendered);
  $('img').each((_, el) => add($(el).attr('data-src') || $(el).attr('src')));
  $('[style*="background-image"]').each((_, el) => {
    const m = ($(el).attr('style') || '').match(/url\(["']?([^"')]+)/); if (m) add(m[1]);
  });
  const fm = p._embedded?.['wp:featuredmedia']?.[0]?.source_url; if (fm) add(fm);
}
// brand assets from the media library we want regardless of usage
const wanted = /LogoV2|Group-505|Ausgezeichnet_bewertung|nrw-haushaltsaufloesung-Marco|marco2\.jpg|auto-und-marco2|marcothb|og-image|nrw\.webp|nrw2\.webp|bei-der-arbeit|beiderarbeit|nrw-house-clearance-team|2x3\.png|bueroaufloesung\.png|naegel-entfernen|kuechenausbau|abtransport-entruempelung|transporter-beladen|Brown-Cardboard|auto-scaled/;
for (const m of media) if (wanted.test(m.source_url)) add(m.source_url);

const outMap = fs.existsSync('content/images.json') ? JSON.parse(fs.readFileSync('content/images.json', 'utf8')) : {};
const list = [...urls.entries()];
console.log(`images to process: ${list.length}`);
let done = 0, failed = [];
const CONC = 8;
async function work(queue) {
  while (queue.length) {
    const [url, local] = queue.shift();
    const dest = path.join('public', local);
    try {
      if (!fs.existsSync(dest)) {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const isLogoOrIcon = /Logo|Group-5|stroke-rounded|Ausgezeichnet/.test(url);
        let img = sharp(buf, { animated: false }).rotate();
        const meta = await img.metadata();
        if (!isLogoOrIcon && (meta.width || 0) > 1600) img = img.resize({ width: 1600, withoutEnlargement: true });
        await img.webp({ quality: isLogoOrIcon ? 92 : 80, effort: 4 }).toFile(dest);
      }
      const m = await sharp(dest).metadata();
      outMap[local] = { width: m.width, height: m.height, source: url };
    } catch (e) {
      failed.push([url, String(e.message || e)]);
    }
    done++;
    if (done % 50 === 0) { console.log(`${done}/${list.length}`); fs.writeFileSync('content/images.json', JSON.stringify(outMap, null, 1)); }
  }
}
fs.mkdirSync('content', { recursive: true });
await Promise.all(Array.from({ length: CONC }, () => work(list)));
fs.writeFileSync('content/images.json', JSON.stringify(outMap, null, 1));
console.log(`done ${done}, failed ${failed.length}`);
for (const f of failed) console.log('FAILED', f[0], f[1]);
