import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Button, Container, Eyebrow, SectionHeading, Stars } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { VideoCard } from "@/components/video-card";
import { BlogTeaser, CitiesTeaser, ContactSection, ProcessSteps, ReviewsSection, ServiceShowcase, StatsRow, TrustBar } from "@/components/sections";
import { ReviewSourceStrip } from "@/components/review-sources";
import { ArrowRight, CheckIcon, ClockIcon, EuroIcon, HeartIcon, HomeIcon, KeyIcon, PhoneIcon, ShieldIcon, TagIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Entrümpelung & Wohnungsauflösung | NRW-Haushaltsauflösung",
  description:
    "Haushaltsauflösung, Entrümpelung & Nachlassankauf in NRW. Kostenlose Besichtigung & unverbindliches Angebot ✔ Schnell & diskret ✔ Privat- & Geschäftlich ✔",
  path: "/",
});

const BENEFIT_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  besichtigung: HomeIcon,
  wertanrechnung: TagIcon,
  festpreis: EuroIcon,
  schluessel: KeyIcon,
  express: ClockIcon,
  versicherung: ShieldIcon,
};

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[52rem] bg-[radial-gradient(60rem_40rem_at_80%_-10%,rgb(60_173_43/0.16),transparent_60%),radial-gradient(40rem_30rem_at_0%_30%,rgb(69_99_78/0.12),transparent_60%)]" aria-hidden />
        <Container className="grid items-center gap-12 pb-14 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-16">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-3.5 py-1.5 text-xs font-bold text-white"><span className="h-2 w-2 rounded-full bg-leaf-400" /> Seit {SITE.founded} in ganz NRW</span>
              <Link href="/bewertungen/" className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink shadow-soft"><Stars size="h-3.5 w-3.5" /> {SITE.rating.value.toLocaleString("de-DE")} · {SITE.rating.label} · {SITE.rating.count} Bewertungen</Link>
            </div>
            <ReviewSourceStrip className="mt-4" />
            <h1 className="display-xl mt-7 text-balance text-ink">
              Wohnungsauflösung &amp; Entrümpelung <span className="relative inline-block text-leaf-700">zum Festpreis.<svg className="absolute -bottom-2 left-0 h-3 w-full text-leaf-500/50" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden><path d="M2 9c40-6 120-8 196-3" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg></span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              Kostenlose Besichtigung, garantierter Festpreis, faire Wertanrechnung – und in über 90 % der Fälle an einem Tag besenrein übergeben. Für Privat- und Geschäftskunden in ganz Nordrhein-Westfalen.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Button href="/kontakt/" size="lg">Kostenlose Besichtigung <ArrowRight className="h-5 w-5 shrink-0" /></Button>
              <Button href={SITE.phoneMobileHrefPlain} variant="outline" size="lg"><PhoneIcon className="h-5 w-5 shrink-0 text-leaf-700" /> {SITE.phoneMobile}</Button>
            </div>
            <ul className="mt-6 grid gap-2 text-[0.95rem] font-medium text-ink/80 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {["Wertanrechnung senkt Ihre Kosten", "Besenrein & schlüsselabgabefertig", "Betriebshaftpflicht versichert"].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckIcon className="h-5 w-5 shrink-0 text-leaf-600" /> {t}</li>
              ))}
            </ul>
          </div>

          {/* Original photo cluster on desktop; hidden on phones, where it read as noise. */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="grid grid-cols-[1.35fr_1fr] gap-3">
              <VideoCard id={SITE.video.id} title={SITE.video.title} poster={SITE.video.poster} posterAlt={`${SITE.owner}, ${SITE.ownerRole} von NRW-Haushaltsauflösung`} priority className="row-span-2" aspect="aspect-[3/4.3]" />
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-soft">
                <Image src="/images/wp/2026-02-nrw.webp" alt="NRW Haushaltsauflösung Team beim Abbau einer Küche" width={607} height={867} sizes="240px" quality={80} priority className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-soft">
                <Image src="/images/wp/2026-02-nrw2.webp" alt="Zwei Mitarbeiter von NRW Haushaltsauflösung beim High-Five vor dem Transporter" width={602} height={832} sizes="240px" quality={80} className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="absolute -left-8 bottom-8 rounded-2xl bg-white/95 p-4 shadow-lift backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Erfahrung</p>
              <p className="font-display text-3xl leading-none text-ink">2.500+ <span className="text-base text-muted">Aufträge</span></p>
            </div>
            <div className="absolute -right-6 top-6 flex items-center gap-2 rounded-2xl bg-forest-950 px-4 py-3 text-white shadow-lift">
              <ShieldIcon className="h-5 w-5 shrink-0 text-leaf-400" />
              <span className="text-sm font-semibold">Betriebshaftpflicht versichert</span>
            </div>
          </div>
        </Container>
        <TrustBar className="border-y border-ink/5 bg-paper/60 py-3" />
      </section>

      {/* ---------------------------------------------------------- SERVICES */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Unser Service" title="Drei Kernleistungen. Ein Ansprechpartner für alles." text="Ob einzelne Räume, komplette Häuser oder Geschäftsflächen – Sie erhalten direkt bei der Besichtigung ein kostenloses Festpreisangebot." />
            <Button href="/leistungen/" variant="outline" className="shrink-0">Alle Leistungen <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <ServiceShowcase className="mt-12" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {SITE.specialties.slice(0, 8).map((s) => (
              <li key={s.path}><Link href={s.path} className="inline-flex items-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-leaf-600 hover:text-leaf-800">{s.title}</Link></li>
            ))}
            <li><Link href="/leistungen/" className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-4 py-2 text-sm font-semibold text-white">Alle Leistungen <ArrowRight className="h-4 w-4" /></Link></li>
          </ul>
        </Container>
      </section>

      {/* ------------------------------------------------------------- WHY */}
      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Ihr Vorteil" title="Warum NRW-Haushaltsauflösung?" text="Unser Team sorgt für einen reibungslosen Ablauf und hinterlässt jede Wohnung, jedes Haus und jede Geschäftsfläche besenrein – ohne versteckte Kosten." />
            <div className="flex flex-wrap gap-3 lg:shrink-0">
              <Button href="/ueber-uns/" variant="dark">Mehr über uns <ArrowRight className="h-4 w-4 shrink-0" /></Button>
              <Button href="/ablauf/" variant="outline">So läuft es ab</Button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {/* Typographic promise panel – carries the section without a photo. */}
            <Reveal className="lg:col-span-4">
              <div className="grain flex h-full flex-col justify-between rounded-[2rem] bg-forest-950 p-7 text-white sm:p-8">
                <div>
                  <Eyebrow light>Unser Versprechen</Eyebrow>
                  <p className="mt-5 font-display text-[1.6rem] leading-snug text-balance sm:text-[1.75rem]">
                    „Schnell, genau, diskret und professionell – das prägt unser tägliches Handeln.“
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Image src="/images/wp/2021-01-marco2.webp" alt={SITE.owner} width={48} height={48} quality={85} className="h-12 w-12 rounded-full object-cover object-top ring-2 ring-white/15" />
                    <span className="text-sm"><strong className="block text-white">{SITE.owner}</strong><span className="text-sage-300">{SITE.ownerRole} · seit {SITE.founded}</span></span>
                  </div>
                </div>
                <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {[["2.500+", "Aufträge"], ["4,97", "Bewertung"], ["24/7", "erreichbar"]].map(([v, l]) => (
                    <div key={l}>
                      <dt className="font-display text-2xl leading-none text-leaf-400 sm:text-3xl">{v}</dt>
                      <dd className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-sage-300">{l}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              {SITE.benefits.map((b, i) => {
                const Icon = BENEFIT_ICONS[b.id];
                return (
                  <Reveal as="li" key={b.id} delay={i * 60} className="group flex flex-col rounded-[1.5rem] border border-ink/6 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-500/10 text-leaf-700 transition group-hover:bg-leaf-700 group-hover:text-white"><Icon className="h-5 w-5" /></span>
                    <h3 className="mt-4 font-sans text-lg font-bold leading-snug text-ink">{b.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{b.text}</p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------- PROCESS */}
      <ProcessSteps light title="In 5 Schritten zur Übergabe." />

      {/* ----------------------------------------------------------- REVIEWS */}
      <ReviewsSection compact />

      {/* ------------------------------------------------------------ CITIES */}
      <section className="bg-paper py-14 sm:py-20 lg:py-24">
        <Container><CitiesTeaser /></Container>
      </section>

      {/* -------------------------------------------------------------- SOCIAL */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <Link href="/soziales-engagement/" className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-forest-950 text-white shadow-soft">
                <div className="relative aspect-[16/9]">
                  <Image src="/images/wp/2025-09-abtransport-entruempelung.webp" alt="Abtransport von Möbeln bei einer Entrümpelung" fill sizes="(min-width: 1024px) 40vw, 100vw" quality={75} className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <HeartIcon className="h-6 w-6 text-leaf-400" />
                  <p className="eyebrow mt-3 text-leaf-300">Soziales Engagement</p>
                  <h2 className="display-sm mt-2 text-white">Was noch gut ist, bekommt eine zweite Chance.</h2>
                  <p className="mt-2 flex-1 text-sm text-sage-200">Brauchbare Möbel und Hausrat spenden wir an Flüchtlingsheime und soziale Einrichtungen in NRW.</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white">Mehr erfahren <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            </Reveal>
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Nachhaltigkeit" title="Weitergeben statt wegwerfen." text="Wir führen wiederverwendbare Gegenstände aus Haushaltsauflösungen einem guten Zweck zu – Flüchtlingsheimen, Second-Hand-Möbelhäusern und karitativen Einrichtungen in NRW. Der Rest wird sortenrein getrennt und fachgerecht entsorgt." />
              <StatsRow columns={2} className="mt-8" />
            </div>
          </div>
        </Container>
      </section>

      <ContactSection />
      <BlogTeaser />
    </>
  );
}
