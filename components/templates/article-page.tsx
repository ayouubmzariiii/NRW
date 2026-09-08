import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { formatDate, imageSize, relatedPosts, type PostRecord } from "@/lib/content";
import { SITE } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, truncate } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { Toc } from "@/components/toc";
import { ReadingProgress } from "@/components/reading-progress";
import { PostCard } from "@/components/post-card";
import { Button, Container } from "@/components/ui";
import { CtaBanner } from "@/components/sections";
import { ArrowRight, ClockIcon, PhoneIcon } from "@/components/icons";

export function articlePageMetadata(post: PostRecord): Metadata {
  return buildMetadata({
    title: post.seoTitle.replace(/\s*[-|–]\s*(Zum Festpreis mit Wertanrechnung|NRW-Haushaltsauflösung)\s*$/i, ""),
    description: truncate(post.seoDescription || post.excerpt),
    path: post.path,
    image: post.featured?.src,
    type: "article",
    publishedTime: `${post.date}Z`,
    modifiedTime: `${post.modified}Z`,
  });
}

export function ArticlePage({ post }: { post: PostRecord }) {
  const related = relatedPosts(post, 3);
  const img = post.featured;
  const size = img ? imageSize(img.src, { width: 1600, height: 900 }) : null;
  return (
    <>
      <ReadingProgress targetId="artikel" />
      <JsonLd data={[
        articleJsonLd({ title: post.title, description: post.seoDescription || post.excerpt, path: post.path, image: img?.src, published: post.date, modified: post.modified, wordCount: post.wordCount }),
        breadcrumbJsonLd([{ name: "Ratgeber", path: "/ratgeber/" }, { name: post.title, path: post.path }]),
      ]} />

      <article id="artikel">
        <header className="border-b border-ink/5 bg-paper">
          <Container className="py-10 lg:py-16">
            <nav aria-label="Brotkrumen" className="text-sm text-muted"><Link href="/" className="hover:text-ink">Startseite</Link> <span className="mx-1.5">/</span> <Link href="/ratgeber/" className="hover:text-ink">Ratgeber</Link></nav>
            <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="inline-flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {post.readingMinutes} Min. Lesezeit</span>
                  {post.modified.slice(0, 10) !== post.date.slice(0, 10) && <span>Aktualisiert {formatDate(post.modified)}</span>}
                </div>
                <h1 className="display-lg mt-4 text-balance">{post.title}</h1>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-muted sm:text-lg">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((t) => <li key={t} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest-700 shadow-soft">{t}</li>)}
                  </ul>
                )}
              </div>
              {img && size && (
                <div className="relative aspect-video overflow-hidden rounded-[2rem] shadow-lift">
                  <Image src={img.src} alt={img.alt || post.title} fill priority sizes="(min-width: 1024px) 480px, 100vw" quality={75} className="object-cover" />
                </div>
              )}
            </div>
          </Container>
        </header>

        <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:py-16">
          <div className="min-w-0 max-w-3xl">
            <Prose html={post.html} />
            <div className="mt-12 rounded-[2rem] bg-forest-950 p-8 text-white grain">
              <p className="eyebrow text-leaf-300">Persönliche Beratung</p>
              <p className="mt-2 font-display text-2xl text-balance">Sie stehen selbst vor einer Haushaltsauflösung oder Entrümpelung in NRW?</p>
              <p className="mt-3 text-sage-200">Wir besichtigen kostenlos, rechnen Verwertbares an und nennen Ihnen vor Ort einen garantierten Festpreis – ohne Vorauszahlung.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/kontakt/" variant="white">Kostenlose Besichtigung <ArrowRight className="h-4 w-4" /></Button>
                <Button href={SITE.phoneMobileHrefPlain} variant="primary"><PhoneIcon className="h-4 w-4" /> {SITE.phoneMobile}</Button>
              </div>
            </div>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28 grid gap-8">
              <Toc items={post.toc} />
              <div className="rounded-3xl border border-ink/6 bg-white p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">24/7 erreichbar</p>
                <a href={SITE.phoneMobileHrefPlain} className="mt-1 block font-display text-2xl text-leaf-700">{SITE.phoneMobile}</a>
                <p className="mt-2 text-sm text-muted">Kostenlose Besichtigung in ganz NRW. Festpreis inkl. Wertanrechnung.</p>
                <Link href="/kontakt/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-leaf-700">Anfrage senden <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </aside>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-paper py-12 sm:py-16 lg:py-24">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-md">Passende Ratgeber</h2>
              <Link href="/ratgeber/" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-leaf-700">Alle Artikel <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
            </div>
          </Container>
        </section>
      )}
      <CtaBanner />
    </>
  );
}
