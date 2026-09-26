"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CLUBS, DEFAULT_CLUB, getClub, type Club } from "@/data/clubs";

/**
 * Drzi aktualne vybrany klub a promita jeho barvy do CSS promennych na <html>.
 * Diky --accent jako @property se zmena prolne misto skoku.
 */

type Ctx = {
  club: Club;
  setClub: (slug: string) => void;
  clubs: Club[];
};

const AccentContext = createContext<Ctx | null>(null);

export function AccentProvider({
  children,
  initialClub,
}: {
  children: ReactNode;
  initialClub?: string;
}) {
  const [slug, setSlug] = useState(initialClub ?? DEFAULT_CLUB.slug);
  const club = getClub(slug) ?? DEFAULT_CLUB;

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--accent", club.accent);
    root.setProperty("--on-accent", club.onAccent);
  }, [club]);

  const setClub = useCallback((next: string) => setSlug(next), []);
  const value = useMemo(() => ({ club, setClub, clubs: CLUBS }), [club, setClub]);

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent(): Ctx {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent musi byt uvnitr <AccentProvider>.");
  return ctx;
}
