import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Container, Eyebrow } from "@/components/ui";
import { PostsExplorer } from "@/components/posts-explorer";
import { CtaBanner } from "@/components/sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Ratgeber: Haushaltsauflösung, Entrümpelung & Nachlass",
  description: `${posts.length} Ratgeber-Artikel von NRW-Haushaltsauflösung: Kosten, Ablauf, Wertanrechnung, Messie-Hilfe, Erbrecht, Sperrmüll und Praxisauflösung – verständlich erklärt.`,
  path: "/ratgeber/",
});

export default function RatgeberPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Ratgeber", path: "/ratgeber/" }]), {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Ratgeber",
        url: `${SITE.url}/ratgeber/`,
        hasPart: posts.slice(0, 50).map((p) => ({ "@type": "Article", headline: p.title, url: `${SITE.url}${p.path}` })),
      }]} />
      <section className="border-b border-ink/5 bg-paper py-14 lg:py-20">
        <Container>
          <nav aria-label="Brotkrumen" className="text-sm text-muted"><Link href="/" className="hover:text-ink">Startseite</Link> <span className="mx-1.5">/</span> <span className="text-ink">Ratgeber</span></nav>
          <Eyebrow className="mt-6 mb-4">Ratgeber</Eyebrow>
          <h1 className="display-xl text-balance">Wissen aus über 15 Jahren Haushaltsauflösung.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">Kosten realistisch einschätzen, Fristen im Erbfall wahren, Messie-Situationen respektvoll lösen, Praxen und Büros auflösen: Unsere Ratgeber erklären Schritt für Schritt, worauf es ankommt – und wo Sie sparen können.</p>
        </Container>
      </section>
      <section className="py-14 lg:py-20">
        <Container>
          <PostsExplorer posts={posts} />
        </Container>
      </section>
      <CtaBanner title="Lieber direkt fragen?" text="Wir beraten Sie kostenlos und unverbindlich – am Telefon oder bei einer Besichtigung vor Ort." />
    </>
  );
}
