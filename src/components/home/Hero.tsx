"use client";

import { useEffect, useRef } from "react";
import { BraceletPreview } from "@/components/BraceletPreview";
import { CtaButton } from "@/components/CtaButton";
import { useAccent } from "@/components/AccentProvider";

export function Hero() {
  const { club } = useAccent();
  const tiltRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // 2.5D naklon naramku za kurzorem + jemny parallax pri scrollu.
  useEffect(() => {
    const el = tiltRef.current;
    const wrap = parallaxRef.current;
    if (!el || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `perspective(1100px) rotateY(${x * 13}deg) rotateX(${-y * 9}deg) translateZ(0)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(1100px)";
    };
    const onScroll = () => {
      wrap.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    };

    window.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-24">
      {/* Akcentni zare klubu */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[130vw] -translate-x-1/2 opacity-40 blur-[110px] transition-[background] duration-700"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, var(--accent) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <h1 className="display text-[15vw] leading-[0.84] sm:text-[11vw] lg:text-[6.6rem]">
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

          <p className="mt-7 max-w-lg animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_400ms_both] text-base leading-relaxed text-white/60 md:text-lg">
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
                <dd className="text-white/40">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={parallaxRef} className="relative">
          <div
            ref={tiltRef}
            className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          >
            <BraceletPreview
              color={club.lace}
              letters={club.abbr}
              assemble
              assembleKey={`hero-${club.slug}`}
              className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
            />
          </div>
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
