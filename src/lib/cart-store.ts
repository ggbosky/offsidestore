"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getClub } from "@/data/clubs";
import { CURRENCY } from "@/lib/pricing";
import {
  configPrice,
  configSubtitle,
  configToAttributes,
  type BraceletConfig,
} from "@/lib/configuration";
import type { CartLine } from "@/lib/commerce/types";

/**
 * Kosik zije na klientovi (localStorage). Do Shopify se posila az pri checkoutu
 * pres cartCreate — diky tomu nemusime drzet Shopify cart ID pres cele session.
 */

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (input: { config: BraceletConfig; merchandiseId: string; productHandle: string; title: string }) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

function lineId(merchandiseId: string, attrs: { key: string; value: string }[]) {
  return `${merchandiseId}::${attrs.map((a) => `${a.key}=${a.value}`).join("|")}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      add: ({ config, merchandiseId, productHandle, title }) => {
        const attributes = configToAttributes(config);
        const id = lineId(merchandiseId, attributes);
        const price = configPrice(config);
        const club = getClub(config.clubSlug);

        set((state) => {
          const existing = state.lines.find((l) => l.id === id);
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.id === id ? { ...l, quantity: l.quantity + 1 } : l,
              ),
            };
          }
          const line: CartLine = {
            id,
            merchandiseId,
            productHandle,
            title,
            subtitle: configSubtitle(config),
            quantity: 1,
            unitPrice: { amount: price.total, currencyCode: CURRENCY },
            attributes,
            color: config.color || club?.lace || "#111111",
          };
          return { isOpen: true, lines: [...state.lines, line] };
        });
      },

      remove: (id) =>
        set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.id !== id)
              : state.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "offsidestore-cart",
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice.amount * l.quantity, 0);
}
