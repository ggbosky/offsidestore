"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * Ovalne plovouci CTA pro mobil (spec: ne sticky banner pres celou sirku).
 * Objevi se, jakmile uzivatel odscrolluje hero.
 */
export function FloatingCta({
  label,
  onClick,
  href,
  showAfter = 520,
  visible: controlled,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  showAfter?: number;
  /** Rizeny rezim — kdyz je zadany, prebiji scrollovaci prah. */
  visible?: boolean;
}) {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    if (controlled !== undefined) return;
    const onScroll = () => setScrolledPast(window.scrollY > showAfter);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter, controlled]);

  const visible = controlled ?? scrolledPast;

  const classes = clsx(
    "fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 md:hidden",
    "flex items-center gap-2 rounded-full px-7 py-4",
    "bg-[var(--accent)] text-[var(--on-accent)]",
    "text-[13px] font-bold uppercase tracking-[0.12em] whitespace-nowrap",
    "shadow-[0_14px_44px_-8px_rgba(0,0,0,0.85)]",
    "transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
    visible
      ? "translate-y-0 opacity-100"
      : "pointer-events-none translate-y-24 opacity-0",
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes}>
      {label}
    </button>
  );
}
