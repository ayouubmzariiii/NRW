import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Zigzag, splitLongHtml } from "@/components/zigzag";
import { Reveal } from "@/components/reveal";
import { VideoCard } from "@/components/video-card";
import { Container, SectionHeading } from "@/components/ui";
import { BlogTeaser, ContactSection, HeroActions, PageHero, PhilosophyStrip } from "@/components/sections";
import { HeartIcon, HomeIcon, LeafIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Soziales Engagement & Nachhaltigkeit",
  description: "Nachhaltigkeit und soziales Engagement bei NRW-Haushaltsauflösung: Brauchbare Möbel und Hausrat aus Haushaltsauflösungen spenden wir an Flüchtlingsheime, Second-Hand-Möbelhäuser und karitative Einrichtungen.",
  path: "/soziales-engagement/",
  image: "/images/wp/2025-09-transporter-beladen1x2.webp",
});

export default function SozialesPage() {
  const page = getPage("soziales-engagement")!;
  const main = page.sections[0];
  // The original page is one long block – split it into readable rows at its inner headings.
  const chunks = splitLongHtml(main.html.replace(/<p><strong>([^<]+)<\/strong><\/p>/g, "<h3>$1</h3>"), 1100);
  const rows = chunks.map((html, i) => ({ heading: i === 0 ? main.heading : null, html }));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Soziales Engagement", path: "/soziales-engagement/" }])} />
      <PageHero
        dark
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Soziales Engagement" }]}
        eyebrow="Nachhaltigkeit & soziales Engagement"
        title="Mit jedem Auftrag tragen Sie zu einer besseren Welt bei."
        lead="Wir verbinden professionellen Service mit sozialer Verantwortung: Was noch gut ist, bekommt eine zweite Chance – in Flüchtlingsheimen, Second-Hand-Möbelhäusern und karitativen Einrichtungen in NRW."
        image="/images/wp/2025-09-transporter-beladen1x2.webp"
        imageAlt="Beladen des Transporters bei einer Entrümpelung"
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Weitergeben statt wegwerfen</p><p className="mt-1 font-display text-xl">Möbel, Kleidung, Hausrat</p></>}
      >
        <HeroActions dark />
      </PageHero>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3">
            {[[HomeIcon, "Flüchtlingsheime", "Möbel, Kleidung und Haushaltsgegenstände für einen würdigen Start im neuen Zuhause."], [HeartIcon, "Second-Hand-Möbelhäuser", "Gute Möbel zu günstigen Preisen – und Arbeitsplätze für Menschen in schwierigen Lebenslagen."], [LeafIcon, "Karitative Einrichtungen", "Kleidung, Spielzeug, Bücher und mehr für Bedürftige in unserer Gemeinschaft."]].map(([Icon, t, d], i) => {
              const I = Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
              return (
                <Reveal as="li" key={t as string} delay={i * 70} className="rounded-3xl border border-ink/6 bg-white p-6 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-500/10 text-leaf-700"><I className="h-5 w-5" /></span>
                  <p className="mt-4 text-lg font-bold text-ink">{t as string}</p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{d as string}</p>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><Zigzag rows={rows} images={[{ src: "/images/wp/2025-09-abtransport-entruempelung.webp", alt: "Abtransport von Möbeln" }, { src: "/images/wp/2026-02-nrw2.webp", alt: "Zwei Mitarbeiter beim High-Five vor dem Transporter" }, { src: "/images/wp/2025-09-moebel-ausraeumen2x3.webp", alt: "Mitarbeiter tragen Möbel aus einer Wohnung" }]} /></Container>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <VideoCard id={SITE.videoSocial.id} title={SITE.videoSocial.title} poster="/images/wp/2025-09-nrw-haushaltsaufloesung-marco.webp" posterAlt={`${SITE.owner} von NRW-Haushaltsauflösung`} aspect="aspect-[4/5]" className="mx-auto max-w-md lg:max-w-none" />
            </Reveal>
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="NRW-Haushaltsauflösung" title="Ein ganzheitlicher Anbieter – mit klarer Haltung." text="Unsere Firmenphilosophie spiegelt genau unsere Vorgehensweise wider – bei Geschäftsauflösungen, Entrümpelungen und Haushaltsauflösungen aller Art." />
              <PhilosophyStrip columns={2} className="mt-8" />
            </div>
          </div>
        </Container>
      </section>
      <ContactSection title="Gemeinsam können wir einen Unterschied machen." text="Für weitere Informationen oder um Ihren Auftrag zu besprechen, kontaktieren Sie uns – kostenlos und unverbindlich." />
      <BlogTeaser />
    </>
  );
}
