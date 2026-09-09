import Link from "next/link";
import { SITE } from "@/lib/site";
import { CalendarIcon, PhoneIcon } from "@/components/icons";

/** Sticky call/request bar on small screens – the two actions every visitor needs. Labels never wrap; the icons only show once there is room (≥ 416px). */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur-lg lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="grid grid-cols-2 gap-2">
        <a href={SITE.phoneMobileHrefPlain} className="flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-forest-900 text-sm font-semibold text-white">
          <PhoneIcon className="hidden h-5 w-5 text-leaf-400 min-[26rem]:block" /> Jetzt anrufen
        </a>
        <Link href="/kontakt/" prefetch={false} className="flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-leaf-700 text-sm font-semibold text-white">
          <CalendarIcon className="hidden h-5 w-5 min-[26rem]:block" /> Gratis Besichtigung
        </Link>
      </div>
    </div>
  );
}
