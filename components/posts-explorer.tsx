"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchIcon } from "@/components/icons";
import clsx from "clsx";

const TOPICS: { label: string; match: RegExp }[] = [
  { label: "Alle Themen", match: /./ },
  { label: "Kosten & Preise", match: /kosten|preis|günstig|gebühr|rechnung|steuer/i },
  { label: "Haushaltsauflösung", match: /haushaltsaufl|wohnungsaufl|hausaufl|todesfall|erbe|nachlass/i },
  { label: "Entrümpelung", match: /entrümpel|entrumpel|keller|dachboden|sperrmüll|container|wertstoffhof|entsorg/i },
  { label: "Messie-Hilfe", match: /messie|messi|unordnung|horten/i },
  { label: "Erbrecht & Nachlass", match: /erb|nachlass|testament|pflichtteil|notar|versicherung/i },
  { label: "Ankauf & Wert", match: /ankauf|wert|antiquität|silber|gold|schallplatte|briefmarke|möbel/i },
  { label: "Gewerbe", match: /praxis|firma|gastro|restaurant|büro|fitness|zahnarzt|gewerbe/i },
  { label: "Umzug & Senioren", match: /umzug|senior|pflegeheim/i },
];

function norm(s: string) {
  return s.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss").replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");
}

export function PostsExplorer({ posts }: { posts: PostSummary[] }) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState(0);
  const [limit, setLimit] = useState(18);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    const t = TOPICS[topic];
    return posts.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.tags.join(" ")}`;
      if (topic !== 0 && !t.match.test(hay)) return false;
      if (nq && !norm(hay).includes(nq)) return false;
      return true;
    });
  }, [posts, q, topic]);

  const shown = filtered.slice(0, limit);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Artikel durchsuchen</span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(18); }} placeholder="Suchen, z. B. Kosten, Messie, Erbschein …" className="h-12 w-full rounded-full border border-ink/12 bg-white pl-12 pr-5 text-[0.98rem] shadow-soft outline-none transition focus:border-leaf-600 focus:ring-4 focus:ring-leaf-500/15" />
        </label>
        <p className="text-sm text-muted" aria-live="polite">{filtered.length} von {posts.length} Artikeln</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {TOPICS.map((t, i) => (
          <button key={t.label} type="button" onClick={() => { setTopic(i); setLimit(18); }} aria-pressed={topic === i} className={clsx("rounded-full border px-4 py-2 text-sm font-semibold transition", topic === i ? "border-forest-950 bg-forest-950 text-white" : "border-ink/10 bg-white text-ink hover:border-leaf-500 hover:text-leaf-800")}>
            {t.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 rounded-3xl bg-white p-8 text-center text-muted shadow-soft">Kein Artikel gefunden. Versuchen Sie einen anderen Suchbegriff – oder <Link href="/kontakt/" className="font-semibold text-leaf-700 underline">fragen Sie uns direkt</Link>.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
        </div>
      )}

      {filtered.length > limit && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setLimit((l) => l + 18)} className="inline-flex h-12 items-center rounded-full border border-ink/12 bg-white px-6 font-semibold text-ink shadow-soft transition hover:border-leaf-500 hover:text-leaf-800">
            Weitere Artikel laden ({filtered.length - limit})
          </button>
        </div>
      )}
      {/* Crawlable index of every article (hidden visually when JS filters) */}
      <noscript>
        <ul className="mt-10 grid gap-2 sm:grid-cols-2">
          {posts.map((p) => <li key={p.slug}><a href={p.path} className="underline">{p.title}</a></li>)}
        </ul>
      </noscript>
    </div>
  );
}
