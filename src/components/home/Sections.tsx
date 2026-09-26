import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CtaButton } from "@/components/CtaButton";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/commerce/types";

/* ------------------------------------------------------------------ */
/* Klubove kolekce                                                     */
/* ------------------------------------------------------------------ */

export function CollectionSection({ products }: { products: Product[] }) {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-[10vw] leading-[0.88] md:text-[4.5rem]">
            Hotové edice
          </h2>
          <Link
            href="/kolekce"
            className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/50 underline underline-offset-8 hover:text-white"
          >
            Všechny kluby →
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <Reveal key={p.handle} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Jak vznika                                                          */
/* ------------------------------------------------------------------ */

const CRAFT = [
  {
    title: "Tkanička z brusle",
    text: "Stejný materiál, jaký drží brusli na noze. Voskované vlákno, které snese pot, mráz i vodu — proto náramek nezplihne po týdnu nošení.",
  },
  {
    title: "Barva podle dresu",
    text: "Odstín ladíme podle aktuálního dresu, ne podle nejbližší barvy ze skladu. Když si vezmeš náramek na stadion, sedí s tím, co máš na sobě.",
  },
  {
    title: "Zkratka v pletení",
    text: "Znaky nejsou nalepené ani potištěné. Jsou navlečené na tkaničce a zapletené do splétání, takže se nemají jak setřít.",
  },
  {
    title: "Splétáno rukou",
    text: "Každý kus splétáme ručně kus po kuse. Drobné odchylky v napětí splétání nejsou vada — jsou důkaz, že to nedělal stroj.",
  },
];

export function CraftSection() {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <h2 className="display text-[10vw] leading-[0.88] md:text-[4.5rem]">
            Jak vzniká
          </h2>
        </Reveal>

        <ol className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {CRAFT.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 70}>
                <div className="grid gap-4 py-8 md:grid-cols-[80px_260px_1fr] md:items-baseline md:gap-8">
                  <span className="text-sm font-black tabular-nums text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="max-w-2xl leading-relaxed text-white/50">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const FAQ_ITEMS = [
  {
    q: "Z čeho je náramek vyrobený?",
    a: "Z originálních hokejových tkaniček — stejného materiálu, jaký hráči používají v bruslích. Tkanička je zkrácená, zapletená do náramku a zakončená kovovou koncovkou.",
  },
  {
    q: "Kolik znaků si můžu nechat vyplést?",
    a: "V ceně 290 Kč jsou tři znaky. Každý další stojí 12 Kč, maximum je dvanáct znaků.",
  },
  {
    q: "Jaký je rozdíl mezi univerzálním zakončením a velikostí na míru?",
    a: "Univerzální má posuvný uzel — délku si doladíš na ruce sám a sedne prakticky komukoliv. Zakončení na míru je pevné a šije se na konkrétní velikost S, M nebo L.",
  },
  {
    q: "Jak si vyberu velikost?",
    a: "S odpovídá obvodu zápěstí 16–17 cm, M 17–19 cm a L 19–21 cm. Změř obvod provázkem a přidej zhruba centimetr na volnost. Když si nejsi jistý, vezmi univerzální zakončení.",
  },
  {
    q: "Kdy mi náramek dorazí?",
    a: "Každý kus splétáme ručně, takže termín odeslání závisí na velikosti objednávky. Konkrétní termín ti potvrdíme e-mailem hned po objednání.",
  },
  {
    q: "Vydrží náramek ve vodě?",
    a: "Ano. Tkanička i koncovka snesou déšť i sprchu. Doporučujeme jen vyhnout se dlouhému máčení ve slané vodě a chlóru.",
  },
  {
    q: "Můžu ho vrátit?",
    a: "Standardní edice do 30 dnů bez udání důvodu. U kusů s vlastní zkratkou na míru vracíme peníze při vadě výroby — zboží upravené podle přání zákazníka nelze ze zákona vrátit bez důvodu.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal>
          <h2 className="display text-[10vw] leading-[0.88] md:text-[4.5rem]">
            Časté dotazy
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                <span className="text-lg font-bold">{item.q}</span>
                <span className="shrink-0 text-2xl text-white/35 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-white/55">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-24 text-center md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, var(--accent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal>
          <h2 className="display text-[13vw] leading-[0.86] md:text-[7rem]">
            Nos svůj klub.
            <br />
            <span className="text-[var(--accent)]">Kdekoliv.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CtaButton href="/konfigurator">Vytvořit si náramek</CtaButton>
            <CtaButton href="/kolekce" variant="outline">
              Prohlédnout kolekce
            </CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
