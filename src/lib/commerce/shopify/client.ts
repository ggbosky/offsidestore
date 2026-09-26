/**
 * Tenky klient nad Shopify Storefront GraphQL API.
 * Aktivuje se, jakmile jsou vyplnene env promenne (viz .env.example).
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-01";

export function isShopifyConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

export const LETTER_ADDON_HANDLE =
  process.env.NEXT_PUBLIC_SHOPIFY_LETTER_ADDON_HANDLE ?? "priplatek-pismeno";

export class ShopifyError extends Error {}

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  cache: RequestCache = "force-cache",
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new ShopifyError(
      "Shopify neni nakonfigurovane — chybi NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN nebo NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.",
    );
  }

  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: { revalidate: cache === "force-cache" ? 300 : undefined },
  });

  if (!res.ok) {
    throw new ShopifyError(`Storefront API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new ShopifyError("Storefront API vratilo prazdnou odpoved.");
  }
  return json.data;
}

/** Shopify vraci ceny jako string v hlavni mene ("350.00") — prevod na halere. */
export function toMinorUnits(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}
