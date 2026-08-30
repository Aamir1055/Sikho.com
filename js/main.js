/* ===================================================================
   Sikho Market — Interactivity
   =================================================================== */

/* Prevent the browser from restoring a previous scroll position so the
   hero is always visible on refresh / hard reload. */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  /* ---- Mobile menu toggle ---- */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---- Language filter pills ---- */
  var langButtons = document.querySelectorAll(".lang-filter button");
  var rows = document.querySelectorAll("[data-lang]");

  function applyLangFilter(lang) {
    langButtons.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-filter") === lang);
    });
    rows.forEach(function (row) {
      var match = lang === "all" || row.getAttribute("data-lang") === lang;
      row.classList.remove("hidden");
      row.classList.toggle("webinar-highlight", lang !== "all" && match);
      row.classList.toggle("webinar-dim", lang !== "all" && !match);
    });
  }

  var webinarsSection = document.querySelector("#webinars");
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-filter");
      applyLangFilter(lang);
      var target = lang !== "all"
        ? document.querySelector('.webinar-card[data-lang="' + lang + '"], tr[data-lang="' + lang + '"]')
        : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (webinarsSection) {
        webinarsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* Apply ?lang= from the URL (e.g. index.html?lang=Hindi#webinars) */
  if (langButtons.length) {
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get("lang");
    if (urlLang) {
      var valid = Array.prototype.some.call(langButtons, function (b) {
        return b.getAttribute("data-filter") === urlLang;
      });
      if (valid) applyLangFilter(urlLang);
    }
  }

  /* ---- Upcoming / Past tabs ---- */
  var tabButtons = document.querySelectorAll(".table-tabs button");
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var target = btn.getAttribute("data-tab");
      document.querySelectorAll("[data-tab-panel]").forEach(function (panel) {
        panel.classList.toggle("hidden", panel.getAttribute("data-tab-panel") !== target);
      });
    });
  });

  /* ---- Table search ---- */
  var searchInput = document.querySelector("#tableSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var q = this.value.toLowerCase();
      document.querySelectorAll("[data-tab-panel]:not(.hidden) tbody tr").forEach(function (tr) {
        var text = tr.textContent.toLowerCase();
        tr.style.display = text.indexOf(q) > -1 ? "" : "none";
      });
    });
  }

  /* ---- Generic demo form handler (contact, subscribe, trainer) ---- */
  function wireForm(formSel, statusSel, message) {
    var f = document.querySelector(formSel);
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = statusSel ? document.querySelector(statusSel) : null;
      if (status) {
        status.textContent = message;
        status.style.color = "#16a34a";
      }
      f.reset();
    });
  }
  wireForm("#contactForm", "#formStatus", "Thank you! Your message has been received. We'll get back to you soon.");
  wireForm("#subscribeForm", "#subscribeStatus", "You're subscribed! We'll notify you when new webinars go live.");
  wireForm("#trainerForm", "#trainerStatus", "Thanks for your interest! Our team will reach out shortly.");

  /* ---- Footer year ---- */
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
