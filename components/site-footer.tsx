import Link from "next/link";
import { Logo } from "@/components/logo";
import { FOOTER_LEGAL, SITE } from "@/lib/site";
import { cities } from "@/lib/content";
import { ArrowRight, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { ReviewSourceStrip } from "@/components/review-sources";

const topCities = ["duesseldorf", "koeln", "essen", "duisburg", "bochum", "wuppertal", "neuss", "krefeld", "moenchengladbach", "leverkusen", "oberhausen", "solingen"];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="grain relative bg-forest-950 text-sage-200">
      <div className="container-x pt-16 pb-28 lg:pb-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
            <Logo inverted />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">
              Entrümpelung, Haushaltsauflösung, Wohnungsauflösung und Nachlassankauf in ganz Nordrhein-Westfalen – schnell, genau, diskret und professionell. Seit {SITE.founded}.
            </p>
            <ReviewSourceStrip light className="mt-6" />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Link href="/bewertungen/" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10 transition hover:bg-white/10">
                <span className="text-amber">★★★★★</span>
                <span className="text-white"><strong>{SITE.rating.value.toLocaleString("de-DE")}</strong> {SITE.rating.label}</span>
                <span className="text-sage-300">· {SITE.rating.count} gesamt</span>
              </Link>
              <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10"><span className="h-2 w-2 rounded-full bg-leaf-400" />24/7 erreichbar</span>
            </div>
          </div>

          <div>
            <p className="eyebrow text-leaf-300">Leistungen</p>
            <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
              {SITE.services.map((s) => (
                <li key={s.path}><Link href={s.path} className="transition hover:text-white">{s.title}</Link></li>
              ))}
              {SITE.specialties.slice(0, 6).map((s) => (
                <li key={s.path}><Link href={s.path} className="transition hover:text-white">{s.title}</Link></li>
              ))}
              <li><Link href="/leistungen/" className="inline-flex items-center gap-1.5 font-semibold text-white">Alle Leistungen <ArrowRight className="h-4 w-4" /></Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-leaf-300">Einsatzgebiete</p>
            <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
              {topCities.map((slug) => {
                const c = cities.find((x) => x.slug === slug);
                return c ? <li key={slug}><Link href={c.path} className="transition hover:text-white">{c.name}</Link></li> : null;
              })}
              <li><Link href="/einsatzgebiete/" className="inline-flex items-center gap-1.5 font-semibold text-white">Alle {cities.length} Städte <ArrowRight className="h-4 w-4" /></Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-leaf-300">Unternehmen</p>
            <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
              <li><Link href="/ueber-uns/" className="transition hover:text-white">Über uns</Link></li>
              <li><Link href="/ablauf/" className="transition hover:text-white">Ablauf & Festpreis</Link></li>
              <li><Link href="/bewertungen/" className="transition hover:text-white">Bewertungen</Link></li>
              <li><Link href="/soziales-engagement/" className="transition hover:text-white">Soziales Engagement</Link></li>
              <li><Link href="/faq/" className="transition hover:text-white">Häufige Fragen</Link></li>
              <li><Link href="/ratgeber/" className="transition hover:text-white">Ratgeber</Link></li>
              <li><Link href="/kontakt/" className="transition hover:text-white">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-leaf-300">Kontakt</p>
            <ul className="mt-4 grid gap-3 text-[0.95rem]">
              <li className="flex gap-3"><PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf-400" /><span>Mobil: <a href={SITE.phoneMobileHrefPlain} className="font-semibold text-white">{SITE.phoneMobile}</a><br />Kostenlos: <a href={SITE.phoneFreeHref} className="text-white">{SITE.phoneFree}</a><br />Büro: <a href="tel:02119762998" className="text-white">{SITE.phoneOffice}</a></span></li>
              <li className="flex gap-3"><MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf-400" /><a href={`mailto:${SITE.email}`} className="text-white [overflow-wrap:anywhere]">{SITE.email}</a></li>
              <li className="flex gap-3"><MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf-400" /><span>{SITE.address.street}<br />{SITE.address.zip} {SITE.address.city}</span></li>
            </ul>
            <Link href="/kontakt/" className="mt-5 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-leaf-700 px-5 font-semibold text-white transition hover:bg-leaf-600">Besichtigung anfragen <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-sage-300 md:flex-row md:items-center md:justify-between">
          <p>© {year} {SITE.name} · {SITE.owner} · {SITE.address.city}. Alle Rechte vorbehalten.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.href}><Link href={l.href} className="transition hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
