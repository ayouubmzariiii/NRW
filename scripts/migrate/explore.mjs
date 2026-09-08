import fs from 'node:fs';
import * as cheerio from 'cheerio';
const pages = JSON.parse(fs.readFileSync('.migrate-cache/pages.json','utf8'));
const slug = process.argv[2] || 'entruempelung';
const parentSlug = process.argv[3];
const byId = Object.fromEntries(pages.map(p=>[p.id,p]));
const page = pages.find(p=>p.slug===slug && (!parentSlug || (p.parent && byId[p.parent].slug===parentSlug)));
const $ = cheerio.load(page.content.rendered);
function walk(el, depth){
  const $el=$(el);
  const cls=($el.attr('class')||'').split(/\s+/).filter(c=>/^(av|avia|flex_column|iconbox|toggle|single_toggle|togglecontainer|entry|hr|template|container|post-entry|main_color|slide|avia_ajax_form|av-)/.test(c)).slice(0,4).join('.');
  const tag=el.tagName;
  const text=$el.clone().children().remove().end().text().replace(/\s+/g,' ').trim().slice(0,90);
  if(['script','style'].includes(tag)) return;
  const kids=$el.children().toArray();
  const interesting = text || /section|column|toggle|iconbox|textblock|heading|button|image|video|number|timeline|form|table/.test(cls);
  if(interesting && depth<9) console.log('  '.repeat(depth)+`<${tag}${cls?'.'+cls:''}> ${text}`);
  if(depth<9) kids.forEach(k=>walk(k,depth+1));
}
$('body').children().toArray().forEach(k=>walk(k,0));
