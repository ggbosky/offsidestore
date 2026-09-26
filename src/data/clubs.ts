/**
 * Katalog klubu. Zdroj pravdy pro barvy, zkratky a vychozi konfiguraci naramku.
 *
 * `from` / `to` jsou konce prechodu na dlazdici klubu (levy horni -> pravy dolni).
 * `ink` je barva zkratky pres tento prechod — u svetlych klubu tmava, jinak bila.
 * `lace` je barva tkanicky v nahledu naramku (klub ma vzdy jednu vychozi).
 *
 * Poznamka k Shopify: kazdy klub odpovida produktu s handle `naramek-<slug>`
 * a metafieldem `custom.club_slug` — viz SHOPIFY.md.
 */

export type Club = {
  slug: string;
  name: string;
  short: string;
  city: string;
  /** Zkratka vypletena do naramku (3 znaky = zakladni cena). */
  abbr: string;
  /** Prechod na dlazdici — klubove barvy. */
  from: string;
  to: string;
  /** Barva zkratky na dlazdici. */
  ink: string;
  /** Vychozi barva tkanicky. */
  lace: string;
  /** Akcentni barva rozhrani pri vyberu klubu. */
  accent: string;
  /** Barva textu na akcentu (kontrast). */
  onAccent: string;
};

export const CLUBS: Club[] = [
  {
    slug: "jihlava",
    name: "Dukla Jihlava",
    short: "Jihlava",
    city: "Jihlava",
    abbr: "JIH",
    from: "#D6122B",
    to: "#3E0810",
    ink: "#FFFFFF",
    lace: "#D6122B",
    accent: "#D6122B",
    onAccent: "#FFFFFF",
  },
  {
    slug: "kometa",
    name: "Kometa Brno",
    short: "Kometa",
    city: "Brno",
    abbr: "KOM",
    from: "#0B4EA2",
    to: "#061E3C",
    ink: "#FFFFFF",
    lace: "#0B4EA2",
    accent: "#0B4EA2",
    onAccent: "#FFFFFF",
  },
  {
    slug: "sparta",
    name: "Sparta Praha",
    short: "Sparta",
    city: "Praha",
    abbr: "SPA",
    from: "#B01E28",
    to: "#340A0E",
    ink: "#FFFFFF",
    lace: "#B01E28",
    accent: "#B01E28",
    onAccent: "#FFFFFF",
  },
  {
    slug: "slovan",
    name: "Slovan Bratislava",
    short: "Slovan",
    city: "Bratislava",
    abbr: "SBA",
    from: "#3FA9E0",
    to: "#0A3452",
    ink: "#FFFFFF",
    lace: "#3FA9E0",
    accent: "#3FA9E0",
    onAccent: "#08202F",
  },
  {
    slug: "vsetin",
    name: "VHK Vsetín",
    short: "Vsetín",
    city: "Vsetín",
    abbr: "VSE",
    from: "#0F9D4F",
    to: "#F5C518",
    ink: "#0A2A14",
    lace: "#0F9D4F",
    accent: "#0F9D4F",
    onAccent: "#FFFFFF",
  },
  {
    slug: "pardubice",
    name: "Dynamo Pardubice",
    short: "Pardubice",
    city: "Pardubice",
    abbr: "PCE",
    from: "#E01B24",
    to: "#3A0A0E",
    ink: "#FFFFFF",
    lace: "#E01B24",
    accent: "#E01B24",
    onAccent: "#FFFFFF",
  },
  {
    slug: "trinec",
    name: "Oceláři Třinec",
    short: "Třinec",
    city: "Třinec",
    abbr: "TRI",
    from: "#D2232A",
    to: "#121212",
    ink: "#FFFFFF",
    lace: "#D2232A",
    accent: "#D2232A",
    onAccent: "#FFFFFF",
  },
  {
    slug: "kladno",
    name: "Poldi Kladno",
    short: "Kladno",
    city: "Kladno",
    abbr: "KLA",
    from: "#0A46A5",
    to: "#061E3C",
    ink: "#FFFFFF",
    lace: "#0A46A5",
    accent: "#0A46A5",
    onAccent: "#FFFFFF",
  },
  {
    slug: "trencin",
    name: "Dukla Trenčín",
    short: "Trenčín",
    city: "Trenčín",
    abbr: "TRE",
    from: "#D0202F",
    to: "#3A0A0E",
    ink: "#FFFFFF",
    lace: "#D0202F",
    accent: "#D0202F",
    onAccent: "#FFFFFF",
  },
  {
    slug: "litvinov",
    name: "Verva Litvínov",
    short: "Litvínov",
    city: "Litvínov",
    abbr: "LIT",
    from: "#F2C300",
    to: "#121212",
    ink: "#FFFFFF",
    lace: "#F2C300",
    accent: "#F2C300",
    onAccent: "#0A0A0A",
  },
  {
    slug: "slavia",
    name: "Slavia Praha",
    short: "Slavia",
    city: "Praha",
    abbr: "SLA",
    from: "#C8102E",
    to: "#340A0E",
    ink: "#FFFFFF",
    lace: "#C8102E",
    accent: "#C8102E",
    onAccent: "#FFFFFF",
  },
  {
    slug: "zlin",
    name: "PSG Berani Zlín",
    short: "Zlín",
    city: "Zlín",
    abbr: "ZLN",
    from: "#F5C518",
    to: "#101010",
    ink: "#FFFFFF",
    lace: "#F5C518",
    accent: "#F5C518",
    onAccent: "#0A0A0A",
  },
];

export const DEFAULT_CLUB = CLUBS[0];

export function getClub(slug: string): Club | undefined {
  return CLUBS.find((c) => c.slug === slug);
}

/** Prechod pro dlazdici klubu. */
export function clubGradient(club: Club): string {
  return `linear-gradient(135deg, ${club.from} 0%, ${club.to} 100%)`;
}
