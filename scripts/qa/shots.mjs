// Full-page screenshots of key templates for visual QA: node scripts/qa/shots.mjs [baseUrl] [filter]
import { chromium } from 'playwright';
import fs from 'node:fs';
const base = process.argv[2] || 'http://localhost:3300';
const only = process.argv[3];
const pages = [
  ['home', '/'], ['service', '/entruempelung/'], ['specialty', '/messie-raeumung/'], ['city', '/duesseldorf/haushaltsaufloesung/'],
  ['ratgeber', '/ratgeber/'], ['post', '/wohnungsauflosung-nach-todesfall-kosten/'], ['kontakt', '/kontakt/'], ['ueber-uns', '/ueber-uns/'],
  ['sozial', '/soziales-engagement/'], ['impressum', '/impressum/'], ['404', '/gibt-es-nicht/'],
  ['leistungen', '/leistungen/'], ['einsatzgebiete', '/einsatzgebiete/'], ['ablauf', '/ablauf/'], ['bewertungen', '/bewertungen/'], ['faq', '/faq/'],
];
fs.mkdirSync('.migrate-cache/shots', { recursive: true });
const browser = await chromium.launch();
for (const [name, path] of pages) {
  if (only && !name.includes(only)) continue;
  for (const [vp, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(1200);
    await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} .marquee-track{animation:none!important}' });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `.migrate-cache/shots/${name}-${vp}.png`, fullPage: true });
    console.log(name, vp, 'height', await page.evaluate(() => document.body.scrollHeight), errors.length ? 'ERRORS: ' + errors.join(' | ') : '');
    await ctx.close();
  }
}
await browser.close();
