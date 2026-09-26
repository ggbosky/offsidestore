import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { Configurator } from "@/components/Configurator";

export const metadata: Metadata = {
  title: "Konfigurátor náramku",
  description:
    "Namíchej si vlastní náramek z hokejových tkaniček — barvy, písmena, velikost. Základ 350 Kč, každé písmeno navíc 50 Kč.",
  alternates: { canonical: "/konfigurator" },
};

export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams: Promise<{ klub?: string }>;
}) {
  const [{ klub }, products] = await Promise.all([
    searchParams,
    commerce.getProducts(),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-8">
      <h1 className="display max-w-3xl text-[12vw] leading-[0.86] md:text-[5.2rem]">
        Vytvoř si svůj náramek
      </h1>
      <p className="mt-6 max-w-xl text-white/50">
        Čtyři kroky. Náhled se skládá v reálném čase a cena se přepočítává rovnou
        v tlačítku.
      </p>

      <div className="mt-14">
        <Configurator products={products} initialClub={klub} />
      </div>
    </div>
  );
}
