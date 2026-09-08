import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { cities } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Container, SectionHeading } from "@/components/ui";
import { CitiesGrid } from "@/components/cities-grid";
import { BenefitsSplit, BlogTeaser, ContactSection, HeroActions, PageHero, ProcessSteps, ReviewsSection, TrustBar } from "@/components/sections";

export const metadata: Metadata = buildMetadata({
  title: "Einsatzgebiete: Haushaltsauflösung in ganz NRW",
  description: `Haushaltsauflösung und Entrümpelung in ${cities.length} Städten in Nordrhein-Westfalen – Düsseldorf, Köln, Essen, Duisburg, Wuppertal, Neuss und mehr. Kostenlose Besichtigung, Festpreis, Wertanrechnung.`,
  path: "/einsatzgebiete/",
});

export default function EinsatzgebietePage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Einsatzgebiete", path: "/einsatzgebiete/" }]), {
        "@context": "https://schema.org", "@type": "ItemList", name: "Einsatzgebiete",
        itemListElement: cities.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `Haushaltsauflösung ${c.name}`, url: `${SITE.url}${c.path}` })),
      }]} />
      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Einsatzgebiete" }]}
        eyebrow="Einsatzgebiete"
        title="In ganz Nordrhein-Westfalen für Sie im Einsatz."
        lead={`Unser Sitz ist Düsseldorf, unser Einsatzgebiet ganz NRW: von Köln und Leverkusen über Neuss und Krefeld bis ins Ruhrgebiet und Bergische Land. ${cities.length} Städte haben eine eigene Seite – kommen Sie aus einem anderen Ort, rufen Sie einfach an.`}
        image="/images/wp/2021-01-auto-und-marco2.webp"
        imageAlt={`${SITE.owner} vor dem Firmenwagen von NRW-Haushaltsauflösung`}
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Kostenlose Anfahrt</p><p className="mt-1 font-display text-xl">Besichtigung oft noch am selben Tag</p></>}
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Ihre Stadt" title="Wählen Sie Ihre Stadt." text="Jede Städteseite enthält Vorteile vor Ort, Leistungsumfang, Ablauf und Antworten auf häufige Fragen." />
          <div className="mt-10"><CitiesGrid cities={cities.map(({ slug, name, path }) => ({ slug, name, path }))} regions={SITE.regions} /></div>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><BenefitsSplit title="Überall in NRW mit denselben Vorteilen." image="/images/wp/2025-09-transporter-beladen1x2.webp" imageAlt="Transporter wird beladen" /></Container>
      </section>

      <ProcessSteps light />
      <ReviewsSection compact />
      <ContactSection title="Kostenlose Besichtigung an Ihrem Ort anfragen" />
      <BlogTeaser />
    </>
  );
}
