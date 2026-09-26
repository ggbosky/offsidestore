import clsx from "clsx";

/**
 * Znacka OffsideStore: ofsajdova cara, hrac za ni (cerna) a hrac v ofsajdu (cervena).
 *
 * Vektor je inlinovany, aby sel prebarvit podle akcentu klubu. Rastrove verze
 * z `public/logo/` pouzij pro favicon a OG obrazky.
 */
export function LogoMark({
  className,
  behind = "currentColor",
  offside = "var(--accent)",
}: {
  className?: string;
  behind?: string;
  offside?: string;
}) {
  return (
    <svg viewBox="0 0 72 100" className={className} aria-hidden="true">
      <rect x="29" y="0" width="12" height="100" fill={behind} />
      <circle cx="12" cy="63" r="12.5" fill={behind} />
      <circle cx="57" cy="37" r="12.5" fill={offside} />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-6 w-[17px] shrink-0" />
      {!compact && (
        <span className="text-[15px] font-black tracking-[-0.03em] uppercase">
          Offside<span className="text-[var(--accent)]">store</span>
        </span>
      )}
    </span>
  );
}
