import type { MetadataRoute } from "next";
import { cities, pages, posts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

const toDate = (s: string) => new Date(s.endsWith("Z") ? s : `${s}Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  const noindex = new Set(["impressum", "datenschutzhinweis", "vielen-dank"]);
  const staticPages = pages
    .filter((p) => p.kind !== "city" && !noindex.has(p.slug))
    .map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: toDate(p.modified),
      changeFrequency: (p.path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: p.path === "/" ? 1 : p.slug === "ratgeber" ? 0.8 : 0.8,
    }));
  const extra = ['/leistungen/', '/einsatzgebiete/', '/ablauf/', '/bewertungen/', '/faq/'].map((p) => ({ url: absoluteUrl(p), lastModified: new Date('2026-09-08'), changeFrequency: 'monthly' as const, priority: 0.8 }));
  const cityPages = cities.map((c) => ({ url: absoluteUrl(c.path), lastModified: toDate(c.modified), changeFrequency: "monthly" as const, priority: 0.7 }));
  const postPages = posts.map((p) => ({ url: absoluteUrl(p.path), lastModified: toDate(p.modified), changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...staticPages, ...extra, ...cityPages, ...postPages];
}
