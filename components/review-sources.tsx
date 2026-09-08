import clsx from "clsx";
import { SITE } from "@/lib/site";
import { Stars } from "@/components/ui";
import { ArrowRight, CheckIcon } from "@/components/icons";

/** Google "G" — drawn so no third-party script or logo file is needed. */
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

/** Ausgezeichnet.org mark – the seal image from the media library, or a fallback badge. */
function AusgMark({ className }: { className?: string }) {
  return (
    <span className={clsx("flex items-center justify-center rounded-full bg-leaf-600 text-white", className)} aria-hidden>
      <CheckIcon className="h-5 w-5" />
    </span>
  );
}

/**
 * Where the rating comes from: the AUSGEZEICHNET.org profile and the company's
 * Google reviews, each with its own score, linked out for verification.
 */
export function ReviewSources({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [ausg, google] = SITE.rating.sources;
  const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className={clsx("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3", className)}>
      {/* combined */}
      {!compact && (
        <div className="grain flex flex-col justify-between rounded-3xl bg-forest-950 p-6 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-leaf-300">Gesamtbewertung</p>
            <p className="mt-3 font-display text-6xl leading-none">{fmt(SITE.rating.value)}</p>
            <Stars size="h-5 w-5" className="mt-3" />
            <p className="mt-3 font-semibold">{SITE.rating.label} · {SITE.rating.count} Bewertungen</p>
          </div>
          <p className="mt-4 text-sm text-sage-300">Aus beiden Portalen zusammengerechnet, Stand August 2026.</p>
        </div>
      )}

      {/* AUSGEZEICHNET.org */}
      <a href={ausg.url} target="_blank" rel="noopener" className="group flex flex-col justify-between rounded-3xl border border-ink/8 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
        <div>
          <div className="flex h-11 items-center gap-2.5">
            <AusgMark className="h-8 w-8" />
            <span className="text-lg font-bold leading-tight text-ink">AUSGEZEICHNET<span className="text-muted">.org</span></span>
          </div>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl leading-none text-ink">{fmt(ausg.value)}</span>
            <span className="text-sm text-muted">/ 5,00</span>
          </p>
          <Stars value={ausg.value} className="mt-2" />
          <p className="mt-2 font-semibold text-ink">{ausg.label} · {ausg.count} Bewertungen</p>
          <p className="mt-1 text-sm text-muted">{ausg.note}</p>
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-700">Profil ansehen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </a>

      {/* Google */}
      <a href={google.url} target="_blank" rel="noopener" className="group flex flex-col justify-between rounded-3xl border border-ink/8 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
        <div>
          <div className="flex h-11 items-center gap-2.5">
            <GoogleMark className="h-8 w-8" />
            <span className="text-lg font-bold text-ink">Google</span>
          </div>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl leading-none text-ink">{fmt(google.value)}</span>
            <span className="text-sm text-muted">/ 5,00</span>
          </p>
          <Stars value={google.value} className="mt-2" />
          <p className="mt-2 font-semibold text-ink">{google.label} · {google.count} Rezensionen</p>
          <p className="mt-1 text-sm text-muted">{google.note}</p>
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-700">Bei Google ansehen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </a>
    </div>
  );
}

/** Small inline strip of both logos with their scores – for hero areas and footers. */
export function ReviewSourceStrip({ className, light = false }: { className?: string; light?: boolean }) {
  const [ausg, google] = SITE.rating.sources;
  const fmt = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className={clsx("flex flex-wrap items-center gap-2", className)}>
      <a href={ausg.url} target="_blank" rel="noopener" className={clsx("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] font-semibold shadow-soft transition sm:text-sm", light ? "bg-white/10 text-white hover:bg-white/15" : "bg-white text-ink hover:shadow-lift")}>
        <span className="text-amber">★★★★★</span> {fmt(ausg.value)} · {ausg.count} auf AUSGEZEICHNET.org
      </a>
      <a href={google.url} target="_blank" rel="noopener" className={clsx("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] font-semibold shadow-soft transition sm:text-sm", light ? "bg-white/10 text-white hover:bg-white/15" : "bg-white text-ink hover:shadow-lift")}>
        <GoogleMark className="h-4 w-4" /> {fmt(google.value)} · {google.count} Google-Rezensionen
      </a>
    </div>
  );
}
