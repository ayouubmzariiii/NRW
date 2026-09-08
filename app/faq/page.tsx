import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { getPage } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Container, SectionHeading } from "@/components/ui";
import { Faq } from "@/components/faq";
import { BlogTeaser, ContactSection, HeroActions, PageHero, ProcessSteps, TrustBar } from "@/components/sections";

export const metadata: Metadata = buildMetadata({
  title: "Häufige Fragen zu Haushaltsauflösung & Entrümpelung",
  description: "Antworten auf die häufigsten Fragen: Was kostet der Festpreis? Wie funktioniert die Wertanrechnung? Was bedeutet schlüsselabgabefertig? Ist die Besichtigung kostenlos? Was passiert bei Schäden?",
  path: "/faq/",
});

export default function FaqPage() {
  const buero = getPage("bueroaufloesung-praxisaufloesung")?.faq ?? [];
  const entr = getPage("entruempelung")?.faq ?? [];
  const groups = [
    { title: "Festpreis, Wertanrechnung & Ablauf", items: SITE.faq },
    { title: "Entrümpelung & Renovierung", items: entr },
    { title: "Büro- & Praxisauflösung", items: buero },
  ].filter((g) => g.items.length);
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Häufige Fragen", path: "/faq/" }]), faqJsonLd(groups.flatMap((g) => g.items))]} />
      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Häufige Fragen" }]}
        eyebrow="FAQ"
        title="Häufige Fragen – kurz und ehrlich beantwortet."
        lead="Alles zu Festpreis, Wertanrechnung, Versicherung, Übergabe und Ablauf. Ihre Frage ist nicht dabei? Rufen Sie uns an – wir sind rund um die Uhr erreichbar."
        image="/images/wp/2025-09-naegel-entfernen.webp"
        imageAlt="Nägel werden aus der Wand entfernt – schlüsselabgabefertig"
      >
        <HeroActions />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      {groups.map((g, gi) => (
        <section key={g.title} className={gi % 2 ? "bg-paper py-12 sm:py-16 lg:py-20" : "py-12 sm:py-16 lg:py-20"}>
          <Container className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4"><SectionHeading title={g.title} as="h2" className="lg:sticky lg:top-28" /></div>
            <div className="rounded-[2rem] border border-ink/6 bg-white px-6 shadow-soft sm:px-8 lg:col-span-8"><Faq items={g.items} openFirst={gi === 0} /></div>
          </Container>
        </section>
      ))}

      <ProcessSteps light />
      <ContactSection />
      <BlogTeaser />
    </>
  );
}
