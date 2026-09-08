// Scan every template at several viewport widths for horizontal overflow.
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3400';
const urls = ['/', '/leistungen/', '/bewertungen/', '/ueber-uns/', '/soziales-engagement/', '/duesseldorf/haushaltsaufloesung/', '/entruempelung/', '/ablauf/', '/faq/', '/kontakt/', '/einsatzgebiete/', '/ratgeber/', '/wohnungsauflosung-nach-todesfall-kosten/'];
const b = await chromium.launch();
for (const w of [390, 768, 1024, 1280, 1440, 1920]) {
  const bad = [];
  for (const u of urls) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(base + u, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const doc = document.documentElement;
      const out = { s: doc.scrollWidth, c: doc.clientWidth, who: [] };
      if (out.s > out.c + 1) {
        const clipped = (el) => { let n = el.parentElement; while (n) { if (getComputedStyle(n).overflowX !== 'visible') return true; n = n.parentElement; } return false; };
        document.querySelectorAll('body *').forEach((el) => {
          const b = el.getBoundingClientRect();
          if (b.width > 0 && b.right > out.c + 1 && !clipped(el)) out.who.push(el.tagName + '.' + String(el.className).slice(0, 40));
        });
        out.who = [...new Set(out.who)].slice(0, 3);
      }
      return out;
    });
    if (r.s > r.c + 1) bad.push(`${u} ${r.s}/${r.c} ${r.who.join(' | ')}`);
    await ctx.close();
  }
  console.log(String(w).padEnd(5), bad.length ? 'OVERFLOW\n      ' + bad.join('\n      ') : 'ok');
}
await b.close();
