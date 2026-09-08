"use client";

import Image from "next/image";
import clsx from "clsx";
import type { CSSProperties } from "react";
import { SITE, TEAM_PHOTOS } from "@/lib/site";
import { ArrowRight, QuoteIcon } from "@/components/icons";

type Review = (typeof SITE.reviews)[number] & { source?: string };

const SOURCE_LABEL: Record<string, string> = { ausgezeichnet: "AUSGEZEICHNET.org", google: "Google" };

/** Two-letter monogram from the reviewer name – no invented portraits. */
function initials(name: string) {
  const parts = name.replace(/[^\p{L}\s./-]/gu, "").split(/[\s./-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "★";
}
const AVATAR_TONES = ["bg-leaf-700", "bg-forest-700", "bg-leaf-800", "bg-forest-800", "bg-forest-600"];

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.3Z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.2l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.3 15.5 46 24 46Z" />
      <path fill="#FBBC05" d="M11.8 28.4a13.2 13.2 0 0 1 0-8.8v-5.7H4.5a22 22 0 0 0 0 20.2l7.3-5.7Z" />
      <path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 2.9 29.9.9 24 .9 15.5.9 8.1 5.7 4.5 12.7l7.3 5.7c1.7-5.2 6.5-8.9 12.2-8.9Z" />
    </svg>
  );
}

function Card({ r, i }: { r: Review; i: number }) {
  return (
    <article className="flex h-[13.5rem] w-[19rem] shrink-0 flex-col rounded-2xl border border-ink/6 bg-white p-5 shadow-soft sm:w-[21rem]">
      <div className="flex items-center gap-3">
        <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", AVATAR_TONES[i % AVATAR_TONES.length])} aria-hidden>
          {initials(r.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-ink">{r.name}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="text-amber">★★★★★</span>
            <span>{new Date(r.date).toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })}</span>
          </span>
        </span>
        {r.source === "google" ? <GoogleMark className="h-5 w-5 shrink-0" /> : <QuoteIcon className="h-5 w-5 shrink-0 text-leaf-500/40" />}
      </div>
      <p className="mt-3 line-clamp-1 font-display text-[1.05rem] leading-snug text-ink">{r.title}</p>
      <p className="mt-1.5 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">{r.text}</p>
      <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-wider text-muted">{SOURCE_LABEL[r.source ?? "ausgezeichnet"]}</p>
    </article>
  );
}

function PhotoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[13.5rem] w-[11rem] shrink-0 overflow-hidden rounded-2xl shadow-soft" aria-hidden>
      <Image src={src} alt={alt} fill sizes="176px" quality={70} className="object-cover" />
      <span className="absolute inset-0 ring-1 ring-inset ring-black/10" />
    </div>
  );
}

/** One infinite row: the items are rendered twice so the loop is seamless. */
function Row({ items, duration, reverse = false }: { items: React.ReactNode[]; duration: number; reverse?: boolean }) {
  const style = { animationDuration: `${duration}s` } as CSSProperties;
  return (
    <div className="marquee overflow-hidden">
      <div className={clsx("flex w-max gap-4 py-1", reverse ? "marquee-track-rev" : "marquee-track")} style={style}>
        {items}
        <span className="contents" aria-hidden>{items}</span>
      </div>
    </div>
  );
}

/**
 * Full-bleed, continuously moving wall of the reviews published on the rating
 * portals. Pauses on hover/focus and stops entirely for reduced-motion users.
 */
export function ReviewCarousel({ className }: { className?: string }) {
  const reviews = SITE.reviews as Review[];
  const half = Math.ceil(reviews.length / 2);

  const build = (list: Review[], offset: number) => {
    const out: React.ReactNode[] = [];
    list.forEach((r, i) => {
      out.push(<Card key={`${r.name}-${r.date}`} r={r} i={i + offset} />);
      if (i % 3 === 2) {
        const p = TEAM_PHOTOS[(i + offset) % TEAM_PHOTOS.length];
        out.push(<PhotoTile key={`p-${r.name}-${i}`} src={p.src} alt={p.alt} />);
      }
    });
    return out;
  };

  return (
    <div className={clsx("relative", className)}>
      {/* full-bleed: break out of the page container */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="grid gap-4">
          <Row items={build(reviews.slice(0, half), 0)} duration={64} />
          <Row items={build(reviews.slice(half), 2)} duration={72} reverse />
        </div>
        {/* soft edges so cards fade instead of being cut */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28" aria-hidden />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {reviews.length} von {SITE.rating.count} Bewertungen ·{" "}
        {SITE.rating.sources.map((s, i) => (
          <span key={s.id}>
            {i > 0 && " und "}
            <a href={s.url} target="_blank" rel="noopener" className="font-semibold text-leaf-700 underline underline-offset-2">
              {s.name}
            </a>
          </span>
        ))}{" "}
        <ArrowRight className="inline h-4 w-4 text-leaf-700" />
      </p>
    </div>
  );
}
