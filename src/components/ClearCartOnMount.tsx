"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Po dokonceni objednavky vyprazdni lokalni kosik. */
export function ClearCartOnMount() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
