import site from "@/content/site.json";

export const SITE = site;
export const SITE_URL = site.url;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; text?: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "Leistungen",
    href: "/leistungen/",
    children: [
      ...site.services.map((s) => ({ label: s.title, href: s.path, text: s.text })),
      ...site.specialties.slice(0, 9).map((s) => ({ label: s.title, href: s.path, text: s.text })),
    ],
  },
  { label: "Einsatzgebiete", href: "/einsatzgebiete/" },
  { label: "Ablauf", href: "/ablauf/" },
  {
    label: "Über uns",
    href: "/ueber-uns/",
    children: [
      { label: "Über uns", href: "/ueber-uns/", text: "Team, Philosophie und Geschichte seit 2010" },
      { label: "Bewertungen", href: "/bewertungen/", text: "4,97 von 5 – echte Kundenstimmen" },
      { label: "Soziales Engagement", href: "/soziales-engagement/", text: "Was mit Möbeln und Hausrat passiert" },
      { label: "Häufige Fragen", href: "/faq/", text: "Festpreis, Wertanrechnung, Ablauf" },
    ],
  },
  { label: "Ratgeber", href: "/ratgeber/" },
  { label: "Kontakt", href: "/kontakt/" },
];

export const FOOTER_LEGAL = [
  { label: "Impressum", href: "/impressum/" },
  { label: "Datenschutzhinweis", href: "/datenschutzhinweis/" },
  { label: "Kontakt", href: "/kontakt/" },
  { label: "Über uns", href: "/ueber-uns/" },
  { label: "Soziales Engagement", href: "/soziales-engagement/" },
];

/** Real team photos used to balance long text passages with imagery. */
export const TEAM_PHOTOS = [
  { src: "/images/wp/2026-02-nrw.webp", alt: "NRW Haushaltsauflösung Team beim Abbau einer Küche" },
  { src: "/images/wp/2025-09-moebel-ausraeumen2x3.webp", alt: "Mitarbeiter tragen Möbel aus einer Wohnung" },
  { src: "/images/wp/2026-02-nrw2.webp", alt: "Zwei Mitarbeiter beim High-Five vor dem Transporter" },
  { src: "/images/wp/2025-09-naegel-entfernen.webp", alt: "Nägel werden aus der Wand entfernt – schlüsselabgabefertig" },
  { src: "/images/wp/2025-09-kueche-entruempelung2x3.webp", alt: "Küchen-Entrümpelung durch das Team" },
  { src: "/images/wp/2025-09-transporter-beladen1x2.webp", alt: "Transporter wird beladen" },
  { src: "/images/wp/2026-02-3-bei-der-arbeit.webp", alt: "Mitarbeiter bei einer Haushaltsauflösung" },
  { src: "/images/wp/2025-09-abtransport-entruempelung.webp", alt: "Abtransport von Möbeln" },
  { src: "/images/wp/2025-09-bueroaufloesung.webp", alt: "Büroauflösung: Mitarbeiter transportiert Büromöbel" },
  { src: "/images/wp/2025-09-kuechenausbau.webp", alt: "Ausbau einer Einbauküche" },
];

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
