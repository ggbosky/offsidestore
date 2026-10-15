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
    title: "Velikost",
    lead:
      "Náramky jsou univerzální — posuvný uzel si dotáhneš přímo na ruce.",
    blocks: [
      {
        type: "p",
        text: "Jedna velikost pro všechny. Splet má posuvný uzel, kterým náramek dotáhneš nebo povolíš — sedne na obvod zápěstí přibližně 16 až 21 cm. Nic se neměří předem a nic se nevrací kvůli špatné velikosti.",
      },
      { type: "h", text: "Jak ho dotáhnout" },
      {
        type: "list",
        items: [
          "Nasaď náramek na zápěstí a uzel posuň směrem k němu.",
          "Dotáhni ho tak, aby se dal otočit, ale nespadl přes ruku.",
          "Volné konce nech viset, nebo je zastrkňi pod splet.",
          "Když povolí, stačí uzel přitlakovat zpátky.",
        ],
      },
      {
        type: "p",
        text: "Uzel drží třením, takže se během nošení nerozjíždí. Kdyby se přece jen povolil, jen ho přitlakuj zpátky — nic se tím neopotřebuje.",
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
];

export function getContentPage(slug: string): ContentPage | undefined {
  return CONTENT_PAGES.find((p) => p.slug === slug);
}
