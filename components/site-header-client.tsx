"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { CloseIcon, MenuIcon } from "@/components/icons";

/*
 * The interactive slice of the site header. Everything that depends on the
 * route or on scroll position lives here; the static markup (top bar, mega
 * menu, CTAs, drawer contents) stays in the server-rendered <SiteHeader/> so
 * its code and data are not shipped to the browser.
 */

const MenuContext = createContext<{ open: boolean; toggle: () => void }>({ open: false, toggle: () => {} });

/** Sticky <header> with the scroll-dependent chrome, plus the mobile drawer that belongs to it. */
export function HeaderChrome({ children, drawer }: { children: ReactNode; drawer: ReactNode }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // The drawer is "open" only for the route it was opened on – navigating closes it without an effect.
  const open = openPath === pathname;
  const toggle = () => setOpenPath(open ? null : pathname);
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

  return (
    <MenuContext.Provider value={{ open, toggle }}>
      <header className={clsx("sticky top-0 z-50 transition-all duration-300", scrolled ? "bg-cream/92 shadow-[0_1px_0_rgb(20_32_26/0.06)] backdrop-blur-xl" : "bg-cream/75 backdrop-blur-md")}>
        {children}
      </header>
      {/* Drawer lives outside <header> – a backdrop-filter on the header would
          otherwise become the containing block for position: fixed. */}
      <div id="mobile-nav" className={clsx("xl:hidden", open ? "block" : "hidden")}>
        {drawer}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuButton() {
  const { open, toggle } = useContext(MenuContext);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="mobile-nav"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-white text-ink shadow-soft transition active:scale-95"
    >
      {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      <span className="sr-only">Menü {open ? "schließen" : "öffnen"}</span>
    </button>
  );
}

/**
 * Link that highlights itself for the current route. `prefixes` match by path
 * prefix (default: the link's own href), `exact` by equality, and `cityPages`
 * additionally matches every `/<city>/haushaltsaufloesung/` page.
 */
export function NavLink({ href, prefixes, exact = [], cityPages = false, className, activeClassName, inactiveClassName, children }: {
  href: string;
  prefixes?: string[];
  exact?: string[];
  cityPages?: boolean;
  className?: string;
  activeClassName: string;
  inactiveClassName: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const byPrefix = (p: string) => pathname === p || (p.length > 1 && pathname.startsWith(p));
  const active =
    (prefixes ?? [href]).some(byPrefix) ||
    exact.includes(pathname) ||
    (cityPages && /\/haushaltsaufloesung\/$/.test(pathname) && pathname.split("/").length === 4);
  return (
    <Link href={href} prefetch={false} className={clsx(className, active ? activeClassName : inactiveClassName)}>
      {children}
    </Link>
  );
}
