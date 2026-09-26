import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { CtaButton } from "@/components/CtaButton";

export const metadata: Metadata = {
  title: "Klubové kolekce",
  description:
    "Náramky z hokejových tkaniček ve barvách českých klubů. Sparta, Kometa, Pardubice, Plzeň a další. Od 350 Kč.",
  alternates: { canonical: "/kolekce" },
};

export default async function CollectionsPage() {
  const collection = await commerce.getCollection("klubove-kolekce");
  const products = collection?.products ?? (await commerce.getProducts());

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-8">
      <Reveal>
        <h1 className="display text-[13vw] leading-[0.86] md:text-[6rem]">
          Vyber si klub
        </h1>
        <p className="mt-6 max-w-xl text-white/50">
          {collection?.description ??
            "Předpřipravené varianty podle klubů. Barvy, zkratka, hotovo."}{" "}
          Chceš vlastní barvu nebo víc písmen? Skoč rovnou do konfigurátoru.
        </p>
        <div className="mt-8">
          <CtaButton href="/konfigurator" variant="outline">
            Vytvořit vlastní
          </CtaButton>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.handle} delay={(i % 4) * 60}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
