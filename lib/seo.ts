import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

const OG_IMAGE = "/images/og-default.jpg";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image ?? OG_IMAGE);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: opts.type ?? "website",
      url,
      title: opts.title,
      description: opts.description,
      siteName: SITE.name,
      locale: "de_DE",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      ...(opts.type === "article" ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime, authors: [SITE.name] } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl(OG_IMAGE),
    telephone: `+49${SITE.phoneMobile.replace(/\s/g, "").slice(1)}`,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    founder: { "@type": "Person", name: SITE.owner },
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: SITE.address.city,
      addressCountry: "DE",
    },
    areaServed: { "@type": "State", name: "Nordrhein-Westfalen" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating.value,
      bestRating: SITE.rating.best,
      reviewCount: SITE.rating.count,
    },
    sameAs: SITE.rating.sources.map((s) => s.url),
    makesOffer: SITE.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(s.path) },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "de",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Startseite", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() },
    })),
  };
}

export function serviceJsonLd(opts: { name: string; description: string; path: string; area?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    serviceType: opts.name,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: opts.area ? { "@type": "City", name: opts.area } : { "@type": "State", name: "Nordrhein-Westfalen" },
    offers: { "@type": "Offer", priceCurrency: "EUR", description: "Kostenlose Besichtigung, garantierter Festpreis, Wertanrechnung" },
  };
}

export function articleJsonLd(opts: { title: string; description: string; path: string; image?: string; published: string; modified: string; wordCount: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: absoluteUrl(opts.path),
    image: opts.image ? [absoluteUrl(opts.image)] : undefined,
    datePublished: `${opts.published}Z`,
    dateModified: `${opts.modified}Z`,
    wordCount: opts.wordCount,
    inLanguage: "de",
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(s: string, n = 155) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
