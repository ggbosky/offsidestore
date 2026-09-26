/**
 * Cenova logika konfiguratoru.
 *
 * Vsechny ceny v halerich (integer), aby nedochazelo k float chybam.
 * Do UI se formatuje pres formatPrice().
 */

export const CURRENCY = "CZK";

/** Zakladni cena: tkanicka + az 3 znaky. */
export const BASE_PRICE = 29000;
/** Kazdy znak nad ramec zakladnich 3. */
export const EXTRA_LETTER_PRICE = 1200;
/** Pocet znaku v zakladni cene. */
export const INCLUDED_LETTERS = 3;

export type Size = "UNI" | "S" | "M" | "L";

/** Zakonceni naramku — urcuje, jestli se vybira konkretni velikost. */
export type EndingId = "univerzalni" | "pevne";

export const ENDINGS: {
  id: EndingId;
  label: string;
  description: string;
  /** true = velikost se dovoluje doladit, nevybira se S/M/L */
  universal: boolean;
}[] = [
  {
    id: "univerzalni",
    label: "Univerzální",
    description: "Posuvný uzel — délku si doladíš na ruce sám. Sedne komukoliv.",
    universal: true,
  },
  {
    id: "pevne",
    label: "Na míru",
    description: "Pevné zakončení ušité na konkrétní velikost. Drží přesně.",
    universal: false,
  },
];

export const SIZES: { id: Exclude<Size, "UNI">; label: string; cm: string }[] = [
  { id: "S", label: "S", cm: "16–17 cm" },
  { id: "M", label: "M", cm: "17–19 cm" },
  { id: "L", label: "L", cm: "19–21 cm" },
];

export type PriceBreakdown = {
  base: number;
  extraLetters: number;
  extraLettersCount: number;
  total: number;
};

export function calcPrice(input: { letters: string }): PriceBreakdown {
  const count = countLetters(input.letters);
  const extraLettersCount = Math.max(0, count - INCLUDED_LETTERS);
  const extraLetters = extraLettersCount * EXTRA_LETTER_PRICE;
  return {
    base: BASE_PRICE,
    extraLetters,
    extraLettersCount,
    total: BASE_PRICE + extraLetters,
  };
}

/** Mezery se nepocitaji jako znak k vypleteni. */
export function countLetters(letters: string): number {
  return letters.replace(/\s/g, "").length;
}

export function formatPrice(minor: number): string {
  return `${Math.round(minor / 100).toLocaleString("cs-CZ")} Kč`;
}
