// Extract structured content from the WordPress export into content/*.json
import fs from 'node:fs';
import * as cheerio from 'cheerio';
import { cleanHtml, htmlToText, text, decode, localImagePath, fullSizeUrl } from './lib.mjs';

const pages = JSON.parse(fs.readFileSync('.migrate-cache/pages.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('.migrate-cache/posts.json', 'utf8'));
const imageMap = fs.existsSync('content/images.json') ? JSON.parse(fs.readFileSync('content/images.json', 'utf8')) : {};
const byId = Object.fromEntries(pages.map((p) => [p.id, p]));

const pathOf = (p) => p.link.replace(/^https?:\/\/(www\.)?nrw-haushaltsaufloesung\.de/, '') || '/';

// ---- template signatures to drop -------------------------------------------------
const TEMPLATE_TEXT = [
  /^Wir sind seit\s*2010/i, /^Seit 2010 in ganz Nordrhein/i, /^Rufen Sie uns unverbindlich an/i, /^Rufen Sie uns an,? um Ihr individuelles Angebot/i,
  /^Wir arbeiten 24 Stunden/i, /^Kontaktieren Sie uns/i, /^erhalten Sie kostenlos/i, /^Mobil:/i, /^NRW – Haushaltsauflösung$/i,
  /^Sehr zuverlässig und super Arbeit/i, /^Wir von NRW-Haushaltsauflösung sind Ihr kompetenter Ansprechpartner/i, /^Unsere Firmenphilosophie/i,
  /^Ob einzelne Räume, komplette Wohnungen/i, /^Mit NRW-Haushaltsauflösung entscheiden Sie sich/i, /^Wir von NRW-Haushaltsauflösung sind ein ganzheitlicher Anbieter/i,
  /^Marco van der Sande/i, /^0177 866 70 16/, /^0800 222/, /^Schnell: Auch kurzfristig/i, /^Schnell – Wir halten/i, /^kontakt@nrw/i, /^Jetzt anrufen/i,
  /^Aufträge$/i, /^Gegründet$/i, /^Festpreisgarantie$/i, /^Jahre Erfahrung$/i, /^Gratis Besichtigung$/i, /^Wertanrechnung$/i, /^Festpreis$/i,
  /^Schlüssel-Abgabefertig$/i, /^24\/7 Expressdienst$/i, /^Betriebshaftpflicht-Versicherung$/i, /^Da wir permanent in ganz NRW/i, /^Wir kaufen nicht nur Möbel/i,
  /^Unser Angebot enthält einen garantierten Festpreis/i, /^Besenrein\? Nicht nur!/i, /^Kurzfristige Besichtigungen und Räumungen/i, /^Damit sowohl wir, als auch Sie/i,
  /^Nutzen Sie das Kontaktformular/i, /^Name$/, /^E-Mail$/, /^Telefon$/, /^Ort des Objekts$/, /^Nachricht$/, /^\d \+ \d = \?/, /^Stellen Sie Ihre Anfrage$/i,
  /^Unser professionelles Team wird alles besenrein/i, /^Sie erhalten unmittelbar nach oder bei Besichtigung/i, /^Garantierter Festpreis$/i,
  /^Tel\.:/i, /^Fax:/i, /^Rufen Sie uns an um Ihr individuelles Angebot/i, /^Kontaktinfo$/i, /^Jetzt kostenlos\s*Besichtigung anfragen/i,
];
const TEMPLATE_HEADINGS = [
  /^Über uns$/i, /^NRW-Haushaltsauflösung – Ihr zuverlässiger Partner$/i, /^Ablauf /i, /^Meinungen unserer Kunden$/i, /^Unsere Vorteile$/i, /^Kurz über uns$/i,
  /^Kontaktieren Sie uns$/i, /^Stellen Sie Ihre Anfrage$/i, /^Häufig gestellte Fragen$/i, /^FAQ$/i, /^NRW Haushaltsauflösung$/i, /^Ihr Vorteil$/i, /^Kontaktinfo$/i, /^Wertanrechnung$/i,
];
const isTemplateText = (t) => TEMPLATE_TEXT.some((r) => r.test(t));
const isTemplateHeading = (t) => TEMPLATE_HEADINGS.some((r) => r.test(t));
const CONTENT_PHOTO = /(2025-09-(?!ausgezeichnet)|2026-02-nrw2?\.|bei-der-arbeit|beiderarbeit|2021-01-marco2|auto-und-marco)/i;

/** Remove template paragraphs/headings that live inside a free-form text block. */
function stripTemplate(html) {
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  $('#r').children('p, h2, h3, h4').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (isTemplateText(t) || (/^h/.test(el.tagName) && isTemplateHeading(t))) $(el).remove();
  });
  return $('#r').html().trim();
}

/** Split free-form html into sections at <h2>. */
function splitByH2(html) {
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  const out = [];
  let cur = { heading: null, html: '' };
  $('#r').contents().each((_, node) => {
    if (node.type === 'tag' && node.tagName === 'h2') {
      if (cur.html.trim() || cur.heading) out.push(cur);
      cur = { heading: $(node).text().trim(), html: '' };
    } else cur.html += $.html(node);
  });
  if (cur.html.trim() || cur.heading) out.push(cur);
  return out.map((s) => ({ ...s, html: s.html.trim() })).filter((s) => htmlToText(s.html) || s.heading);
}

// ---- internal link repair --------------------------------------------------------
const norm = (s) => s.toLowerCase().replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[^a-z0-9/]+/g, '-');
const VALID = new Set([...pages.map(pathOf), ...posts.map((p) => `/${p.slug}/`)]);
const VALID_NORM = new Map([...VALID].map((p) => [norm(p), p]));
const CITY_SLUGS = new Set(pages.filter((p) => p.parent === 0 && pages.some((c) => c.parent === p.id && c.slug === 'haushaltsaufloesung')).map((p) => p.slug));
const linkFixes = {};
function resolveHref(href) {
  if (!href || !href.startsWith('/')) return href;
  const [pathPart, hash] = href.split('#');
  const re = (p) => (hash ? `${p}#${hash}` : p);
  if (pathPart === '/' || VALID.has(pathPart)) return href;
  let fixed = null;
  if (VALID_NORM.has(norm(pathPart))) fixed = VALID_NORM.get(norm(pathPart));
  else if (/^\/tag\//.test(pathPart)) fixed = '/ratgeber/';
  else {
    const m = pathPart.match(/^\/([^/]+)\/(haushaltsaufloesung|wohnungsaufloesung|entruempelung)\/$/);
    if (m) fixed = CITY_SLUGS.has(m[1]) ? `/${m[1]}/haushaltsaufloesung/` : m[2] === 'entruempelung' ? '/entruempelung/' : '/haushaltsaufloesung-wohnungsaufloesung/';
    else {
      const n = norm(pathPart).replace(/^\/|\/$/g, '');
      const cand = [...VALID_NORM.entries()].filter(([k]) => { const kk = k.replace(/^\/|\/$/g, ''); return kk.length > 12 && (n.includes(kk) || kk.includes(n)); }).sort((a, b) => b[0].length - a[0].length)[0];
      fixed = cand ? cand[1] : '/ratgeber/';
    }
  }
  linkFixes[pathPart] = fixed;
  return re(fixed);
}
function fixLinks(html) {
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  $('#r a[href^="/"]').each((_, el) => $(el).attr('href', resolveHref($(el).attr('href'))));
  return $('#r').html();
}

// global FAQ (home page) for dedupe
const GLOBAL_FAQ_Q = [
  'Wie wird eine Wertanrechnung', 'Was fällt unter den Festpreis', 'Was ist der Unterschied zwischen einer Entrümpelung', 'Ist die Besichtigung und Anfahrt',
  'Was passiert bei Schäden', 'Was bedeutet eine schlüsselabgabefertige', 'Ist es ggf. günstiger selbst',
];
const isGlobalFaq = (q) => GLOBAL_FAQ_Q.some((s) => q.startsWith(s));

function extractBlocks(html) {
  const $ = cheerio.load(html);
  const blocks = [];
  $('.av-special-heading, .avia_textblock, .single_toggle, .avia-image-container img, .iconbox, .avia-timeline li, .avia-video').each((_, el) => {
    const $el = $(el);
    if ($el.parents('.single_toggle, .iconbox, form').length && !$el.is('.single_toggle, .iconbox')) return;
    if ($el.is('.av-special-heading')) {
      const h = $el.find('h1,h2,h3,h4').first();
      const kicker = text($el.find('.av-subheading'));
      const t = text(h);
      if (!t) return;
      blocks.push({ type: 'heading', level: Number((h.get(0)?.tagName || 'h2').slice(1)), text: t, kicker: kicker || undefined });
    } else if ($el.is('.avia_textblock')) {
      const inner = $el.html() || '';
      const t = htmlToText(inner);
      if (!t) return;
      blocks.push({ type: 'text', html: inner, text: t });
    } else if ($el.is('.single_toggle')) {
      const q = text($el.find('.toggler'));
      const a = $el.find('.toggle_content').html() || '';
      if (q) blocks.push({ type: 'faq', q, a: cleanHtml(a, { headingIds: false }) });
    } else if ($el.is('img')) {
      const src = $el.attr('src') || '';
      if (!src) return;
      blocks.push({ type: 'image', src: localImagePath(fullSizeUrl(src)), alt: ($el.attr('alt') || '').trim() });
    } else if ($el.is('.iconbox')) {
      const t = text($el.find('.iconbox_content_title'));
      const c = text($el.find('.iconbox_content_container'));
      blocks.push({ type: 'iconbox', title: t, text: c });
    } else if ($el.is('li')) {
      const t = text($el.find('h4, .av-milestone-title'));
      const c = text($el.find('.av-milestone-content p, .av-milestone-content'));
      blocks.push({ type: 'step', title: t || text($el), text: c });
    } else if ($el.is('.avia-video')) {
      blocks.push({ type: 'video', url: $el.attr('data-original_url') });
    }
  });
  return blocks;
}

/** Turn ordered blocks into hero + sections + faq, dropping template chrome. */
function structure(blocks, imgCollector) {
  let h1 = null;
  let subtitle = null;
  const sections = [];
  const faq = [];
  const images = [];
  let video = null;
  let cur = null;
  const flush = () => {
    if (cur && !cur.skip) {
      cur.html = fixLinks(stripTemplate(cur.html || ''));
      if (htmlToText(cur.html)) sections.push(cur);
    }
    cur = null;
  };
  for (const b of blocks) {
    if (b.type === 'video') { video = b.url; continue; }
    if (b.type === 'image') {
      if (CONTENT_PHOTO.test(b.src)) images.push(b);
      continue;
    }
    if (b.type === 'faq') { faq.push(b); continue; }
    if (b.type === 'iconbox' || b.type === 'step') continue;
    if (b.type === 'heading') {
      if (b.level === 1 && !h1) { h1 = b.text; continue; }
      if (isTemplateHeading(b.text)) { flush(); cur = { skip: true }; continue; }
      flush();
      cur = { heading: b.text, level: b.level, kicker: b.kicker, html: '' };
      continue;
    }
    if (b.type === 'text') {
      if (isTemplateText(b.text)) continue;
      if (!subtitle && h1 && /Einsatz!?$/.test(b.text) && b.text.length < 120) { subtitle = b.text; continue; }
      if (cur?.skip) continue;
      const html = cleanHtml(b.html, { imageMap, collectImages: imgCollector, headingIds: false });
      if (!htmlToText(html)) continue;
      if (!cur) cur = { heading: null, level: 2, html: '' };
      cur.html += html;
    }
  }
  flush();
  return { h1, subtitle, sections, faq, images, video };
}

// ---- pages --------------------------------------------------------------------
const CITY_PARENTS = new Set(
  pages.filter((p) => p.parent === 0 && pages.some((c) => c.parent === p.id && c.slug === 'haushaltsaufloesung')).map((p) => p.id),
);
const out = [];
const cities = [];
for (const p of pages) {
  const path = pathOf(p);
  const seo = p.yoast_head_json || {};
  const title = decode(p.title.rendered);
  const isCityParent = CITY_PARENTS.has(p.id);
  const isCity = p.parent && CITY_PARENTS.has(p.parent);
  if (isCityParent) continue; // redirected to /<city>/haushaltsaufloesung/
  const blocks = extractBlocks(p.content.rendered);
  const imgs = [];
  const s = structure(blocks, imgs);
  const rec = {
    slug: p.slug,
    path,
    title,
    h1: s.h1 || title,
    subtitle: s.subtitle,
    seoTitle: seo.title || title,
    seoDescription: seo.description || null,
    published: p.date_gmt,
    modified: p.modified_gmt,
    sections: s.sections,
    faq: s.faq.filter((f) => !isGlobalFaq(f.q)),
    usesGlobalFaq: s.faq.some((f) => isGlobalFaq(f.q)),
    images: [...new Map([...s.images, ...imgs].filter((i) => CONTENT_PHOTO.test(i.src)).map((i) => [i.src, i])).values()],
    video: s.video || null,
    wordCount: htmlToText(p.content.rendered).split(/\s+/).length,
  };
  if (isCity) {
    const parent = byId[p.parent];
    const city = {
      slug: parent.slug,
      name: title.replace(/^Haushaltsauflösung\s+/i, '').replace(/Mülheim adR/, 'Mülheim an der Ruhr'),
      path,
    };
    // inline <h2>s live inside one text block on city pages -> split them out
    const flat = rec.sections.flatMap((x) => splitByH2(x.html).map((s, i) => ({ heading: s.heading ?? (i === 0 ? x.heading : null), html: s.html })));
    rec.sections = flat;
    const pick = (re) => flat.find((x) => re.test(x.heading || ''));
    const nb = pick(/Nachbarst/i);
    city.neighbors = nb
      ? cheerio.load(nb.html)('a').map((_, e) => ({ name: cheerio.load(e).text().replace(/Haushaltsauflösung\s*/i, '').trim(), href: cheerio.load(e)('a').attr('href') })).get()
      : [];
    city.intro = flat.filter((x) => !x.heading || /Unser Service/i.test(x.heading)).map((x) => x.html).join('');
    const ben = pick(/Vorteile/i);
    city.benefitsHeading = ben?.heading || null;
    city.benefits = ben ? cheerio.load(ben.html)('li').map((_, e) => cheerio.load(e).text().trim()).get() : [];
    city.scope = pick(/Leistungsumfang/i)?.html || '';
    city.steps = pick(/^Ablauf$/i) ? cheerio.load(pick(/^Ablauf$/i).html)('li').map((_, e) => cheerio.load(e).text().trim()).get() : [];
    city.summary = pick(/Zusammengefasst/i)?.html || '';
    const eco = pick(/Umweltfreundliche|Entsorgung/i);
    city.eco = eco ? { heading: eco.heading, html: eco.html } : null;
    city.faq = rec.faq;
    city.seoTitle = rec.seoTitle;
    city.seoDescription = rec.seoDescription;
    city.h1 = rec.h1;
    city.modified = rec.modified;
    city.published = rec.published;
    cities.push(city);
    rec.kind = 'city';
    rec.city = parent.slug;
  }
  out.push(rec);
}
fs.mkdirSync('content', { recursive: true });
fs.writeFileSync('content/pages.json', JSON.stringify(out, null, 1));
fs.writeFileSync('content/cities.json', JSON.stringify(cities, null, 1));
console.log('pages', out.length, 'cities', cities.length);

// ---- posts --------------------------------------------------------------------
fs.mkdirSync('content/posts', { recursive: true });
const index = [];
const allSlugs = new Set([...pages.map((p) => pathOf(p)), ...posts.map((p) => `/${p.slug}/`)]);
let brokenLinks = 0;
const broken = new Set();
for (const p of posts) {
  const seo = p.yoast_head_json || {};
  const imgs = [];
  const links = [];
  const html = fixLinks(cleanHtml(p.content.rendered, { imageMap, collectImages: imgs, collectLinks: links }));
  const $ = cheerio.load(`<div>${html}</div>`, null, false);
  links.length = 0;
  $('a[href^="/"]').each((_, e) => links.push($(e).attr('href')));
  const toc = $('h2').map((_, e) => ({ id: $(e).attr('id'), text: $(e).text().trim() })).get();
  const wc = $.text().split(/\s+/).filter(Boolean).length;
  const fm = p._embedded?.['wp:featuredmedia']?.[0];
  const terms = (p._embedded?.['wp:term'] || []).flat();
  const tags = terms.filter((t) => t.taxonomy === 'post_tag').map((t) => t.name);
  const featured = fm?.source_url ? { src: localImagePath(fullSizeUrl(fm.source_url)), alt: fm.alt_text || decode(p.title.rendered) } : null;
  for (const l of links) {
    const clean = l.split('#')[0];
    if (clean !== '/' && !allSlugs.has(clean)) { brokenLinks++; broken.add(clean); }
  }
  const rec = {
    slug: p.slug,
    path: `/${p.slug}/`,
    title: decode(p.title.rendered),
    seoTitle: seo.title || decode(p.title.rendered),
    seoDescription: seo.description || htmlToText(p.excerpt.rendered).slice(0, 160),
    excerpt: htmlToText(p.excerpt.rendered).replace(/\s*\[…\]$/, '…'),
    date: p.date_gmt,
    modified: p.modified_gmt,
    featured,
    tags,
    toc,
    wordCount: wc,
    readingMinutes: Math.max(1, Math.round(wc / 220)),
    html,
    internalLinks: [...new Set(links)],
  };
  fs.writeFileSync(`content/posts/${p.slug}.json`, JSON.stringify(rec, null, 1));
  index.push({
    slug: rec.slug, path: rec.path, title: rec.title, excerpt: rec.excerpt, date: rec.date, modified: rec.modified,
    featured, tags, readingMinutes: rec.readingMinutes, seoDescription: rec.seoDescription,
  });
}
index.sort((a, b) => b.date.localeCompare(a.date));
fs.writeFileSync('content/posts-index.json', JSON.stringify(index, null, 1));
console.log('posts', index.length, 'broken internal links', brokenLinks, [...broken].slice(0, 20));
console.log('link fixes applied:', linkFixes);
