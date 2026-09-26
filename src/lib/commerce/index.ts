import type { CommerceProvider } from "./types";
import { mockProvider } from "./mock/provider";
import { shopifyProvider } from "./shopify/provider";
import { isShopifyConfigured } from "./shopify/client";

/**
 * Jediny bod prepnuti mock -> Shopify. Zbytek aplikace importuje jen `commerce`.
 */
export const commerce: CommerceProvider = isShopifyConfigured()
  ? shopifyProvider
  : mockProvider;

export * from "./types";
