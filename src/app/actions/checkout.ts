"use server";

import { commerce } from "@/lib/commerce";
import { LETTER_ADDON_HANDLE } from "@/lib/commerce/shopify/client";
import type { CartInput, CartLine } from "@/lib/commerce/types";

/**
 * Prevede klientsky kosik na objednavku.
 *
 * Znaky nad ramec zakladnich tri neumi variant cena vyjadrit, proto jdou do
 * kosiku jako samostatny addon radek navazany na hlavni radek pres atribut
 * `_parent`. Ve Shopify k tomu staci jeden skryty produkt `priplatek-pismeno`.
 */
export async function startCheckout(
  lines: CartLine[],
): Promise<{ ok: true; checkoutUrl: string } | { ok: false; error: string }> {
  if (!lines.length) {
    return { ok: false, error: "Košík je prázdný." };
  }

  try {
    const inputs: CartInput[] = [];

    for (const line of lines) {
      inputs.push({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
        attributes: line.attributes.filter((a) => !a.key.startsWith("_parent")),
      });

      if (commerce.name !== "shopify") continue;

      const extra = Number(
        line.attributes.find((a) => a.key === "_extra_letters")?.value ?? "0",
      );
      if (extra > 0) {
        const addon = await commerce.getProduct(LETTER_ADDON_HANDLE);
        const variant = addon?.variants[0];
        if (variant) {
          inputs.push({
            merchandiseId: variant.id,
            quantity: extra * line.quantity,
            attributes: [
              { key: "_parent", value: line.id },
              { key: "Patří k", value: line.subtitle },
            ],
          });
        }
      }

    }

    const { checkoutUrl } = await commerce.createCheckout(inputs);
    return { ok: true, checkoutUrl };
  } catch (error) {
    console.error("[checkout]", error);
    return {
      ok: false,
      error: "Objednávku se nepodařilo vytvořit. Zkus to prosím znovu.",
    };
  }
}
