import Image from "next/image";
import clsx from "clsx";
import { Prose } from "@/components/prose";
import { Reveal } from "@/components/reveal";
import type { PageImage, Section } from "@/lib/content";
import { TEAM_PHOTOS } from "@/lib/site";

/** Split very long html at paragraph boundaries so no single text block dwarfs its image. */
export function splitLongHtml(html: string, maxChars = 1900): string[] {
  if (html.length <= maxChars) return [html];
  const parts = html.split(/(?<=<\/p>|<\/ul>|<\/ol>|<\/h3>|<\/h4>)/).filter((p) => p.trim());
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if (cur && cur.length + p.length > maxChars) { out.push(cur); cur = ""; }
    cur += p;
  }
  if (cur) out.push(cur);
  return out;
}

export type ZigzagRow = { heading?: string | null; level?: number; html: string };

export function toRows(sections: Section[], maxChars = 1900): ZigzagRow[] {
  const rows: ZigzagRow[] = [];
  for (const s of sections) {
    const chunks = splitLongHtml(s.html, maxChars);
    chunks.forEach((html, i) => rows.push({ heading: i === 0 ? s.heading : null, level: s.level, html }));
  }
  return rows;
}

/**
 * Alternating text / photo rows. Keeps every reading block short and pairs it
 * with a real photo so pages never turn into a wall of text.
 */
export function Zigzag({ rows, images = [], exclude = [], startRight = true, className }: { rows: ZigzagRow[]; images?: PageImage[]; exclude?: string[]; startRight?: boolean; className?: string }) {
  const pool = [...images, ...TEAM_PHOTOS].filter((im, i, arr) => !exclude.includes(im.src) && !/marco/.test(im.src) && arr.findIndex((x) => x.src === im.src) === i);
  return (
    <div className={clsx("grid gap-12 sm:gap-16 lg:gap-24", className)}>
      {rows.map((row, i) => {
        const img = pool[i % pool.length];
        const imageRight = startRight ? i % 2 === 0 : i % 2 === 1;
        return (
          <div key={i} className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className={clsx("lg:col-span-8", imageRight ? "lg:order-1" : "lg:order-2")}>
              {row.heading && ((row.level ?? 2) <= 2 ? <h2 className="display-md text-balance">{row.heading}</h2> : <h3 className="display-sm text-balance">{row.heading}</h3>)}
              <Prose html={row.html} className={row.heading ? "mt-5" : ""} />
            </Reveal>
            <Reveal delay={80} className={clsx("lg:col-span-4", imageRight ? "lg:order-2" : "lg:order-1")}>
              <div className={clsx("relative mx-auto aspect-[4/5] w-full max-w-[17rem] overflow-hidden rounded-[1.75rem] shadow-soft sm:max-w-xs lg:max-w-[19rem]", imageRight ? "lg:mr-auto" : "lg:ml-auto")}>
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 304px, 272px" quality={78} className="object-cover" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
