import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3300';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const log = (...a) => console.log(...a);

// redirects
for (const [from, to] of [['/duesseldorf/', '/duesseldorf/haushaltsaufloesung/'], ['/tag/irgendwas/', '/ratgeber/'], ['/koeln', '/koeln/haushaltsaufloesung/']]) {
  const r = await page.goto(base + from, { waitUntil: 'domcontentloaded' });
  log('redirect', from, '->', new URL(page.url()).pathname, page.url().endsWith(to) ? 'OK' : 'FAIL', r?.status());
}
// sitemap + robots
const sm = await (await page.goto(base + '/sitemap.xml')).text();
log('sitemap urls', (sm.match(/<loc>/g) || []).length);
log('robots', (await (await page.goto(base + '/robots.txt')).text()).replace(/\n/g, ' | '));
// mobile menu
await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
await page.click('button[aria-controls="mobile-nav"]');
log('mobile nav visible', await page.locator('#mobile-nav').isVisible());
await page.click('#mobile-nav a[href="/ratgeber/"]');
await page.waitForURL('**/ratgeber/');
log('nav closed after route change', !(await page.locator('#mobile-nav').isVisible()));
// blog search
await page.fill('input[type=search]', 'messie');
await page.waitForTimeout(300);
log('search result text', await page.locator('p[aria-live]').textContent());
// contact form: validation error, then a successful submit
await page.goto(base + '/kontakt/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
await page.fill('#cf-name', 'Test Person');
await page.fill('#cf-email', 'test@example.com');
await page.fill('#cf-phone', '0171 1234567');
await page.fill('#cf-ort', 'Düsseldorf');
await page.fill('#cf-msg', 'Testanfrage aus dem QA-Skript.');
await page.waitForTimeout(3000); // timing check needs >2.5s since load
await page.click('form button[type=submit]'); // consent missing -> error
await page.waitForSelector('form [role=alert]', { timeout: 15000 });
log('validation error shown:', await page.locator('form [role=alert]').textContent());
await page.check('input[name=datenschutz]');
await page.click('form button[type=submit]');
await page.waitForURL('**/vielen-dank/', { timeout: 20000 });
log('submitted -> ', new URL(page.url()).pathname);
// FAQ details toggle & video click-to-play
await page.goto(base + '/entruempelung/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const faqs = await page.locator('details.faq').count();
await page.locator('details.faq summary').nth(1).click();
log('faq count', faqs, 'second open', await page.locator('details.faq').nth(1).getAttribute('open') !== null);
// click-to-play video lives on the about page
await page.goto(base + '/ueber-uns/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
await page.getByRole('button', { name: /Video abspielen/ }).first().click();
log('iframe after play', await page.locator('iframe[src*="youtube-nocookie"]').count());
// 404
const r404 = await page.goto(base + '/diese-seite-gibt-es-nicht/');
log('404 status', r404?.status());
await browser.close();
