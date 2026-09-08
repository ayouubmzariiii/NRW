import Link from "next/link";
import { SITE } from "@/lib/site";
import { CalendarIcon, PhoneIcon } from "@/components/icons";

/** Sticky call/request bar on small screens – the two actions every visitor needs. */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur-lg lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="grid grid-cols-2 gap-2">
        <a href={SITE.phoneMobileHrefPlain} className="flex h-12 items-center justify-center gap-2 rounded-full bg-forest-900 font-semibold text-white">
          <PhoneIcon className="h-5 w-5 text-leaf-400" /> Jetzt anrufen
        </a>
        <Link href="/kontakt/" className="flex h-12 items-center justify-center gap-2 rounded-full bg-leaf-700 font-semibold text-white">
          <CalendarIcon className="h-5 w-5" /> Gratis Besichtigung
        </Link>
      </div>
    </div>
  );
}
