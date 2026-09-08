import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Prose } from "@/components/prose";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzhinweis",
  description: "Datenschutzerklärung von NRW-Haushaltsauflösung: Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.",
  path: "/datenschutzhinweis/",
  noindex: true,
});

export default function DatenschutzPage() {
  const page = getPage("datenschutzhinweis")!;
  // The original page carries its own <h1>Datenschutzerklärung</h1> inside the body – strip it.
  const html = page.sections.map((s) => s.html).join("").replace(/<h1[^>]*>.*?<\/h1>/i, "").replace(/<p><strong>Datenschutzerklärung<\/strong><\/p>/i, "");
  return (
    <section className="py-12 lg:py-20">
      <Container className="max-w-3xl">
        <nav aria-label="Brotkrumen" className="text-sm text-muted"><Link href="/" className="hover:text-ink">Startseite</Link> <span className="mx-1.5">/</span> <span className="text-ink">Datenschutzhinweis</span></nav>
        <Eyebrow className="mt-6 mb-4">Rechtliches</Eyebrow>
        <h1 className="display-lg">Datenschutzerklärung</h1>
        <Prose html={html} className="mt-10" />
      </Container>
    </section>
  );
}
