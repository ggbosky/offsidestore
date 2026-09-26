# Napojení na Shopify backend

Storefront je postavený headless: veškerá komunikace s obchodem prochází jedním
rozhraním `CommerceProvider` ([src/lib/commerce/types.ts](src/lib/commerce/types.ts)).
Dnes běží lokální mock katalog, po vyplnění env proměnných se **automaticky** přepne
na Shopify — v komponentách se nemění ani řádek.

```
src/lib/commerce/
├── types.ts            # doménové typy (kopírují tvar Storefront API)
├── index.ts            # ← jediný bod přepnutí mock ↔ Shopify
├── mock/provider.ts    # lokální katalog generovaný z src/data/clubs.ts
└── shopify/
    ├── client.ts       # fetch nad Storefront GraphQL + detekce konfigurace
    ├── queries.ts      # GraphQL dotazy a mutace
    └── provider.ts     # normalizace Shopify → doménové typy
```

## 1. Vytvoř obchod a Storefront token

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**
2. Vytvoř app, záložka **Configuration → Storefront API** a povol scopes:
   `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
   `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
3. **Install app** → zkopíruj *Storefront API access token*

Zkopíruj `.env.example` do `.env.local` a vyplň:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=tvuj-obchod.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_STOREFRONT_API_VERSION=2025-01
NEXT_PUBLIC_SHOPIFY_LETTER_ADDON_HANDLE=priplatek-pismeno
```

Po restartu dev serveru už `commerce` vrací `shopifyProvider`. Ověříš to tak, že
`/kolekce` zobrazí produkty z adminu místo mocku.

## 2. Struktura produktů v adminu

### Klubové náramky — jeden produkt na klub

| Pole | Hodnota |
| --- | --- |
| Handle | `naramek-<slug>` (např. `naramek-sparta`) — slugy jsou v [src/data/clubs.ts](src/data/clubs.ts) |
| Title | `Náramek Sparta Praha` |
| Options | **Velikost**: `UNI`, `S`, `M`, `L` (čtyři varianty) |
| Cena varianty | `290` Kč (základ: tkanička + 3 znaky) |
| Metafield | namespace `custom`, key `club_slug`, typ *single line text*, hodnota = slug klubu |

Metafield `custom.club_slug` je povinný — podle něj si storefront páruje produkt
s barvami a zkratkou klubu. Bez něj produkt zůstane bez klubové palety.

> Metafield musí být v **Settings → Custom data → Products** označený jako
> „Storefronts → expose to Storefront API", jinak ho GraphQL nevrátí.

### Příplatkové produkty (skryté z navigace)

| Handle | K čemu | Cena |
| --- | --- | --- |
| `priplatek-pismeno` | každý znak nad rámec základních 3 | 12 Kč |

Nastav mu „Sales channels → Online Store" bez zařazení do kolekcí a bez
publikování v navigaci. Do košíku se přidává programově.

### Kolekce

| Handle | Obsah |
| --- | --- |
| `klubove-kolekce` | všechny klubové náramky |

## 3. Jak se personalizace dostane do objednávky

Konfigurace se posílá jako **line item attributes** — Shopify je ukáže v detailu
objednávky i na packing slipu ([src/lib/configuration.ts](src/lib/configuration.ts)).

| Atribut | Příklad | Viditelnost |
| --- | --- | --- |
| `Klub` | `Sparta Praha` | zákazník i admin |
| `Zkratka` | `SPA` | zákazník i admin |
| `Velikost` | `Univerzální` / `M` | zákazník i admin |
| `Barva tkaničky` | `#B01E28` | zákazník i admin |
| `Zakončení` | `Univerzální` / `Na míru` | zákazník i admin |
| `_club_slug` | `sparta` | skryté (podtržítko) |
| `_extra_letters` | `5` | skryté |
| `_ending` | `univerzalni` | skryté |

Cena se neposílá jako atribut — počítá ji Shopify z variant. Příplatky přidává
[src/app/actions/checkout.ts](src/app/actions/checkout.ts) jako samostatné řádky
navázané atributem `_parent` na hlavní řádek.

## 4. Checkout

`createCheckout()` volá mutaci `cartCreate` a přesměruje na `cart.checkoutUrl`,
tedy na hostovaný Shopify checkout — platby, doprava, DPH a e-maily řeší Shopify.

Po dokončení objednávky nastav v adminu (**Settings → Checkout → Order status page**)
návrat na `https://offsidestore.cz/kosik/hotovo`.

Košík mezitím žije v `localStorage` prohlížeče (klíč `offsidestore-cart`), takže
storefront nemusí držet Shopify cart ID přes celou session.

## 5. Co zůstává v kódu

Tohle se do Shopify nepřenáší a spravuje se v repozitáři:

- **Barvy, přechody a zkratky klubů** — [src/data/clubs.ts](src/data/clubs.ts)
- **Cenová logika konfigurátoru** — [src/lib/pricing.ts](src/lib/pricing.ts)
- **Obsahové stránky** (doprava, velikosti, právní texty) — [src/data/pages.ts](src/data/pages.ts)

Pokud budeš chtít obsahové stránky spravovat v adminu, nahraď registr v `pages.ts`
dotazem na Shopify `pages` — bloková struktura zůstane stejná.

## 6. Fotky a videa

Galerie ([src/components/ProductGallery.tsx](src/components/ProductGallery.tsx))
i karty produktů kreslí vektorový náhled, dokud produkt nemá `images[].url`.
Jakmile nahraješ fotky do Shopify, komponenty je vykreslí přes `next/image` samy —
`cdn.shopify.com` je už povolený v [next.config.ts](next.config.ts).

Doporučené pořadí obrázků: detail na ruce → detail vpletení zkratky → balení.
