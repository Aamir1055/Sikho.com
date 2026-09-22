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
  /* Use canonical extensionless URLs in internal navigation. */
  document.querySelectorAll('a[href$=".html"], a[href*=".html?"], a[href*=".html#"]').forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
    if (link.hasAttribute("data-preserve-extension") || href.indexOf("hindi.sikhomarket.com/") !== -1) return;
    link.setAttribute("href", href.replace(/\.html(?=[?#]|$)/i, ""));
  });

  /* ---- Mobile menu toggle ---- */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    function closeMenu() {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
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

  /* Keep special booking cards useful after their session date. */
  document.querySelectorAll(".webinar-card[data-landing-url]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      window.location.href = card.getAttribute("data-landing-url");
    });
    card.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      window.location.href = card.getAttribute("data-landing-url");
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
      document.querySelectorAll("[data-tab-panel]:not(.hidden) .schedule-item").forEach(function (item) {
        var text = item.textContent.toLowerCase();
        item.style.display = text.indexOf(q) > -1 ? "" : "none";
      });
    });
  }

  /* ---- Generic demo form handler (subscribe, trainer) ---- */
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
  wireForm("#subscribeForm", "#subscribeStatus", "You're subscribed! We'll notify you when new webinars go live.");
  wireForm("#trainerForm", "#trainerStatus", "Thanks for your interest! Our team will reach out shortly.");

  /* ---- Contact form validation ---- */
  var contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    var contactFields = [
      { id: "fullName", required: true, validate: function (value) {
        if (!value) return "Please enter your full name.";
        if (value.length < 2) return "Please enter at least 2 characters.";
        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) return "Use letters, spaces, apostrophes, or hyphens only.";
        return "";
      } },
      { id: "email", required: true, validate: function (value) {
        if (!value) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email address, such as you@example.com.";
        return "";
      } },
      { id: "phone", required: true, validate: function (value) {
        if (!value) return "Please enter your phone number.";
        var digits = value.replace(/\D/g, "");
        if (!/^[5-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit number starting with 5 to 9.";
        return "";
      } },
      { id: "language", required: true, validate: function (value) {
        return value ? "" : "Please select your preferred language.";
      } },
      { id: "subject", required: true, validate: function (value) {
        return value ? "" : "Please select a subject.";
      } },
      { id: "message", required: true, validate: function (value) {
        if (!value) return "Please tell us how we can help.";
        if (value.length < 10) return "Please enter at least 10 characters.";
        return "";
      } }
    ];

    function contactGroup(field) { return field.closest(".form-group"); }
    function setContactError(field, message) {
      var group = contactGroup(field);
      if (!group) return;
      group.classList.toggle("has-error", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
      var error = group.querySelector(".field-error");
      if (!error) {
        error = document.createElement("span");
        error.className = "field-error";
        error.id = field.id + "Error";
        group.appendChild(error);
      }
      error.textContent = message;
      field.setAttribute("aria-describedby", error.id);
    }
    function validateContactField(config) {
      var field = document.getElementById(config.id);
      if (!field) return true;
      var message = config.validate((field.value || "").trim());
      setContactError(field, message);
      return !message;
    }
    function clearContactStatus() {
      var status = document.querySelector("#formStatus");
      if (status) {
        status.textContent = "We usually respond within one business day.";
        status.style.color = "";
      }
    }

    contactFields.forEach(function (config) {
      var field = document.getElementById(config.id);
      if (!field) return;
      field.addEventListener(field.tagName === "SELECT" ? "change" : "input", function () {
        if (contactGroup(field).classList.contains("has-error")) validateContactField(config);
        clearContactStatus();
      });
      field.addEventListener("blur", function () { validateContactField(config); });
    });

    var contactPhone = document.getElementById("phone");
    var contactName = document.getElementById("fullName");
    contactName.addEventListener("input", function () {
      contactName.value = contactName.value.replace(/[^A-Za-z .'-]/g, "").slice(0, 100);
    });
    contactPhone.addEventListener("input", function () {
      var digits = contactPhone.value.replace(/\D/g, "").slice(0, 10);
      digits = digits.replace(/^[0-4]+/, "");
      contactPhone.value = digits;
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      var valid = true;
      contactFields.forEach(function (config) {
        var fieldValid = validateContactField(config);
        if (!fieldValid && !firstInvalid) firstInvalid = document.getElementById(config.id);
        if (!fieldValid) valid = false;
      });
      if (!valid) {
        var status = document.querySelector("#formStatus");
        if (status) {
          status.textContent = "Please review the highlighted fields before sending.";
          status.style.color = "#dc2626";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var successStatus = document.querySelector("#formStatus");
      if (successStatus) {
        successStatus.textContent = "Thank you! Your message has been received. We'll get back to you soon.";
        successStatus.style.color = "#16a34a";
      }
      contactForm.reset();
      contactFields.forEach(function (config) {
        var field = document.getElementById(config.id);
        if (field) setContactError(field, "");
      });
    });
  }

  /* ---- Contact topic chips set the subject and scroll to the form ---- */
  var topicButtons = document.querySelectorAll(".contact-topics button[data-subject]");
  var subjectSelect = document.querySelector("#subject");
  if (topicButtons.length && subjectSelect) {
    topicButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var subject = btn.getAttribute("data-subject");
        subjectSelect.value = subject;
        topicButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var form = document.querySelector("#contactForm");
        if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  /* ---- Reach statistics count-up ---- */
  var reachStats = document.querySelectorAll(".about-reach [data-count]");
  if (reachStats.length && "IntersectionObserver" in window) {
    var statsStarted = false;
    var countObserver = new IntersectionObserver(function (entries, observer) {
      if (!entries[0].isIntersecting || statsStarted) return;
      statsStarted = true;
      observer.disconnect();
      reachStats.forEach(function (stat) {
        var target = Number(stat.getAttribute("data-count"));
        var suffix = stat.getAttribute("data-suffix") || "";
        var decimals = Number(stat.getAttribute("data-decimals")) || 0;
        var startTime;
        function update(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / 1100, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = target * eased;
          stat.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN")) + suffix;
          if (progress < 1) window.requestAnimationFrame(update);
        }
        window.requestAnimationFrame(update);
      });
    }, { threshold: 0.35 });
    countObserver.observe(reachStats[0].closest(".stats-grid"));
  }

  /* ---- Testimonial carousel ---- */
  var carousel = document.querySelector(".testi-carousel");
  if (carousel) {
    var track = carousel.querySelector(".testi-grid");
    var slides = carousel.querySelectorAll(".testi-card");
    var dots = carousel.querySelector(".testi-dots");
    var previous = carousel.querySelector(".testi-prev");
    var next = carousel.querySelector(".testi-next");
    var currentSlide = 0;
    var timer;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    slides.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show testimonial " + (index + 1));
      dot.addEventListener("click", function () { showSlide(index); });
      dots.appendChild(dot);
    });

    function showSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      var slideWidth = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      track.style.transform = "translateX(-" + (currentSlide * (slideWidth + gap)) + "px)";
      dots.querySelectorAll("button").forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === currentSlide);
      });
    }

    function startRotation() {
      if (!reduceMotion) timer = window.setInterval(function () { showSlide(currentSlide + 1); }, 5000);
    }
    function stopRotation() { window.clearInterval(timer); }

    previous.addEventListener("click", function () { stopRotation(); showSlide(currentSlide - 1); startRotation(); });
    next.addEventListener("click", function () { stopRotation(); showSlide(currentSlide + 1); startRotation(); });
    carousel.addEventListener("mouseenter", stopRotation);
    carousel.addEventListener("mouseleave", startRotation);
    carousel.addEventListener("focusin", stopRotation);
    carousel.addEventListener("focusout", startRotation);
    window.addEventListener("resize", function () { showSlide(currentSlide); });
    showSlide(0);
    startRotation();
  }

  /* ---- Footer year ---- */
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  document.querySelectorAll(".footer-bottom").forEach(function (footerBottom) {
    var siteFooter = footerBottom.closest(".site-footer");
    if (!siteFooter || siteFooter.querySelector(".site-disclaimers")) return;

    siteFooter.querySelectorAll(".footer-col").forEach(function (footerCol) {
      var heading = footerCol.querySelector("h4");
      if (heading && heading.textContent.trim().toLowerCase() === "support") {
        footerCol.classList.add("footer-support");
      }
    });

    var oldDisclaimer = footerBottom.lastElementChild;
    if (oldDisclaimer && oldDisclaimer.tagName === "SPAN") oldDisclaimer.remove();

    var disclaimers = document.createElement("div");
    disclaimers.className = "site-disclaimers footer-disclaimer";
    disclaimers.innerHTML =
      '<span data-i18n="footer.educationalDisclaimer">Educational content only. Nothing here is financial, investment, legal, or tax advice. Markets involve risk, and you are responsible for your own decisions. Consult a qualified professional before investing.</span>' +
      '<span data-i18n="footer.riskDisclaimer">Market investments carry risk and returns are not guaranteed. Do your own research before investing.</span>';
    var footerGrid = siteFooter.querySelector(".footer-grid");
    if (footerGrid) footerGrid.appendChild(disclaimers);
    else footerBottom.parentNode.insertBefore(disclaimers, footerBottom);
  });
  var savedLang = "en";
  try { savedLang = localStorage.getItem("sikho_lang") || "en"; } catch (e) {}
  var dateLocale = savedLang === "en" ? "en-IN" : savedLang;
  var currentDate = new Date();
  var dateFormatter = new Intl.DateTimeFormat(dateLocale, { day: "numeric", month: "long", year: "numeric" });
  var monthYearFormatter = new Intl.DateTimeFormat(dateLocale, { month: "short", year: "numeric" });
  document.querySelectorAll("[data-current-date]").forEach(function (el) {
    el.textContent = dateFormatter.format(currentDate);
  });
  document.querySelectorAll("[data-current-month-year]").forEach(function (el) {
    el.textContent = monthYearFormatter.format(currentDate);
  });

  /* ---- Daily course topic and live event schedule ---- */
/* ---- Daily course topic and live event schedule ---- */

var dailySessions = document.querySelectorAll("[data-daily-session]");

if (dailySessions.length) {

  /*
   * Two 7-day levels, run back-to-back and then repeated: Intermediate
   * (days 1-7) followed by Advance (days 1-7). Sessions are Monday-Friday
   * only, 7:00-8:30 PM IST. Everything below is derived from today's date
   * in India, so the site advances itself every weekday with no manual
   * editing required.
   */
  var COURSE_LEVELS = [
    {
      name: "Intermediate",
      topics: [
        "Correlation Between Entities",
        "Introduction to International Market",
        "Types of Market Sessions",
        "Technical Analysis",
        "Usage of 5 Best Indicators",
        "Introduction to Options Trading",
        "Option Buying Vs Option Selling"
      ],
      subtopics: [
        "How markets, assets and global events are connected.",
        "Global exchanges, major indices, opportunities & risks.",
        "Asian / London / New York (with timings and characteristics).",
        "Trends, patterns and chart-based trading strategies.",
        "Moving Average, RSI, MACD, Bollinger Bands, Volume.",
        "Calls, Puts, contract size, basics.",
        "Strategies, risk, reward and suitability."
      ]
    },
    {
      name: "Advance",
      topics: [
        "Trading Psychology",
        "Sentimental Analysis",
        "Theories of Stock Market",
        "SMC Concept",
        "Option Chain Analysis",
        "Advanced Chart Patterns",
        "Risk Management & Trade Plan"
      ],
      subtopics: [
        "Discipline, emotions, mindset, consistency.",
        "News, social media, global events and market sentiment.",
        "Dow Theory, Efficient Market Hypothesis, Elliott Wave Theory and more.",
        "Market structure, liquidity, order blocks, etc.",
        "Open Interest, PCR, strike selection, market direction.",
        "Harmonic patterns, Fibonacci retracement, price action strategies.",
        "Position sizing, portfolio management, performance review."
      ]
    }
  ];

  /* Intermediate Day 1. Must be a Monday-Friday date. */
  var CAMPAIGN_START = "2026-09-22";

  var indiaDateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date()).reduce(function (parts, item) {
    parts[item.type] = item.value;
    return parts;
  }, {});

  var todayIndia = new Date(
    indiaDateParts.year + "-" +
    indiaDateParts.month + "-" +
    indiaDateParts.day +
    "T00:00:00Z"
  );

  var campaignStart = new Date(CAMPAIGN_START + "T00:00:00Z");

  /* No session on weekends: roll forward to the next Monday's slot. */
  var sessionDate = new Date(todayIndia);
  var todayDay = sessionDate.getUTCDay();
  if (todayDay === 6) sessionDate.setUTCDate(sessionDate.getUTCDate() + 2);
  else if (todayDay === 0) sessionDate.setUTCDate(sessionDate.getUTCDate() + 1);

  /* Count weekdays between campaign start and the session date. */
  var weekdaysElapsed = 0;
  var cursor = new Date(campaignStart);
  while (cursor < sessionDate) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    var cursorDay = cursor.getUTCDay();
    if (cursorDay !== 0 && cursorDay !== 6) weekdaysElapsed++;
  }

  var totalCycleLength = COURSE_LEVELS.reduce(function (sum, lvl) {
    return sum + lvl.topics.length;
  }, 0);
  var cycleIndex = ((weekdaysElapsed % totalCycleLength) + totalCycleLength) % totalCycleLength;

  var levelIndex = 0;
  var dayIndex = cycleIndex;
  for (var i = 0; i < COURSE_LEVELS.length; i++) {
    if (dayIndex < COURSE_LEVELS[i].topics.length) {
      levelIndex = i;
      break;
    }
    dayIndex -= COURSE_LEVELS[i].topics.length;
  }

  var level = COURSE_LEVELS[levelIndex];
  var currentCourseDay = dayIndex + 1;
  var topic = level.topics[dayIndex];
  var subtopicText = level.subtopics[dayIndex];
  var topicLabel = level.name + " · Day " + currentCourseDay;
  var timeLabel = "7:00 PM - 8:30 PM IST";

  var sessionDateTime = sessionDate.toISOString().slice(0, 10) + "T19:00:00+05:30";

  dailySessions.forEach(function (event) {

    var title = event.querySelector("h3");
    var subtopic = event.querySelector(".session-subtopic");
    var badge = event.querySelector(".tag-badge");
    var time = event.querySelector("time");

    if (title) {
      title.textContent = topic;
    }

    if (subtopic) {
      subtopic.textContent = subtopicText;
    }

    if (badge) {
      badge.textContent = topicLabel;
    }

    if (time) {
      time.textContent = timeLabel;
      time.setAttribute("datetime", sessionDateTime);
    }

    event.setAttribute("data-date", sessionDateTime);
  });

  var bookingKicker = document.querySelector(".booking-head .kicker");
  if (bookingKicker) {
    bookingKicker.textContent = "Upcoming Sessions — " + level.name + " Level";
  }
}



  /* ---- Live event dates and upcoming/past schedule ---- */
/* ---- Live event dates and upcoming/past schedule ---- */

var events = document.querySelectorAll("[data-date]");

if (events.length) {

  var now = new Date();

  var locale = savedLang === "en" ? "en-IN" : savedLang;

  var formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });

  events.forEach(function (event) {

    var date = new Date(event.getAttribute("data-date"));

    if (isNaN(date.getTime())) return;

    var formatted = formatter.format(date).replace(",", " ·");

    var time = event.querySelector("time");

    if (time) {
      time.textContent = formatted;
    }

    /*
     * If the event has a landing URL, keep it as an active/upcoming
     * registration event.
     *
     * Other schedule items are moved to Past when their actual
     * date/time has passed.
     */
    event.classList.toggle(
      "event-past",
      date < now && !event.hasAttribute("data-landing-url")
    );
  });

  var upcomingPanel = document.querySelector(
    '[data-tab-panel="upcoming"]'
  );

  var pastPanel = document.querySelector(
    '[data-tab-panel="past"]'
  );

  if (upcomingPanel && pastPanel) {

    Array.prototype.forEach.call(
      document.querySelectorAll(".schedule-item[data-date]"),
      function (event) {

        if (event.classList.contains("event-past")) {
          pastPanel.appendChild(event);
        } else {
          upcomingPanel.appendChild(event);
        }

      }
    );
  }
}
});
