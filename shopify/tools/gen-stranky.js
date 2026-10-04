/*
 * Vygeneruje HTML obsahovych stranek pro Shopify.
 *
 * Bere texty primo ze src/data/pages.ts, aby web a obchod nemely dve ruzne
 * verze obchodnich podminek. Vystup je jeden soubor, ze ktereho se kazdy
 * blok zkopiruje do Shopify adminu pod Content -> Pages.
 */

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(__dirname, "..", "obsah-stranek.html");

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function blokNaHtml(b) {
  if (b.type === "h") return "<h2>" + escapeHtml(b.text) + "</h2>";
  if (b.type === "p") return "<p>" + escapeHtml(b.text) + "</p>";
  if (b.type === "list") {
    return (
      "<ul>\n" +
      b.items.map((i) => "  <li>" + escapeHtml(i) + "</li>").join("\n") +
      "\n</ul>"
    );
  }
  if (b.type === "table") {
    return (
      "<table>\n  <thead>\n    <tr>" +
      b.head.map((h) => "<th>" + escapeHtml(h) + "</th>").join("") +
      "</tr>\n  </thead>\n  <tbody>\n" +
      b.rows
        .map(
          (r) =>
            "    <tr>" +
            r.map((c) => "<td>" + escapeHtml(c) + "</td>").join("") +
            "</tr>",
        )
        .join("\n") +
      "\n  </tbody>\n</table>"
    );
  }
  if (b.type === "cta") {
    return (
      '<p><a href="' + b.href + '"><strong>' + escapeHtml(b.label) + "</strong></a></p>"
    );
  }
  return "";
}

import(pathToFileURL(path.join(ROOT, "src", "data", "pages.ts")).href).then((mod) => {
  const strany = mod.CONTENT_PAGES;

  const casti = strany.map((p) => {
    const telo = [
      "<p><em>" + escapeHtml(p.lead) + "</em></p>",
      ...p.blocks.map(blokNaHtml),
    ]
      .filter(Boolean)
      .join("\n\n");

    return [
      "<!-- " + "=".repeat(70) + " -->",
      "<!-- STRÁNKA: " + p.title,
      "     Handle (URL): " + p.slug,
      "     V adminu: Content → Pages → Add page, nazvi ji takhle,",
      "     přepni editor na < > (Show HTML) a vlož text níž.",
      "-->",
      "<!-- " + "=".repeat(70) + " -->",
      "",
      telo,
      "",
      "",
    ].join("\n");
  });

  const hlavicka = [
    "<!--",
    "  OffsideStore — obsah stránek pro Shopify",
    "",
    "  Pro každou stránku níž:",
    "  1. Shopify admin → Content → Pages → Add page",
    "  2. Title podle popisku, URL handle podle popisku",
    "  3. V editoru klikni na < > (Show HTML) a vlož příslušný blok",
    "",
    "  Odkazy v patičce už na tyhle adresy vedou, takže až je založíš,",
    "  začnou fungovat samy.",
    "",
    "  Pozor: obchodní podmínky a ochrana osobních údajů jsou pracovní",
    "  verze. Před spuštěním je nech projít právníkem.",
    "-->",
    "",
    "",
  ].join("\n");

  fs.writeFileSync(OUT, hlavicka + casti.join("\n"), "utf8");
  console.log("vygenerovano " + strany.length + " stranek -> " + path.basename(OUT));
  strany.forEach((p) => console.log("  /pages/" + p.slug + " — " + p.title));
});
