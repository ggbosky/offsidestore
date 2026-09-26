import type {
  CartInput,
  Collection,
  CommerceProvider,
  Product,
} from "@/lib/commerce/types";
import { ShopifyError, storefront, toMinorUnits } from "./client";
import {
  CART_CREATE_MUTATION,
  COLLECTION_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
} from "./queries";

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  clubSlug: { value: string } | null;
  images: { nodes: { url: string; altText: string | null }[] };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

function normalize(p: ShopifyProduct): Product {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    clubSlug: p.clubSlug?.value ?? null,
    tags: p.tags,
    images: p.images.nodes.map((img) => ({
      url: img.url,
      altText: img.altText ?? p.title,
    })),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: {
        amount: toMinorUnits(v.price.amount),
        currencyCode: v.price.currencyCode,
      },
      selectedOptions: v.selectedOptions,
    })),
    priceRange: {
      min: {
        amount: toMinorUnits(p.priceRange.minVariantPrice.amount),
        currencyCode: p.priceRange.minVariantPrice.currencyCode,
      },
      max: {
        amount: toMinorUnits(p.priceRange.maxVariantPrice.amount),
        currencyCode: p.priceRange.maxVariantPrice.currencyCode,
      },
    },
    availableForSale: p.availableForSale,
  };
}

export const shopifyProvider: CommerceProvider = {
  name: "shopify",

  async getProducts() {
    const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
      PRODUCTS_QUERY,
      { first: 50 },
    );
    return data.products.nodes.map(normalize);
  },

  async getProduct(handle) {
    const data = await storefront<{ product: ShopifyProduct | null }>(PRODUCT_QUERY, {
      handle,
    });
    return data.product ? normalize(data.product) : null;
  },

  async getCollection(handle): Promise<Collection | null> {
    const data = await storefront<{
      collection: {
        handle: string;
        title: string;
        description: string;
        products: { nodes: ShopifyProduct[] };
      } | null;
    }>(COLLECTION_QUERY, { handle, first: 50 });
    if (!data.collection) return null;
    return {
      handle: data.collection.handle,
      title: data.collection.title,
      description: data.collection.description,
      products: data.collection.products.nodes.map(normalize),
    };
  },

  async createCheckout(lines: CartInput[]) {
    const data = await storefront<{
      cartCreate: {
        cart: { id: string; checkoutUrl: string } | null;
        userErrors: { message: string }[];
      };
    }>(
      CART_CREATE_MUTATION,
      {
        lines: lines.map((l) => ({
          merchandiseId: l.merchandiseId,
          quantity: l.quantity,
          attributes: l.attributes,
        })),
      },
      "no-store",
    );

    if (data.cartCreate.userErrors.length) {
      throw new ShopifyError(
        data.cartCreate.userErrors.map((e) => e.message).join("; "),
      );
    }
    if (!data.cartCreate.cart) {
      throw new ShopifyError("Shopify nevratilo cart.");
    }
    return { checkoutUrl: data.cartCreate.cart.checkoutUrl };
  },
};
