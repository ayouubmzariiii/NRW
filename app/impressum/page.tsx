import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Impressum",
  description: "Impressum und gesetzliche Anbieterkennung von NRW-Haushaltsauflösung, Marco van der Sande, Düsseldorf.",
  path: "/impressum/",
  noindex: true,
});

export default function ImpressumPage() {
  return (
    <section className="py-12 lg:py-20">
      <Container className="max-w-3xl">
        <nav aria-label="Brotkrumen" className="text-sm text-muted"><Link href="/" className="hover:text-ink">Startseite</Link> <span className="mx-1.5">/</span> <span className="text-ink">Impressum</span></nav>
        <Eyebrow className="mt-6 mb-4">Rechtliches</Eyebrow>
        <h1 className="display-lg">Impressum</h1>
        <div className="prose-nrw mt-10">
          <h2>Gesetzliche Anbieterkennung</h2>
          <p>
            {SITE.owner}<br />
            {SITE.legalName}<br />
            {SITE.address.street}<br />
            {SITE.address.zip} {SITE.address.city}<br />
            {SITE.address.country}
          </p>
          <p>
            Telefon: <a href="tel:02119762998">{SITE.phoneOffice}</a><br />
            Mobil: <a href={SITE.phoneMobileHrefPlain}>{SITE.phoneMobile}</a><br />
            E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>
            {SITE.taxOffice}<br />
            Steuernummer: {SITE.taxNumber}
          </p>
          <h2>Haftungsausschluss</h2>
          <p>NRW-Haushaltsauflösung übernimmt keine Haftung für die Inhalte externer Links. Die Verantwortung für die Inhalte verlinkter Seiten obliegt ausschließlich den Betreibern dieser Seiten.</p>
          <h2>Copyright</h2>
          <p>Alle Inhalte dürfen ohne schriftliche Genehmigung von NRW-Haushaltsauflösung nicht, auch nicht teilweise, verwendet werden.</p>
          <p><Link href="/datenschutzhinweis/">Zum Datenschutzhinweis</Link></p>
        </div>
      </Container>
    </section>
  );
}
