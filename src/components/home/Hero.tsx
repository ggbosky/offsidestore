"use client";

import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";

/**
 * HERO — fotka drzi celou pravou polovinu obrazovky pres celou vysku
 * a vybiha az k okraji okna. Na mobilu je pres celou sirku hned za nadpisem.
 *
 * Fotka ma svetle pozadi, proto na ni lezi prechod do cerne: na desktopu
 * zleva, na mobilu shora i zdola, aby prechod do stranky nebyl ostry rez.
 *
 * Poradi na mobilu resi `order`, na desktopu je fotka absolutne pozicovana,
 * takze se do rozlozeni sloupcu nepocita.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-24">
      {/* ---------- Fotka ---------- */}
      <div className="relative order-2 -mx-5 mt-9 h-[54svh] md:-mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:m-0 lg:h-auto lg:w-[47%]">
        <Image
          src="/foto/hero-puk-ctyri-kluby.jpg"
          alt="Čtyři náramky z hokejových tkaniček v barvách různých klubů položené na puku"
          fill
          sizes="(max-width: 1024px) 100vw, 47vw"
          className="object-cover"
          priority
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] lg:bg-gradient-to-r lg:from-[#050505] lg:via-[#050505]/35 lg:to-transparent"
        />
      </div>

      {/* ---------- Nadpis ---------- */}
      <div className="relative order-1 mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:order-none">
        <h1 className="display text-[15vw] leading-[0.84] sm:text-[11vw] lg:max-w-[52%] lg:text-[6.6rem]">
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
      </div>

      {/* ---------- Text, CTA a cisla ---------- */}
      <div className="relative order-3 mx-auto mt-9 w-full max-w-[1400px] px-5 md:px-8 lg:order-none">
        <div className="lg:max-w-[48%]">
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
      `}</style>
    </section>
  );
}
