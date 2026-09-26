"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { cartCount, useCart } from "@/lib/cart-store";

const NAV = [
  { href: "/kolekce", label: "Kolekce" },
  { href: "/konfigurator", label: "Konfigurátor" },
  { href: "/pribeh", label: "Příběh" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = mounted ? cartCount(lines) : 0;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/10 bg-black/88 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="OffsideStore — domů">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-white/60"
            aria-label={`Košík, ${count} položek`}
          >
            Košík
            <span
              className={clsx(
                "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] tabular-nums transition-colors",
                count > 0 ? "bg-[var(--accent)] text-[var(--on-accent)]" : "bg-white/15",
              )}
            >
              {count}
            </span>
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 md:hidden"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3 w-4">
              <span
                className={clsx(
                  "absolute left-0 block h-[2px] w-4 bg-white transition-transform duration-300",
                  menuOpen ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 block h-[2px] w-4 bg-white transition-transform duration-300",
                  menuOpen ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "grid overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl transition-[grid-template-rows] duration-400 md:hidden",
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-transparent",
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col px-5 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/8 py-4 text-lg font-black uppercase tracking-tight last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
