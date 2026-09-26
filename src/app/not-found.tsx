import { CtaButton } from "@/components/CtaButton";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[720px] flex-col items-center justify-center px-5 py-32 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">Ofsajd</p>
      <h1 className="display mt-4 text-[16vw] leading-[0.86] md:text-[6rem]">
        Tahle stránka
        <br />
        <span className="text-[var(--accent)]">je za čárou.</span>
      </h1>
      <p className="mt-6 text-white/50">
        Odkaz nikam nevede. Zkus kolekce nebo si rovnou navol vlastní náramek.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <CtaButton href="/kolekce">Zobrazit kolekce</CtaButton>
        <CtaButton href="/konfigurator" variant="outline">
          Do konfigurátoru
        </CtaButton>
      </div>
    </div>
  );
}
