import type { Metadata } from "next";
import { CtaButton } from "@/components/CtaButton";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata: Metadata = {
  title: "Objednávka přijata",
  robots: { index: false },
};

/**
 * Potvrzeni pro mock provider. Po napojeni Shopify sem uzivatel nedojde —
 * checkout prebira Shopify a vraci se na vlastni thank-you stranku.
 */
export default async function CheckoutDonePage({
  searchParams,
}: {
  searchParams: Promise<{ ks?: string }>;
}) {
  const { ks } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[720px] flex-col items-center justify-center px-5 py-32 text-center">
      <ClearCartOnMount />
      <h1 className="display text-[12vw] leading-[0.88] md:text-[4.5rem]">
        Máme to.
      </h1>
      <p className="mt-6 text-white/55">
        {ks ? `${ks} ks` : "Tvoje objednávka"} jde do výroby. Potvrzení i termín
        odeslání ti pošleme e-mailem.
      </p>
      <p className="mt-3 text-sm text-white/35">
        Demo režim — reálná platba se spustí po napojení Shopify backendu.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <CtaButton href="/kolekce">Zpět do kolekcí</CtaButton>
        <CtaButton href="/" variant="outline">
          Na hlavní stranu
        </CtaButton>
      </div>
    </div>
  );
}
