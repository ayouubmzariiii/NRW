import type { Metadata } from "next";
import Image from "next/image";
import { getPage } from "@/lib/content";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Zigzag, toRows } from "@/components/zigzag";
import { Reveal } from "@/components/reveal";
import { VideoCard } from "@/components/video-card";
import { Container, SectionHeading } from "@/components/ui";
import { BlogTeaser, ContactSection, HeroActions, PageHero, PhilosophyStrip, ProcessSteps, ReviewsSection, StatsRow, TrustBar } from "@/components/sections";

export const metadata: Metadata = buildMetadata({
  title: "Über uns – NRW Haushaltsauflösung zum Festpreis",
  description: "Seit 2010 Ihr Partner für Entrümpelung, Haushaltsauflösung und Wohnungsauflösung in NRW. Lernen Sie Marco van der Sande und das Team von NRW-Haushaltsauflösung kennen.",
  path: "/ueber-uns/",
  image: "/images/marco-firmenwagen-og.jpg",
});

export default function UeberUnsPage() {
  const page = getPage("ueber-uns")!;
  const rows = toRows(page.sections.map((s) => ({ ...s, heading: s.heading?.replace(/:$/, "") ?? null })), 1400);
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Über uns", path: "/ueber-uns/" }]), { "@context": "https://schema.org", "@type": "AboutPage", name: "Über uns", url: `${SITE.url}/ueber-uns/`, mainEntity: { "@id": `${SITE.url}/#organization` } }]} />

      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Über uns" }]}
        eyebrow="NRW Haushaltsauflösung"
        title={<>Ihr Partner für Entrümpelungen und mehr – seit {SITE.founded}.</>}
        lead="Ein ganzheitlicher Anbieter für Entrümpelungen und Haushalts-/Wohnungsauflösungen aller Art – auch Umzug, Transporte, Aktenvernichtung und Demontage. Für Privat- und Geschäftskunden in ganz NRW."
        image="/images/marco-firmenwagen-portrait.webp"
        imageAlt={`${SITE.owner}, Inhaber von NRW-Haushaltsauflösung, vor dem Firmenwagen`}
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">{SITE.ownerRole} · Gründer</p><p className="mt-1 font-display text-xl">{SITE.owner}</p></>}
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container><Zigzag rows={rows} startRight={false} /></Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Unsere Firmenphilosophie" title="Vier Worte, die unser tägliches Handeln prägen." />
              <PhilosophyStrip columns={2} className="mt-8" />
            </div>
            <Reveal className="lg:col-span-5">
              <VideoCard id={SITE.video.id} title={SITE.video.title} poster={SITE.video.poster} posterAlt={`${SITE.owner} von NRW-Haushaltsauflösung`} aspect="aspect-[4/5]" className="mx-auto max-w-md lg:max-w-none" />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Zahlen & Fakten" title="Auf einen Blick." />
          <StatsRow className="mt-8" />
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[["/images/wp/2026-02-nrw.webp", "Team beim Abbau einer Küche"], ["/images/wp/2025-09-naegel-entfernen.webp", "Nägel werden aus der Wand entfernt"], ["/images/wp/2026-02-nrw2.webp", "High-Five vor dem Transporter"], ["/images/wp/2025-09-transporter-beladen1x2.webp", "Transporter wird beladen"]].map(([src, alt], i) => (
              <Reveal key={src} delay={i * 70} className={i % 2 ? "mt-6" : ""}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft"><Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 45vw" quality={70} className="object-cover" /></div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ProcessSteps light />
      <ReviewsSection compact />
      <ContactSection />
      <BlogTeaser />
    </>
  );
}
