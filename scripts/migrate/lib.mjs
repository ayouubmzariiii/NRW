import crypto from 'node:crypto';
import * as cheerio from 'cheerio';

export const SITE = 'https://www.nrw-haushaltsaufloesung.de';

/** Deterministic local path for a remote image URL. */
export function localImagePath(url) {
  let u = url.trim();
  // strip WP size suffix -WxH before extension
  u = u.replace(/-\d{2,4}x\d{2,4}(\.\w{3,4})(\?.*)?$/, '$1');
  u = u.replace(/-scaled(\.\w{3,4})$/, '$1');
  const m = u.match(/\/wp-content\/uploads\/(\d{4})\/(\d{2})\/([^/?#]+)\.(\w{3,4})$/);
  if (m) {
    const name = slugifyFile(m[3]);
    return `/images/wp/${m[1]}-${m[2]}-${name}.webp`;
  }
  const base = (u.split('/').pop() || 'img').replace(/\.\w{3,4}$/, '');
  const hash = crypto.createHash('md5').update(u).digest('hex').slice(0, 8);
  return `/images/ext/${slugifyFile(base)}-${hash}.webp`;
}

export function slugifyFile(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'img';
}

export function slugifyHeading(s) {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

export function fullSizeUrl(url) {
  return url.replace(/-\d{2,4}x\d{2,4}(\.\w{3,4})$/, '$1');
}

/** Normalise internal link to a relative path with trailing slash. */
export function internalHref(href) {
  if (!href) return href;
  let h = href.trim();
  h = h.replace(/^https?:\/\/(www\.)?nrw-haushaltsaufloesung\.de/i, '');
  if (h === '') return '/';
  if (h.startsWith('/')) {
    const [path, hash] = h.split('#');
    let p = path.replace(/\/+$/, '') + '/';
    if (p === '//') p = '/';
    return hash ? `${p}#${hash}` : p;
  }
  return h;
}

export function isInternal(href) {
  return /^(https?:\/\/(www\.)?nrw-haushaltsaufloesung\.de|\/(?!\/))/i.test(href || '');
}

export function text($el) {
  return $el.text().replace(/\s+/g, ' ').trim();
}

/**
 * Clean a fragment of WordPress HTML: strip attributes/classes, unwrap junk,
 * map images to local paths, normalise links, add heading ids.
 */
export function cleanHtml(html, { headingIds = true, imageMap = null, collectImages = null, collectLinks = null } = {}) {
  const $ = cheerio.load(`<div id="__root">${html}</div>`, null, false);
  const root = $('#__root');

  root.find('script, style, noscript, iframe, form, input, button, .avia_button_icon, .av-special-heading-border, .special-heading-border, .hr, .av-video, .avia_playpause_icon').remove();

  // unwrap figure nested in p
  root.find('p > figure').each((_, el) => { const p = $(el).parent(); p.replaceWith($(el)); });
  // unwrap spans / font / div wrappers keeping content
  root.find('span, font, section, article, div, center').each((_, el) => { $(el).replaceWith($(el).contents()); });
  root.find('b').each((_, el) => { $(el).replaceWith(`<strong>${$(el).html()}</strong>`); });
  root.find('i').each((_, el) => { $(el).replaceWith(`<em>${$(el).html()}</em>`); });

  // images
  root.find('img').each((_, el) => {
    const $img = $(el);
    const src = $img.attr('data-src') || $img.attr('src') || '';
    if (!src || src.startsWith('data:')) { $img.remove(); return; }
    const full = fullSizeUrl(src);
    const local = localImagePath(full);
    const alt = ($img.attr('alt') || '').trim();
    if (collectImages) collectImages.push({ url: full, local, alt });
    const attrs = { src: local, alt };
    if (imageMap && imageMap[local]) { attrs.width = imageMap[local].width; attrs.height = imageMap[local].height; }
    // reset attributes
    const $new = $('<img>');
    Object.entries(attrs).forEach(([k, v]) => $new.attr(k, String(v)));
    $img.replaceWith($new);
  });

  // links
  root.find('a').each((_, el) => {
    const $a = $(el);
    const href = ($a.attr('href') || '').trim();
    if (!href || href.startsWith('#') && !href.slice(1)) { $a.replaceWith($a.contents()); return; }
    const isInt = isInternal(href) || href.startsWith('#');
    const attrs = { href: isInt ? internalHref(href) : href };
    if (!isInt && !/^(mailto|tel):/.test(href)) { attrs.target = '_blank'; attrs.rel = 'noopener'; }
    if (isInt && collectLinks) collectLinks.push(attrs.href);
    const inner = $a.html();
    const $new = $('<a>').html(inner);
    Object.entries(attrs).forEach(([k, v]) => $new.attr(k, v));
    $a.replaceWith($new);
  });

  // strip attributes on everything else
  root.find('*').each((_, el) => {
    const tag = el.tagName;
    const keep = tag === 'img' ? ['src', 'alt', 'width', 'height'] : tag === 'a' ? ['href', 'target', 'rel'] : tag === 'td' || tag === 'th' ? ['colspan', 'rowspan'] : [];
    for (const name of Object.keys(el.attribs || {})) if (!keep.includes(name)) $(el).removeAttr(name);
  });

  // heading ids
  if (headingIds) {
    const seen = new Set();
    root.find('h2, h3, h4').each((_, el) => {
      const t = text($(el));
      if (!t) return;
      let id = slugifyHeading(t) || 'abschnitt';
      let n = 2; const base = id;
      while (seen.has(id)) id = `${base}-${n++}`;
      seen.add(id);
      $(el).attr('id', id);
    });
  }

  // remove empty paragraphs / stray brs
  root.find('p').each((_, el) => { const $p = $(el); if (!text($p) && !$p.find('img').length) $p.remove(); });
  root.find('br + br').remove();
  root.children('br').remove();

  return root.html().replace(/\n{3,}/g, '\n\n').trim();
}

export function htmlToText(html) {
  const $ = cheerio.load(`<div>${html}</div>`, null, false);
  return $.text().replace(/\s+/g, ' ').trim();
}

export function decode(s) {
  return cheerio.load(`<div>${s}</div>`, null, false)('div').text();
}
