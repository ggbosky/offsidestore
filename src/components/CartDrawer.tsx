"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import clsx from "clsx";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/pricing";
import { startCheckout } from "@/app/actions/checkout";
import { CtaButton } from "@/components/CtaButton";

const FREE_SHIPPING_FROM = 99900;

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!mounted) return null;

  const subtotal = cartSubtotal(lines);
  const toFreeShipping = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  const checkout = () => {
    setError(null);
    startTransition(async () => {
      const result = await startCheckout(lines);
      if (result.ok) {
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[70]",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={clsx(
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-label="Košík"
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-[#0b0b0d]",
          "border-l border-white/10 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-black uppercase tracking-tight">Košík</h2>
          <button
            onClick={close}
            className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/60 hover:text-white"
          >
            Zavřít
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="text-white/50">Zatím prázdno. Vyber si klub.</p>
            <CtaButton href="/kolekce" variant="outline" className="px-6 py-3">
              Prohlédnout kolekce
            </CtaButton>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <ul className="flex flex-col gap-5">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div
                    className="h-20 w-20 shrink-0 rounded-xl border border-white/10"
                    style={{ background: line.color }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{line.title}</p>
                    <p className="mt-0.5 truncate text-xs text-white/50">{line.subtitle}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-white/15">
                        <button
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-white/70 hover:text-white"
                          aria-label="Ubrat kus"
                        >
                          &minus;
                        </button>
                        <span className="w-5 text-center text-xs tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-white/70 hover:text-white"
                          aria-label="Přidat kus"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {formatPrice(line.unitPrice.amount * line.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(line.id)}
                    className="self-start text-xs text-white/35 hover:text-white"
                    aria-label={`Odebrat ${line.title}`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lines.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            {toFreeShipping > 0 ? (
              <p className="mb-3 text-xs text-white/50">
                Do dopravy zdarma zbývá{" "}
                <span className="text-white">{formatPrice(toFreeShipping)}</span>.
              </p>
            ) : (
              <p className="mb-3 text-xs text-[var(--accent)]">Doprava zdarma &check;</p>
            )}

            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">Mezisoučet</span>
              <span className="text-2xl font-black tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            {error && <p className="mb-3 text-xs text-[var(--accent)]">{error}</p>}

            <CtaButton onClick={checkout} disabled={pending} full variant="accent">
              {pending ? "Připravuji…" : "Přejít k pokladně"}
            </CtaButton>

            <p className="mt-3 text-center text-[11px] text-white/35">
              Termín odeslání potvrdíme e-mailem ·{" "}
              <Link href="/doprava-a-vraceni" className="underline hover:text-white/60">
                Vrácení do 30 dnů
              </Link>
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
