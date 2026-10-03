# OffsideStore — sekce pro Shopify

Šest sekcí do tvého Shopify motivu. Nejsou to obrázky — všechno se dá měnit
v editoru motivu: texty, barvy, fotky, odkazy. Bloky (kluby, čísla, kroky,
otázky) jdou přidávat, mazat a přetahovat myší.

**Sekce „Hotové edice" bere produkty přímo z tvé kolekce.** Co přidáš do
kolekce v adminu, objeví se na webu samo — nic se nepřepisuje ručně.

---

## 1. Nahraj soubory do motivu

Shopify admin → **Online Store → Themes** → u svého motivu **⋯ → Edit code**.

Pak nahraj (tlačítko **Add a new asset** / **Add a new section**):

| Kam | Soubor |
| --- | --- |
| `assets/` | `offside.css` |
| `sections/` | `offside-hero.liquid` |
| `sections/` | `offside-kluby.liquid` |
| `sections/` | `offside-edice.liquid` |
| `sections/` | `offside-jak-vznika.liquid` |
| `sections/` | `offside-faq.liquid` |
| `sections/` | `offside-cta.liquid` |

Soubory `.liquid` musí jít do složky **sections**, `offside.css` do **assets**.
Jinak je Shopify nenajde.

## 2. Nahraj fotky

Shopify admin → **Content → Files** → **Upload files** a nahraj obsah složky
`fotky/`. Potom se budou dát vybrat v editoru motivu.

## 3. Založ kolekci s produkty

Admin → **Products → Collections → Create collection**, pojmenuj třeba
*Hotové edice* a přidej do ní náramky. Sekce si z ní produkty vytáhne sama.

## 4. Poskládej stránku

Admin → **Online Store → Themes → Customize** → vyber domovskou stránku →
**Add section** → sekce najdeš pod názvy začínajícími **Offside —**.

Doporučené pořadí:

1. Offside — Hero
2. Offside — Komu fandíš
3. Offside — Hotové edice
4. Offside — Jak vzniká
5. Offside — Časté dotazy
6. Offside — Závěrečné CTA

Pořadí se dá kdykoli přetáhnout myší v levém panelu.

---

## Co se dá u každé sekce nastavit

### Offside — Hero
Fotka na pozadí, síla ztmavení (aby byl text čitelný), výška sekce,
tři řádky nadpisu zvlášť (prostřední je barevný), text, dvě tlačítka,
akcentní barva. Čísla dole jsou bloky — přidej, smaž nebo přetáhni.

### Offside — Komu fandíš
Každý klub je blok: zkratka, název, popisek, dvě barvy přechodu, barva
zkratky a odkaz na produkt. Kliknutí na dlaždici přepne panel pod mřížkou
i akcentní barvu sekce. Přednastaveno je šest klubů, přidej si zbytek.

### Offside — Hotové edice
**Výběr kolekce**, počet produktů, počet sloupců, zobrazení ceny, text a cíl
odkazu vpravo nahoře a nepovinný pás s fotkou nad mřížkou.

Produkt bez fotky se nezobrazí prázdný — ukáže zkratku. Bere ji z metafieldu
`custom.club_abbr`, a když chybí, použije poslední slovo z názvu produktu.

### Offside — Jak vzniká
Fotka vlevo, kroky vpravo. Každý krok je blok, čísla se přečíslují sama
podle pořadí.

### Offside — Časté dotazy
Každá otázka je blok. Rozbaluje se nativně, funguje i bez JavaScriptu.
Sekce zároveň vkládá strukturovaná data, takže se otázky můžou objevit
přímo ve výsledcích Googlu.

### Offside — Závěrečné CTA
Dva řádky nadpisu, text a dvě tlačítka.

---

## Poznámky

**Barvy.** Každá sekce má vlastní akcentní barvu. Když chceš jinou než
červenou, přenastav ji u všech sekcí zvlášť — je to záměr, aby šlo třeba
nechat jednu sekci v klubové barvě.

**Styly.** Všechno je prefixované `.os-` a drží se uvnitř sekcí, takže se to
nepere s původním motivem. Pokud chceš něco doladit, uprav `assets/offside.css`.

**Tmavé pozadí.** Sekce mají černý podklad napevno. Pokud má tvůj motiv světlé
pozadí, mezi sekcemi bude vidět přechod — buď dej celé stránce tmavé pozadí
v nastavení motivu, nebo mi řekni a udělám světlou variantu.

**Netestováno na živém obchodu.** Syntaxi Liquidu a platnost všech schémat
jsem ověřil, ale nemám přístup k tvému Shopify, takže jsem to nemohl spustit
naostro. Kdyby něco neslo, pošli mi chybovou hlášku z editoru kódu.
