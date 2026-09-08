"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { SITE } from "@/lib/site";
import { ArrowRight, CheckIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon, ShieldIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui";

/**
 * Same field set as the original WordPress form (Name, E-Mail, Telefon,
 * Ort des Objekts, Nachricht). Spam protection is a honeypot plus a timing
 * check instead of the old math captcha.
 */
const fieldCls =
  "peer w-full rounded-xl border border-ink/12 bg-paper/60 py-3 pl-11 pr-4 text-[1rem] text-ink outline-none transition placeholder:text-muted/50 hover:border-ink/20 focus:border-leaf-600 focus:bg-white focus:ring-4 focus:ring-leaf-500/12";
const labelCls = "mb-1.5 block text-[0.8rem] font-bold uppercase tracking-wider text-muted";
const iconCls = "pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted transition peer-focus:text-leaf-700";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
function PenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4ZM14.5 5.5l4 4" />
    </svg>
  );
}

export function ContactForm({ defaultOrt = "" }: { compact?: boolean; defaultOrt?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);
  const tsRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  useEffect(() => { if (tsRef.current) tsRef.current.value = String(Date.now()); }, []);
  const f = state?.fields ?? {};

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 pb-5">
        <div>
          <p className="eyebrow">Anfrage</p>
          <p className="mt-1 font-display text-2xl leading-tight text-ink">In 60 Sekunden zur Anfrage</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-bold text-leaf-800">
          <ClockIcon className="h-4 w-4" /> Antwort meist in wenigen Stunden
        </span>
      </div>

      <form action={action} className="mt-6 grid gap-4" noValidate>
        <input ref={tsRef} type="hidden" name="_t" defaultValue="0" />
        <input type="hidden" name="_page" value={pathname} />
        <div className="hidden" aria-hidden="true">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className={labelCls}>Name *</label>
            <div className="relative">
              <input id="cf-name" name="name" type="text" required autoComplete="name" placeholder="Vor- und Nachname" defaultValue={f.name} className={fieldCls} />
              <UserIcon className={iconCls} />
            </div>
          </div>
          <div>
            <label htmlFor="cf-phone" className={labelCls}>Telefon</label>
            <div className="relative">
              <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="Für den Rückruf" defaultValue={f.phone} className={fieldCls} />
              <PhoneIcon className={iconCls} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-email" className={labelCls}>E-Mail *</label>
            <div className="relative">
              <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="name@beispiel.de" defaultValue={f.email} className={fieldCls} />
              <MailIcon className={iconCls} />
            </div>
          </div>
          <div>
            <label htmlFor="cf-ort" className={labelCls}>Ort des Objekts</label>
            <div className="relative">
              <input id="cf-ort" name="ort" type="text" autoComplete="address-level2" placeholder="z. B. Düsseldorf" defaultValue={f.ort ?? defaultOrt} className={fieldCls} />
              <MapPinIcon className={iconCls} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="cf-msg" className={labelCls}>Nachricht</label>
          <div className="relative">
            <textarea id="cf-msg" name="nachricht" rows={4} placeholder="Was soll geräumt werden? Größe, Etage, Aufzug, Wunschtermin …" defaultValue={f.nachricht} className={clsx(fieldCls, "resize-y pt-3")} />
            <PenIcon className="pointer-events-none absolute left-4 top-4 h-4.5 w-4.5 text-muted transition peer-focus:text-leaf-700" />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-xl bg-paper/60 p-3 text-sm text-muted">
          <input type="checkbox" name="datenschutz" required className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink/20 accent-leaf-700" />
          <span>Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Details im <Link href="/datenschutzhinweis/" className="underline underline-offset-2 hover:text-ink">Datenschutzhinweis</Link>. *</span>
        </label>

        {state && !state.ok && state.error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{state.error}</p>
        )}

        <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full")}>
          {pending ? "Wird gesendet…" : "Anfrage senden"} <ArrowRight className="h-5 w-5 shrink-0" />
        </button>

        <ul className="grid gap-2 text-sm text-muted sm:grid-cols-3 sm:gap-3">
          {[[CheckIcon, "Kostenlos & unverbindlich"], [ShieldIcon, "Keine Vorauszahlung"], [PhoneIcon, "24/7 erreichbar"]].map(([Icon, t]) => {
            const I = Icon as React.ComponentType<{ className?: string }>;
            return (
              <li key={t as string} className="flex items-center gap-2">
                <I className="h-4 w-4 shrink-0 text-leaf-700" /> {t as string}
              </li>
            );
          })}
        </ul>

        <p className="text-center text-sm text-muted">
          Lieber telefonisch? <a href={SITE.phoneMobileHrefPlain} className="font-bold text-leaf-700 hover:text-leaf-800">{SITE.phoneMobile}</a>
        </p>
      </form>
    </div>
  );
}
