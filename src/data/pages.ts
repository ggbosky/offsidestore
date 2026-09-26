/**
 * Obsahove stranky (doprava, velikosti, pravni texty...).
 *
 * Az bude obsah spravovat klient, staci tento registr vymenit za dotaz na
 * Shopify `pages` (Storefront API) — struktura bloku zustava stejna.
 */

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cta"; label: string; href: string };

export type ContentPage = {
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  blocks: ContentBlock[];
};

export const CONTENT_PAGES: ContentPage[] = [
  {
    slug: "pribeh",
    eyebrow: "Značka",
    title: "Náš příběh",
    lead:
      "Začalo to jednou prasklou tkaničkou v šatně a otázkou, jestli se z ní nedá udělat něco, co si vezmeš i mimo stadion.",
    blocks: [
      {
        type: "p",
        text: "OffsideStore vznikl mezi zápasy. Hráli jsme, jezdili na výjezdy a pořád nám chybělo něco, co má klubovou barvu, ale nevypadá jako suvenýr z fanshopu. Dres si na rande nevezmeš. Šálu v červnu taky ne.",
      },
      {
        type: "p",
        text: "Tak jsme vzali materiál, který v hokeji drží všechno pohromadě — tkaničku z brusle — a udělali z něj náramek. Barva podle dresu, zkratka klubu vpletená do splétání, kovová koncovka, která vydrží.",
      },
      { type: "h", text: "Co pro nás znamená ofsajd" },
      {
        type: "p",
        text: "Naše značka je čára a dvě tečky: hráč za čárou a hráč, který je o kousek dál. Ofsajd je moment, kdy jsi na hraně — a přesně to nás baví. Náramek, který nosíš do práce i na stadion, je taky trochu na hraně.",
      },
      { type: "h", text: "Jak to děláme dnes" },
      {
        type: "list",
        items: [
          "Každý kus splétáme ručně, ne na stroji.",
          "Tkaničky odebíráme od českého dodavatele a stříháme na míru.",
          "Barvy ladíme podle aktuálních dresů, ne podle stock palet.",
          "Termín odeslání potvrzujeme e-mailem podle velikosti objednávky.",
        ],
      },
      { type: "cta", label: "Vybrat svůj klub", href: "/kolekce" },
    ],
  },
  {
    slug: "doprava-a-vraceni",
    eyebrow: "Zákazník",
    title: "Doprava a vrácení",
    lead:
      "Odesíláme z Česka. Nad 999 Kč je doprava zdarma.",
    blocks: [
      { type: "h", text: "Doprava" },
      {
        type: "table",
        head: ["Způsob", "Cena", "Doručení"],
        rows: [
          ["Zásilkovna — výdejní místo", "69 Kč", "podle přepravce"],
          ["Balíkovna", "79 Kč", "podle přepravce"],
          ["PPL na adresu", "99 Kč", "podle přepravce"],
          ["Objednávka nad 999 Kč", "zdarma", "podle přepravce"],
        ],
      },
      {
        type: "p",
        text: "Každý náramek splétáme ručně, takže termín odeslání závisí na velikosti objednávky. Konkrétní termín ti potvrdíme e-mailem hned po objednání a jakmile balík předáme přepravci, pošleme sledovací číslo.",
      },
      { type: "h", text: "Vrácení" },
      {
        type: "list",
        items: [
          "Standardní edice můžeš vrátit do 30 dnů bez udání důvodu.",
          "Zboží musí být nenošené a v původním balení.",
          "Peníze posíláme zpět do 14 dnů od doručení vratky.",
          "U kusů s vlastní zkratkou na míru vracíme peníze při vadě výroby — zákonné právo na odstoupení se na zboží upravené podle přání zákazníka nevztahuje.",
        ],
      },
      { type: "h", text: "Reklamace" },
      {
        type: "p",
        text: "Praskla koncovka nebo se rozplétá splet? Napiš nám na info@offsidestore.cz s číslem objednávky a fotkou. Vyřizujeme obvykle výměnou kus za kus.",
      },
      { type: "cta", label: "Napsat nám", href: "/kontakt" },
    ],
  },
  {
    slug: "velikosti",
    eyebrow: "Zákazník",
    title: "Tabulka velikostí",
    lead:
      "Univerzální zakončení sedne komukoliv. Tabulka platí pro pevné zakončení na míru.",
    blocks: [
      {
        type: "table",
        head: ["Velikost", "Obvod zápěstí", "Délka náramku", "Komu sedí"],
        rows: [
          ["S", "16–17 cm", "17,5 cm", "Děti a útlejší zápěstí"],
          ["M", "17–19 cm", "19,5 cm", "Nejčastější volba"],
          ["L", "19–21 cm", "21,5 cm", "Silnější zápěstí"],
        ],
      },
      { type: "h", text: "Jak se změřit" },
      {
        type: "list",
        items: [
          "Vezmi provázek nebo krejčovský metr a obtoč ho kolem zápěstí za kostičkou.",
          "Změř délku provázku pravítkem.",
          "K naměřené hodnotě přičti zhruba 1 cm na volnost.",
          "Jsi mezi dvěma velikostmi? Ber větší — posuvný uzel dotažení dovolí.",
        ],
      },
      {
        type: "p",
        text: "Univerzální zakončení má posuvný uzel, takže si délku doladíš i po doručení — rozsah je zhruba 1,5 cm. Pevné zakončení na míru se posouvat nedá, proto u něj velikost změř pořádně.",
      },
      { type: "cta", label: "Do konfigurátoru", href: "/konfigurator" },
    ],
  },
  {
    slug: "pece",
    eyebrow: "Zákazník",
    title: "Péče o náramek",
    lead: "Tkanička je stavěná na led a pot. Pár věcí jí ale nedělá dobře.",
    blocks: [
      { type: "h", text: "Co v pohodě vydrží" },
      {
        type: "list",
        items: [
          "Déšť, sprcha, pot i tréninková hala.",
          "Bazén — po koupání jen opláchni sladkou vodou.",
          "Mráz na stadionu i léto na festivalu.",
        ],
      },
      { type: "h", text: "Čemu se vyhni" },
      {
        type: "list",
        items: [
          "Dlouhé máčení v slané vodě — sůl vysušuje vlákna.",
          "Rozpouštědla, aceton a bělidlo.",
          "Sušení na radiátoru nebo fénem — nech ho uschnout volně.",
          "Praní v pračce spolu s oblečením.",
        ],
      },
      { type: "h", text: "Když se zašpiní" },
      {
        type: "p",
        text: "Vlažná voda, kapka mýdla a starý zubní kartáček. Jemně vydrhni, opláchni a nech uschnout na ručníku. Barvy tím neutrpí.",
      },
    ],
  },
  {
    slug: "kontakt",
    eyebrow: "Zákazník",
    title: "Kontakt",
    lead: "Odpovídáme obvykle do pár hodin, nejpozději následující pracovní den.",
    blocks: [
      {
        type: "list",
        items: [
          "E-mail: info@offsidestore.cz",
          "Instagram: @offsidestore.cz",
          "Objednávky a reklamace: uveď číslo objednávky, vyřídíme rychleji.",
        ],
      },
      { type: "h", text: "Fakturační údaje" },
      {
        type: "p",
        text: "OffsideStore s.r.o., Česká republika. IČO a DIČ doplníme po registraci obchodu. Nejsme oficiálním partnerem uvedených klubů — názvy a barvy slouží k popisu varianty produktu.",
      },
      { type: "cta", label: "Zpět na kolekce", href: "/kolekce" },
    ],
  },
  {
    slug: "spoluprace",
    eyebrow: "Značka",
    title: "Spolupráce a kluby",
    lead:
      "Děláme edice pro kluby, fankluby, týmy i firmy. Od padesáti kusů výš.",
    blocks: [
      { type: "h", text: "Pro kluby a fankluby" },
      {
        type: "p",
        text: "Vlastní barva, klubová zkratka, případně logo na kartičce v balení. Dodáváme včetně licenčního ošetření — pomůžeme s formulací smlouvy.",
      },
      { type: "h", text: "Pro týmy a firmy" },
      {
        type: "list",
        items: [
          "Náramky pro celý tým s čísly hráčů.",
          "Firemní edice v barvě značky.",
          "Dárkové balení s vlastní kartičkou.",
        ],
      },
      {
        type: "p",
        text: "Napiš nám na info@offsidestore.cz počet kusů a představu. Ozveme se s cenovou nabídkou a vzorkem.",
      },
      { type: "cta", label: "Napsat nám", href: "/kontakt" },
    ],
  },
  {
    slug: "obchodni-podminky",
    eyebrow: "Právní",
    title: "Obchodní podmínky",
    lead:
      "Shrnutí pravidel nákupu. Před spuštěním obchodu nech text zkontrolovat právníkem — tohle je pracovní verze.",
    blocks: [
      { type: "h", text: "1. Základní ustanovení" },
      {
        type: "p",
        text: "Podmínky upravují vztah mezi provozovatelem e-shopu offsidestore.cz a kupujícím. Odesláním objednávky kupující potvrzuje, že se s nimi seznámil.",
      },
      { type: "h", text: "2. Objednávka a uzavření smlouvy" },
      {
        type: "p",
        text: "Smlouva vzniká odesláním objednávky a jejím potvrzením ze strany prodávajícího na e-mail kupujícího. Ceny jsou uvedené včetně DPH.",
      },
      { type: "h", text: "3. Dodání" },
      {
        type: "p",
        text: "Termín odeslání sdělíme kupujícímu e-mailem po přijetí objednávky. Doručení zajišťují smluvní přepravci uvedení v sekci Doprava a vrácení.",
      },
      { type: "h", text: "4. Odstoupení od smlouvy" },
      {
        type: "p",
        text: "Kupující spotřebitel má právo odstoupit od smlouvy do 14 dnů; my nabízíme lhůtu 30 dnů. Právo se nevztahuje na zboží upravené podle přání kupujícího, tedy na náramky s vlastní zkratkou nebo barevným mixem.",
      },
      { type: "h", text: "5. Reklamace" },
      {
        type: "p",
        text: "Záruční doba je 24 měsíců. Reklamaci uplatní kupující e-mailem na info@offsidestore.cz. Vyřizujeme do 30 dnů.",
      },
      { type: "h", text: "6. Mimosoudní řešení sporů" },
      {
        type: "p",
        text: "K mimosoudnímu řešení spotřebitelských sporů je příslušná Česká obchodní inspekce (www.coi.cz).",
      },
    ],
  },
  {
    slug: "ochrana-osobnich-udaju",
    eyebrow: "Právní",
    title: "Ochrana osobních údajů",
    lead:
      "Zpracováváme jen to, co potřebujeme k vyřízení objednávky. Pracovní verze — před spuštěním nech zkontrolovat.",
    blocks: [
      { type: "h", text: "Jaké údaje zpracováváme" },
      {
        type: "list",
        items: [
          "Jméno, adresa a kontakt — kvůli doručení a fakturaci.",
          "E-mail — potvrzení objednávky, případně novinky, pokud si je vyžádáš.",
          "Údaje o objednávce včetně personalizace (zkratka, barva, velikost).",
        ],
      },
      { type: "h", text: "Jak dlouho" },
      {
        type: "p",
        text: "Účetní doklady uchováváme po dobu stanovenou zákonem (10 let). Marketingové souhlasy do odvolání.",
      },
      { type: "h", text: "Komu je předáváme" },
      {
        type: "p",
        text: "Přepravcům kvůli doručení, platební bráně kvůli platbě a poskytovateli e-shopové platformy. Nikomu jinému a nikdy je neprodáváme.",
      },
      { type: "h", text: "Tvoje práva" },
      {
        type: "list",
        items: [
          "Přístup k údajům a jejich opravu.",
          "Výmaz, pokud pominul důvod zpracování.",
          "Odvolání souhlasu s marketingem kdykoli.",
          "Stížnost u Úřadu pro ochranu osobních údajů.",
        ],
      },
    ],
  },
];

export function getContentPage(slug: string): ContentPage | undefined {
  return CONTENT_PAGES.find((p) => p.slug === slug);
}
