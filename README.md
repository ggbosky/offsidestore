# OffsideStore.cz

E-shop s náramky z originálních hokejových tkaniček. Headless storefront
postavený tak, aby se dal napojit na Shopify backend bez přepisování frontendu.

**Motto:** *Nos svůj klub. Kdekoliv.*

## Spuštění

```bash
npm install
npm run dev
```

Běží na `http://localhost:3000` (v `.claude/launch.json` je port 3210).
Bez Shopify env proměnných jede lokální mock katalog, takže je celý web
proklikatelný včetně objednávky.

```bash
npm run build      # produkční build
npm run typecheck  # kontrola typů
```

## Stack

| | |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components) |
| Jazyk | TypeScript |
| Styly | Tailwind CSS 4 (`@theme` v [src/app/globals.css](src/app/globals.css)) |
| Stav košíku | Zustand + `localStorage` |
| Backend | `CommerceProvider` — mock ↔ Shopify Storefront API |

## Struktura

```
src/
├── app/
│   ├── page.tsx                 # homepage
│   ├── kolekce/                 # výpis klubových kolekcí
│   ├── konfigurator/            # samostatný konfigurátor
│   ├── produkt/[handle]/        # detail produktu
│   ├── kosik/hotovo/            # potvrzení objednávky (mock režim)
│   ├── [slug]/                  # obsahové stránky z src/data/pages.ts
│   └── actions/checkout.ts      # server action: košík → checkout
├── components/
│   ├── BraceletPreview.tsx      # SVG náramek, skládá se v reálném čase
│   ├── Configurator.tsx         # 4 kroky + živý přepočet ceny
│   ├── AccentProvider.tsx       # klubová barva → CSS proměnné
│   ├── FloatingCta.tsx          # oválné plovoucí CTA pro mobil
│   └── home/                    # sekce homepage
├── data/
│   ├── clubs.ts                 # kluby, barvy, přechody, zkratky
│   └── pages.ts                 # obsahové stránky
└── lib/
    ├── pricing.ts               # cenová logika (ceny v haléřích)
    ├── configuration.ts         # konfigurace náramku → line item attributes
    ├── cart-store.ts            # košík
    └── commerce/                # mock + Shopify provider
```

## Cenová logika

Zdroj pravdy je [src/lib/pricing.ts](src/lib/pricing.ts). Všechny částky jsou
v haléřích (integer), aby nevznikaly chyby zaokrouhlením.

| Položka | Cena |
| --- | --- |
| Základ (tkanička + 3 znaky) | 290 Kč |
| Každý znak nad rámec 3 | +12 Kč |

Maximum je 12 znaků, tedy 398 Kč za nejdelší nápis.

## Design a animace

- **Barvy:** černá / bílá základ, klubová barva se promítá do `--accent`.
  Klubové dlaždice jsou zkratka přes celý obdélník na přechodu klubových barev.
  Přepnutí klubu prolne akcent přes `@property --accent` napříč celým UI.
- **Tkaničkový efekt:** vlnící se prameny na pozadí hero sekce, při scrollu se
  „rozvazují" ([LaceBackground.tsx](src/components/LaceBackground.tsx)).
- **Skládání náramku:** tkaničky se provlékají (`stroke-dashoffset`) a písmena
  dopadají shora ([BraceletPreview.tsx](src/components/BraceletPreview.tsx)).
- **Magnetická CTA, 2.5D náklon, parallax, reveal on scroll.**
- Vše respektuje `prefers-reduced-motion`. Skrytý stav animací žije jen
  v keyframu `from`, takže se obsah zobrazí i když se animace nespustí.

## Přidání klubu

Přidej záznam do [src/data/clubs.ts](src/data/clubs.ts) — vyplň `from` / `to`
(konce přechodu na dlaždici), `ink` (barva zkratky) a `lace` (výchozí barva
tkaničky). Klub se objeví v sekci „Komu fandíš?", v konfigurátoru, v kolekcích,
v patičce i v sitemapě. V Shopify pak založ produkt s handle `naramek-<slug>` a metafieldem `custom.club_slug`.

## Fotky

Zatím se všude kreslí vektorový náhled. Jakmile budou fotky v Shopify,
komponenty je vykreslí samy — struktura se nemění. Detaily v [SHOPIFY.md](SHOPIFY.md).

## Poznámka k názvům klubů

Názvy a barvy klubů popisují variantu produktu. Nejsou použita klubová loga ani
znaky. Před ostrým provozem doporučujeme ověřit licenční podmínky s dotčenými
kluby — patička to zmiňuje, ale právní posouzení to nenahrazuje.
