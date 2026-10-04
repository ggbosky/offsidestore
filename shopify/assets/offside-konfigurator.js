/* ==========================================================================
   OffsideStore — konfigurator naramku.

   Kresli nahled, pocita cenu a vklada do kosiku pres Shopify Cart API.
   Zadne zavislosti, jeden soubor, bezi na kazde sekci zvlast.
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
    var kanaly = [1, 2, 3].map(function (i) {
      return Math.max(0, Math.round(parseInt(m[i], 16) * (1 - podil)));
    });
    return (
      "#" +
      kanaly
        .map(function (c) {
          return ("0" + c.toString(16)).slice(-2);
        })
        .join("")
    );
  }

  /**
   * Vrati #000 nebo #fff podle toho, co je na dane barve citelnejsi.
   * Zlute a svetle klubove barvy jinak dostaly bily text a nebyly videt.
   */
  function textNaBarve(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    if (!m) return "#ffffff";
    var r = parseInt(m[1], 16),
      g = parseInt(m[2], 16),
      b = parseInt(m[3], 16);
    // Relativni jas podle WCAG, zjednodusene.
    var jas = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
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
    var klubyData = data.kluby || [{ zkratka: "", nazev: "", varianty: data.varianty || [] }];
    var indexKlubu = 0;

    function variantyKlubu() {
      var k = klubyData[indexKlubu] || klubyData[0] || { varianty: [] };
      return k.varianty || [];
    }

    var zakladniCena = variantyKlubu().length ? variantyKlubu()[0].cena : 0;

    function penize(halere) {
      return Math.round(halere / 100).toLocaleString("cs-CZ") + " " + mena;
    }

    var stav = {
      klub: "",
      zkratka: "",
      barva: "#b01e28",
      klubovaBarva: "#b01e28",
      zakonceni: "UNI",
      velikost: "UNI",
      krok: 1,
    };

    var el = {
      prameny: root.querySelector("[data-os-prameny]"),
      pismenaSvg: root.querySelector("[data-os-pismena-svg]"),
      vstup: root.querySelector("input[data-os-pismena]"),
      nazevKlubu: root.querySelector("[data-os-nazev-klubu]"),
      souhrnZkratka: root.querySelector("[data-os-souhrn-zkratka]"),
      souhrnVelikost: root.querySelector("[data-os-souhrn-velikost]"),
      souhrnBarva: root.querySelector("[data-os-souhrn-barva]"),
      napoveda: root.querySelector("[data-os-napoveda]"),
      radekZnaku: root.querySelector("[data-os-radek-znaku]"),
      popisZnaku: root.querySelector("[data-os-popis-znaku]"),
      cenaNavic: root.querySelector("[data-os-cena-navic]"),
      cenaCelkem: root.querySelector("[data-os-cena-celkem]"),
      popisekTlacitka: root.querySelector("[data-os-popisek-tlacitka]"),
      popisekPlovouci: root.querySelector("[data-os-popisek-plovouci]"),
      plovouci: root.querySelector("[data-os-plovouci]"),
      pridat: root.querySelector("[data-os-pridat]"),
      stavText: root.querySelector("[data-os-stav]"),
      velikosti: root.querySelector("[data-os-velikosti]"),
    };

    /* ---------- Vykresleni naramku ---------- */

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

      if (el.pismenaSvg) {
        el.pismenaSvg.innerHTML = "";
        var znaky = stav.zkratka.split("").slice(0, 12);
        var n = znaky.length || 1;
        var rozestup = Math.min(50, (X1 - X0 - 120) / n);
        var prvni = (X0 + X1) / 2 - (rozestup * (n - 1)) / 2;

        znaky.forEach(function (znak, i) {
          if (znak === " ") return;
          var x = prvni + rozestup * i;
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
    }

    /* ---------- Cena ---------- */

    function spocitej() {
      var pocet = pocetZnaku(stav.zkratka);
      var navic = Math.max(0, pocet - data.znakyVCene);
      var varianta = najdiVariantu();
      var zaklad = varianta ? varianta.cena : zakladniCena;
      return {
        navic: navic,
        zaklad: zaklad,
        celkem: zaklad + navic * data.cenaZnaku,
      };
    }

    function najdiVariantu() {
      var seznam = variantyKlubu();
      var hledany = stav.zakonceni === "UNI" ? "UNI" : stav.velikost;
      var nalezena = null;
      seznam.forEach(function (v) {
        if (!nalezena && v.nazev.toUpperCase().indexOf(hledany) !== -1) nalezena = v;
      });
      return nalezena || seznam[0] || null;
    }

    /* ---------- Prekresleni rozhrani ---------- */

    function obnov() {
      prekresli();

      var cena = spocitej();

      if (el.souhrnZkratka) el.souhrnZkratka.textContent = stav.zkratka || "—";
      if (el.souhrnVelikost) {
        el.souhrnVelikost.textContent = stav.zakonceni === "UNI" ? "UNI" : stav.velikost;
      }
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
        if (el.cenaNavic) {
          el.cenaNavic.textContent = "+" + penize(cena.navic * data.cenaZnaku);
        }
      }

      var zakladEl = root.querySelector("[data-os-cena-zaklad]");
      if (zakladEl) zakladEl.textContent = penize(cena.zaklad);
      if (el.cenaCelkem) el.cenaCelkem.textContent = penize(cena.celkem);

      var popisek = "Přidat do košíku — " + penize(cena.celkem);
      if (el.popisekTlacitka) el.popisekTlacitka.textContent = popisek;
      if (el.popisekPlovouci) el.popisekPlovouci.textContent = popisek;

      root.style.setProperty("--os-accent", stav.akcent || root.style.getPropertyValue("--os-accent"));
    }

    /* ---------- Kroky ---------- */

    function nastavKrok(cislo) {
      stav.krok = Math.max(1, Math.min(4, cislo));
      root.querySelectorAll("[data-os-krok]").forEach(function (panel) {
        panel.hidden = Number(panel.getAttribute("data-os-krok")) !== stav.krok;
      });
      root.querySelectorAll("[data-os-krok-tlacitko]").forEach(function (btn) {
        var je = Number(btn.getAttribute("data-os-krok-tlacitko")) === stav.krok;
        btn.setAttribute("aria-selected", je ? "true" : "false");
      });
    }

    /* ---------- Udalosti ---------- */

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
        stav.akcent = tile.dataset.accent;
        root.style.setProperty("--os-accent", stav.akcent);
        root.style.setProperty("--os-on-accent", textNaBarve(stav.akcent));

        if (el.vstup) el.vstup.value = stav.zkratka;
        oznacBarvu();
        obnov();
        nastavKrok(2);
      });
    });

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

    if (el.vstup) {
      el.vstup.addEventListener("input", function () {
        var ocistene = ocisti(el.vstup.value);
        if (el.vstup.value !== ocistene) el.vstup.value = ocistene;
        stav.zkratka = ocistene;
        obnov();
      });
    }

    root.querySelectorAll("[data-os-zakonceni]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        stav.zakonceni = btn.getAttribute("data-os-zakonceni");
        root.querySelectorAll("[data-os-zakonceni]").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        if (el.velikosti) el.velikosti.hidden = stav.zakonceni === "UNI";
        stav.velikost = stav.zakonceni === "UNI" ? "UNI" : stav.velikost || "M";
        obnov();
      });
    });

    root.querySelectorAll("[data-os-velikost]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        stav.velikost = btn.getAttribute("data-os-velikost");
        root.querySelectorAll("[data-os-velikost]").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        obnov();
      });
    });

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
      var varianta = najdiVariantu();
      if (!varianta) {
        if (el.stavText) {
          el.stavText.textContent =
            "Tenhle klub zatím nemá v obchodě produkt. Vyber jiný.";
        }
        return;
      }

      var cena = spocitej();
      var polozky = [
        {
          id: varianta.id,
          quantity: 1,
          properties: {
            Klub: stav.klub,
            Zkratka: stav.zkratka,
            "Barva tkaničky": stav.barva,
            Zakončení: stav.zakonceni === "UNI" ? "Univerzální" : "Na míru",
            Velikost: stav.zakonceni === "UNI" ? "Univerzální" : stav.velikost,
          },
        },
      ];

      if (cena.navic > 0 && data.priplatekId) {
        polozky.push({
          id: data.priplatekId,
          quantity: cena.navic,
          properties: { "Patří k": stav.klub + " — " + stav.zkratka },
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
          if (el.stavText) el.stavText.textContent = "Přidáno do košíku ✓";
          document.dispatchEvent(new CustomEvent("offside:added"));
          // Dawn si kosik osvezi sam, kdyz mu posleme jeho vlastni udalost.
          if (typeof window.publish === "function" && window.PUB_SUB_EVENTS) {
            window.publish(window.PUB_SUB_EVENTS.cartUpdate, { source: "offside" });
          }
          setTimeout(function () {
            window.location.href = "/cart";
          }, 700);
        })
        .catch(function () {
          if (el.stavText) {
            el.stavText.textContent = "Nepodařilo se přidat do košíku. Zkus to prosím znovu.";
          }
          if (el.pridat) el.pridat.disabled = false;
        });
    }

    if (el.pridat) el.pridat.addEventListener("click", vlozDoKosiku);
    if (el.plovouci) {
      el.plovouci.addEventListener("click", function (e) {
        e.preventDefault();
        vlozDoKosiku();
      });
    }

    /* ---------- Start ---------- */

    var prvni = root.querySelector("[data-os-klub]");
    if (prvni) {
      indexKlubu = Number(prvni.dataset.index || 0);
      stav.klub = prvni.dataset.name || "";
      stav.zkratka = ocisti(prvni.dataset.abbr || "");
      stav.barva = prvni.dataset.lace || stav.barva;
      stav.klubovaBarva = stav.barva;
    } else {
      // Produktova stranka nema dlazdice klubu — klub je dany produktem.
      stav.klub = root.dataset.vychoziKlub || "";
      stav.zkratka = ocisti(root.dataset.vychoziZkratka || "");
      stav.barva = root.dataset.vychoziBarva || stav.barva;
      stav.klubovaBarva = stav.barva;
    }
    if (el.vstup) el.vstup.value = stav.zkratka;
    oznacBarvu();
    nastavKrok(prvni ? 1 : 2);
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
