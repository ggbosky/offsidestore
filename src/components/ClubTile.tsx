"use client";

import clsx from "clsx";
import { clubGradient, type Club } from "@/data/clubs";

/**
 * Dlazdice klubu: zkratka pres cely obdelnik, pozadi v prechodu klubovych barev.
 * Nazev klubu je pod zkratkou, aby slo dlazdici precist i bez znalosti zkratek.
 */
export function ClubTile({
  club,
  active = false,
  onClick,
  size = "md",
}: {
  club: Club;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl",
        "transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5",
        size === "sm" ? "aspect-[16/10]" : "aspect-[16/11]",
        active
          ? "ring-2 ring-white ring-offset-2 ring-offset-[#08080a]"
          : "ring-1 ring-white/10 hover:ring-white/35",
      )}
      style={{ background: clubGradient(club) }}
    >
      <span
        className={clsx(
          "font-black uppercase leading-none tracking-[-0.03em]",
          size === "sm" ? "text-3xl" : "text-4xl sm:text-5xl",
        )}
        style={{ color: club.ink }}
      >
        {club.abbr}
      </span>
      <span
        className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] opacity-70"
        style={{ color: club.ink }}
      >
        {club.short}
      </span>
    </button>
  );
}
