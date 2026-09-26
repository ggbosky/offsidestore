/**
 * Domenove typy storefrontu. Zamerne kopiruji tvar Shopify Storefront API
 * (handle / variants / lines / attributes), aby prechod z mocku na Shopify
 * neznamenal prepis komponent — meni se jen implementace provideru.
 */

export type Money = {
  /** V halerich. */
  amount: number;
  currencyCode: string;
};

export type ProductImage = {
  url: string | null;
  altText: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  /** Klub, ke kteremu produkt patri (mapuje se ze Shopify metafieldu). */
  clubSlug: string | null;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  priceRange: { min: Money; max: Money };
  availableForSale: boolean;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  products: Product[];
};

/** Personalizace se do objednavky prenasi jako line item attributes. */
export type LineAttribute = { key: string; value: string };

export type CartLine = {
  id: string;
  merchandiseId: string;
  productHandle: string;
  title: string;
  subtitle: string;
  quantity: number;
  /** Jednotkova cena vcetne priplatku za pismena a upgrady. */
  unitPrice: Money;
  attributes: LineAttribute[];
  /** Barva tkanicky pro nahled v kosiku. */
  color: string;
};

export type Cart = {
  id: string | null;
  lines: CartLine[];
  subtotal: Money;
  /** URL Shopify checkoutu. Null u mock provideru. */
  checkoutUrl: string | null;
};

export type CartInput = {
  merchandiseId: string;
  quantity: number;
  attributes: LineAttribute[];
};

export interface CommerceProvider {
  readonly name: "mock" | "shopify";
  getProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getCollection(handle: string): Promise<Collection | null>;
  /**
   * Vytvori checkout pro dany obsah kosiku a vrati URL, kam presmerovat.
   * Mock vraci /kosik/hotovo, Shopify vraci cart.checkoutUrl.
   */
  createCheckout(lines: CartInput[]): Promise<{ checkoutUrl: string }>;
}
