import { CLUBS, DEFAULT_CLUB, getClub } from "@/data/clubs";
import {
  ENDINGS,
  INCLUDED_LETTERS,
  calcPrice,
  countLetters,
  type EndingId,
  type Size,
} from "@/lib/pricing";
import type { LineAttribute } from "@/lib/commerce/types";

/** Kompletni stav jednoho navoleneho naramku. */
export type BraceletConfig = {
  clubSlug: string;
  /** Naramek je z jedne tkanicky — tedy jedna barva. */
  color: string;
  letters: string;
  ending: EndingId;
  /** U univerzalniho zakonceni vzdy "UNI". */
  size: Size;
};

export const MAX_LETTERS = 12;

export function defaultConfig(clubSlug = DEFAULT_CLUB.slug): BraceletConfig {
  const club = getClub(clubSlug) ?? DEFAULT_CLUB;
  return {
    clubSlug: club.slug,
    color: club.lace,
    letters: club.abbr,
    ending: "univerzalni",
    size: "UNI",
  };
}

/** Povolena je jen velka latinka, cislice a mezera — to je to, co jde vyplest. */
export function sanitizeLetters(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .slice(0, MAX_LETTERS);
}

export function configPrice(config: BraceletConfig) {
  return calcPrice({ letters: config.letters });
}

function endingLabel(id: EndingId): string {
  return ENDINGS.find((e) => e.id === id)?.label ?? id;
}

export function configSubtitle(config: BraceletConfig): string {
  const club = getClub(config.clubSlug);
  return [
    club?.name ?? "Vlastní barva",
    `„${config.letters}“`,
    config.size === "UNI" ? "univerzální" : `vel. ${config.size}`,
  ].join(" · ");
}

/**
 * Personalizace -> line item attributes.
 *
 * Klice s podtrzitkem jsou v Shopify skryte pred zakaznikem v kosiku
 * (pouzivame je pro vyrobu), ostatni se zobrazuji v objednavce i na packing slipu.
 */
export function configToAttributes(config: BraceletConfig): LineAttribute[] {
  const club = getClub(config.clubSlug);
  const price = configPrice(config);
  return [
    { key: "Klub", value: club?.name ?? "Vlastní barva" },
    { key: "Zkratka", value: config.letters },
    { key: "Barva tkaničky", value: config.color },
    { key: "Zakončení", value: endingLabel(config.ending) },
    { key: "Velikost", value: config.size === "UNI" ? "Univerzální" : config.size },
    { key: "_club_slug", value: config.clubSlug },
    { key: "_extra_letters", value: String(price.extraLettersCount) },
    { key: "_ending", value: config.ending },
  ];
}

export function lettersHint(letters: string): string {
  const count = countLetters(letters);
  if (count <= INCLUDED_LETTERS) {
    return `${count}/${INCLUDED_LETTERS} znaků v základní ceně`;
  }
  return `${count} znaků — ${count - INCLUDED_LETTERS} nad rámec základu`;
}

export const ALL_CLUBS = CLUBS;
