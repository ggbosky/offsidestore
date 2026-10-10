/* ==========================================================================
   OffsideStore — konfigurator naramku.

   Kresli nahled, pocita cenu a vklada do kosiku pres Shopify Cart API.
   Zadne zavislosti, jeden soubor, bezi na kazde sekci zvlast.

   Naramky jsou univerzalni, takze se zadna velikost nevybira — do kosiku
   jde prvni dostupna varianta vybraneho produktu.

   Znaky nad ramec zakladu se uctuji samostatnou polozkou "priplatek za
   znak" v mnozstvi podle poctu znaku navic. Storefront cenu varianty
   prepsat neumi, takze bez tohoto produktu cenu nad zaklad nelze vybrat
   — pak se znaky navic vubec nenabizeji, aby se soucet v konfiguratoru
   nerozesel s kosikem.
   ========================================================================== */

(function () {
  "use strict";

  var X0 = 70;
  var X1 = 810;
  var CY = 150;
  var SAG = 26;
  var SVG_NS = "http://www.w3.org/2000/svg";

  /** Jeden pramen tkanicky — vlnovka kolem vodici krivky. */
  function pramen(amp, faze) {
    var d = "";
    for (var i = 0; i <= 120; i++) {
      var t = i / 120;
      var x = X0 + (X1 - X0) * t;
      var zuzeni = Math.pow(Math.sin(Math.PI * t), 0.6);
      var y =
        CY +
        SAG * Math.sin(Math.PI * t) +
        amp * zuzeni * Math.sin(2 * Math.PI * 5.5 * t + faze);
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  }

  /** Ztmaveni hex barvy o dany podil (0–1). */
  function ztmav(hex, podil) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#b01e28");
    if (!m) return hex;
    return (
      "#" +
      [1, 2, 3]
        .map(function (i) {
          var c = Math.max(0, Math.round(parseInt(m[i], 16) * (1 - podil)));
          return ("0" + c.toString(16)).slice(-2);
        })
        .join("")
    );
  }

  /**
   * Vrati #000 nebo #fff podle toho, co je na dane barve citelnejsi.
   * Zlute kluby jinak dostaly bily text a nebyly videt.
   */
  function textNaBarve(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    if (!m) return "#ffffff";
    var jas =
      (0.2126 * parseInt(m[1], 16) +
        0.7152 * parseInt(m[2], 16) +
        0.0722 * parseInt(m[3], 16)) / 255;
    return jas > 0.6 ? "#0a0a0a" : "#ffffff";
  }

  function pocetZnaku(text) {
    return (text || "").replace(/\s/g, "").length;
  }

  function ocisti(text) {
    return (text || "").toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 12);
  }

  function sklonujZnaky(n) {
    if (n === 1) return "1 znak";
    if (n < 5) return n + " znaky";
    return n + " znaků";
  }

  function init(root) {
    var dataEl = root.querySelector("[data-os-data]");
    if (!dataEl) return;

    var data;
    try {
      data = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    var mena = data.mena || "Kč";

    // Konfigurator na homepage ma varianty po klubech, produktova stranka
    // jeden seznam. Srovname to na jeden tvar, at zbytek kodu nemusi vedet,
    // odkud data prisla.
    var kluby = data.kluby || [{ nazev: "", varianty: data.varianty || [] }];
    var indexKlubu = 0;

    function varianty() {
      var k = kluby[indexKlubu] || kluby[0] || { varianty: [] };
      return k.varianty || [];
    }

    function penize(halere) {
      return Math.round(halere / 100).toLocaleString("cs-CZ") + " " + mena;
    }

    var stav = {
      klub: "",
      zkratka: "",
      barva: "#b01e28",
      klubovaBarva: "#b01e28",
      krok: 1,
    };

    var el = {
      prameny: root.querySelector("[data-os-prameny]"),
      pismenaSvg: root.querySelector("[data-os-pismena-svg]"),
      vstup: root.querySelector("input[data-os-pismena]"),
      nazevKlubu: root.querySelector("[data-os-nazev-klubu]"),
      souhrnZkratka: root.querySelector("[data-os-souhrn-zkratka]"),
      souhrnBarva: root.querySelector("[data-os-souhrn-barva]"),
      napoveda: root.querySelector("[data-os-napoveda]"),
      radekZnaku: root.querySelector("[data-os-radek-znaku]"),
      popisZnaku: root.querySelector("[data-os-popis-znaku]"),
      cenaZaklad: root.querySelector("[data-os-cena-zaklad]"),
      cenaNavic: root.querySelector("[data-os-cena-navic]"),
      cenaCelkem: root.querySelector("[data-os-cena-celkem]"),
      popisekTlacitka: root.querySelector("[data-os-popisek-tlacitka]"),
      pridat: root.querySelector("[data-os-pridat]"),
      stavText: root.querySelector("[data-os-stav]"),
    };

    var maKluby = root.querySelectorAll("[data-os-klub]").length > 0;

    /* ---------- Nahled ---------- */

    function prekresli() {
      if (el.prameny) {
        el.prameny.innerHTML = "";
        [
          { amp: 15, faze: 0, sirka: 17, stin: 0 },
          { amp: 17, faze: (2 * Math.PI) / 3, sirka: 15.5, stin: 0.22 },
          { amp: 19, faze: (4 * Math.PI) / 3, sirka: 14, stin: 0.38 },
        ].forEach(function (p) {
          var path = document.createElementNS(SVG_NS, "path");
          path.setAttribute("d", pramen(p.amp, p.faze));
          path.setAttribute("stroke", ztmav(stav.barva, p.stin));
          path.setAttribute("stroke-width", String(p.sirka));
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("fill", "none");
          el.prameny.appendChild(path);
        });
      }

      if (!el.pismenaSvg) return;
      el.pismenaSvg.innerHTML = "";

      var znaky = stav.zkratka.split("").slice(0, 12);
      var n = znaky.length || 1;
      var rozestup = Math.min(50, (X1 - X0 - 120) / n);
      var prvniX = (X0 + X1) / 2 - (rozestup * (n - 1)) / 2;

      znaky.forEach(function (znak, i) {
        if (znak === " ") return;
        var x = prvniX + rozestup * i;
        var t = (x - X0) / (X1 - X0);
        var y = CY + SAG * Math.sin(Math.PI * t);

        var g = document.createElementNS(SVG_NS, "g");
        g.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")");

        var rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", "-21");
        rect.setAttribute("y", "-25");
        rect.setAttribute("width", "42");
        rect.setAttribute("height", "50");
        rect.setAttribute("rx", "10");
        rect.setAttribute("fill", "#f2f2f5");
        rect.setAttribute("stroke", "#00000022");

        var text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("x", "0");
        text.setAttribute("y", "9");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "27");
        text.setAttribute("font-weight", "900");
        text.setAttribute("fill", "#0a0a0a");
        text.textContent = znak;

        g.appendChild(rect);
        g.appendChild(text);
        el.pismenaSvg.appendChild(g);
      });
    }

    /* ---------- Varianta ---------- */

    // Univerzalni velikost: bereme prvni variantu, ktera je skladem.
    function vybranaVarianta() {
      var seznam = varianty();
      var skladem = null;
      seznam.forEach(function (v) {
        if (!skladem && v.skladem) skladem = v;
      });
      return skladem || seznam[0] || null;
    }

    /* ---------- Cena ---------- */

    function spocitej() {
      var navic = Math.max(0, pocetZnaku(stav.zkratka) - data.znakyVCene);
      var varianta = vybranaVarianta();
      var zaklad = varianta ? varianta.cena : 0;
      return { navic: navic, zaklad: zaklad, celkem: zaklad + navic * data.cenaZnaku };
    }

    /* ---------- Prekresleni rozhrani ---------- */

    function obnov() {
      prekresli();
      var cena = spocitej();
      var varianta = vybranaVarianta();

      if (el.souhrnZkratka) el.souhrnZkratka.textContent = stav.zkratka || "—";
      if (el.souhrnBarva) el.souhrnBarva.style.background = stav.barva;
      if (el.nazevKlubu) el.nazevKlubu.textContent = stav.klub;

      if (el.napoveda) {
        var pocet = pocetZnaku(stav.zkratka);
        el.napoveda.textContent =
          pocet <= data.znakyVCene
            ? pocet + "/" + data.znakyVCene + " znaků v základní ceně"
            : sklonujZnaky(pocet) + " — " + cena.navic + " nad rámec základu";
      }

      if (el.radekZnaku) {
        el.radekZnaku.hidden = cena.navic === 0;
        if (el.popisZnaku) {
          el.popisZnaku.textContent =
            "Znaky navíc (" + cena.navic + "× " + penize(data.cenaZnaku) + ")";
        }
        if (el.cenaNavic) el.cenaNavic.textContent = "+" + penize(cena.navic * data.cenaZnaku);
      }

      if (el.cenaZaklad) el.cenaZaklad.textContent = penize(cena.zaklad);
      if (el.cenaCelkem) el.cenaCelkem.textContent = penize(cena.celkem);

      var popisek = "Přidat do košíku — " + penize(cena.celkem);
      if (el.popisekTlacitka) el.popisekTlacitka.textContent = popisek;

      if (el.pridat) el.pridat.disabled = !varianta || !varianta.skladem;
    }

    /* ---------- Kroky ---------- */

    function nastavKrok(cislo) {
      var panely = root.querySelectorAll("[data-os-krok]");
      var dostupne = [];
      panely.forEach(function (p) {
        var c = Number(p.getAttribute("data-os-krok"));
        if (c === 1 && !maKluby) return;
        dostupne.push(c);
      });
      if (!dostupne.length) return;

      var nejmensi = Math.min.apply(null, dostupne);
      var nejvetsi = Math.max.apply(null, dostupne);
      stav.krok = Math.max(nejmensi, Math.min(nejvetsi, cislo));
      while (dostupne.indexOf(stav.krok) === -1 && stav.krok < nejvetsi) stav.krok++;

      panely.forEach(function (p) {
        p.hidden = Number(p.getAttribute("data-os-krok")) !== stav.krok;
      });
      root.querySelectorAll("[data-os-krok-tlacitko]").forEach(function (btn) {
        var je = Number(btn.getAttribute("data-os-krok-tlacitko")) === stav.krok;
        btn.setAttribute("aria-selected", je ? "true" : "false");
      });
    }

    /* ---------- Udalosti ---------- */

    function oznacBarvu() {
      root.querySelectorAll("[data-os-barva]").forEach(function (b) {
        b.setAttribute(
          "aria-pressed",
          b.getAttribute("data-os-barva").toLowerCase() === stav.barva.toLowerCase()
            ? "true"
            : "false",
        );
      });
    }

    root.querySelectorAll("[data-os-klub]").forEach(function (tile) {
      tile.addEventListener("click", function () {
        root.querySelectorAll("[data-os-klub]").forEach(function (t) {
          t.setAttribute("aria-pressed", "false");
        });
        tile.setAttribute("aria-pressed", "true");

        indexKlubu = Number(tile.dataset.index || 0);
        stav.klub = tile.dataset.name || "";
        stav.zkratka = ocisti(tile.dataset.abbr || "");
        stav.barva = tile.dataset.lace || stav.barva;
        stav.klubovaBarva = stav.barva;

        var akcent = tile.dataset.accent || "#ec0016";
        root.style.setProperty("--os-accent", akcent);
        root.style.setProperty("--os-on-accent", textNaBarve(akcent));

        if (el.vstup) el.vstup.value = stav.zkratka;
        oznacBarvu();
        obnov();
        nastavKrok(2);
      });
    });

    root.querySelectorAll("[data-os-barva]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        stav.barva = btn.getAttribute("data-os-barva");
        oznacBarvu();
        obnov();
      });
    });

    var reset = root.querySelector("[data-os-barva-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        stav.barva = stav.klubovaBarva;
        oznacBarvu();
        obnov();
      });
    }

    // Strop drzime i v JS, ne jen pres maxlength — vlozeni ze schranky
    // nebo autofill maxlength obchazi.
    var maxZnaku = Number(data.maxZnaku) || data.znakyVCene;
    if (!data.priplatekId) maxZnaku = Math.min(maxZnaku, data.znakyVCene);

    if (el.vstup) {
      el.vstup.addEventListener("input", function () {
        var ocistene = ocisti(el.vstup.value).slice(0, maxZnaku);
        if (el.vstup.value !== ocistene) el.vstup.value = ocistene;
        stav.zkratka = ocistene;
        obnov();
      });
    }

    root.querySelectorAll("[data-os-krok-tlacitko]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        nastavKrok(Number(btn.getAttribute("data-os-krok-tlacitko")));
      });
    });

    var zpet = root.querySelector("[data-os-zpet]");
    var dale = root.querySelector("[data-os-dale]");
    if (zpet) zpet.addEventListener("click", function () { nastavKrok(stav.krok - 1); });
    if (dale) dale.addEventListener("click", function () { nastavKrok(stav.krok + 1); });

    /* ---------- Vlozeni do kosiku ---------- */

    function vlozDoKosiku() {
      var varianta = vybranaVarianta();
      if (!varianta) {
        if (el.stavText) {
          el.stavText.textContent = "Tenhle klub zatím nemá v obchodě produkt. Vyber jiný.";
        }
        return;
      }

      var cena = spocitej();

      // Pojistka: radeji nevlozit nic, nez vlozit levnejsi naramek, nez
      // jaky si zakaznik nakonfiguroval.
      if (cena.navic > 0 && !data.priplatekId) {
        if (el.stavText) {
          el.stavText.textContent =
            "Znaky nad rámec základu teď nejdou objednat. Zkrať nápis na " +
            data.znakyVCene + " znaky, nebo nám napiš.";
        }
        return;
      }

      var vlastnosti = {
        Zkratka: stav.zkratka,
        "Barva tkaničky": stav.barva,
      };
      if (cena.navic > 0) {
        vlastnosti["Znaky navíc"] =
          cena.navic + "× " + penize(data.cenaZnaku) + " (účtováno samostatnou položkou)";
      }

      var polozky = [{ id: varianta.id, quantity: 1, properties: vlastnosti }];

      if (cena.navic > 0 && data.priplatekId) {
        var patriK = stav.klub
          ? stav.klub + " — " + stav.zkratka
          : stav.zkratka;
        polozky.push({
          id: data.priplatekId,
          quantity: cena.navic,
          properties: { "Patří k": patriK },
        });
      }

      if (el.pridat) el.pridat.disabled = true;
      if (el.stavText) el.stavText.textContent = "Přidávám do košíku…";

      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ items: polozky }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("cart");
          return r.json();
        })
        .then(function () {
          if (el.stavText) el.stavText.textContent = "Přidáno do košíku, otevírám ho…";
          setTimeout(function () {
            window.location.href = "/cart";
          }, 600);
        })
        .catch(function () {
          if (el.stavText) {
            el.stavText.textContent = "Nepodařilo se přidat do košíku. Zkus to prosím znovu.";
          }
          if (el.pridat) el.pridat.disabled = false;
        });
    }

    if (el.pridat) el.pridat.addEventListener("click", vlozDoKosiku);

    /* ---------- Start ---------- */

    var prvniDlazdice = root.querySelector("[data-os-klub]");
    if (prvniDlazdice) {
      indexKlubu = Number(prvniDlazdice.dataset.index || 0);
      stav.klub = prvniDlazdice.dataset.name || "";
      stav.zkratka = ocisti(prvniDlazdice.dataset.abbr || "");
      stav.barva = prvniDlazdice.dataset.lace || stav.barva;
    } else {
      // Produktova stranka: klub je dany produktem.
      stav.klub = root.dataset.vychoziKlub || "";
      stav.zkratka = ocisti(root.dataset.vychoziZkratka || "");
      stav.barva = root.dataset.vychoziBarva || stav.barva;
    }
    stav.klubovaBarva = stav.barva;
    if (el.vstup) el.vstup.value = stav.zkratka;

    oznacBarvu();
    nastavKrok(maKluby ? 1 : 2);
    obnov();
  }

  function start() {
    document.querySelectorAll("[data-os-konfigurator]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // Editor motivu sekci prekresluje — po kazde zmene ji nastartujeme znovu.
  document.addEventListener("shopify:section:load", function (e) {
    var root = e.target.querySelector("[data-os-konfigurator]");
    if (root) init(root);
  });
})();
