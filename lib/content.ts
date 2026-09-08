import pagesData from "@/content/pages.json";
import citiesData from "@/content/cities.json";
import postsIndex from "@/content/posts-index.json";
import imagesData from "@/content/images.json";

export type Section = { heading: string | null; level?: number; kicker?: string; html: string };
export type FaqItem = { q: string; a: string };
export type PageImage = { src: string; alt: string };

export type PageRecord = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  subtitle: string | null;
  seoTitle: string;
  seoDescription: string | null;
  published: string;
  modified: string;
  sections: Section[];
  faq: FaqItem[];
  usesGlobalFaq: boolean;
  images: PageImage[];
  video: string | null;
  wordCount: number;
  kind?: string;
  city?: string;
};

export type CityRecord = {
  slug: string;
  name: string;
  path: string;
  neighbors: { name: string; href: string }[];
  intro: string;
  benefitsHeading: string | null;
  benefits: string[];
  scope: string;
  steps: string[];
  summary: string;
  eco: { heading: string; html: string } | null;
  faq: FaqItem[];
  seoTitle: string;
  seoDescription: string | null;
  h1: string;
  modified: string;
  published: string;
};

export type PostSummary = {
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  featured: PageImage | null;
  tags: string[];
  readingMinutes: number;
  seoDescription: string;
};

export type PostRecord = PostSummary & {
  seoTitle: string;
  toc: { id: string; text: string }[];
  wordCount: number;
  html: string;
  internalLinks: string[];
};

export type ImageMeta = { width: number; height: number; source?: string };

export const pages = pagesData as PageRecord[];
export const cities = (citiesData as CityRecord[]).slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
export const posts = postsIndex as PostSummary[];
export const imageMeta = imagesData as Record<string, ImageMeta>;

export function getPage(slug: string) {
  return pages.find((p) => p.slug === slug && p.kind !== "city");
}

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function imageSize(src: string, fallback: { width: number; height: number } = { width: 1600, height: 1067 }) {
  return imageMeta[src] ?? fallback;
}

/** Specialty / service pages that share the generic service template. */
export const SERVICE_PAGE_SLUGS = pages
  .filter((p) => p.kind !== "city" && !["ratgeber", "kontakt", "impressum", "datenschutzhinweis", "vielen-dank", "ueber-uns", "soziales-engagement"].includes(p.slug) && p.path !== "/")
  .map((p) => p.slug);

export function relatedPosts(post: PostRecord, limit = 3): PostSummary[] {
  const tagSet = new Set(post.tags.map((t) => t.toLowerCase()));
  const linked = new Set(post.internalLinks.map((l) => l.replace(/^\/|\/$/g, "")));
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      for (const t of p.tags) if (tagSet.has(t.toLowerCase())) score += 2;
      if (linked.has(p.slug)) score += 3;
      const words = post.title.toLowerCase().split(/\W+/).filter((w) => w.length > 5);
      for (const w of words) if (p.title.toLowerCase().includes(w)) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map((x) => x.p);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Berlin" }).format(new Date(iso.endsWith("Z") ? iso : `${iso}Z`));
}
