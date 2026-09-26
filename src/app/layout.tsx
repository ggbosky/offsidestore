import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AccentProvider } from "@/components/AccentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://offsidestore.cz"),
  title: {
    default: "OffsideStore",
    template: "%s | OffsideStore",
  },
  description:
    "Hokejové náramky z originálních hokejových tkaniček. Barvy tvého klubu, jeho zkratka, ruční výroba v ČR. Doručíme do 2 dnů.",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "OffsideStore",
    title: "OffsideStore — Nos svůj klub. Kdekoliv.",
    description:
      "Náramky z originálních hokejových tkaniček. Barvy klubu, zkratka, ruční kompletace.",
  },
  icons: {
    icon: "/logo/offside-mark.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <AccentProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </AccentProvider>
      </body>
    </html>
  );
}
