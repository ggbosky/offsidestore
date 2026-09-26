"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { clubGradient, getClub } from "@/data/clubs";
import { BraceletPreview } from "@/components/BraceletPreview";
import type { Product } from "@/lib/commerce/types";

/**
 * Galerie s podporou realnych fotek i skeletonu.
 *
 * Dokud produkt nema `images[].url` (tj. dokud nejsou fotky ve Shopify),
 * vykresli se vektorovy nahled — struktura zustava stejna, takze po uploadu
 * staci nahrat obrazky, nic se neprepisuje.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const club = product.clubSlug ? getClub(product.clubSlug) : undefined;
  const lace = club?.lace ?? "#b01e28";

  const slides = product.images.length
    ? product.images
    : [{ url: null, altText: product.title }];

  const current = slides[active];

  return (
    <div>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: `radial-gradient(120% 100% at 50% 0%, color-mix(in srgb, ${
            club?.accent ?? "#ec0016"
          } 26%, #0b0b0d) 0%, #0b0b0d 72%)`,
        }}
      >
        {current?.url ? (
          <Image
            src={current.url}
            alt={current.altText}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center px-6 sm:px-12">
            <BraceletPreview
              color={lace}
              letters={club?.abbr ?? "OFF"}
              assemble
              assembleKey={`${product.handle}-${active}`}
            />
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex gap-3">
          {slides.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={img.altText}
              className={clsx(
                "relative aspect-square w-20 overflow-hidden rounded-xl border transition-colors",
                i === active ? "border-white" : "border-white/12 hover:border-white/40",
              )}
              style={{ background: club ? clubGradient(club) : "#101013" }}
            >
              {img.url && (
                <Image src={img.url} alt={img.altText} fill sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
