import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { SITE } from "@/lib/site";
import { cities, posts } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Reveal } from "@/components/reveal";
import { Button, Container, Eyebrow, SectionHeading, Stars } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { ReviewSources } from "@/components/review-sources";
import { ReviewCarousel } from "@/components/review-carousel";
import { ArrowRight, CheckIcon, ClockIcon, EuroIcon, HomeIcon, KeyIcon, MailIcon, MapPinIcon, PhoneIcon, QuoteIcon, ShieldIcon, TagIcon } from "@/components/icons";

const BENEFIT_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  besichtigung: HomeIcon,
  wertanrechnung: TagIcon,
  festpreis: EuroIcon,
  schluessel: KeyIcon,
  express: ClockIcon,
  versicherung: ShieldIcon,
};

/* ---------------------------------------------------------------- Benefits */
export function BenefitsGrid({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul className={clsx("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", compact && "lg:grid-cols-6", className)}>
      {SITE.benefits.map((b, i) => {
        const Icon = BENEFIT_ICONS[b.id] ?? CheckIcon;
        return (
          <Reveal as="li" key={b.id} delay={i * 60} className={clsx("group rounded-3xl border border-ink/6 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift", compact && "p-4")}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-500/10 text-leaf-700 transition group-hover:bg-leaf-600 group-hover:text-white"><Icon className="h-5.5 w-5.5" /></span>
            <h3 className={clsx("mt-4 font-sans font-bold text-ink", compact ? "text-[0.95rem] leading-snug" : "text-lg")}>{b.title}</h3>
            {!compact && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{b.text}</p>}
          </Reveal>
        );
      })}
    </ul>
  );
}

/** Benefits as a compact checklist beside a photo – for pages that already carry a lot of text. */
export function BenefitsSplit({ title = "Was bei uns immer dazugehört.", eyebrow = "Unsere Vorteile", image = "/images/wp/2026-02-nrw2.webp", imageAlt = "Zwei Mitarbeiter beim High-Five vor dem Transporter" }: { title?: string; eyebrow?: string; image?: string; imageAlt?: string }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SITE.benefits.map((b) => {
            const Icon = BENEFIT_ICONS[b.id] ?? CheckIcon;
            return (
              <li key={b.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-500/10 text-leaf-700"><Icon className="h-4.5 w-4.5" /></span>
                <span><span className="block font-bold text-ink">{b.title}</span><span className="block text-sm leading-snug text-muted">{b.text}</span></span>
              </li>
            );
          })}
        </ul>
      </div>
      <Reveal className="lg:col-span-4">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[17rem] overflow-hidden rounded-[2rem] shadow-soft sm:max-w-xs lg:ml-auto lg:max-w-[19rem]">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 304px, 272px" quality={78} className="object-cover" />
        </div>
      </Reveal>
    </div>
  );
}

/* ----------------------------------------------------------------- Process */
export function ProcessSteps({ title = "Ablauf Ihrer Räumung", eyebrow = "So einfach geht's", light = false, id, cta = true }: { title?: string; eyebrow?: string; light?: boolean; id?: string; cta?: boolean }) {
  return (
    <section id={id} className={clsx("py-14 sm:py-20 lg:py-24", light ? "grain bg-forest-950 text-white" : "bg-paper")}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} light={light} text="Von der kostenlosen Besichtigung bis zur Schlüsselübergabe – in über 90 % aller Fälle an einem Tag erledigt." />
          {cta && <Button href="/ablauf/" variant={light ? "white" : "outline"} className="shrink-0">Ablauf im Detail <ArrowRight className="h-4 w-4" /></Button>}
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {SITE.process.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className={clsx("relative rounded-3xl p-6", light ? "bg-white/5 ring-1 ring-white/10" : "bg-white shadow-soft")}>
              <span className={clsx("font-display text-5xl leading-none", light ? "text-leaf-400" : "text-leaf-600")}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={clsx("mt-6 font-sans text-lg font-bold", light ? "text-white" : "text-ink")}>{s.title}</h3>
              <p className={clsx("mt-2 text-[0.95rem] leading-relaxed", light ? "text-sage-200" : "text-muted")}>{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- Reviews */
export function ReviewCard({ r, dark = false, clamp = true, className }: { r: (typeof SITE.reviews)[number]; dark?: boolean; clamp?: boolean; className?: string }) {
  return (
    <div className={clsx("flex h-full flex-col rounded-3xl border p-6", dark ? "border-transparent bg-forest-950 text-white" : "border-ink/6 bg-white shadow-soft", className)}>
      <QuoteIcon className={clsx("h-6 w-6 shrink-0", dark ? "text-leaf-400" : "text-leaf-500/50")} />
      <p className={clsx("mt-3 font-display text-lg leading-snug", dark ? "text-white" : "text-ink")}>{r.title}</p>
      <p className={clsx("mt-2 flex-1 text-[0.95rem] leading-relaxed", clamp && "line-clamp-5", dark ? "text-sage-200" : "text-muted")}>{r.text}</p>
      <div className={clsx("mt-5 flex items-center justify-between gap-3 border-t pt-4 text-sm", dark ? "border-white/10" : "border-ink/8")}>
        <span className={clsx("font-semibold", dark ? "text-white" : "text-ink")}>{r.name}</span>
        <span className="flex shrink-0 items-center gap-2"><Stars value={r.rating} /><span className={dark ? "text-sage-300" : "text-muted"}>{new Date(r.date).toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })}</span></span>
      </div>
    </div>
  );
}

export function RatingBadge({ className }: { className?: string }) {
  return (
    <Link href="/bewertungen/" className={clsx("inline-flex items-center gap-4 rounded-3xl border border-ink/8 bg-white p-4 shadow-soft transition hover:shadow-lift sm:gap-5 sm:p-5", className)}>
      <span className="font-display text-5xl leading-none text-ink sm:text-6xl">{SITE.rating.value.toLocaleString("de-DE")}</span>
      <span>
        <Stars value={5} size="h-5 w-5" />
        <span className="mt-1 block font-semibold text-ink">{SITE.rating.label} · {SITE.rating.count} Bewertungen</span>
        <span className="block text-sm text-muted">{SITE.rating.provider} & Google · unabhängig geprüft</span>
      </span>
    </Link>
  );
}

export function ReviewsSection({ id = "bewertungen", compact = false, light = false }: { id?: string; compact?: boolean; light?: boolean }) {
  return (
    <section id={id} className={clsx("overflow-x-clip py-14 sm:py-20 lg:py-24", light && "bg-paper")}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Meinungen unserer Kunden" title={<>Bewertet mit <span className="text-leaf-700">{SITE.rating.label}</span> – von echten Kunden.</>} />
          <RatingBadge className="shrink-0" />
        </div>
        <ReviewCarousel className="mt-10" />
        <ReviewSources compact className="mt-8" />
        {!compact && (
          <p className="mt-6 text-sm text-muted">{SITE.rating.note}. <Link href="/bewertungen/" className="font-semibold text-leaf-700 underline underline-offset-2">Alle Bewertungen</Link></p>
        )}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ Contact */
export function ContactSection({ id = "kontakt", title = "Jetzt kostenlose Besichtigung anfragen", text, defaultOrt }: { id?: string; title?: string; text?: string; defaultOrt?: string }) {
  return (
    <section id={id} className="grain relative overflow-hidden bg-forest-950 py-20 text-white lg:py-24">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(60_173_43/0.28),transparent)]" aria-hidden />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <Eyebrow light className="mb-4">Kontakt</Eyebrow>
            <h2 className="display-lg text-balance text-white">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-sage-200">{text ?? "Formular ausfüllen oder direkt anrufen – wir sind 24 Stunden am Tag erreichbar, auch an Sonn- und Feiertagen."}</p>
            <ul className="mt-8 grid gap-4">
              <li>
                <a href={SITE.phoneMobileHrefPlain} className="flex items-center gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-600 text-white"><PhoneIcon className="h-6 w-6" /></span>
                  <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-leaf-300">Mobil · 24/7</span><span className="block font-display text-xl sm:text-2xl">{SITE.phoneMobile}</span></span>
                </a>
              </li>
              <li>
                <a href={SITE.phoneFreeHref} className="flex items-center gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white"><PhoneIcon className="h-6 w-6" /></span>
                  <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-leaf-300">Kostenlose Hotline</span><span className="block font-display text-xl sm:text-2xl">{SITE.phoneFree}</span></span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white"><MailIcon className="h-6 w-6" /></span>
                  <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-leaf-300">E-Mail</span><span className="block text-[1rem] font-semibold [overflow-wrap:anywhere] sm:text-[1.05rem]">{SITE.email}</span></span>
                </a>
              </li>
            </ul>
            <div className="mt-8 flex items-center gap-4">
              <Image src="/images/wp/2021-01-marco2.webp" alt={SITE.owner} width={56} height={56} className="h-14 w-14 rounded-full object-cover object-top" />
              <p className="text-sm text-sage-200"><strong className="block text-base text-white">{SITE.owner}, {SITE.ownerRole}</strong>„Sie erhalten direkt bei der Besichtigung ein kostenloses, unverbindliches Festpreisangebot.“</p>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-cream p-5 text-ink shadow-lift sm:rounded-[2rem] sm:p-8">
            <ContactForm defaultOrt={defaultOrt} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------------- Mini CTA */
export function CtaBanner({ title = "Kostenlose Besichtigung – in ganz NRW.", text = "Rufen Sie uns an oder schreiben Sie uns. Sie erhalten vor Ort ein Festpreisangebot inklusive Wertanrechnung." }: { title?: string; text?: string }) {
  return (
    <Container className="py-6">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-leaf-700 px-6 py-8 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.22),transparent)]" aria-hidden />
        <div className="relative">
          <h2 className="display-sm text-balance">{title}</h2>
          <p className="mt-2 max-w-xl text-leaf-50/90">{text}</p>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
          <Button href={SITE.phoneMobileHrefPlain} variant="white" size="lg"><PhoneIcon className="h-5 w-5 text-leaf-700" /> {SITE.phoneMobile}</Button>
          <Button href="/kontakt/" variant="dark" size="lg">Anfrage senden <ArrowRight className="h-5 w-5" /></Button>
        </div>
      </div>
    </Container>
  );
}

/* --------------------------------------------------------------- Philosophy */
export function PhilosophyStrip({ className, columns = 4 }: { className?: string; columns?: 2 | 4 }) {
  return (
    <ul className={clsx("grid gap-3 sm:grid-cols-2", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2", className)}>
      {SITE.philosophy.map((p, i) => (
        <Reveal as="li" key={p.title} delay={i * 60} className="rounded-3xl border border-ink/6 bg-white p-5 shadow-soft">
          <p className="font-display text-2xl text-leaf-700">{p.title}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------- Service showcase */
/**
 * Three equal cards filling the row: a small portrait thumbnail beside the text.
 * The service photos are 2:3 and 9:16 portraits, so they keep that shape at a
 * size their resolution can carry, and the text never sits on the image.
 */
export function ServiceShowcase({ className, exclude }: { className?: string; exclude?: string }) {
  const items = SITE.services.filter((s) => s.slug !== exclude);
  return (
    <ul className={clsx("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((s, i) => (
        <Reveal as="li" key={s.slug} delay={i * 70} className="h-full">
          <Link
            href={s.path}
            className="group flex h-full gap-4 rounded-2xl border border-ink/6 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-leaf-600/30 hover:shadow-lift"
          >
            <span className="relative aspect-[4/5] w-[4.75rem] shrink-0 overflow-hidden rounded-xl bg-sage-100 lg:w-24">
              <Image src={s.image} alt={s.imageAlt} fill sizes="96px" quality={80} className="object-cover transition duration-500 group-hover:scale-105" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-sans text-[0.98rem] font-bold leading-snug text-ink transition group-hover:text-leaf-800 [hyphens:auto] [overflow-wrap:break-word]">{s.title}</span>
              <span className="mt-1.5 flex items-start gap-1.5 text-[0.78rem] font-bold leading-snug text-leaf-700 [hyphens:auto] [overflow-wrap:break-word]">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {s.highlight}
              </span>
              <span className="mt-1.5 flex-1 text-[0.82rem] leading-snug text-muted">{s.covers.slice(0, 3).join(" · ")}</span>
              <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.82rem] font-bold text-leaf-700">
                Mehr erfahren <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

export function SpecialtyLinks({ exclude, limit, className }: { exclude?: string; limit?: number; className?: string }) {
  const items = SITE.specialties.filter((s) => s.path !== exclude).slice(0, limit ?? SITE.specialties.length);
  return (
    <ul className={clsx("grid gap-2 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((s) => (
        <li key={s.path}>
          <Link href={s.path} className="group flex items-center justify-between gap-3 rounded-2xl border border-ink/6 bg-white px-4 py-3 transition hover:border-leaf-500/40 hover:bg-leaf-50">
            <span><span className="block font-semibold text-ink">{s.title}</span><span className="block text-sm text-muted">{s.text}</span></span>
            <ArrowRight className="h-4 w-4 shrink-0 text-leaf-700 transition group-hover:translate-x-1" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Compact chips linking to the other services – used at the bottom of every service page. */
export function ServiceChips({ exclude, className }: { exclude?: string; className?: string }) {
  const items = [...SITE.services.map((s) => ({ title: s.title, path: s.path })), ...SITE.specialties.slice(0, 9)].filter((s) => s.path !== exclude);
  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2">
        {items.map((s) => (
          <li key={s.path}><Link href={s.path} className="inline-flex items-center rounded-full border border-ink/10 bg-white px-4 py-2 text-[0.95rem] font-semibold text-ink transition hover:border-leaf-600 hover:text-leaf-800">{s.title}</Link></li>
        ))}
        <li><Link href="/leistungen/" className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-4 py-2 text-[0.95rem] font-semibold text-white">Alle Leistungen <ArrowRight className="h-4 w-4" /></Link></li>
      </ul>
    </div>
  );
}

export function TrustBar({ className, light = false }: { className?: string; light?: boolean }) {
  const items = ["Gratis Besichtigung", "Garantierter Festpreis", "Wertanrechnung", "Besenrein & schlüsselabgabefertig", "24/7 Expressdienst", "Betriebshaftpflicht versichert", "Entsorgungsnachweis auf Wunsch", "Seit 2010 in ganz NRW"];
  return (
    <div className={clsx("marquee overflow-hidden", className)} aria-hidden>
      <div className="marquee-track gap-3 py-1">
        {[...items, ...items].map((t, i) => (
          <span key={i} className={clsx("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold", light ? "bg-white/8 text-sage-100 ring-1 ring-white/10" : "bg-white text-ink shadow-soft")}>
            <CheckIcon className="h-4 w-4 text-leaf-600" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatsRow({ light = false, className, columns = 4 }: { light?: boolean; className?: string; columns?: 2 | 4 }) {
  return (
    <ul className={clsx("grid grid-cols-2 gap-4", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2", className)}>
      {SITE.stats.map((s) => (
        <li key={s.label} className={clsx("rounded-3xl p-5", light ? "bg-white/5 ring-1 ring-white/10" : "bg-white shadow-soft")}>
          <p className={clsx("font-display text-4xl leading-none tracking-tight lg:text-5xl", light ? "text-white" : "text-ink")}>{s.value}</p>
          <p className={clsx("mt-3 text-sm font-bold uppercase tracking-wider", light ? "text-leaf-300" : "text-leaf-700")}>{s.label}</p>
          <p className={clsx("mt-1 text-sm", light ? "text-sage-300" : "text-muted")}>{s.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ Cities teaser */
const TEASER_CITIES = ["duesseldorf", "koeln", "essen", "duisburg", "bochum", "wuppertal", "neuss", "krefeld", "moenchengladbach", "leverkusen", "oberhausen", "solingen", "gelsenkirchen", "ratingen", "hilden", "langenfeld", "meerbusch", "velbert"];

export function CitiesTeaser({ current, title = "In ganz Nordrhein-Westfalen für Sie im Einsatz.", light = false }: { current?: string; title?: string; light?: boolean }) {
  const list = TEASER_CITIES.map((s) => cities.find((c) => c.slug === s)).filter(Boolean) as typeof cities;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <SectionHeading eyebrow="Einsatzgebiete" title={title} light={light} text={`${cities.length} Städte mit eigener Seite – von Düsseldorf über Köln bis ins Ruhrgebiet und Bergische Land. Kostenlose Besichtigung, auch kurzfristig.`} />
        <Button href="/einsatzgebiete/" variant={light ? "white" : "dark"} className="mt-8">Alle Einsatzgebiete <ArrowRight className="h-4 w-4" /></Button>
      </div>
      <div className="lg:col-span-7">
        <ul className="flex flex-wrap gap-2">
          {list.map((c) => (
            <li key={c.slug}>
              <Link href={c.path} className={clsx("inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[0.95rem] font-semibold transition", c.slug === current ? "border-leaf-700 bg-leaf-700 text-white" : light ? "border-white/15 bg-white/5 text-white hover:bg-white/10" : "border-ink/10 bg-white text-ink hover:border-leaf-600 hover:text-leaf-800")}>
                <MapPinIcon className="h-4 w-4 text-leaf-500" /> {c.name}
              </Link>
            </li>
          ))}
          <li><Link href="/einsatzgebiete/" className={clsx("inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.95rem] font-semibold", light ? "bg-white text-forest-950" : "bg-forest-950 text-white")}>+ {cities.length - list.length} weitere <ArrowRight className="h-4 w-4" /></Link></li>
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------- Wertanrechnung explainer */
export function WertanrechnungExplainer({ className }: { className?: string }) {
  return (
    <div className={clsx("grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16", className)}>
      <Reveal className="order-2 lg:order-1">
        <div className="relative rounded-[2rem] border border-ink/6 bg-white p-6 shadow-soft sm:p-8">
          <p className="eyebrow">Beispielhafte Rechnung</p>
          <p className="mt-2 font-display text-2xl">So wirkt die Wertanrechnung</p>
          <ul className="mt-6 divide-y divide-ink/8">
            <li className="flex items-center justify-between gap-4 py-3"><span className="text-muted">Räumung inkl. Entsorgung, An- & Abfahrt</span><span className="shrink-0 font-semibold">Festpreis</span></li>
            <li className="flex items-center justify-between gap-4 py-3"><span className="text-muted">Nägel, Schrauben, Teppiche entfernen</span><span className="shrink-0 font-semibold text-leaf-700">inklusive</span></li>
            <li className="flex items-center justify-between gap-4 py-3"><span className="text-muted">Besenreine Übergabe</span><span className="shrink-0 font-semibold text-leaf-700">inklusive</span></li>
            <li className="flex items-center justify-between gap-4 py-3"><span className="text-muted">Verwertbarer Hausrat, Möbel, Gold, Antiquitäten</span><span className="shrink-0 font-semibold text-leaf-700">− Wertanrechnung</span></li>
            <li className="flex items-center justify-between gap-4 py-4 text-lg"><span className="font-semibold">Ihr Preis</span><span className="rounded-full bg-forest-950 px-4 py-1.5 font-display text-white">Festpreis − Wert</span></li>
          </ul>
          <p className="mt-4 text-xs text-muted">Der konkrete Betrag steht nach der kostenlosen Besichtigung fest. Keine Vorauszahlung, keine versteckten Kosten.</p>
        </div>
      </Reveal>
      <div className="order-1 lg:order-2">
        <Eyebrow className="mb-4">Wertanrechnung</Eyebrow>
        <h2 className="display-lg text-balance">Ihr Hausrat senkt den Preis – wir sehen, was noch Wert hat.</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">Bei der Besichtigung begutachten wir das gesamte Inventar. Verwertbares – von Möbeln über Porzellan bis zu Antiquitäten und Kunst – wird preismindernd berücksichtigt. Gold, Schmuck und Edelmetalle kaufen wir zu tagesaktuellen Kursen an.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[["Geschultes Auge", "Wir erkennen Werte, die Laien oft übersehen."], ["Direkt vor Ort", "Sie erfahren den Wert sofort bei der Besichtigung."], ["Optional", "Die Wertanrechnung ist kein Muss – Sie entscheiden in Ruhe."], ["Fair & transparent", "Alles fließt sichtbar in Ihr Festpreisangebot ein."]].map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-paper p-4"><TagIcon className="h-5 w-5 text-leaf-700" /><p className="mt-2 font-semibold text-ink">{t}</p><p className="text-sm text-muted">{d}</p></li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/wertanrechnung/" variant="dark">Mehr zur Wertanrechnung</Button>
          <Button href="/nachlassankauf/" variant="outline">Nachlassankauf</Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Page header */
export function PageHero({ eyebrow, title, lead, crumbs, image, imageAlt, children, dark = false, badge }: { eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; crumbs: { name: string; href?: string }[]; image?: string; imageAlt?: string; children?: React.ReactNode; dark?: boolean; badge?: React.ReactNode }) {
  return (
    <section className={clsx("relative overflow-hidden border-b border-ink/5", dark && "grain bg-forest-950 text-white")}>
      {!dark && <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(50rem_30rem_at_90%_0%,rgb(60_173_43/0.14),transparent_60%)]" aria-hidden />}
      <Container className={clsx("grid gap-5 py-8 sm:gap-7 sm:py-10 lg:items-center lg:gap-12 lg:py-20", image && "lg:grid-cols-12 lg:grid-rows-[auto_auto]")}>
        <div className={clsx(image ? "lg:col-span-8 lg:row-start-1" : "max-w-3xl")}>
          <nav aria-label="Brotkrumen" className={clsx("text-sm", dark ? "text-sage-300" : "text-muted")}>
            {crumbs.map((c, i) => (
              <span key={i}>{i > 0 && <span className="mx-1.5">/</span>}{c.href ? <Link href={c.href} className={dark ? "hover:text-white" : "hover:text-ink"}>{c.name}</Link> : <span className={dark ? "text-white" : "text-ink"}>{c.name}</span>}</span>
            ))}
          </nav>
          {eyebrow && <Eyebrow light={dark} className="mt-4 mb-2.5 sm:mt-5 sm:mb-3">{eyebrow}</Eyebrow>}
          <h1 className={clsx("display-xl text-balance", dark && "text-white")}>{title}</h1>
          {lead && <div className={clsx("mt-4 max-w-2xl text-[1rem] leading-relaxed text-pretty sm:mt-5 sm:text-lg", dark ? "text-sage-200" : "text-muted")}>{lead}</div>}
        </div>
        {/* Desktop only: on phones the portrait pushed the actions below the fold. Not preloaded, so phones never fetch it. */}
        {image && (
          <div className="relative hidden w-full lg:col-span-4 lg:row-span-2 lg:row-start-1 lg:ml-auto lg:block lg:max-w-[20rem] lg:self-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
              <Image src={image} alt={imageAlt ?? ""} fill sizes="320px" quality={75} className="object-cover" />
              {badge && <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-forest-950 via-forest-950/75 to-transparent p-4 pt-10 text-white sm:block">{badge}</div>}
            </div>
          </div>
        )}
        {children && <div className={clsx(image ? "lg:col-span-8 lg:row-start-2 lg:self-start" : "max-w-3xl")}>{children}</div>}
      </Container>
    </section>
  );
}

export function HeroActions({ primaryHref = "/kontakt/", primaryLabel = "Kostenlose Besichtigung", dark = false }: { primaryHref?: string; primaryLabel?: string; dark?: boolean }) {
  return (
    <>
      <div className="grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
        <Button href={primaryHref} size="lg" variant={dark ? "white" : "primary"}>{primaryLabel} <ArrowRight className="h-5 w-5 shrink-0" /></Button>
        <Button href={SITE.phoneMobileHrefPlain} variant={dark ? "primary" : "outline"} size="lg"><PhoneIcon className={clsx("h-5 w-5 shrink-0", !dark && "text-leaf-700")} /> {SITE.phoneMobile}</Button>
      </div>
      <div className={clsx("mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:mt-5", dark ? "text-sage-200" : "text-muted")}>
        <Link href="/bewertungen/" prefetch={false} className={clsx("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold shadow-soft sm:text-sm", dark ? "bg-white/10 text-white" : "bg-white text-ink")}><Stars size="h-3.5 w-3.5" /> {SITE.rating.value.toLocaleString("de-DE")} {SITE.rating.label} · {SITE.rating.count} Bewertungen</Link>
        <span className="hidden items-center gap-1.5 sm:inline-flex"><CheckIcon className="h-4 w-4 text-leaf-600" /> Keine Vorauszahlung</span>
        <span className="hidden items-center gap-1.5 sm:inline-flex"><CheckIcon className="h-4 w-4 text-leaf-600" /> Festpreis vor Ort</span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------- Blog teaser */
/** Three latest guides – closes every page and links deep into the Ratgeber. */
export function BlogTeaser({ className }: { className?: string }) {
  const latest = posts.slice(0, 3);
  return (
    <section className={clsx("bg-paper py-14 sm:py-20", className)}>
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeading eyebrow="Ratgeber" title="Wissen für Ihre Entscheidung." text={`${posts.length} Artikel zu Kosten, Ablauf, Wertanrechnung, Messie-Hilfe und Erbrecht – von Praktikern geschrieben.`} />
          <Button href="/ratgeber/" variant="outline" className="shrink-0">Alle Artikel <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
        </div>
      </Container>
    </section>
  );
}
