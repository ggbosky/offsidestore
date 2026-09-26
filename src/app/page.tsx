import { commerce } from "@/lib/commerce";
import { Hero } from "@/components/home/Hero";
import { ClubPicker } from "@/components/home/ClubPicker";
import {
  CollectionSection,
  CraftSection,
  FaqSection,
  FinalCta,
  FAQ_ITEMS,
} from "@/components/home/Sections";
import { ConfiguratorSection } from "@/components/home/ConfiguratorSection";

export default async function HomePage() {
  const products = await commerce.getProducts();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Hero />
      <ClubPicker />
      <CollectionSection products={products} />
      <ConfiguratorSection products={products} />
      <CraftSection />
      <FaqSection />
      <FinalCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
