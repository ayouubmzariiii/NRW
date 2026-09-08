"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { MapPinIcon, SearchIcon } from "@/components/icons";

export type CityLite = { slug: string; name: string; path: string };
export type RegionLite = { name: string; cities: string[] };

function norm(s: string) {
  return s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "");
}

export function CitiesGrid({ cities, regions, current }: { cities: CityLite[]; regions: RegionLite[]; current?: string }) {
  const [q, setQ] = useState("");
  const bySlug = useMemo(() => Object.fromEntries(cities.map((c) => [c.slug, c])), [cities]);
  const nq = norm(q);
  const filtered = useMemo(
    () => regions.map((r) => ({ ...r, items: r.cities.map((s) => bySlug[s]).filter(Boolean).filter((c) => !nq || norm(c.name).includes(nq)) })).filter((r) => r.items.length),
    [regions, bySlug, nq],
  );
  const total = filtered.reduce((n, r) => n + r.items.length, 0);

  return (
    <div>
      <label className="relative block max-w-md">
        <span className="sr-only">Stadt suchen</span>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ihre Stadt suchen, z. B. Düsseldorf"
          className="h-12 w-full rounded-full border border-ink/12 bg-white pl-12 pr-5 text-[0.98rem] shadow-soft outline-none transition focus:border-leaf-600 focus:ring-4 focus:ring-leaf-500/15"
        />
      </label>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {total === 0 ? (
          <>Keine Stadt gefunden – wir sind trotzdem in ganz NRW für Sie da. <Link href="/kontakt/" className="font-semibold text-leaf-700 underline underline-offset-2">Jetzt anfragen</Link>.</>
        ) : (
          <>{total} Städte mit eigener Seite · Einsatzgebiet: ganz Nordrhein-Westfalen</>
        )}
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {filtered.map((r) => (
          <div key={r.name}>
            <h3 className="mb-3 flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wider text-forest-700"><MapPinIcon className="h-4 w-4 text-leaf-700" /> {r.name}</h3>
            <ul className="flex flex-wrap gap-2">
              {r.items.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.path}
                    aria-current={c.slug === current ? "page" : undefined}
                    className={clsx(
                      "inline-flex items-center rounded-full border px-4 py-2 text-[0.95rem] font-semibold transition",
                      c.slug === current ? "border-leaf-700 bg-leaf-700 text-white" : "border-ink/10 bg-white text-ink hover:border-leaf-500 hover:text-leaf-800",
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
