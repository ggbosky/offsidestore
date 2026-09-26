import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/kosik/"] },
    sitemap: "https://offsidestore.cz/sitemap.xml",
  };
}
