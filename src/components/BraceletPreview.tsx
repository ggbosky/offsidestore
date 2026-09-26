"use client";

import { useId, useMemo } from "react";
import clsx from "clsx";

type Props = {
  /** Naramek je z jedne tkanicky — jedna barva. */
  color: string;
  letters: string;
  /** Postupne "sestaveni" naramku — provlekani tkanicky, nasazovani pismen. */
  assemble?: boolean;
  /** Klic, pri jehoz zmene se sestaveni prehraje znovu (typicky slug klubu). */
  assembleKey?: string;
  className?: string;
};

const VB_W = 880;
const X0 = 70;
const X1 = 810;
const CY = 150;
const SAG = 26;

/** Vodici krivka pasku — mirny prohyb jako u naramku na zapesti. */
function baseY(t: number) {
  return CY + SAG * Math.sin(Math.PI * t);
}

/** Jeden pramen tkanicky: vlnovka kolem vodici krivky. */
function strandPath(amp: number, phase: number, freq = 5.5, steps = 120) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = X0 + (X1 - X0) * t;
    // U konců amplitudu stáhneme k nule, aby pramen vešel do koncovky.
    const taper = Math.sin(Math.PI * t) ** 0.6;
    const y = baseY(t) + amp * taper * Math.sin(2 * Math.PI * freq * t + phase);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function BraceletPreview({
  color,
  letters,
  assemble = false,
  assembleKey = "",
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const chars = useMemo(() => letters.toUpperCase().split("").slice(0, 12), [letters]);

  // Jedna barva, tři prameny — hloubku dělá jen světlo a stín na téže barvě.
  const strands = useMemo(
    () => [
      { d: strandPath(15, 0), width: 17, shade: "0%" },
      { d: strandPath(17, (2 * Math.PI) / 3), width: 15.5, shade: "22%" },
      { d: strandPath(19, (4 * Math.PI) / 3), width: 14, shade: "38%" },
    ],
    [],
  );

  // Písmena sedí těsně vedle sebe uprostřed pásku (roztečí korálků, ne procenty),
  // aby tři znaky vypadaly jako náramek a ne jako rozházená abeceda.
  const beads = useMemo(() => {
    const n = chars.length || 1;
    const pitch = Math.min(50, (X1 - X0 - 120) / Math.max(n, 1));
    const first = (X0 + X1) / 2 - (pitch * (n - 1)) / 2;
    return chars.map((char, i) => {
      const x = first + pitch * i;
      const t = (x - X0) / (X1 - X0);
      return { char, x, y: baseY(t), i };
    });
  }, [chars]);

  return (
    <svg
      key={assemble ? assembleKey : undefined}
      /* Orez na skutecny obsah — nahore i dole zbyval prazdny pas. */
      viewBox={`0 95 ${VB_W} 200`}
      className={clsx("w-full", className)}
      role="img"
      aria-label={`Náramek s nápisem ${letters || "bez písmen"}`}
    >
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a40" />
          <stop offset="45%" stopColor="#232327" />
          <stop offset="100%" stopColor="#16161a" />
        </linearGradient>
        <linearGradient id={`${uid}-bead`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8d8dc" />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-20%" y="-40%" width="140%" height="220%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* Stín pod náramkem */}
      <ellipse cx={VB_W / 2} cy={CY + SAG + 74} rx={318} ry={16} fill="#000" opacity="0.45" />

      <g filter={`url(#${uid}-shadow)`}>
        {/* Tkanička */}
        {strands.map((s, i) => (
          <path
            key={i}
            d={s.d}
            stroke={`color-mix(in srgb, ${color} calc(100% - ${s.shade}), #000)`}
            strokeWidth={s.width}
            strokeLinecap="round"
            fill="none"
            className={assemble ? "bp-strand" : undefined}
            style={
              assemble
                ? ({ "--d": "2400", animationDelay: `${i * 130}ms` } as React.CSSProperties)
                : undefined
            }
          />
        ))}

        {/* Koncovky */}
        {[X0 - 8, X1 + 8].map((x, i) => (
          <rect
            key={i}
            x={x - 20}
            y={CY - 20}
            width="40"
            height="40"
            rx="12"
            fill={`url(#${uid}-metal)`}
            stroke="#ffffff18"
          />
        ))}

        {/* Písmena */}
        {beads.map((b) => (
          <g key={`${b.char}-${b.i}`} transform={`translate(${b.x} ${b.y})`}>
            {/* Vnitrni <g> nese CSS transform — atribut translate na vnejsim
                by se s nim jinak prebijel. */}
            <g
              className={assemble ? "bp-bead" : undefined}
              style={
                assemble
                  ? ({ animationDelay: `${520 + b.i * 90}ms` } as React.CSSProperties)
                  : undefined
              }
            >
              <rect
                x="-21"
                y="-25"
                width="42"
                height="50"
                rx="10"
                fill={`url(#${uid}-bead)`}
                stroke="#00000022"
              />
              <text
                x="0"
                y="9"
                textAnchor="middle"
                fontSize="27"
                fontWeight="900"
                fill="#0a0a0a"
                letterSpacing="-0.5"
              >
                {b.char === " " ? "" : b.char}
              </text>
            </g>
          </g>
        ))}
      </g>

      <style>{`
        /* Skryty stav zije jen v keyframu "from" — kdyz se animace nespusti
           (zablokovane animace, skryta zalozka, prerender), naramek je videt. */
        .bp-strand {
          stroke-dasharray: var(--d);
          stroke-dashoffset: 0;
          animation: bp-thread 1400ms cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes bp-thread {
          from { stroke-dashoffset: var(--d); }
          to { stroke-dashoffset: 0; }
        }
        .bp-bead {
          animation: bp-drop 620ms cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes bp-drop {
          from { opacity: 0; transform: translateY(-38px) scale(0.7); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-strand, .bp-bead { animation: none; }
        }
      `}</style>
    </svg>
  );
}
