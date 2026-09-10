/* ===================================================================
   Sikho Market — Learning page gate
  Shows the access form 30s after opening any learning level.
  Once submitted on any level, all learning pages stay unlocked.
   =================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  var content = document.querySelector("#gateContent");
  if (!content) return;

  var course = content.getAttribute("data-course") || "Course";

  /* ---- Build the gate popup + form dynamically (one definition, all pages) ---- */
  var panel = document.createElement("div");
  panel.className = "gate-panel";
  panel.id = "gatePanel";
  panel.innerHTML =
    '<div class="gate-card">' +
      '<div class="gate-head">' +
        '<span class="gate-badge">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>' +
        '</span>' +
        '<div>' +
          '<h3 data-i18n="gate.unlockCourse">Unlock ' + course + ' learning</h3>' +
          '<p data-i18n="gate.registerContinue">Register free to continue learning.</p>' +
        '</div>' +
      '</div>' +
      '<div class="gate-body">' +
        '<form id="gateForm" novalidate>' +
          '<div class="form-group">' +
            '<label for="g-name"><span data-i18n="gate.fullName">Full Name</span><span class="required-mark" aria-hidden="true">*</span></label>' +
            '<input type="text" id="g-name" name="name" data-i18n-ph="gate.fullNamePh" placeholder="Your full name" autocomplete="name" required />' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="g-phone"><span data-i18n="gate.phone">Phone Number</span><span class="required-mark" aria-hidden="true">*</span></label>' +
            '<input type="tel" id="g-phone" name="phone" data-i18n-ph="gate.phonePh" inputmode="numeric" maxlength="10" pattern="[5-9][0-9]{9}" placeholder="10-digit mobile number" autocomplete="tel" required />' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="g-language"><span data-i18n="gate.preferredLanguage">Preferred language</span><span class="required-mark" aria-hidden="true">*</span></label>' +
            '<select id="g-language" name="language" required>' +
              '<option value="" disabled selected data-i18n="gate.selectLanguage">Select your language</option>' +
              '<option value="Tamil">Tamil</option><option value="Telugu">Telugu</option><option value="Kannada">Kannada</option><option value="Malayalam">Malayalam</option>' +
              '<option value="English">English</option><option value="Hindi">Hindi</option><option value="Gujarati">Gujarati</option><option value="Marathi">Marathi</option><option value="Punjabi">Punjabi</option><option value="Other">Other</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="g-exp"><span data-i18n="gate.experience">Experience level</span><span class="required-mark" aria-hidden="true">*</span></label>' +
            '<select id="g-exp" name="experience" required>' +
              '<option value="" disabled selected data-i18n="gate.selectExperience">Select your experience</option>' +
              '<option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Expert">Expert</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="g-market"><span data-i18n="gate.marketPreference">Market preference</span><span class="required-mark" aria-hidden="true">*</span></label>' +
            '<select id="g-market" name="market" required>' +
              '<option value="" disabled selected data-i18n="gate.selectMarket">Select your market</option>' +
              '<option value="Stocks">Stocks</option><option value="Forex">Forex</option><option value="Crypto">Crypto</option>' +
              '<option value="Commodities">Commodities</option><option value="Options">Options</option><option value="Futures">Futures</option>' +
            '</select>' +
          '</div>' +
          '<p class="gate-status" role="status" aria-live="polite"></p>' +
          '<button type="submit" class="btn btn-primary gate-submit" data-i18n="gate.continueLearning">Continue learning</button>' +
        '</form>' +
      '</div>' +
    '</div>';
  /* Start hidden: the user can read the content freely for 30 seconds. */
  panel.classList.add("hidden");
  document.body.appendChild(panel);

  var form = panel.querySelector("#gateForm");
  var COMPLETED_KEY = "sikho_learning_gate_completed";
  var OPEN_KEY = "sikho_learning_gate_open";
  var WEBHOOK_URL = "https://webhooks.integrately.com/a/webhooks/a945859bb59b4a3a98177acbfd1f2f77";
  var submitButton = form.querySelector(".gate-submit");
  var status = form.querySelector(".gate-status");
  var THANKYOU_URL = new URL("tamilwebinar/thankyou.html", window.location.href).href;

  function hasCompletedGate() {
    try { return localStorage.getItem(COMPLETED_KEY) === "true"; } catch (e) { return false; }
  }

  function wasGateOpen() {
    try { return localStorage.getItem(OPEN_KEY) === "true"; } catch (e) { return false; }
  }

  function openGate() {
    if (hasCompletedGate()) return;
    panel.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    try { localStorage.setItem(OPEN_KEY, "true"); } catch (e) {}
    var firstInput = form.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeGate() {
    panel.classList.add("hidden");
    document.body.style.overflow = "";
    try { localStorage.removeItem(OPEN_KEY); } catch (e) {}
  }

  if (wasGateOpen()) openGate();
  else if (!hasCompletedGate()) setTimeout(openGate, 30000);

  /* ---- Numeric-only phone: block non-digits as the user types ---- */
  var phone = form.querySelector("#g-phone");
  phone.addEventListener("keypress", function (e) {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
    if (!phone.value && !/[5-9]/.test(e.key)) e.preventDefault();
  });
  phone.addEventListener("input", function () {
    phone.value = phone.value.replace(/\D/g, "").slice(0, 10).replace(/^[0-4]+/, "");
  });

  var name = form.querySelector("#g-name");
  name.addEventListener("input", function () {
    name.value = name.value.replace(/[^A-Za-z .'-]/g, "").slice(0, 100);
  });

  /* ---- Validation helpers ---- */
  function fieldGroup(el) { return el.closest(".form-group"); }
  function setError(el, message) {
    var group = fieldGroup(el);
    if (!group) return;
    group.classList.add("has-error");
    var msg = group.querySelector(".field-error");
    if (!msg) { msg = document.createElement("span"); msg.className = "field-error"; group.appendChild(msg); }
    msg.textContent = message;
  }
  function clearError(el) {
    var group = fieldGroup(el);
    if (!group) return;
    group.classList.remove("has-error");
    var msg = group.querySelector(".field-error");
    if (msg) msg.textContent = "";
  }
  function validateField(el) {
    var val = (el.value || "").trim();
    var id = el.id;
    if (!val) { setError(el, "This field is required."); return false; }
    if (id === "g-name") {
      if (val.length < 2) { setError(el, "Please enter your full name."); return false; }
      if (!/^[A-Za-z .'-]+$/.test(val)) { setError(el, "Name can only contain letters."); return false; }
    }
    if (id === "g-phone") {
      if (!/^[5-9]\d{9}$/.test(val)) { setError(el, "Enter a valid 10-digit number starting with 5 to 9."); return false; }
    }
    clearError(el);
    return true;
  }

  var fields = Array.prototype.slice.call(
    form.querySelectorAll("#g-name, #g-phone, #g-language, #g-exp, #g-market")
  );
  fields.forEach(function (el) {
    var evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () {
      if (fieldGroup(el).classList.contains("has-error")) validateField(el);
    });
    el.addEventListener("blur", function () { validateField(el); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, firstBad = null;
    fields.forEach(function (el) {
      var valid = validateField(el);
      if (!valid && !firstBad) firstBad = el;
      if (!valid) ok = false;
    });
    if (!ok) { if (firstBad) firstBad.focus(); return; }

    submitButton.disabled = true;
    status.textContent = "Saving your details...";
    status.classList.remove("is-error");

    var pageUrl = new URL(window.location.href);
    var sourceOrigin = pageUrl.origin === "null"
      ? pageUrl.protocol + "//" + (pageUrl.host || "")
      : pageUrl.origin;
    var query = new URLSearchParams(window.location.search || "");
    var payload = {
      course: course,
      name: form.querySelector("#g-name").value.trim(),
      phone: form.querySelector("#g-phone").value.trim(),
      language: form.querySelector("#g-language").value,
      experience: form.querySelector("#g-exp").value,
      market: form.querySelector("#g-market").value,
      termsAccepted: true,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      submittedAtIso: new Date().toISOString(),
      pageUrl: pageUrl.href,
      pageTitle: document.title,
      sourcePage: sourceOrigin,
      sourceHost: pageUrl.hostname,
      landingPath: pageUrl.pathname,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent,
      campaignUrl: pageUrl.href,
      utmSource: (query.get("utm_source") || "").trim(),
      utmMedium: (query.get("utm_medium") || "").trim(),
      utmCampaign: (query.get("utm_campaign") || "").trim(),
      utmTerm: (query.get("utm_term") || "").trim(),
      utmContent: (query.get("utm_content") || "").trim()
    };

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      if (!response.ok) throw new Error("Webhook request failed");
      /* Notify the thank-you URL without navigating away or showing it. */
      fetch(THANKYOU_URL, { method: "GET", mode: "no-cors", cache: "no-store" }).catch(function () {});
      try { localStorage.setItem(COMPLETED_KEY, "true"); } catch (e) {}
      closeGate();
    }).catch(function () {
      submitButton.disabled = false;
      status.textContent = "We could not save your details. Please try again.";
      status.classList.add("is-error");
    });
  });
});

/* ===================================================================
   Tutorial sidebar — scroll-spy + mobile toggle
   =================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.querySelector(".tut-sidebar");
  if (!sidebar) return;

  var links = sidebar.querySelectorAll("a[href^='#']");
  var lessons = document.querySelectorAll(".lesson[id]");

  /* Build a backdrop for the mobile drawer */
  var backdrop = document.createElement("div");
  backdrop.className = "tut-backdrop";
  document.body.appendChild(backdrop);

  /* Build a close (x) button inside the sidebar */
  var closeBtn = document.createElement("button");
  closeBtn.className = "tut-sidebar-close";
  closeBtn.setAttribute("aria-label", "Close topics");
  closeBtn.innerHTML = "&times;";
  sidebar.prepend(closeBtn);

  function openSidebar() {
    sidebar.classList.add("open");
    backdrop.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
  }

  /* Mobile toggle */
  var toggle = document.querySelector(".side-toggle");
  if (toggle) {
    toggle.addEventListener("click", openSidebar);
  }
  closeBtn.addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });
  links.forEach(function (l) {
    l.addEventListener("click", closeSidebar);
  });

  /* Scroll-spy: highlight the topic currently in view */
  function onScroll() {
    var pos = window.scrollY + 140;
    var currentId = null;
    lessons.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });
    links.forEach(function (l) {
      l.classList.toggle("active", l.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
