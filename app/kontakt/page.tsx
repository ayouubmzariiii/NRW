import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ContactForm } from "@/components/contact-form";
import { Container, Eyebrow } from "@/components/ui";
import { BlogTeaser, ReviewsSection } from "@/components/sections";
import { CheckIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Kontakt – Kostenlose Besichtigung anfragen",
  description: "Kontaktieren Sie NRW-Haushaltsauflösung und erhalten Sie kostenlos und unverbindlich Ihr Festpreisangebot. 24/7 erreichbar: 0177 866 70 16 · 0800 222 10 222 (kostenlos).",
  path: "/kontakt/",
});

export default function KontaktPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Kontakt", path: "/kontakt/" }]), { "@context": "https://schema.org", "@type": "ContactPage", name: "Kontakt", url: `${SITE.url}/kontakt/` }]} />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(50rem_30rem_at_10%_0%,rgb(60_173_43/0.14),transparent_60%)]" aria-hidden />
        <Container className="grid gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div>
            <nav aria-label="Brotkrumen" className="text-sm text-muted"><Link href="/" className="hover:text-ink">Startseite</Link> <span className="mx-1.5">/</span> <span className="text-ink">Kontakt</span></nav>
            <Eyebrow className="mt-6 mb-4">Kontakt</Eyebrow>
            <h1 className="display-xl text-balance">Kontaktieren Sie uns – und erhalten Sie kostenlos Ihr Angebot.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">Nutzen Sie das Formular oder rufen Sie uns direkt an. Wir besichtigen kostenlos und unverbindlich in ganz NRW – oft noch am selben Tag – und nennen Ihnen vor Ort einen garantierten Festpreis inklusive Wertanrechnung.</p>

            <ul className="mt-8 grid gap-3">
              <li><a href={SITE.phoneMobileHrefPlain} className="flex items-center gap-4 rounded-3xl border border-ink/6 bg-white p-4 shadow-soft transition hover:shadow-lift"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf-600 text-white"><PhoneIcon className="h-6 w-6" /></span><span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-muted">Mobil · 24/7</span><span className="block font-display text-xl text-ink sm:text-2xl">{SITE.phoneMobile}</span></span></a></li>
              <li><a href={SITE.phoneFreeHref} className="flex items-center gap-4 rounded-3xl border border-ink/6 bg-white p-4 shadow-soft transition hover:shadow-lift"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-950 text-white"><PhoneIcon className="h-6 w-6" /></span><span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-muted">Kostenlose Hotline</span><span className="block font-display text-xl text-ink sm:text-2xl">{SITE.phoneFree}</span></span></a></li>
              <li><a href={`mailto:${SITE.email}`} className="flex items-center gap-4 rounded-3xl border border-ink/6 bg-white p-4 shadow-soft transition hover:shadow-lift"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-950 text-white"><MailIcon className="h-6 w-6" /></span><span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wider text-muted">E-Mail</span><span className="block text-[1rem] font-semibold text-ink [overflow-wrap:anywhere] sm:text-lg">{SITE.email}</span></span></a></li>
              <li className="flex items-center gap-4 rounded-3xl border border-ink/6 bg-white p-4 shadow-soft"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-forest-700"><MapPinIcon className="h-6 w-6" /></span><span className="min-w-0 text-[0.95rem] text-muted"><span className="block font-semibold text-ink">{SITE.name}</span>{SITE.address.street}<br />{SITE.address.zip} {SITE.address.city}<br />Büro: <a href="tel:02119762998" className="text-ink">{SITE.phoneOffice}</a><br />Fax: {SITE.fax}</span></li>
            </ul>

            <div className="mt-8 flex items-start gap-4 rounded-3xl bg-forest-950 p-5 text-white">
              <Image src="/images/marco-portrait.webp" alt={SITE.owner} width={64} height={64} className="h-16 w-16 rounded-2xl object-cover object-top" />
              <div>
                <p className="font-semibold">{SITE.owner}, {SITE.ownerRole}</p>
                <p className="mt-1 text-sm text-sage-200">„Wir sind 24 Stunden am Tag erreichbar, an jedem Tag des Jahres. Sogar an Sonn- und Feiertagen machen wir keine Pause.“</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-ink/6 bg-white p-5 shadow-lift sm:rounded-[2rem] sm:p-8">
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="h-4 w-4 text-leaf-700" /> Kostenlos & unverbindlich</span>
              <span className="inline-flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-leaf-700" /> Rückmeldung meist innerhalb weniger Stunden</span>
            </div>
            <h2 className="display-sm">Besichtigung anfragen</h2>
            <p className="mt-2 mb-6 text-muted">Ein paar Angaben genügen – alles Weitere klären wir am Telefon oder vor Ort.</p>
            <ContactForm />
          </div>
        </Container>
      </section>

      <ReviewsSection compact light />
      <BlogTeaser />
    </>
  );
}
