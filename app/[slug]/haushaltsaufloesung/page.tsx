import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCity } from "@/lib/content";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, serviceJsonLd, stripTags, truncate } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { Faq } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeading } from "@/components/ui";
import { BlogTeaser, CitiesTeaser, ContactSection, HeroActions, PageHero, ProcessSteps, ReviewsSection, ServiceShowcase, TrustBar } from "@/components/sections";
import { ArrowRight, CheckIcon, LeafIcon, MapPinIcon } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

const HERO_IMAGES = ["/images/wp/2025-09-moebel-ausraeumen2x3.webp", "/images/wp/2026-02-nrw.webp", "/images/wp/2025-09-kueche-entruempelung2x3.webp", "/images/wp/2026-02-nrw2.webp", "/images/wp/2025-09-entruempelung-haushaltsaufloesung2x3.webp", "/images/wp/2026-02-3-bei-der-arbeit.webp"];
function pick(slug: string, offset = 0) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return HERO_IMAGES[(h + offset) % HERO_IMAGES.length];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  const desc = city.seoDescription || truncate(`Haushaltsauflösung in ${city.name} zum garantierten Festpreis: kostenlose Besichtigung, Wertanrechnung, besenrein & schlüsselabgabefertig, keine Vorauszahlung. Seit ${SITE.founded} in ganz NRW – auch kurzfristig.`);
  return buildMetadata({ title: `Haushaltsauflösung ${city.name} – Festpreis mit Wertanrechnung`, description: desc, path: city.path, image: pick(slug) });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  const faqItems = [...city.faq, ...SITE.faq.slice(0, 3)];
  const h1 = city.h1.replace(/\s*–\s*/g, " – ").replace(/(\S)–/g, "$1 –").replace(/\s+/g, " ");
  const paragraphs = city.intro.split("</p>").filter((p) => p.trim()).map((p) => `${p}</p>`);
  // Hero shows the opening sentence only – the full paragraph follows in the body.
  const firstParagraph = stripTags(paragraphs[0] ?? "");
  const cut = firstParagraph.indexOf(". ");
  const lead = cut > 60 && cut < 200 ? firstParagraph.slice(0, cut + 1) : truncate(firstParagraph, 180);
  const restIntro = paragraphs.join("");

  return (
    <>
      <JsonLd data={[
        serviceJsonLd({ name: `Haushaltsauflösung ${city.name}`, description: stripTags(city.summary || city.intro).slice(0, 300), path: city.path, area: city.name }),
        breadcrumbJsonLd([{ name: "Einsatzgebiete", path: "/einsatzgebiete/" }, { name: `Haushaltsauflösung ${city.name}`, path: city.path }]),
        faqJsonLd(faqItems),
      ]} />

      <PageHero
        crumbs={[{ name: "Startseite", href: "/" }, { name: "Einsatzgebiete", href: "/einsatzgebiete/" }, { name: city.name }]}
        eyebrow={<><MapPinIcon className="h-4 w-4" /> Einsatzgebiet {city.name} · seit {SITE.founded}</>}
        title={h1}
        lead={lead}
        image={pick(slug)}
        imageAlt={`Haushaltsauflösung in ${city.name} durch NRW-Haushaltsauflösung`}
        badge={<><p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Vor Ort in {city.name}</p><p className="mt-1 font-display text-xl">Besichtigung oft noch am selben Tag.</p></>}
      >
        <HeroActions primaryHref="#kontakt" primaryLabel={`Besichtigung in ${city.name}`} />
      </PageHero>
      <TrustBar className="bg-paper/70 py-3" />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {restIntro && <Prose html={restIntro} className="prose-lead" />}
            {city.benefits.length > 0 && (
              <>
                <h2 className="display-md mt-8 text-balance">{city.benefitsHeading ?? `Ihre Vorteile in ${city.name}`}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {city.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-semibold text-ink shadow-soft"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white"><CheckIcon className="h-4 w-4" /></span>{b}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-soft lg:max-w-none">
              <Image src={pick(slug, 2)} alt={`Team von NRW-Haushaltsauflösung bei einer Räumung – auch in ${city.name}`} fill sizes="(min-width: 1024px) 420px, 90vw" quality={72} className="object-cover" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container className="grid gap-6 lg:grid-cols-2">
          {city.scope && (
            <Reveal className="rounded-[2rem] border border-ink/6 bg-white p-7 shadow-soft sm:p-9">
              <h2 className="display-sm">Leistungsumfang in {city.name}</h2>
              <Prose html={city.scope} className="mt-4" />
              <Link href="/leistungen/" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-700">Alle Leistungen <ArrowRight className="h-4 w-4" /></Link>
            </Reveal>
          )}
          {city.steps.length > 0 && (
            <Reveal delay={80} className="grain rounded-[2rem] bg-forest-950 p-7 text-white sm:p-9">
              <h2 className="display-sm text-white">Ablauf in {city.name}</h2>
              <ol className="mt-5 grid gap-3">
                {city.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-4"><span className="font-display text-2xl leading-none text-leaf-400">{String(i + 1).padStart(2, "0")}</span><span className="font-semibold">{s}</span></li>
                ))}
              </ol>
              <Link href="/ablauf/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-300">Ablauf im Detail <ArrowRight className="h-4 w-4" /></Link>
            </Reveal>
          )}
        </Container>
      </section>

      {(city.eco || city.summary) && (
        <section className="py-14 sm:py-20 lg:py-24">
          <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-soft lg:max-w-none">
                <Image src={pick(slug, 4)} alt="Fachgerechte Entsorgung und Wertanrechnung" fill sizes="(min-width: 1024px) 420px, 90vw" quality={72} className="object-cover" />
              </div>
            </Reveal>
            <div className="lg:col-span-7">
              {city.eco && (
                <div className="rounded-[2rem] bg-leaf-50 p-7 sm:p-9">
                  <LeafIcon className="h-7 w-7 text-leaf-700" />
                  <h2 className="display-sm mt-3 text-balance">{city.eco.heading}</h2>
                  <Prose html={city.eco.html} className="mt-4 prose-compact" />
                </div>
              )}
              {city.summary && (<><h2 className="display-sm mt-8">Zusammengefasst</h2><Prose html={city.summary} className="mt-3 prose-compact" /></>)}
            </div>
          </Container>
        </section>
      )}

      <ProcessSteps light title={`Ablauf: Haushaltsauflösung in ${city.name}`} />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Häufig gestellte Fragen" title={`Fragen zur Haushaltsauflösung in ${city.name}`} className="lg:sticky lg:top-28" />
            {city.neighbors.length > 0 && (
              <div className="mt-8 rounded-3xl border border-ink/6 bg-white p-5 shadow-soft">
                <p className="eyebrow">Nachbarstädte</p>
                <ul className="mt-3 grid gap-1">
                  {city.neighbors.map((n) => <li key={n.href}><Link href={n.href} className="flex items-center justify-between rounded-xl px-3 py-2 font-semibold text-ink transition hover:bg-leaf-50 hover:text-leaf-800">Haushaltsauflösung {n.name} <ArrowRight className="h-4 w-4 text-leaf-700" /></Link></li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-[2rem] border border-ink/6 bg-white px-6 shadow-soft sm:px-8 lg:col-span-8"><Faq items={faqItems} /></div>
        </Container>
      </section>

      <ReviewsSection compact light />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Weitere Leistungen" title={`Auch in ${city.name}: Entrümpelung, Büro- & Praxisauflösung.`} />
          <ServiceShowcase className="mt-10" />
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><CitiesTeaser current={slug} title="Weitere Städte in NRW." /></Container>
      </section>

      <ContactSection title={`Kostenlose Besichtigung in ${city.name} anfragen`} defaultOrt={city.name} />
      <BlogTeaser />
    </>
  );
}
