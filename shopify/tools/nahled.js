/*
 * Nahled motivu bez Shopify.
 *
 * Vykresli skutecne .liquid sekce pres liquidjs nad vymyslenym obchodem,
 * takze co uvidis v prohlizeci, je to same, co jde do zipu. Drive tu byl
 * rucne psany HTML mock, ktery se pokazde rozesel se skutecnym motivem.
 *
 * Pouziti:
 *   node shopify/tools/nahled.js [port]
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const { Liquid } = require("liquidjs");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.argv[2]) || 4320;

/* ---------- Falesny obchod ---------- */

const KLUBY = [
  ["hc-slavia-praha", "HC Slavia Praha", "SPA", "#b01e28", "#340a0e", "#ffffff"],
  ["hc-ocelari-trinec", "HC Oceláři Třinec", "TRI", "#ec0016", "#3d0206", "#ffffff"],
  ["psg-berani-zlin", "PSG Berani Zlín", "ZLN", "#f2c300", "#111111", "#111111"],
  ["bili-tygri-liberec", "Bílí Tygři Liberec", "LIB", "#0b4ea2", "#061d3d", "#ffffff"],
  ["rytiri-kladno", "Rytíři Kladno", "KLA", "#0f9d4f", "#04301a", "#ffffff"],
  ["hc-dynamo-pardubice", "HC Dynamo Pardubice", "PCE", "#ff6b00", "#3d1a00", "#ffffff"],
  ["hc-vitkovice-ridera", "HC Vítkovice Ridera", "VIT", "#3fa9e0", "#0d2d3d", "#ffffff"],
  ["hc-kometa-brno", "HC Kometa Brno", "BRN", "#c0c0c0", "#3a3a3a", "#111111"],
  ["hc-olomouc", "HC Olomouc", "OLO", "#7a4a2b", "#2b1a0f", "#ffffff"],
  ["bk-mlada-boleslav", "BK Mladá Boleslav", "MBL", "#0b4ea2", "#061d3d", "#ffffff"],
  ["mountfield-hk", "Mountfield HK", "HKR", "#111111", "#333333", "#ffffff"],
  ["hc-energie-karlovy-vary", "HC Energie Karlovy Vary", "KVA", "#b01e28", "#340a0e", "#ffffff"],
];

function obrazek(cesta) {
  return {
    src: cesta,
    alt: "",
    width: 1242,
    height: 1656,
    aspect_ratio: 0.75,
    toString: () => cesta,
  };
}

function produkt(i) {
  const [handle, title, abbr, from, to, ink] = KLUBY[i];
  const img = obrazek("/nahled-fotky/p" + ((i % 8) + 1) + ".jpg");
  const varianta = {
    id: 1000 + i,
    title: "Default Title",
    price: 29000,
    available: true,
  };
  return {
    id: 100 + i,
    handle: handle,
    title: title,
    vendor: "OffsideStore",
    url: "/produkt",
    price: 29000,
    price_min: 29000,
    price_varies: false,
    available: true,
    description:
      "<p>Hotový náramek v barvách klubu. Zapletený z originální hokejové " +
      "tkaničky, zakončený raženými písmeny se zkratkou.</p>" +
      "<ul><li>Originální hokejová tkanička</li><li>Ražená kovová písmena</li>" +
      "<li>Ruční kompletace v Česku</li></ul>",
    featured_image: img,
    images: [img],
    variants: [varianta],
    selected_or_first_available_variant: varianta,
    first_available_variant: varianta,
    metafields: {
      custom: {
        club_abbr: abbr,
        club_from: from,
        club_to: to,
        club_ink: ink,
      },
    },
  };
}

const PRODUKTY = KLUBY.map(function (_, i) {
  return produkt(i);
});

const KOLEKCE = {
  id: 1,
  title: "Náramky",
  handle: "naramky",
  url: "/kolekce",
  description: "",
  products: PRODUKTY,
  products_count: PRODUKTY.length,
  all_products_count: PRODUKTY.length,
};

const PRIPLATEK = {
  id: 900,
  title: "Příplatek za znak",
  handle: "priplatek-za-znak",
  price: 1200,
  first_available_variant: { id: 9001, price: 1200, available: true },
};

// all_products["handle"] v Liquidu. Obycejny objekt, ne Proxy — liquidjs
// si klice cte pres bezny pristup a Proxy by mu nemusel sednout.
const VSECHNY_PRODUKTY = {};
// Handle priplatkoveho produktu jde podstrcit promennou, at jde overit
// i zalozni hledani a stav, kdy produkt vubec neexistuje.
// PRIPLATEK_HANDLE=zadny  -> produkt se nenajde
// PRIPLATEK_HANDLE=znak-navic -> najde se az pres zalozni seznam
const HANDLE_PRIPLATKU = process.env.PRIPLATEK_HANDLE || PRIPLATEK.handle;
if (HANDLE_PRIPLATKU !== "zadny") {
  PRIPLATEK.handle = HANDLE_PRIPLATKU;
  VSECHNY_PRODUKTY[HANDLE_PRIPLATKU] = PRIPLATEK;
}
PRODUKTY.forEach(function (p) {
  VSECHNY_PRODUKTY[p.handle] = p;
});

/* ---------- Liquid ---------- */

const engine = new Liquid({
  root: path.join(ROOT, "sections"),
  extname: ".liquid",
});

function koruny(v) {
  if (v === null || v === undefined || v === "") return "";
  return Math.round(Number(v) / 100).toLocaleString("cs-CZ") + " Kč";
}

engine.registerFilter("money", koruny);
engine.registerFilter("money_with_currency", koruny);
engine.registerFilter("money_without_trailing_zeros", koruny);
engine.registerFilter("asset_url", function (v) {
  return "/assets/" + String(v).replace(/^\/+/, "");
});
engine.registerFilter("stylesheet_tag", function (v) {
  return '<link rel="stylesheet" href="' + v + '">';
});
engine.registerFilter("script_tag", function (v) {
  return '<script src="' + v + '"></script>';
});
engine.registerFilter("image_url", function (v) {
  return (v && v.src) || String(v || "");
});
engine.registerFilter("image_tag", function (src) {
  // liquidjs predava pojmenovane argumenty bud jako jeden objekt, nebo
  // jako plochou dvojici klic/hodnota. Zvladneme oboji.
  const args = Array.prototype.slice.call(arguments, 1);
  const a = {};
  for (let i = 0; i < args.length; i += 1) {
    const x = args[i];
    if (x && typeof x === "object" && !Array.isArray(x)) {
      Object.assign(a, x);
    } else if (typeof x === "string" && i + 1 < args.length) {
      a[x] = args[i + 1];
      i += 1;
    }
  }
  const povolene = ["class", "alt", "loading", "sizes", "width", "height", "fetchpriority"];
  const atr = Object.keys(a)
    .filter(function (k) {
      return povolene.indexOf(k) !== -1;
    })
    .map(function (k) {
      return " " + k + '="' + String(a[k]).replace(/"/g, "&quot;") + '"';
    })
    .join("");
  return '<img src="' + src + '"' + atr + ">";
});
engine.registerFilter("json", function (v) {
  return JSON.stringify(v === undefined ? null : v);
});
engine.registerFilter("handleize", function (v) {
  return String(v).toLowerCase().replace(/[^a-z0-9]+/g, "-");
});
engine.registerFilter("divided_by", function (v, d) {
  return Number(v) / Number(d);
});

/* ---------- Sekce ---------- */

function nactiSchema(soubor) {
  const t = fs.readFileSync(path.join(ROOT, "sections", soubor + ".liquid"), "utf8");
  const m = t.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  return m ? JSON.parse(m[1]) : { settings: [], blocks: [] };
}

// Nastaveni ze sablony doplnime o vychozi hodnoty ze schematu, aby se
// nahled choval jako cerstve nahrany motiv.
function slozNastaveni(soubor, zeSablony) {
  const sch = nactiSchema(soubor);
  const out = {};
  (sch.settings || []).forEach(function (s) {
    if (s.id && "default" in s) out[s.id] = s.default;
  });
  return Object.assign(out, zeSablony || {});
}

function slozBloky(soubor, sablona) {
  const sch = nactiSchema(soubor);
  const poradi = sablona.block_order || Object.keys(sablona.blocks || {});
  return poradi.map(function (id) {
    const b = (sablona.blocks || {})[id] || {};
    const def =
      (sch.blocks || []).filter(function (x) {
        return x.type === b.type;
      })[0] || { settings: [] };
    const nast = {};
    (def.settings || []).forEach(function (s) {
      if (s.id && "default" in s) nast[s.id] = s.default;
    });
    return {
      id: id,
      type: b.type,
      settings: Object.assign(nast, b.settings || {}),
      shopify_attributes: "",
    };
  });
}

async function vykresliSekci(soubor, sablona, kontext) {
  const nast = slozNastaveni(soubor, sablona.settings);

  // Vybery, ktere v Shopify vraci objekt, ne retezec.
  if ("collection" in nast || soubor === "offside-kluby" || soubor === "offside-konfigurator") {
    nast.collection = KOLEKCE;
  }
  // Zamerne nechavame prazdne, at nahled overi hledani podle handle.
  if ("addon_product" in nast) nast.addon_product = "";
  if ("related_collection" in nast) nast.related_collection = KOLEKCE;

  // Obrazkove vybery nechavame prazdne, at se pouzije zaloha z assets.
  nast.image = "";
  if ("fallback_image" in nast) nast.fallback_image = "";

  const sekce = {
    id: soubor,
    settings: nast,
    blocks: slozBloky(soubor, sablona),
    index: 1,
  };

  const t = fs
    .readFileSync(path.join(ROOT, "sections", soubor + ".liquid"), "utf8")
    .replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/, "");

  return engine.parseAndRender(t, Object.assign({ section: sekce }, kontext));
}

function obal(telo) {
  return [
    "<!doctype html>",
    '<html lang="cs">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>OffsideStore — náhled</title>",
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;900&display=swap" rel="stylesheet">',
    '<link rel="stylesheet" href="/assets/offside-global.css">',
    '<link rel="stylesheet" href="/assets/offside.css">',
    '<link rel="stylesheet" href="/assets/offside-stranky.css">',
    "<style>",
    "  body { background:#0a0a0a; color:#f5f5f5; font-family:Archivo,system-ui,sans-serif; margin:0; }",
    "  .nahled-lista { position:sticky; top:0; z-index:200; display:flex; gap:18px; align-items:center;",
    "    background:#000; border-bottom:1px solid #222; padding:10px 18px; font-size:14px; }",
    "  .nahled-lista a { color:#bbb; text-decoration:none; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }",
    '  .nahled-lista a:hover { color:#fff; }',
    "  .nahled-lista span { color:#666; margin-left:auto; font-size:13px; letter-spacing:0; text-transform:none; }",
    "</style>",
    "</head>",
    "<body>",
    '<nav class="nahled-lista">',
    '  <a href="/">Domů</a>',
    '  <a href="/produkt">Produkt</a>',
    '  <a href="/kolekce">Kolekce</a>',
    "  <span>Náhled mimo Shopify — košík a pokladna nefungují</span>",
    "</nav>",
    telo,
    '<script src="/assets/offside-konfigurator.js"></script>',
    "</body>",
    "</html>",
  ].join("\n");
}

const SABLONY = { "/": "index", "/produkt": "product", "/kolekce": "collection" };

async function stranka(cesta) {
  const jmeno = SABLONY[cesta];
  const tpl = JSON.parse(fs.readFileSync(path.join(ROOT, "templates", jmeno + ".json"), "utf8"));

  const kontext = {
    routes: { root_url: "/", cart_url: "/kosik", search_url: "/hledat" },
    shop: { name: "OffsideStore", url: "" },
    request: { design_mode: false, page_type: jmeno },
    all_products: VSECHNY_PRODUKTY,
    collection: cesta === "/kolekce" ? KOLEKCE : null,
    product: cesta === "/produkt" ? PRODUKTY[0] : null,
    page: null,
    cart: { item_count: 0 },
  };

  const kusy = [];
  for (const id of tpl.order) {
    const s = tpl.sections[id];
    if (!fs.existsSync(path.join(ROOT, "sections", s.type + ".liquid"))) continue;
    try {
      kusy.push(await vykresliSekci(s.type, s, kontext));
    } catch (e) {
      kusy.push(
        '<pre style="color:#ff6b6b;padding:24px;white-space:pre-wrap">' +
          s.type +
          ": " +
          String(e.message) +
          "</pre>",
      );
      console.error("  chyba v " + s.type + ": " + e.message);
    }
  }
  return obal(kusy.join("\n"));
}

/* ---------- Server ---------- */

const TYPY = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http
  .createServer(async function (req, res) {
    const cesta = decodeURIComponent(req.url.split("?")[0]);

    if (cesta in SABLONY) {
      try {
        const html = await stranka(cesta);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(html);
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("chyba: " + e.stack);
      }
    }

    const soubor = path.join(ROOT, cesta.replace(/^\/+/, ""));
    if (!soubor.startsWith(ROOT) || !fs.existsSync(soubor) || fs.statSync(soubor).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404");
    }
    res.writeHead(200, {
      "Content-Type": TYPY[path.extname(soubor)] || "application/octet-stream",
    });
    fs.createReadStream(soubor).pipe(res);
  })
  .listen(PORT, "127.0.0.1", function () {
    console.log("nahled bezi na http://127.0.0.1:" + PORT);
  });
