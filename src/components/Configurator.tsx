"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { CLUBS, getClub } from "@/data/clubs";
import {
  MAX_LETTERS,
  defaultConfig,
  lettersHint,
  sanitizeLetters,
  type BraceletConfig,
} from "@/lib/configuration";
import {
  ENDINGS,
  EXTRA_LETTER_PRICE,
  SIZES,
  calcPrice,
  formatPrice,
  type EndingId,
  type Size,
} from "@/lib/pricing";
import { useCart } from "@/lib/cart-store";
import { useAccent } from "@/components/AccentProvider";
import { BraceletPreview } from "@/components/BraceletPreview";
import { ClubTile } from "@/components/ClubTile";
import { CtaButton } from "@/components/CtaButton";
import { FloatingCta } from "@/components/FloatingCta";
import type { Product } from "@/lib/commerce/types";

/** Paleta tkanicek — vybira se vzdy prave jedna. */
const LACE_PALETTE = [
  { hex: "#111111", label: "Černá" },
  { hex: "#FFFFFF", label: "Bílá" },
  { hex: "#B01E28", label: "Červená" },
  { hex: "#0B4EA2", label: "Modrá" },
  { hex: "#3FA9E0", label: "Světle modrá" },
  { hex: "#0F9D4F", label: "Zelená" },
  { hex: "#F2C300", label: "Žlutá" },
  { hex: "#FF6B00", label: "Oranžová" },
  { hex: "#C0C0C0", label: "Stříbrná" },
  { hex: "#7A4A2B", label: "Hnědá" },
];

const STEPS = [
  { id: 1, label: "Klub" },
  { id: 2, label: "Barva" },
  { id: 3, label: "Písmena" },
  { id: 4, label: "Zakončení" },
];

export function Configurator({
  products,
  initialClub,
  compact = false,
}: {
  products: Product[];
  initialClub?: string;
  /** Varianta pro produktovou stranku — bez kroku vyberu klubu. */
  compact?: boolean;
}) {
  const [config, setConfig] = useState<BraceletConfig>(() => defaultConfig(initialClub));
  const [step, setStep] = useState(compact ? 2 : 1);
  const [added, setAdded] = useState(false);
  // Plovouci CTA patri konfiguratoru — ukazuje se jen kdyz je konfigurator videt.
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { setClub } = useAccent();
  const add = useCart((s) => s.add);

  const club = getClub(config.clubSlug);
  const price = useMemo(() => calcPrice({ letters: config.letters }), [config.letters]);

  useEffect(() => {
    setClub(config.clubSlug);
  }, [config.clubSlug, setClub]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-15% 0px -25% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const product = products.find((p) => p.clubSlug === config.clubSlug) ?? products[0];
  const variant =
    product?.variants.find((v) =>
      v.selectedOptions.some((o) => o.value === config.size),
    ) ?? product?.variants[0];

  const patch = (next: Partial<BraceletConfig>) =>
    setConfig((prev) => ({ ...prev, ...next }));

  const selectClub = (slug: string) => {
    const c = getClub(slug);
    if (!c) return;
    patch({ clubSlug: slug, color: c.lace, letters: c.abbr });
    setStep(2);
  };

  const selectEnding = (ending: EndingId) => {
    const universal = ENDINGS.find((e) => e.id === ending)?.universal;
    patch({ ending, size: universal ? "UNI" : "M" });
  };

  const addToCart = () => {
    if (!product || !variant) return;
    add({
      config,
      merchandiseId: variant.id,
      productHandle: product.handle,
      title: `Náramek ${club?.name ?? "vlastní"}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const ctaLabel = `Přidat do košíku — ${formatPrice(price.total)}`;
  const universal = config.ending === "univerzalni";

  return (
    <div ref={rootRef} className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      {/* ---------- Nahled ---------- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 p-6 transition-colors duration-700 sm:p-10"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--accent) 26%, #0b0b0d) 0%, #0b0b0d 68%)",
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
              Náhled živě
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
              {club?.short ?? "Vlastní"}
            </span>
          </div>

          <BraceletPreview
            color={config.color}
            letters={config.letters}
            assemble
            assembleKey={`${config.clubSlug}-${config.color}`}
            className="drop-shadow-2xl"
          />

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Zkratka
              </dt>
              <dd className="mt-1 text-sm font-black">{config.letters || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Velikost
              </dt>
              <dd className="mt-1 text-sm font-black">
                {universal ? "UNI" : config.size}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Barva
              </dt>
              <dd className="mt-1 flex justify-center">
                <span
                  className="h-4 w-4 rounded-full border border-white/25"
                  style={{ background: config.color }}
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ---------- Kroky ---------- */}
      <div>
        <ol className="mb-8 flex gap-2">
          {STEPS.filter((s) => !compact || s.id !== 1).map((s) => (
            <li key={s.id} className="flex-1">
              <button
                onClick={() => setStep(s.id)}
                className={clsx(
                  "w-full border-t-2 pt-3 text-left transition-colors duration-300",
                  step === s.id ? "border-[var(--accent)]" : "border-white/15",
                )}
              >
                <span
                  className={clsx(
                    "block text-[11px] font-bold uppercase tracking-[0.16em]",
                    step === s.id ? "text-white" : "text-white/40",
                  )}
                >
                  {s.id}. {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* Krok 1 — klub */}
        {step === 1 && !compact && (
          <section>
            <h3 className="display text-3xl">Komu fandíš?</h3>
            <p className="mt-2 text-sm text-white/50">
              Klub nastaví barvu tkaničky i výchozí zkratku. Obojí jde pak přepsat.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {CLUBS.map((c) => (
                <ClubTile
                  key={c.slug}
                  club={c}
                  size="sm"
                  active={config.clubSlug === c.slug}
                  onClick={() => selectClub(c.slug)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Krok 2 — barva */}
        {step === 2 && (
          <section>
            <h3 className="display text-3xl">Barva tkaničky</h3>
            <p className="mt-2 text-sm text-white/50">
              Náramek je z jedné tkaničky, takže i barva je jedna. Přednastavená
              je klubová — přepni ji, jak chceš.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Vybráno
              </span>
              <span
                className="h-9 w-9 rounded-full border-2 border-white/40"
                style={{ background: config.color }}
              />
              {club && config.color !== club.lace && (
                <button
                  onClick={() => patch({ color: club.lace })}
                  className="ml-auto text-[11px] font-bold uppercase tracking-[0.14em] text-white/50 underline hover:text-white"
                >
                  Zpět na klubovou
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3 sm:grid-cols-6">
              {LACE_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => patch({ color: c.hex })}
                  aria-label={c.label}
                  aria-pressed={config.color === c.hex}
                  title={c.label}
                  className={clsx(
                    "aspect-square rounded-full border-2 transition-transform duration-200 hover:scale-110",
                    config.color === c.hex ? "scale-110 border-white" : "border-white/20",
                  )}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Krok 3 — pismena */}
        {step === 3 && (
          <section>
            <h3 className="display text-3xl">Písmena</h3>
            <p className="mt-2 text-sm text-white/50">
              Tři znaky jsou v ceně. Každý další {formatPrice(EXTRA_LETTER_PRICE)}.
            </p>

            <label className="mt-6 block">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Zkratka / nápis
              </span>
              <input
                value={config.letters}
                onChange={(e) => patch({ letters: sanitizeLetters(e.target.value) })}
                maxLength={MAX_LETTERS}
                placeholder={club?.abbr ?? "SPA"}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-2xl font-black uppercase tracking-[0.2em] outline-none transition-colors focus:border-[var(--accent)]"
              />
            </label>
            <p className="mt-2 text-xs text-white/40">{lettersHint(config.letters)}</p>
          </section>
        )}

        {/* Krok 4 — zakonceni a velikost */}
        {step === 4 && (
          <section>
            <h3 className="display text-3xl">Zakončení</h3>
            <p className="mt-2 text-sm text-white/50">
              Univerzální si doladíš na ruce sám. Na míru drží přesně, ale velikost
              je pak potřeba trefit.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {ENDINGS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => selectEnding(e.id)}
                  className={clsx(
                    "rounded-xl border p-5 text-left transition-colors duration-300",
                    config.ending === e.id
                      ? "border-white bg-white/10"
                      : "border-white/12 hover:border-white/40",
                  )}
                >
                  <span className="block text-base font-black uppercase tracking-tight">
                    {e.label}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-white/50">
                    {e.description}
                  </span>
                </button>
              ))}
            </div>

            {!universal && (
              <div className="mt-8">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Velikost
                </h4>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {SIZES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => patch({ size: s.id as Size })}
                      className={clsx(
                        "rounded-xl border p-5 text-center transition-colors duration-300",
                        config.size === s.id
                          ? "border-white bg-white/10"
                          : "border-white/12 hover:border-white/40",
                      )}
                    >
                      <span className="block text-2xl font-black">{s.label}</span>
                      <span className="mt-1 block text-[11px] text-white/45">{s.cm}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/40">
                  Změř obvod zápěstí provázkem a přidej zhruba centimetr na volnost.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ---------- Souhrn ceny + CTA ---------- */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-white/60">
              <dt>Základ (tkanička + 3 znaky)</dt>
              <dd className="tabular-nums">{formatPrice(price.base)}</dd>
            </div>
            {price.extraLettersCount > 0 && (
              <div className="flex justify-between text-white/60">
                <dt>
                  Znaky navíc ({price.extraLettersCount}× {formatPrice(EXTRA_LETTER_PRICE)})
                </dt>
                <dd className="tabular-nums">+{formatPrice(price.extraLetters)}</dd>
              </div>
            )}
            <div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-3">
              <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Celkem
              </dt>
              <dd className="text-3xl font-black tabular-nums">
                {formatPrice(price.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 hidden md:block">
            <CtaButton onClick={addToCart} full disabled={!variant}>
              {added ? "Přidáno" : ctaLabel}
            </CtaButton>
          </div>

          <p className="mt-3 text-center text-[11px] text-white/35">
            Ruční výroba v Česku · Termín odeslání potvrdíme e-mailem
          </p>
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(compact ? 2 : 1, s - 1))}
            disabled={step === (compact ? 2 : 1)}
            className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/50 hover:text-white disabled:opacity-25"
          >
            ← Zpět
          </button>
          <button
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={step === 4}
            className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/50 hover:text-white disabled:opacity-25"
          >
            Další →
          </button>
        </div>
      </div>

      <FloatingCta label={ctaLabel} onClick={addToCart} visible={inView} />
    </div>
  );
}
