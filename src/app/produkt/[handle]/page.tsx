import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { commerce } from "@/lib/commerce";
import { getClub } from "@/data/clubs";
import { BASE_PRICE, ENDINGS, SIZES, formatPrice } from "@/lib/pricing";
import { Configurator } from "@/components/Configurator";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { FAQ_ITEMS } from "@/components/home/Sections";

type Params = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) return { title: "Produkt nenalezen" };
  const club = product.clubSlug ? getClub(product.clubSlug) : undefined;
  return {
    title: `Náramek ${club?.name ?? product.title}`,
    description: product.description,
    alternates: { canonical: `/produkt/${product.handle}` },
  };
}

const DETAILS = [
  ["Materiál", "Originální hokejová tkanička, voskovaná polyesterová nit"],
  ["Rozměry", "Šíře 9 mm, délka podle zvoleného zakončení"],
  ["Zakončení", "Univerzální s posuvným uzlem, nebo pevné na míru"],
  ["Písmena", "Ražené korálky, 3 znaky v ceně, každý další 12 Kč"],
  ["Péče", "Snese vodu i pot. Neutírat rozpouštědly, nesušit na radiátoru."],
  ["Původ", "Ruční výroba v České republice"],
];

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) notFound();

  const all = await commerce.getProducts();
  const related = all.filter((p) => p.handle !== product.handle).slice(0, 4);
  const club = product.clubSlug ? getClub(product.clubSlug) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: { "@type": "Brand", name: "OffsideStore" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CZK",
      price: BASE_PRICE / 100,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 pt-28 md:px-8">
        {/* Drobeckova navigace */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-white/35">
          <Link href="/" className="hover:text-white">
            Domů
          </Link>
          <span>/</span>
          <Link href="/kolekce" className="hover:text-white">
            Kolekce
          </Link>
          <span>/</span>
          <span className="text-white/60">{club?.name ?? product.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <ProductGallery product={product} />

          {/* Nakupni box — na desktopu prichyceny */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">{club ? `${club.city} · ${club.abbr}` : "Edice"}</p>
            <h1 className="display mt-3 text-[11vw] leading-[0.88] md:text-[3.6rem]">
              {club?.name ?? product.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-black tabular-nums">
                {formatPrice(product.priceRange.min.amount)}
              </span>
              <span className="text-sm text-white/40">
                tkanička a tři znaky · každý další znak 12 Kč
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full border border-white/15 px-3 py-1 text-white/60">
                {product.availableForSale ? "Skladem" : "Vyprodáno"}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-white/60">
                Ruční výroba
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-white/60">
                Vrácení do 30 dnů
              </span>
            </div>

            <p className="mt-6 text-white/55">{product.description}</p>

            <div className="mt-9 border-t border-white/10 pt-9">
              <Configurator
                products={all}
                initialClub={product.clubSlug ?? undefined}
                compact
              />
            </div>
          </div>
        </div>

        {/* Detaily produktu */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <h2 className="display text-3xl">Detaily</h2>
              <p className="mt-3 max-w-sm text-sm text-white/45">
                Každý náramek je kompletovaný ručně. Drobné odchylky v zapletení jsou
                znakem toho, že ho dělal člověk.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {DETAILS.map(([term, value]) => (
                  <div key={term} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                      {term}
                    </dt>
                    <dd className="text-sm text-white/70">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Zakonceni */}
        <section className="mt-16">
          <h2 className="display text-3xl">Zakončení</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {ENDINGS.map((e) => (
              <div key={e.id} className="rounded-xl border border-white/12 p-5">
                <p className="text-base font-black uppercase tracking-tight">{e.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tabulka velikosti */}
        <section className="mt-16">
          <h2 className="display text-3xl">Velikosti na míru</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/15 text-left">
                  <th className="py-3 pr-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Velikost
                  </th>
                  <th className="py-3 pr-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Obvod zápěstí
                  </th>
                  <th className="py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Komu sedí
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s, i) => (
                  <tr key={s.id} className="border-b border-white/8">
                    <td className="py-3 pr-6 font-black">{s.label}</td>
                    <td className="py-3 pr-6 tabular-nums text-white/70">{s.cm}</td>
                    <td className="py-3 text-white/50">
                      {["Děti a útlejší zápěstí", "Nejčastější volba", "Silnější zápěstí"][i]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ k produktu */}
        <section className="mt-16">
          <h2 className="display text-3xl">Časté dotazy</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {FAQ_ITEMS.slice(0, 4).map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="font-bold">{item.q}</span>
                  <span className="shrink-0 text-2xl text-white/35 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-white/55">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Souvisejici */}
        <section className="mt-20 pb-24">
          <h2 className="display text-3xl">Další kluby</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
