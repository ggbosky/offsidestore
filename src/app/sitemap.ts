import type { MetadataRoute } from "next";
import { commerce } from "@/lib/commerce";
import { CONTENT_PAGES } from "@/data/pages";

const BASE = "https://offsidestore.cz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await commerce.getProducts();

  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/kolekce`, priority: 0.9 },
    { url: `${BASE}/konfigurator`, priority: 0.9 },
    ...products.map((p) => ({
      url: `${BASE}/produkt/${p.handle}`,
      priority: 0.8,
    })),
    ...CONTENT_PAGES.map((p) => ({ url: `${BASE}/${p.slug}`, priority: 0.4 })),
  ];
}
