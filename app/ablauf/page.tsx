import type { Metadata } from "next";
import Image from "next/image";
import { SITE, TEAM_PHOTOS } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { BlogTeaser, ContactSection, HeroActions, PageHero, ReviewsSection, StatsRow, TrustBar, WertanrechnungExplainer } from "@/components/sections";

export const metadata: Metadata = buildMetadata({
  title: "Ablauf & Festpreis: So läuft Ihre Haushaltsauflösung ab",
  description: "In 5 Schritten zur besenreinen Übergabe: kostenlose Besichtigung, Wertermittlung & Festpreis, Räumung an einem Tag, Schlüsselübergabe, Entsorgungsnachweis. Keine Vorauszahlung, keine versteckten Kosten.",
  path: "/ablauf/",
});

const STEP_DETAILS = [
  "Wir kommen zu Ihnen – oft noch am selben Tag, auch abends oder am Wochenende. Die Besichtigung ist kostenlos und verpflichtet Sie zu nichts.",
  "Vor Ort bewerten wir den Hausrat. Verwertbares wird auf den Preis angerechnet. Sie erhalten sofort ein Festpreisangebot, in dem alles enthalten ist: Arbeit, Transport, Entsorgung, An- und Abfahrt.",
  "Zum vereinbarten Termin räumt unser Team das Objekt komplett – inklusive Keller, Dachboden, Garage. Nägel, Schrauben, Teppiche und Wandverkleidungen entfernen wir auf Wunsch gleich mit.",
  "Sie übernehmen die Räume besenrein und schlüsselabgabefertig. Auf Wunsch übergeben wir direkt an Vermieter, Nachmieter oder Käufer – persönlich oder postalisch.",
  "Für Behörden, Vermieter oder Erbengemeinschaften stellen wir Ihnen auf Wunsch einen Entsorgungsnachweis aus. Abgerechnet wird erst nach Abschluss – ohne Vorauszahlung.",
];

export default function AblaufPage() {
  const faq = SITE.faq;
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Ablauf", path: "/ablauf/" }]), faqJsonLd(faq), {
        "@context": "https://schema.org", "@type": "HowTo", name: "Ablauf einer Haushaltsauflösung mit NRW-Haushaltsauflösung",
        step: SITE.process.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: STEP_DETAILS[i] })),
      }]} />
      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Ablauf" }]}
        eyebrow="Ablauf & Festpreis"
        title="Von der Besichtigung bis zur Schlüsselübergabe – in 5 Schritten."
        lead="Transparent von Anfang an: Sie wissen vor dem ersten Handgriff, was es kostet. In über 90 % aller Fälle sind wir an einem Tag fertig."
        image="/images/wp/2026-02-nrw.webp"
        imageAlt="NRW Haushaltsauflösung Team beim Abbau einer Küche"
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Festpreisgarantie</p><p className="mt-1 font-display text-xl">Keine Vorauszahlung, keine versteckten Kosten</p></>}
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Schritt für Schritt" title="So läuft es ab." />
          <ol className="mt-12 grid gap-6">
            {SITE.process.map((s, i) => {
              const img = TEAM_PHOTOS[(i + 1) % TEAM_PHOTOS.length];
              return (
                <Reveal as="li" key={s.title} className="grid items-center gap-6 rounded-[2rem] border border-ink/6 bg-white p-4 shadow-soft md:grid-cols-[8rem_1fr_16rem] md:p-6">
                  <span className="font-display text-6xl leading-none text-leaf-600 md:text-7xl">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-ink">{s.title}</h3>
                    <p className="mt-1 font-semibold text-forest-700">{s.text}</p>
                    <p className="mt-3 leading-relaxed text-muted">{STEP_DETAILS[i]}</p>
                  </div>
                  <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:block">
                    <Image src={img.src} alt={img.alt} fill sizes="256px" quality={65} className="object-cover" />
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><WertanrechnungExplainer /></Container>
      </section>

      <section className="py-16"><Container><StatsRow /></Container></section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Häufig gestellte Fragen" title="Alles, was Sie vor der Räumung wissen wollen." text="Die wichtigsten Antworten zu Festpreis, Wertanrechnung, Versicherung und Übergabe." className="lg:sticky lg:top-28" />
          </div>
          <div className="rounded-[2rem] border border-ink/6 bg-white px-6 shadow-soft sm:px-8 lg:col-span-7"><Faq items={faq} /></div>
        </Container>
      </section>

      <ReviewsSection compact light />
      <ContactSection />
      <BlogTeaser />
    </>
  );
}
