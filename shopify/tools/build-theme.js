/*
 * Sestavi nahratelny Shopify motiv: vezme cistou Dawn, prida nase sekce,
 * styly a fotky, prepne motiv do tmave palety a zabali to do platneho zipu.
 *
 * Pouziti:
 *   node shopify/tools/build-theme.js <slozka-s-dawn> <vystup.zip>
 *
 * Proc vlastni zip: Compress-Archive i .NET ZipFile na Windows zapisuji
 * cesty se zpetnym lomitkem a Shopify takovy archiv odmitne.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const [, , DAWN, OUT] = process.argv;
if (!DAWN || !OUT) {
  console.error("pouziti: node build-theme.js <dawn-slozka> <vystup.zip>");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..");
const PROJECT = path.resolve(ROOT, "..");

function kopiruj(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/* ---------- 1. Nase sekce, styly a skripty ---------- */

let pocet = 0;
for (const slozka of ["sections", "assets"]) {
  const dir = path.join(ROOT, slozka);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (fs.statSync(path.join(dir, f)).isDirectory()) continue;
    kopiruj(path.join(dir, f), path.join(DAWN, slozka, f));
    pocet++;
  }
}
console.log("sekce a assety: " + pocet);

/* ---------- 2. Fotky jako vychozi obrazky ---------- */

const fotky = {
  "hero-beton.jpg": "os-hero.jpg",
  "naramky-beton.jpg": "os-banner.jpg",
  "ruka-puk-slavia.jpg": "os-vznik.jpg",
};
for (const [zdroj, cil] of Object.entries(fotky)) {
  const p = path.join(PROJECT, "public", "foto", zdroj);
  if (fs.existsSync(p)) kopiruj(p, path.join(DAWN, "assets", cil));
}
console.log("fotky: " + Object.keys(fotky).length);

/* ---------- 3. Sablony ---------- */

const tplDir = path.join(ROOT, "templates");
if (fs.existsSync(tplDir)) {
  for (const f of fs.readdirSync(tplDir)) {
    kopiruj(path.join(tplDir, f), path.join(DAWN, "templates", f));
  }
  console.log("sablony: " + fs.readdirSync(tplDir).length);
}

/* ---------- 4. Nase CSS do hlavicky layoutu ---------- */

const layoutPath = path.join(DAWN, "layout", "theme.liquid");
let layout = fs.readFileSync(layoutPath, "utf8");
if (!layout.includes("offside-global.css")) {
  const kotva = "{{ 'base.css' | asset_url | stylesheet_tag }}";
  if (!layout.includes(kotva)) throw new Error("v theme.liquid chybi base.css");

  const odkazy =
    "    {{ 'offside-global.css' | asset_url | stylesheet_tag }}\n" +
    "    {{ 'offside.css' | asset_url | stylesheet_tag }}\n" +
    "    {{ 'offside-stranky.css' | asset_url | stylesheet_tag }}\n";

  // V hlavicce kvuli prvnimu vykresleni, jinak problikne bila.
  layout = layout.replace(kotva, kotva + "\n" + odkazy);

  // A jeste jednou na konci tela. Dawn si styly jednotlivych sekci nacita
  // az v <body>, takze by nase pravidla jinak prebil: vyhrava to, co je
  // v dokumentu pozdeji. Soubor uz prohlizec ma, nestahuje ho znovu.
  if (!layout.includes("</body>")) throw new Error("v theme.liquid chybi </body>");
  layout = layout.replace("</body>", odkazy + "  </body>");

  fs.writeFileSync(layoutPath, layout);
  console.log("theme.liquid: styly pripojeny v hlavicce i na konci tela");
} else {
  console.log("theme.liquid: styly uz pripojeny");
}

/* ---------- 5. Tmava paleta motivu ---------- */

const sdPath = path.join(DAWN, "config", "settings_data.json");
const sd = JSON.parse(fs.readFileSync(sdPath, "utf8"));
const preset = sd.presets[sd.current];

const tmave = {
  background: "#050505",
  background_gradient: "",
  text: "#FFFFFF",
  button: "#EC0016",
  button_label: "#FFFFFF",
  secondary_button_label: "#FFFFFF",
  shadow: "#000000",
};
for (const klic of Object.keys(preset.color_schemes)) {
  preset.color_schemes[klic].settings = Object.assign(
    {},
    preset.color_schemes[klic].settings,
    tmave,
  );
}
preset.page_width = 1400;
preset.buttons_radius = 40;
preset.buttons_border_thickness = 0;
preset.card_color_scheme = preset.card_color_scheme || "scheme-1";
fs.writeFileSync(sdPath, JSON.stringify(sd, null, 2) + "\n");
console.log("paleta: " + Object.keys(preset.color_schemes).length + " schemat na tmavou");

/* ---------- 6. Cestina jako vychozi jazyk motivu ---------- */

/*
 * Dawn ma kompletni cesky preklad, jen jako vychozi jazyk veze anglictinu
 * (soubor s priponou .default). Bez teto zameny by zakaznik videl
 * "YOUR CART", "Continue shopping" a dalsi anglicke texty Dawnu.
 * Prehozeni pripony je zpusob, jakym se vychozi jazyk motivu urcuje.
 */

const locDir = path.join(DAWN, "locales");
const prejmenuj = [
  ["en.default.json", "en.json"],
  ["en.default.schema.json", "en.schema.json"],
  ["cs.json", "cs.default.json"],
  ["cs.schema.json", "cs.default.schema.json"],
];

const chybi = prejmenuj
  .map(([z]) => z)
  .filter((f) => !fs.existsSync(path.join(locDir, f)));
if (chybi.length) throw new Error("v locales chybi: " + chybi.join(", "));

for (const [zdroj, cil] of prejmenuj) {
  fs.renameSync(path.join(locDir, zdroj), path.join(locDir, cil));
}
console.log("jazyk: vychozi je cestina (cs.default.json)");

/* ---------- 7. Zabaleni ---------- */

execFileSync(
  process.execPath,
  [
    path.join(__dirname, "make-zip.js"),
    DAWN,
    OUT,
    "assets",
    "config",
    "layout",
    "locales",
    "sections",
    "snippets",
    "templates",
  ],
  { stdio: "inherit" },
);
