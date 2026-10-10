# OffsideStore — motiv pro Shopify

`offsidestore-motiv.zip` je kompletní motiv postavený na Dawn. Nahraješ ho
jako celek, nic se nekopíruje po souborech.

Všechno se dá měnit v editoru motivu: texty, barvy, fotky, odkazy. Bloky
(čísla v heru, kroky výroby, otázky) jdou přidávat, mazat a přetahovat myší.

Kluby v sekci **Komu fandíš** i v konfigurátoru se berou **z kolekce**. Co
přidáš do kolekce v adminu, objeví se na webu samo.

---

## 1. Nahraj motiv

Admin → **Internetový obchod → Motivy → Přidat motiv → Nahrát zip soubor** →
vyber `offsidestore-motiv.zip`.

Zatím ho **nepublikuj**. Klikni **Přizpůsobit** a projdi si kroky níž.

## 2. Přepni obchod do češtiny

Motiv už má češtinu jako výchozí jazyk, ale **jazyk obchodu je samostatné
nastavení** a řídí se podle něj pokladna, systémové e-maily i názvy
automatických kolekcí (např. `/collections/all`, která se jinak jmenuje
*Products*).

Admin → **Nastavení → Jazyky** → u češtiny **Změnit výchozí**. Pokud tam
čeština není, nejdřív **Přidat jazyk**.

> Dokud to neuděláš, bude část textu anglicky — a motiv s tím nic nenadělá,
> protože ty texty nepatří jemu, ale obchodu.

## 3. Založ kolekci s náramky

Admin → **Produkty → Kolekce → Vytvořit kolekci**, pojmenuj třeba
*Náramky* a přidej do ní klubové náramky.

Každý produkt = jeden klub. Fotku nahraj k produktu — objeví se v dlaždici
i na produktové stránce. Dokud fotku nemá, použije se výchozí fotka ze sekce.

Nepovinné metafieldy produktu, kterými se dá dlaždice doladit:

| Metafield | K čemu je |
| --- | --- |
| `custom.club_abbr` | zkratka, např. `SPA` (jinak poslední slovo z názvu) |
| `custom.club_from` | začátek barevného přechodu, hex |
| `custom.club_to` | konec přechodu, hex |
| `custom.club_ink` | barva zkratky, hex |

## 4. Založ produkt „Příplatek za znak"

**Tohle je povinné, pokud chceš účtovat delší nápisy.**

Shopify neumí ze storefrontu změnit cenu položky v košíku — cena vždy přijde
z varianty. Příplatek proto musí být samostatný produkt, který se do košíku
přidá v množství podle počtu znaků navíc. Součet v košíku pak sedí s tím, co
ukázal konfigurátor.

1. **Produkty → Přidat produkt**
2. Název: *Příplatek za znak*
3. Cena: **12 Kč** (nebo kolik si účtuješ za znak)
4. Odškrtni **Sledovat množství**, ať se nikdy nevyprodá
5. Doprava: odškrtni **Jedná se o fyzický produkt**
6. Dostupnost prodeje: nech zapnutý jen internetový obchod
7. Ulož

Pak v editoru motivu: **Offside — Konfigurátor** → *Příplatek za znak* →
vyber tenhle produkt.

> Dokud ho nevybereš, konfigurátor znaky nad rámec základu vůbec nenabídne —
> vstup se zastropuje na počet znaků v ceně. Je to schválně: radši kratší
> nápis než košík levnější, než co zákazník viděl.

V editoru najdeš i **Znaků v základní ceně** (výchozí 3) a **Maximálně znaků**
(výchozí 12).

## 5. Propoj sekce s kolekcí

Admin → **Motivy → Přizpůsobit** → domovská stránka. U sekcí
**Offside — Komu fandíš** a **Offside — Konfigurátor** vyber v nastavení
kolekci z kroku 3.

Totéž u šablony produktu: **Offside — Produkt** → *Kolekce pro „Další kluby"*.

## 6. Obsahové stránky

V souboru `obsah-stranek.html` je připravený text osmi stránek včetně
obchodních podmínek a ochrany osobních údajů. U každé je napsaný handle
(URL), pod kterým ji má smysl založit.

Admin → **Internetový obchod → Stránky → Přidat stránku**, přepni editor do
režimu HTML (ikona `<>`) a vlož obsah. V **Šabloně** vyber `page`.

## 7. Publikuj

Až všechno sedí: **Motivy → Akce → Publikovat**.

---

## Struktura stránek

| Šablona | Sekce |
| --- | --- |
| Domovská stránka | Hero → Komu fandíš → Konfigurátor → Jak vzniká → Časté dotazy → Závěrečné CTA |
| Produkt | Offside — Produkt |
| Kolekce | Offside — Kolekce |
| Stránka | Offside — Stránka |

Pořadí sekcí na domovské stránce se dá kdykoli přetáhnout myší.

---

## Co se dá nastavit

### Offside — Hero
Fotka na pozadí, síla ztmavení, výška sekce, tři řádky nadpisu zvlášť
(prostřední je barevný), text, dvě tlačítka, akcentní barva. Čísla dole jsou
bloky. Na telefonu stojí ve třech sloupcích pod akcentní linkou.

### Offside — Komu fandíš
Kolekce, počet klubů, text tlačítka, popisek pod názvem a záložní barvy pro
produkty bez metafieldů. Kliknutí na dlaždici přepne panel i akcentní barvu
sekce. Tlačítko vloží produkt rovnou do košíku.

### Offside — Konfigurátor
Kolekce, příplatek za znak, počet znaků v ceně a maximum, paleta barev
tkaniček, akcentní barva. Tři kroky: klub, barva, písmena. Cena se počítá
průběžně a je vidět přímo v tlačítku.

### Offside — Produkt
Výchozí fotka (než produkt dostane vlastní), poznámka pod tlačítkem, kolekce
pro „Další kluby" a řádky tabulky detailů jako bloky.

Klubový náramek je hotový kus, takže se na něm nic nenastavuje — personalizace
žije jen v konfigurátoru.

### Offside — Jak vzniká
Fotka vlevo, kroky vpravo. Každý krok je blok, čísla se přečíslují sama.

### Offside — Časté dotazy
Každá otázka je blok. Rozbaluje se nativně, funguje i bez JavaScriptu. Sekce
vkládá strukturovaná data, takže se otázky můžou objevit ve výsledcích Googlu.

### Offside — Závěrečné CTA
Dva řádky nadpisu, text a dvě tlačítka.

---

## Poznámky

**Velikosti.** Náramky jsou univerzální s posuvným uzlem, nikde se velikost
nevybírá. Nedávej proto produktům varianty S/M/L — konfigurátor i produktová
stránka berou první dostupnou variantu.

**Fotky.** Dlaždice a karty počítají s fotkami na výšku v poměru 3:4 (běžná
fotka z telefonu). Taková fotka vyplní dlaždici přesně a nic se neořízne.
Fotka s jiným poměrem se po krajích trochu ořízne, aby dlaždici vyplnila.

**Jazyk.** Motiv má výchozí češtinu (`locales/cs.default.json`), takže texty
jako „Váš košík" nebo „Pokračovat v nákupu" jsou česky rovnou. Pokladna,
systémové e-maily a názvy automatických kolekcí se řídí jazykem obchodu — viz
krok 2. Nadpis na stránce kolekce jde přepsat v nastavení sekce
**Offside — Kolekce** (*Vlastní nadpis*).

**Barvy.** Každá sekce má vlastní akcentní barvu — je to záměr, aby šlo
nechat jednu sekci v klubové barvě.

**Styly.** Všechno je prefixované `.os-`. Doladit se dá v `assets/offside.css`,
`assets/offside-stranky.css` a `assets/offside-global.css`.

**Netestováno na živém obchodu.** Syntaxi Liquidu, platnost všech schémat,
JavaScript i strukturu zipu jsem ověřil a vzhled proklikal ve statickém
náhledu, ale na tvůj Shopify nevidím, takže jsem motiv nespustil naostro.
Kdyby něco neslo, pošli mi chybovou hlášku z editoru.
