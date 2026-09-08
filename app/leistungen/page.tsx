import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { BenefitsSplit, BlogTeaser, ContactSection, HeroActions, PageHero, ServiceShowcase, TrustBar, WertanrechnungExplainer } from "@/components/sections";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Leistungen: Entrümpelung, Haushaltsauflösung & mehr",
  description: "Alle Leistungen von NRW-Haushaltsauflösung im Überblick: Haushalts- und Wohnungsauflösung, Entrümpelung, Büro- und Praxisauflösung, Nachlassankauf, Seniorenumzug, Messie-Räumung, Zwangsräumung, Demontage – zum Festpreis mit Wertanrechnung.",
  path: "/leistungen/",
});

export default function LeistungenPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Leistungen", path: "/leistungen/" }]), {
        "@context": "https://schema.org", "@type": "ItemList", name: "Leistungen von NRW-Haushaltsauflösung",
        itemListElement: [...SITE.services, ...SITE.specialties].map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${SITE.url}${s.path}` })),
      }]} />
      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Leistungen" }]}
        eyebrow="Unsere Leistungen"
        title="Alles rund um Räumung, Auflösung und Ankauf – aus einer Hand."
        lead="Drei Kernleistungen und viele Spezialfälle: Wir räumen, entsorgen, rechnen Werte an und übergeben besenrein. Immer zum garantierten Festpreis, immer nach kostenloser Besichtigung."
        image="/images/wp/2025-09-moebel-ausraeumen2x3.webp"
        imageAlt="Mitarbeiter tragen Möbel aus einer Wohnung"
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Seit {SITE.founded}</p><p className="mt-1 font-display text-xl">2.500+ Aufträge in ganz NRW</p></>}
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Kernleistungen" title="Das machen wir jeden Tag." />
          <ServiceShowcase className="mt-10" />
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Spezialleistungen" title="Für besondere Situationen." text="Vom Nachlassankauf über den Seniorenumzug bis zur Messie- oder Zwangsräumung – diskret, versichert und meist an einem Tag erledigt." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SITE.specialties.map((s, i) => (
              <Reveal as="li" key={s.path} delay={(i % 3) * 60}>
                <Link href={s.path} className="group flex h-full flex-col justify-between rounded-3xl border border-ink/6 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div>
                    <h3 className="font-sans text-lg font-bold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-700">Details <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container><WertanrechnungExplainer /></Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><BenefitsSplit image="/images/wp/2025-09-kueche-entruempelung2x3.webp" imageAlt="Küchen-Entrümpelung durch das Team" /></Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/ablauf/" className="group relative overflow-hidden rounded-[2rem] bg-forest-950 p-8 text-white">
              <p className="eyebrow text-leaf-300">Ablauf</p>
              <h2 className="display-sm mt-2 text-white">So läuft Ihre Räumung ab – in 5 Schritten.</h2>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Ablauf ansehen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
            <Link href="/einsatzgebiete/" className="group relative overflow-hidden rounded-[2rem] bg-leaf-700 p-8 text-white">
              <Image src="/images/wp/2020-10-auto.webp" alt="" fill sizes="50vw" quality={60} className="object-cover opacity-20 transition group-hover:scale-105" />
              <div className="relative">
                <p className="eyebrow text-leaf-100">Einsatzgebiete</p>
                <h2 className="display-sm mt-2 text-white">44 Städte in NRW mit eigener Seite.</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Ihre Stadt finden <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <ContactSection />
      <BlogTeaser />
    </>
  );
}
