import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTENT_PAGES, getContentPage } from "@/data/pages";
import { CtaButton } from "@/components/CtaButton";
import { Reveal } from "@/components/Reveal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CONTENT_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage(slug);
  if (!page) return { title: "Stránka nenalezena" };
  return {
    title: page.title,
    description: page.lead,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function ContentPageView({ params }: Params) {
  const { slug } = await params;
  const page = getContentPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-[860px] px-5 pb-24 pt-28 md:px-8">
      <Reveal>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 className="display mt-3 text-[11vw] leading-[0.88] md:text-[4.2rem]">
          {page.title}
        </h1>
        <p className="mt-6 text-lg text-white/55">{page.lead}</p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-7">
        {page.blocks.map((block, i) => {
          if (block.type === "h") {
            return (
              <h2
                key={i}
                className="mt-4 text-xl font-black uppercase tracking-tight md:text-2xl"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "p") {
            return (
              <p key={i} className="leading-relaxed text-white/60">
                {block.text}
              </p>
            );
          }
          if (block.type === "list") {
            return (
              <ul key={i} className="flex flex-col gap-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-white/60">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === "table") {
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/15 text-left">
                      {block.head.map((h) => (
                        <th
                          key={h}
                          className="py-3 pr-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join()} className="border-b border-white/8">
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={
                              ci === 0
                                ? "py-3 pr-6 font-bold"
                                : "py-3 pr-6 text-white/60"
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return (
            <div key={i} className="mt-2">
              <CtaButton href={block.href}>{block.label}</CtaButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
