"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/logo";
import { NAV, SITE } from "@/lib/site";
import { ArrowRight, ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui";

export function SiteHeader() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // The drawer is "open" only for the route it was opened on – navigating closes it without an effect.
  const open = openPath === pathname;
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const [services, , , about] = NAV;
  const isActive = (href: string) => pathname === href || (href.length > 1 && pathname.startsWith(href));
  const linkCls = (active: boolean) => clsx("flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.93rem] font-semibold transition hover:bg-ink/5 hover:text-ink 2xl:px-3.5 2xl:text-[0.95rem]", active ? "text-leaf-700" : "text-ink/85");

  return (
    <>
      <header className={clsx("sticky top-0 z-50 transition-all duration-300", scrolled ? "bg-cream/92 shadow-[0_1px_0_rgb(20_32_26/0.06)] backdrop-blur-xl" : "bg-cream/75 backdrop-blur-md")}>
        <div className="hidden border-b border-ink/5 bg-forest-950 text-[0.78rem] text-sage-200 lg:block">
          <div className="container-x flex h-9 items-center justify-between">
            <p className="flex items-center gap-2">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-leaf-400" /><span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-400" /></span>
              Jetzt erreichbar – 24 Stunden, 7 Tage die Woche, auch an Feiertagen
            </p>
            <div className="flex items-center gap-6">
              <Link href="/bewertungen/" className="flex items-center gap-1.5 hover:text-white">
                <span className="text-amber">★★★★★</span>
                <span><strong className="text-white">{SITE.rating.value.toLocaleString("de-DE")}</strong> / 5 · {SITE.rating.label} · {SITE.rating.count} Bewertungen</span>
              </Link>
              <span className="text-sage-500">|</span>
              <a href={SITE.phoneMobileHrefPlain} className="hover:text-white">Mobil: <strong className="text-white">{SITE.phoneMobile}</strong></a>
              <span className="text-sage-500">|</span>
              <a href={SITE.phoneFreeHref} className="hover:text-white">Kostenlos: <strong className="text-white">{SITE.phoneFree}</strong></a>
            </div>
          </div>
        </div>

        <div className="container-x flex h-[4.75rem] items-center justify-between gap-4 lg:h-[5.25rem] lg:gap-6">
          <Logo />

          <nav aria-label="Hauptnavigation" className="hidden shrink-0 items-center xl:flex">
            <div className="group relative">
              <Link href={services.href} className={linkCls(isActive("/leistungen/") || SITE.services.some((s) => s.path === pathname) || SITE.specialties.some((s) => s.path === pathname))}>
                {services.label} <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 w-[min(58rem,calc(100vw-3rem))] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="grid grid-cols-[1.15fr_1fr] gap-6 rounded-3xl border border-ink/8 bg-cream p-6 shadow-lift">
                  <div className="grid content-start gap-1.5">
                    <p className="eyebrow px-2">Kernleistungen</p>
                    {SITE.services.map((s) => (
                      <Link key={s.path} href={s.path} className="group/item flex items-start gap-3 rounded-2xl p-3 transition hover:bg-leaf-50">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-500/10 text-leaf-700 transition group-hover/item:bg-leaf-700 group-hover/item:text-white"><ArrowRight className="h-4 w-4" /></span>
                        <span><span className="block font-semibold text-ink">{s.title}</span><span className="mt-0.5 block text-sm leading-snug text-muted">{s.text}</span></span>
                      </Link>
                    ))}
                    <Link href="/leistungen/" className="mt-1 inline-flex items-center gap-1.5 px-3 text-sm font-bold text-leaf-700 hover:text-leaf-800">Alle Leistungen im Überblick <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                  <div>
                    <p className="eyebrow mb-3 px-2">Weitere Leistungen</p>
                    <ul className="grid grid-cols-1 gap-0.5">
                      {SITE.specialties.slice(0, 9).map((s) => (
                        <li key={s.path}><Link href={s.path} className="block rounded-xl px-3 py-2 text-[0.9rem] font-medium text-ink/80 transition hover:bg-leaf-50 hover:text-leaf-800">{s.title}</Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/einsatzgebiete/" className={linkCls(isActive("/einsatzgebiete/") || (/\/haushaltsaufloesung\/$/.test(pathname) && pathname.split("/").length === 4))}>Einsatzgebiete</Link>
            <Link href="/ablauf/" className={linkCls(isActive("/ablauf/"))}>Ablauf</Link>

            <div className="group relative">
              <Link href={about.href} className={linkCls(about.children!.some((c) => isActive(c.href)))}>
                {about.label} <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-72 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="grid gap-0.5 rounded-3xl border border-ink/8 bg-cream p-3 shadow-lift">
                  {about.children!.map((c) => (
                    <li key={c.href}><Link href={c.href} className="block rounded-2xl px-3 py-2.5 transition hover:bg-leaf-50"><span className="block font-semibold text-ink">{c.label}</span><span className="block text-xs text-muted">{c.text}</span></Link></li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/ratgeber/" className={linkCls(isActive("/ratgeber/"))}>Ratgeber</Link>
            <Link href="/kontakt/" className={linkCls(isActive("/kontakt/"))}>Kontakt</Link>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <a href={SITE.phoneMobileHrefPlain} className={buttonClasses("outline", "md", "whitespace-nowrap")}>
              <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-leaf-700" /> {SITE.phoneMobile}
            </a>
            <Link href="/kontakt/" className={buttonClasses("primary", "md", "whitespace-nowrap")}>Angebot anfragen</Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <a href={SITE.phoneMobileHrefPlain} className="inline-flex h-11 items-center gap-2 rounded-full bg-leaf-700 px-4 text-sm font-semibold text-white shadow-soft">
              <PhoneIcon className="h-4.5 w-4.5 shrink-0" /> <span className="hidden sm:inline">Anrufen</span><span className="sr-only sm:hidden">Anrufen: {SITE.phoneMobile}</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-white text-ink shadow-soft transition active:scale-95"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              <span className="sr-only">Menü {open ? "schließen" : "öffnen"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer lives outside <header> – a backdrop-filter on the header would
          otherwise become the containing block for position: fixed. */}
      <div id="mobile-nav" className={clsx("xl:hidden", open ? "block" : "hidden")}>
        <div className="fixed inset-0 top-[4.5rem] z-40 overflow-y-auto overscroll-contain bg-cream px-5 pb-28 pt-5">
          <ul className="grid gap-1.5">
            {[{ label: "Leistungen", href: "/leistungen/" }, { label: "Einsatzgebiete", href: "/einsatzgebiete/" }, { label: "Ablauf", href: "/ablauf/" }, { label: "Über uns", href: "/ueber-uns/" }, { label: "Bewertungen", href: "/bewertungen/" }, { label: "Ratgeber", href: "/ratgeber/" }, { label: "Kontakt", href: "/kontakt/" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={clsx("flex items-center justify-between rounded-2xl border px-4 py-3.5 text-lg font-semibold transition", isActive(item.href) ? "border-leaf-600 bg-leaf-50 text-leaf-800" : "border-ink/8 bg-white text-ink")}>
                  {item.label}<ArrowRight className="h-4 w-4 text-leaf-700" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-7 mb-2">Leistungen im Detail</p>
          <ul className="grid grid-cols-2 gap-1.5">
            {[...SITE.services, ...SITE.specialties.slice(0, 7)].map((s) => (
              <li key={s.path}><Link href={s.path} className="block rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-ink/80 shadow-soft">{s.title}</Link></li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-ink/10 pt-4 text-sm font-medium text-muted">
            <li><Link href="/soziales-engagement/">Soziales Engagement</Link></li>
            <li><Link href="/faq/">Häufige Fragen</Link></li>
            <li><Link href="/impressum/">Impressum</Link></li>
            <li><Link href="/datenschutzhinweis/">Datenschutz</Link></li>
          </ul>
          <div className="mt-6 rounded-3xl bg-forest-950 p-5 text-sage-200">
            <p className="text-sm">Rund um die Uhr für Sie da:</p>
            <a href={SITE.phoneMobileHrefPlain} className="mt-1 block font-display text-2xl text-white">{SITE.phoneMobile}</a>
            <a href={SITE.phoneFreeHref} className="mt-1 block text-sm">Kostenlos: {SITE.phoneFree}</a>
            <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm [overflow-wrap:anywhere]">{SITE.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
