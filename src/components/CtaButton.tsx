import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

/**
 * Hlavni CTA tlacitko.
 *
 * Zamerne bez efektu, ktery by tlacitko posouval za kurzorem: jakmile se
 * tlacitko hne, muze kurzoru ujet mimo svuj vlastni box, tim se prepne zpet
 * a cely cyklus se opakuje — tlacitko pak vizualne kmita.
 *
 * Hover misto toho nalije bilou plochu zleva doprava (trida `.cta-fill`
 * v globals.css). Obsah proto musi lezet nad ni, tedy v `relative z-10`.
 */
export function CtaButton({
  children,
  href,
  onClick,
  variant = "accent",
  className,
  type = "button",
  disabled,
  full = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "accent" | "outline" | "paper";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Roztahne tlacitko na sirku rodice. */
  full?: boolean;
}) {
  const fills = variant === "accent" || variant === "outline";

  const styles = clsx(
    "relative isolate overflow-hidden",
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4",
    "text-[13px] font-bold uppercase tracking-[0.14em]",
    "transition-[color,border-color,transform] duration-300 ease-out",
    "hover:-translate-y-px active:translate-y-0",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
    "disabled:pointer-events-none disabled:opacity-40",
    full && "w-full",
    fills && "cta-fill",
    variant === "accent" &&
      "bg-[var(--accent)] text-[var(--on-accent)] hover:text-black focus-visible:text-black",
    variant === "paper" && "bg-white text-black hover:bg-white/90",
    variant === "outline" &&
      "border border-white/25 text-white hover:border-white hover:text-black focus-visible:text-black",
    className,
  );

  const content = <span className="relative z-10">{children}</span>;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {content}
    </button>
  );
}
