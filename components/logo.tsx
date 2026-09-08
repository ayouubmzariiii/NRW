import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

/**
 * The original NRW-Haushaltsauflösung logo (roof mark + wordmark), taken over 1:1
 * from the existing site. On dark backgrounds the mark is shown with a white wordmark.
 */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  if (inverted) {
    return (
      <Link href="/" className={clsx("group inline-flex items-center gap-3", className)}>
        <Image src="/logo-mark.png" alt="" width={56} height={37} className="h-9 w-auto" />
        <span className="flex flex-col leading-none">
          <span className="text-[1.3rem] font-extrabold tracking-tight text-white"><span className="text-leaf-400">NRW</span> Haushaltsauflösung</span>
          <span className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-sage-300">Entrümpelung · Wohnungsauflösung · seit 2010</span>
        </span>
        <span className="sr-only">NRW-Haushaltsauflösung – Startseite</span>
      </Link>
    );
  }
  return (
    <Link href="/" className={clsx("group inline-flex shrink-0 items-center", className)}>
      <Image src="/logo.png" alt="NRW-Haushaltsauflösung" width={500} height={122} priority sizes="(min-width: 1280px) 250px, 210px" className="h-12 w-auto max-w-none transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-[3.25rem] lg:h-[3.5rem]" />
      <span className="sr-only">Startseite</span>
    </Link>
  );
}
