import { CLUBS } from "@/data/clubs";
import { BASE_PRICE, CURRENCY, SIZES } from "@/lib/pricing";
import type {
  CartInput,
  Collection,
  CommerceProvider,
  Product,
} from "@/lib/commerce/types";

/**
 * Lokalni katalog. Generuje jeden produkt na klub + limitovane dropy,
 * aby se dal cely web proklikat bez Shopify uctu.
 */

function buildProduct(club: (typeof CLUBS)[number]): Product {
  const handle = `naramek-${club.slug}`;
  return {
    id: `gid://mock/Product/${club.slug}`,
    handle,
    title: `Náramek ${club.name}`,
    description:
      `Náramek z originální hokejové tkaničky v barvě ${club.name}. ` +
      `Zkratka ${club.abbr}, ruční kompletace, kovová koncovka. ` +
      `V ceně je tkanička a tři znaky.`,
    clubSlug: club.slug,
    tags: ["klubova-kolekce"],
    images: [
      { url: null, altText: `Náramek ${club.name} na ruce` },
      { url: null, altText: `Detail vpletení ${club.abbr}` },
      { url: null, altText: `Náramek ${club.name} v balení` },
    ],
    variants: [
      { id: "UNI", label: "Univerzální" },
      ...SIZES.map((s) => ({ id: s.id as string, label: s.label })),
    ].map((size) => ({
      id: `gid://mock/ProductVariant/${club.slug}-${size.id}`,
      title: size.label,
      availableForSale: true,
      price: { amount: BASE_PRICE, currencyCode: CURRENCY },
      selectedOptions: [{ name: "Velikost", value: size.id }],
    })),
    priceRange: {
      min: { amount: BASE_PRICE, currencyCode: CURRENCY },
      max: { amount: BASE_PRICE, currencyCode: CURRENCY },
    },
    availableForSale: true,
  };
}

const PRODUCTS: Product[] = CLUBS.map(buildProduct);

export const mockProvider: CommerceProvider = {
  name: "mock",

  async getProducts() {
    return PRODUCTS;
  },

  async getProduct(handle: string) {
    return PRODUCTS.find((p) => p.handle === handle) ?? null;
  },

  async getCollection(handle: string): Promise<Collection | null> {
    if (handle === "klubove-kolekce") {
      return {
        handle,
        title: "Klubové kolekce",
        description: "Předpřipravené varianty podle klubů. Barva, zkratka, hotovo.",
        products: PRODUCTS,
      };
    }
    return null;
  },

  async createCheckout(lines: CartInput[]) {
    // Bez Shopify jen potvrdime — realny checkout prijde s provider === "shopify".
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    return { checkoutUrl: `/kosik/hotovo?ks=${count}` };
  },
};
