"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="Inhalt" className="text-sm">
      <p className="eyebrow mb-3">Inhalt</p>
      <ol className="grid gap-1 border-l border-ink/10">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={clsx("-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition", active === i.id ? "border-leaf-500 font-semibold text-ink" : "border-transparent text-muted hover:text-ink")}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
