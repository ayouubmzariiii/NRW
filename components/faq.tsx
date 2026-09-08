import clsx from "clsx";
import { Prose } from "@/components/prose";
import type { FaqItem } from "@/lib/content";

export function Faq({ items, className, openFirst = true, light = false }: { items: FaqItem[]; className?: string; openFirst?: boolean; light?: boolean }) {
  return (
    <div className={clsx("divide-y", light ? "divide-white/10" : "divide-ink/10", className)}>
      {items.map((f, i) => (
        <details key={f.q} className="faq group py-1" open={openFirst && i === 0}>
          <summary className={clsx("flex items-start justify-between gap-4 py-4 text-left text-[1.05rem] font-semibold leading-snug", light ? "text-white" : "text-ink")}>
            <span>{f.q}</span>
            <span className={clsx("faq-icon mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg leading-none", light ? "bg-white/10 text-leaf-300" : "bg-leaf-100 text-leaf-700")} aria-hidden>+</span>
          </summary>
          <div className="pb-5 pr-10">
            {/<[a-z]/i.test(f.a) ? <Prose html={f.a} className="prose-compact" invert={light} /> : <p className={clsx("prose-nrw prose-compact", light && "prose-invert")}>{f.a}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}
