"use client";

import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { useAccent } from "@/components/AccentProvider";

/**
 * HERO — hlavni vizual je skutecna fotka naramku na puku.
 *
 * Fotka ma svetle pozadi, takze na cerne strance funguje jako svetly blok.
 * Klubovy akcent zustava v nadpisu a v CTA, aby prepnuti klubu nize na strance
 * bylo porad videt.
 *
 * Poradi v DOM je poradi na mobilu: nadpis -> fotka -> text, CTA a cisla.
 * Na desktopu se fotka presune do praveho sloupce pres obe radky.
 */
export function Hero() {
  const { club } = useAccent();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-24">
      {/* Akcentni zare klubu */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[130vw] -translate-x-1/2 opacity-25 blur-[120px] transition-[background] duration-700"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, var(--accent) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-8 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-x-14 lg:gap-y-8">
        <h1 className="display text-[15vw] leading-[0.84] sm:text-[11vw] lg:col-start-1 lg:row-start-1 lg:self-end lg:text-[6.6rem]">
          <span className="block animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_80ms_both]">
            Nos svůj
          </span>
          <span className="block animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_180ms_both] text-[var(--accent)]">
            klub.
          </span>
          <span className="block animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_280ms_both]">
            Kdekoliv.
          </span>
        </h1>

        {/* ---------- Fotka ---------- */}
        <figure className="relative animate-[photoIn_900ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:ml-auto lg:w-full lg:max-w-[500px] lg:self-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/foto/hero-puk-tri-kla.jpg"
              alt="Náramky Třinec a Kladno z hokejových tkaniček položené na puku"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              priority
            />
          </div>

          <figcaption className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <span>Tkanička · kovová písmena</span>
            <span className="text-white/60">{club.abbr} a dalších 11 klubů</span>
          </figcaption>
        </figure>

        {/* ---------- Text, CTA a cisla ---------- */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-lg animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_400ms_both] text-base leading-relaxed text-white/60 md:text-lg">
            Náramky vytvořené z originálních hokejových tkaniček. Barva tvého klubu.
            Jeho zkratka. Tvůj tým.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_520ms_both]">
            <CtaButton href="#kluby">Vybrat svůj klub</CtaButton>
            <CtaButton href="/konfigurator" variant="outline">
              Vytvořit vlastní
            </CtaButton>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_640ms_both]">
            {[
              ["12", "klubů v nabídce"],
              ["290 Kč", "základní cena"],
              ["ručně", "splétaný kus po kuse"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-lg font-black">{value}</dt>
                <dd className="text-white/40">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes photoIn {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
