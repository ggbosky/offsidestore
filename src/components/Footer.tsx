import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CLUBS } from "@/data/clubs";

const COLUMNS = [
  {
    title: "Nákup",
    links: [
      { href: "/kolekce", label: "Klubové kolekce" },
      { href: "/konfigurator", label: "Konfigurátor" },
    ],
  },
  {
    title: "Zákazník",
    links: [
      { href: "/doprava-a-vraceni", label: "Doprava a vrácení" },
      { href: "/velikosti", label: "Tabulka velikostí" },
      { href: "/pece", label: "Péče o náramek" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
  {
    title: "Značka",
    links: [
      { href: "/pribeh", label: "Náš příběh" },
      { href: "/spoluprace", label: "Spolupráce a kluby" },
      { href: "/obchodni-podminky", label: "Obchodní podmínky" },
      { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-2xl font-black uppercase leading-[0.95] tracking-tight">
              Nos svůj klub.
              <br />
              <span className="text-[var(--accent)]">Kdekoliv.</span>
            </p>
            <p className="mt-5 max-w-sm text-sm text-white/45">
              Náramky z originálních hokejových tkaniček. Ruční výroba v České republice.
            </p>

            <form className="mt-7 flex max-w-sm gap-2">
              <input
                type="email"
                required
                placeholder="tvuj@email.cz"
                aria-label="E-mail pro novinky o dropech"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-white px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/85"
              >
                Chci vědět
              </button>
            </form>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/55 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SEO odkazy na vsechny kluby */}
        <div className="mt-14 border-t border-white/10 pt-8">
          <h3 className="eyebrow">Náramky podle klubu</h3>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {CLUBS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/produkt/naramek-${c.slug}`}
                  className="text-xs text-white/35 transition-colors hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/30">
          <p>© {new Date().getFullYear()} OffsideStore.cz — všechna práva vyhrazena.</p>
          <p>
            Nejsme oficiálním partnerem uvedených klubů. Názvy a barvy slouží k popisu
            varianty produktu.
          </p>
        </div>
      </div>
    </footer>
  );
}
