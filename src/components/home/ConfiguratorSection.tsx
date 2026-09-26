import { Reveal } from "@/components/Reveal";
import { Configurator } from "@/components/Configurator";
import type { Product } from "@/lib/commerce/types";

/** Konfigurator primo na homepage, bez prokliku. */
export function ConfiguratorSection({ products }: { products: Product[] }) {
  return (
    <section id="konfigurator" className="border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <h2 className="display max-w-4xl text-[10vw] leading-[0.88] md:text-[4.5rem]">
            Vytvoř si svůj náramek
          </h2>
          <p className="mt-5 max-w-xl text-white/50">
            Klub, barva, písmena, zakončení. Cena se přepočítává v reálném čase —
            vidíš ji rovnou v tlačítku.
          </p>
        </Reveal>

        <div className="mt-12">
          <Configurator products={products} />
        </div>
      </div>
    </section>
  );
}
