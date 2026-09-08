import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Container, SectionHeading, Stars } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { BenefitsSplit, BlogTeaser, ContactSection, HeroActions, PageHero, ReviewCard, TrustBar } from "@/components/sections";
import { ReviewSources } from "@/components/review-sources";
import { ReviewCarousel } from "@/components/review-carousel";

export const metadata: Metadata = buildMetadata({
  title: "Bewertungen: 4,97 von 5 – Sehr Gut",
  description: `NRW-Haushaltsauflösung wird von Kunden mit ${SITE.rating.value.toLocaleString("de-DE")} von 5 bewertet (${SITE.rating.count} Bewertungen auf AUSGEZEICHNET.org und Google). Lesen Sie echte Erfahrungen zu Haushaltsauflösung und Entrümpelung in NRW.`,
  path: "/bewertungen/",
});

export default function BewertungenPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Bewertungen", path: "/bewertungen/" }])} />
      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Bewertungen" }]}
        eyebrow="Meinungen unserer Kunden"
        title={<>Bewertet mit <span className="text-leaf-700">Sehr Gut</span> – von echten Kunden.</>}
        lead={`${SITE.rating.count} unabhängig geprüfte Bewertungen auf ${SITE.rating.provider} und Google, Durchschnitt ${SITE.rating.value.toLocaleString("de-DE")} von 5. Das loben unsere Kunden am häufigsten: freundliche und professionelle Mitarbeiter, effizienter Service und Einfühlungsvermögen in schwierigen Situationen.`}
        image="/images/wp/2026-02-nrw2.webp"
        imageAlt="Zwei Mitarbeiter beim High-Five vor dem Transporter"
        badge={<><Stars size="h-5 w-5" /><p className="mt-1 font-display text-2xl">{SITE.rating.value.toLocaleString("de-DE")} / 5 · {SITE.rating.label}</p></>}
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Bewertungsportale" title="Geprüft auf zwei Plattformen." text="Unsere Gesamtnote setzt sich aus verifizierten Bewertungen auf AUSGEZEICHNET.org und den Google-Rezensionen zum Unternehmen zusammen." />
          <ReviewSources className="mt-10" />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[["98 %", "5-Sterne-Bewertungen"], ["5,00", "Qualität"], ["5,00", "Preis-Leistung"], ["4,94", "Termintreue"]].map(([v, l]) => (
              <Reveal key={l} className="rounded-3xl bg-white p-6 shadow-soft">
                <p className="font-display text-3xl leading-none text-ink sm:text-4xl">{v}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-leaf-700 sm:text-sm">{l}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">Teilwertungen laut {SITE.rating.provider}, Stand August 2026.</p>
        </Container>
      </section>

      <section className="overflow-x-clip bg-paper py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Kundenstimmen" title="Das sagen unsere Kunden." text="Alle Bewertungen stammen aus den öffentlichen Profilen auf AUSGEZEICHNET.org und Google." />
          <ReviewCarousel className="mt-10" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SITE.reviews.map((r, i) => (
              <Reveal as="li" key={r.name + r.date} delay={(i % 3) * 70}><ReviewCard r={r} /></Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container><BenefitsSplit title="Warum unsere Kunden uns weiterempfehlen." image="/images/wp/2025-09-moebel-ausraeumen2x3.webp" imageAlt="Mitarbeiter tragen Möbel aus einer Wohnung" /></Container>
      </section>
      <ContactSection title="Überzeugen Sie sich selbst – kostenlose Besichtigung anfragen" />
      <BlogTeaser />
    </>
  );
}
