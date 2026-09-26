import Link from "next/link";
import Image from "next/image";
import { clubGradient, getClub } from "@/data/clubs";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/lib/commerce/types";

export function ProductCard({ product }: { product: Product }) {
  const club = product.clubSlug ? getClub(product.clubSlug) : undefined;
  const photo = product.images.find((img) => img.url);

  return (
    <Link
      href={`/produkt/${product.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 transition-colors duration-300 hover:border-white/35"
    >
      <div
        className="relative aspect-[16/11] overflow-hidden"
        style={{ background: club ? clubGradient(club) : "#101013" }}
      >
        {photo?.url ? (
          <Image
            src={photo.url}
            alt={photo.altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          /* Dokud nejsou fotky ve Shopify, drzi misto zkratka klubu. */
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-5xl font-black uppercase leading-none tracking-[-0.03em] transition-transform duration-500 group-hover:scale-105"
              style={{ color: club?.ink ?? "#fff" }}
            >
              {club?.abbr ?? "OFF"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <h3 className="text-base font-black uppercase leading-tight tracking-tight">
            {club?.name ?? product.title}
          </h3>
          <p className="mt-1 text-xs text-white/40">
            {club ? `${club.city} · zkratka ${club.abbr}` : "Vlastní konfigurace"}
          </p>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-lg font-black tabular-nums">
            {formatPrice(product.priceRange.min.amount)}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40 transition-colors group-hover:text-[var(--accent)]">
            Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
