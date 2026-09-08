import type { Metadata } from "next";
import { type PageRecord } from "@/lib/content";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, serviceJsonLd, stripTags, truncate } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/faq";
import { Zigzag, toRows } from "@/components/zigzag";
import { Container, SectionHeading } from "@/components/ui";
import { BenefitsSplit, BlogTeaser, ContactSection, HeroActions, PageHero, ProcessSteps, ReviewsSection, ServiceChips, TrustBar } from "@/components/sections";

const DEFAULT_IMAGES: Record<string, { src: string; alt: string }> = {
  entruempelung: { src: "/images/wp/2025-09-kueche-entruempelung2x3.webp", alt: "Küchen-Entrümpelung durch NRW-Haushaltsauflösung" },
  "haushaltsaufloesung-wohnungsaufloesung": { src: "/images/wp/2025-09-moebel-ausraeumen2x3.webp", alt: "Möbel werden bei einer Wohnungsauflösung ausgeräumt" },
  "bueroaufloesung-praxisaufloesung": { src: "/images/wp/2025-09-bueroaufloesung.webp", alt: "Büroauflösung durch NRW-Haushaltsauflösung" },
  demontage: { src: "/images/wp/2025-09-kuechenausbau.webp", alt: "Demontage einer Einbauküche" },
  "umzug-transporte": { src: "/images/wp/2025-09-transporter-beladen1x2.webp", alt: "Transporter wird beladen" },
  seniorenumzug: { src: "/images/wp/2025-09-abtransport-entruempelung.webp", alt: "Abtransport bei einem Seniorenumzug" },
  "seniorenumzug-duesseldorf": { src: "/images/wp/2025-09-abtransport-entruempelung.webp", alt: "Abtransport bei einem Seniorenumzug in Düsseldorf" },
  wertanrechnung: { src: "/images/wp/2026-02-nrw.webp", alt: "Team beim Abbau einer Küche" },
  nachlassankauf: { src: "/images/wp/2026-02-3-bei-der-arbeit.webp", alt: "Mitarbeiter bei einer Haushaltsauflösung" },
  "nachlassankauf-duesseldorf": { src: "/images/wp/2026-02-3-bei-der-arbeit.webp", alt: "Mitarbeiter bei einer Haushaltsauflösung in Düsseldorf" },
  hausaufloesung: { src: "/images/wp/2025-09-entruempelung-haushaltsaufloesung2x3.webp", alt: "Hausauflösung durch NRW-Haushaltsauflösung" },
};
const FALLBACKS = ["/images/wp/2026-02-nrw2.webp", "/images/wp/2025-09-naegel-entfernen.webp", "/images/wp/2026-02-2bei-der-arbeit.webp", "/images/wp/2026-02-4-bei-der-arbeit.webp", "/images/wp/2025-09-entruempelung-haushaltsaufloesung2x3.webp", "/images/wp/2026-02-bei-der-arbeit.webp"];

function heroImage(page: PageRecord) {
  if (DEFAULT_IMAGES[page.slug]) return DEFAULT_IMAGES[page.slug];
  const own = page.images.find((i) => !/marco/.test(i.src));
  if (own) return { src: own.src, alt: own.alt || page.h1 };
  let h = 0;
  for (const ch of page.slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { src: FALLBACKS[h % FALLBACKS.length], alt: `${page.title} – NRW-Haushaltsauflösung bei der Arbeit` };
}

function cleanTitle(t: string) {
  return t.replace(/­/g, "").replace(/^NRW-Haushaltsauflösung:\s*/i, "").trim();
}
const shortName = (t: string) => t.split(/\s*[&/]\s*/)[0];

/** First paragraph of the intro becomes the hero lead; the rest moves into the body. */
function splitIntro(html: string) {
  const m = html.match(/^\s*(<p>[\s\S]*?<\/p>)([\s\S]*)$/);
  if (!m) return { lead: stripTags(html), rest: "" };
  const lead = stripTags(m[1]);
  return lead.length > 320 ? { lead: truncate(lead, 300), rest: html } : { lead, rest: m[2].trim() };
}

export function servicePageMetadata(page: PageRecord): Metadata {
  const intro = page.sections[0] ? stripTags(page.sections[0].html) : "";
  const desc = page.seoDescription || truncate(`${cleanTitle(page.title)} in ganz NRW: kostenlose Besichtigung, garantierter Festpreis, Wertanrechnung, besenrein & schlüsselabgabefertig. ${intro}`);
  const t = page.seoTitle.replace(/\s*-\s*Zum Festpreis mit Wertanrechnung\s*$/i, "");
  return buildMetadata({ title: /Festpreis|NRW/i.test(t) ? t : `${t} zum Festpreis mit Wertanrechnung`, description: desc, path: page.path, image: heroImage(page).src });
}

export function ServicePage({ page }: { page: PageRecord }) {
  const title = cleanTitle(page.h1);
  const short = shortName(title);
  const [intro, ...rest] = page.sections;
  const { lead, rest: introRest } = intro ? splitIntro(intro.html) : { lead: "", rest: "" };
  const bodySections = [...(introRest ? [{ heading: null, level: 2, html: introRest }] : []), ...rest];
  const rows = toRows(bodySections);
  const faqItems = [...page.faq, ...(page.usesGlobalFaq || page.faq.length === 0 ? SITE.faq.slice(0, 5) : [])];
  const img = heroImage(page);
  const shortDesc = page.seoDescription || truncate(lead, 200);

  return (
    <>
      <JsonLd data={[
        serviceJsonLd({ name: cleanTitle(page.title), description: shortDesc, path: page.path }),
        breadcrumbJsonLd([{ name: "Leistungen", path: "/leistungen/" }, { name: cleanTitle(page.title), path: page.path }]),
        faqJsonLd(faqItems),
      ]} />

      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Leistungen", href: "/leistungen/" }, { name: cleanTitle(page.title) }]}
        eyebrow={page.subtitle ?? `Seit ${SITE.founded} in ganz Nordrhein-Westfalen`}
        title={title}
        lead={lead}
        image={img.src}
        imageAlt={img.alt}
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Unser Versprechen</p><p className="mt-1 font-display text-xl">Besenrein & schlüsselabgabefertig – pünktlich zum Termin.</p></>}
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      {rows.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-24">
          <Container><Zigzag rows={rows} images={page.images} exclude={[img.src]} /></Container>
        </section>
      )}

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><BenefitsSplit title={`${short} mit allen Vorteilen – ohne versteckte Kosten.`} image={FALLBACKS[(title.length + 1) % FALLBACKS.length]} imageAlt="Team von NRW-Haushaltsauflösung bei der Arbeit" /></Container>
      </section>

      <ProcessSteps title={`Ablauf: ${short} in 5 Schritten`} light />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4"><SectionHeading eyebrow="Häufig gestellte Fragen" title={`Fragen zur ${short}`} text="Kurz und ehrlich beantwortet. Weitere Fragen klären wir gerne persönlich am Telefon." className="lg:sticky lg:top-28" /></div>
          <div className="rounded-[2rem] border border-ink/6 bg-white px-6 shadow-soft sm:px-8 lg:col-span-8"><Faq items={faqItems} /></div>
        </Container>
      </section>

      <ReviewsSection compact light />

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Weitere Leistungen" title="Alles aus einer Hand." />
          <ServiceChips exclude={page.path} className="mt-8" />
        </Container>
      </section>

      <ContactSection title={`Kostenlose Besichtigung für Ihre ${short} anfragen`} />
      <BlogTeaser />
    </>
  );
}
