(function () {
  var root = document.documentElement;

  function currentLang() {
    return root.getAttribute("data-lang") === "zh" ? "zh" : "en";
  }

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    root.lang = lang === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem("jr-lang", lang);
    } catch (err) {}
    var enTitle = document.body.getAttribute("data-title-en");
    var zhTitle = document.body.getAttribute("data-title-zh");
    if (enTitle && zhTitle) document.title = lang === "zh" ? zhTitle : enTitle;
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-set-lang"));
    });
  });
  applyLang(currentLang());

  var toggle = document.querySelector(".nav-toggle");
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNav(false);
  });
  var nav = document.getElementById("site-nav");
  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
  }

  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 4);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy"));
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(area);
    });
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      copyText(btn.getAttribute("data-copy")).then(function () {
        btn.classList.add("is-copied");
        window.setTimeout(function () { btn.classList.remove("is-copied"); }, 1600);
      }).catch(function () {});
    });
  });

  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    filterBar.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-filter]");
      if (!btn) return;
      var key = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("[data-filter]").forEach(function (item) {
        item.setAttribute("aria-pressed", item === btn ? "true" : "false");
      });
      document.querySelectorAll("[data-group]").forEach(function (row) {
        row.hidden = key !== "all" && row.getAttribute("data-group") !== key;
      });
    });
  }

  var params = new URLSearchParams(window.location.search);
  var item = params.get("item");
  var select = document.getElementById("product");
  var products = { shell: 1, lining: 1, interlining: 1, zipper: 1, tape: 1, visor: 1 };
  if (select && item && products[item]) select.value = item;

  var form = document.getElementById("inquiry");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var company = String(data.get("company") || "").trim();
      var country = String(data.get("country") || "").trim();
      var product = String(data.get("product") || "").trim();
      var message = String(data.get("message") || "").trim();
      var error = document.getElementById("form-error");
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !message) {
        if (error) error.hidden = false;
        return;
      }
      if (error) error.hidden = true;
      var names = {
        shell: "Shell fabrics / 面料",
        lining: "Lining fabrics / 里布",
        interlining: "Interlinings / 衬布",
        zipper: "Zippers / 拉链",
        tape: "Reflective tapes / 反光带",
        visor: "Visors / 帽檐"
      };
      var body = [
        "Name: " + name,
        "Email: " + email,
        "Company: " + (company || "-"),
        "Country: " + (country || "-"),
        "Product: " + (names[product] || product || "General"),
        "",
        message
      ].join("\n");
      var note = document.getElementById("form-sent");
      if (note) note.hidden = false;
      window.location.href = "mailto:ningbojrexport@hotmail.com?subject="
        + encodeURIComponent("Website inquiry - " + name)
        + "&body=" + encodeURIComponent(body);
    });
  }
})();
