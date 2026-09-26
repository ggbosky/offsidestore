"use client";

import { useState } from "react";
import Link from "next/link";
import { CLUBS, getClub } from "@/data/clubs";
import { BASE_PRICE, formatPrice } from "@/lib/pricing";
import { useAccent } from "@/components/AccentProvider";
import { BraceletPreview } from "@/components/BraceletPreview";
import { ClubTile } from "@/components/ClubTile";
import { CtaButton } from "@/components/CtaButton";
import { Reveal } from "@/components/Reveal";

/**
 * Sekce "KOMU FANDÍŠ?" — po kliknuti probehne retez
 * barva -> naramek -> zkratka -> cena -> koupit.
 */
export function ClubPicker() {
  const { club, setClub } = useAccent();
  const [touched, setTouched] = useState(false);
  const active = getClub(club.slug) ?? CLUBS[0];

  const pick = (slug: string) => {
    setClub(slug);
    setTouched(true);
  };

  return (
    <section id="kluby" className="relative border-t border-white/10 py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <h2 className="display text-[13vw] leading-[0.85] md:text-[7rem]">
            Komu fandíš?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Dlazdice klubu */}
          <Reveal className="order-2 lg:order-1">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {CLUBS.map((c) => (
                <ClubTile
                  key={c.slug}
                  club={c}
                  size="sm"
                  active={c.slug === active.slug}
                  onClick={() => pick(c.slug)}
                />
              ))}
            </div>
          </Reveal>

          {/* Zive skladany naramek */}
          <div className="order-1 lg:order-2">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 p-6 transition-[background] duration-700 sm:p-10"
              style={{
                background:
                  "radial-gradient(130% 100% at 50% 0%, color-mix(in srgb, var(--accent) 30%, #08080a) 0%, #08080a 70%)",
              }}
            >
              <BraceletPreview
                color={active.lace}
                letters={active.abbr}
                assemble
                assembleKey={active.slug}
              />

              <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
                    {touched ? "Tvůj klub" : "Vyber klub"}
                  </p>
                  <p className="mt-1 text-3xl font-black uppercase tracking-tight">
                    {active.name}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    Zkratka {active.abbr} · univerzální i na míru
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
                    Od
                  </p>
                  <p className="text-4xl font-black tabular-nums">
                    {formatPrice(BASE_PRICE)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <CtaButton href={`/produkt/naramek-${active.slug}`}>
                  Koupit {active.abbr}
                </CtaButton>
                <Link
                  href={`/konfigurator?klub=${active.slug}`}
                  className="inline-flex items-center rounded-full border border-white/25 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-white hover:bg-white hover:text-black"
                >
                  Upravit si ho
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
