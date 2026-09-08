import { chromium } from 'playwright';
import fs from 'node:fs';
const base = process.argv[2] || 'http://localhost:3300';
const pages = [['home','/'],['leistungen','/leistungen/'],['service','/entruempelung/'],['city','/duesseldorf/haushaltsaufloesung/'],['ablauf','/ablauf/'],['bewertungen','/bewertungen/'],['faq','/faq/'],['einsatz','/einsatzgebiete/'],['ueber','/ueber-uns/'],['sozial','/soziales-engagement/'],['kontakt','/kontakt/'],['ratgeber','/ratgeber/'],['post','/wohnungsauflosung-nach-todesfall-kosten/']];
fs.mkdirSync('.migrate-cache/m', { recursive: true });
const b = await chromium.launch();
for (const [name, path] of pages) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(1200);
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} .marquee-track{animation:none!important}' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(300);
  // horizontal overflow check
  const over = await p.evaluate(() => {
    const bad = [];
    const vw = document.documentElement.clientWidth;
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1) && !el.closest('.marquee')) {
        const s = el.tagName.toLowerCase() + '.' + (el.className && typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : '');
        bad.push(`${s} [${Math.round(r.left)}..${Math.round(r.right)}]`);
      }
    });
    return { scrollW: document.documentElement.scrollWidth, vw, bad: [...new Set(bad)].slice(0, 6) };
  });
  await p.screenshot({ path: `.migrate-cache/m/${name}.png`, fullPage: true });
  console.log(name.padEnd(14), 'h=' + await p.evaluate(() => document.body.scrollHeight), 'scrollW=' + over.scrollW + '/' + over.vw, over.bad.length ? 'OVERFLOW: ' + over.bad.join(' | ') : '');
  await ctx.close();
}
await b.close();
