"use client";

import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";

/**
 * HERO — fotka vypliuje celou sekci jako pozadi, text lezi na ni.
 *
 * Predchozi verze delila obrazovku na cernou a fotku, coz vytvarelo viditelny
 * sev. Fotka je proto uz v souboru ztmavena (sharp, brightness 0.58), aby
 * patrila do tmave palety, a pres ni jde jediny prechod zleva, ktery drzi
 * citelnost textu. Produkt sedi v dolni tretine zaberu, text nad nim.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* ---------- Fotka pres celou sekci ---------- */}
      <Image
        src="/foto/hero-beton.jpg"
        alt="Náramky Zlín, Slavia a České Budějovice z hokejových tkaniček na betonovém prahu"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Prechod pro citelnost textu — vlevo plna cern, vpravo fotka. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/55 to-[#050505]/85 md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/80 md:to-transparent"
      />
      {/* Ukotveni k sekci pod herem, aby prechod nekoncil rezem. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 md:px-8">
        <h1 className="display text-[15vw] leading-[0.84] sm:text-[11vw] md:max-w-[60%] lg:text-[6.6rem]">
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

        <p className="mt-8 max-w-md animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_400ms_both] text-base leading-relaxed text-white/70 md:text-lg">
          Náramky vytvořené z originálních hokejových tkaniček. Barva tvého klubu.
          Jeho zkratka. Tvůj tým.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_520ms_both]">
          <CtaButton href="#kluby">Vybrat svůj klub</CtaButton>
          <CtaButton href="/konfigurator" variant="outline">
            Vytvořit vlastní
          </CtaButton>
        </div>

        <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_640ms_both]">
          {[
            ["12", "klubů v nabídce"],
            ["290 Kč", "základní cena"],
            ["ručně", "splétaný kus po kuse"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="text-lg font-black">{value}</dt>
              <dd className="text-white/50">{label}</dd>
            </div>
          ))}
        </dl>
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
