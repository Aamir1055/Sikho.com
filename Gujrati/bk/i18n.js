(function () {
  var STORAGE_KEY = "sikho_lang";
  var LANGUAGES = [
    ["en", "English"],
    ["hi", "Hindi (हिंदी)"],
    ["ta", "Tamil (தமிழ்)"],
    ["te", "Telugu (తెలుగు)"],
    ["kn", "Kannada (ಕನ್ನಡ)"],
    ["gu", "Gujarati (ગુજરાતી)"]
  ];

  function getLanguage() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return LANGUAGES.some(function (language) { return language[0] === value; }) ? value : "hi";
    } catch (error) {
      return "hi";
    }
  }

  function setGoogleCookie(language) {
    var value = language === "en" ? "/en/en" : "/en/" + language;
    document.cookie = "googtrans=" + value + ";path=/";
    document.cookie = "googtrans=" + value + ";path=/;domain=" + window.location.hostname;
  }

  function selectGoogleLanguage(language, attempt) {
    var select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = language;
      select.dispatchEvent(new Event("change"));
      return;
    }
    if (attempt < 24) {
      window.setTimeout(function () { selectGoogleLanguage(language, attempt + 1); }, 250);
    }
  }

  function initGoogleTranslate(language) {
    var mount = document.getElementById("google_translate_element");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "google_translate_element";
      mount.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
      document.body.appendChild(mount);
    }

    window.googleTranslateElementInit = function () {
      var TranslateElement = window.google && window.google.translate && window.google.translate.TranslateElement;
      if (mount.dataset.initialized || typeof TranslateElement !== "function") return;
      try {
        new TranslateElement({
          pageLanguage: "en",
          includedLanguages: "hi,ta,te,kn,gu",
          autoDisplay: false
        }, "google_translate_element");
        mount.dataset.initialized = "true";
        selectGoogleLanguage(language, 0);
      } catch (error) {
        window.setTimeout(window.googleTranslateElementInit, 500);
      }
    };

    var script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onload = function () { window.setTimeout(window.googleTranslateElementInit, 0); };
    document.head.appendChild(script);
  }

  function createLanguageMenu(language) {
    var topbar = document.querySelector(".navbar .topbar");
    if (!topbar || document.querySelector(".sikho-language-switch")) return;

    var switcher = document.createElement("div");
    switcher.className = "sikho-language-switch";
    switcher.innerHTML =
      '<button type="button" class="sikho-language-toggle" aria-expanded="false">' +
        '<span aria-hidden="true">◎</span><span class="sikho-language-current"></span><span aria-hidden="true">⌄</span>' +
      '</button>' +
      '<div class="sikho-language-menu" role="menu"></div>';
    topbar.appendChild(switcher);

    var current = switcher.querySelector(".sikho-language-current");
    var menu = switcher.querySelector(".sikho-language-menu");
    current.textContent = LANGUAGES.find(function (item) { return item[0] === language; })[1];
    LANGUAGES.forEach(function (item) {
      var option = document.createElement("button");
      option.type = "button";
      option.className = item[0] === language ? "active" : "";
      option.textContent = item[1];
      option.setAttribute("role", "menuitem");
      option.addEventListener("click", function () {
        try { localStorage.setItem(STORAGE_KEY, item[0]); } catch (error) {}
        setGoogleCookie(item[0]);
        window.location.reload();
      });
      menu.appendChild(option);
    });

    switcher.querySelector(".sikho-language-toggle").addEventListener("click", function (event) {
      event.stopPropagation();
      var open = switcher.classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function () { switcher.classList.remove("open"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var style = document.createElement("style");
    style.textContent =
      ".goog-te-banner-frame,.goog-te-banner-frame.skiptranslate,body>.skiptranslate,body>.skiptranslate iframe,.goog-te-balloon-frame,.goog-te-gadget{display:none!important;}" +
      "html body{top:0!important;position:static!important;}" +
      ".sikho-language-switch{position:relative;margin-left:auto;z-index:100;}" +
      ".sikho-language-toggle{display:flex;align-items:center;gap:7px;border:1px solid rgba(37,99,235,.3);border-radius:999px;padding:8px 12px;background:#eff6ff;color:#12315f;font:600 13px Inter,sans-serif;cursor:pointer;}" +
      ".sikho-language-menu{position:absolute;right:0;top:calc(100% + 8px);display:grid;min-width:178px;padding:7px;background:#fff;border:1px solid #dbe5f2;border-radius:12px;box-shadow:0 14px 30px rgba(15,23,42,.16);opacity:0;visibility:hidden;transform:translateY(-5px);transition:.18s ease;}" +
      ".sikho-language-switch.open .sikho-language-menu{opacity:1;visibility:visible;transform:translateY(0);}" +
      ".sikho-language-menu button{border:0;border-radius:8px;padding:10px;text-align:left;background:transparent;color:#334155;font:500 14px Inter,sans-serif;cursor:pointer;}" +
      ".sikho-language-menu button:hover,.sikho-language-menu button.active{background:#1d3b87;color:#fff;}" +
      "@media(max-width:480px){.sikho-language-toggle{padding:7px 9px;font-size:12px;}.sikho-language-menu{right:-4px;}}";
    document.head.appendChild(style);

    var language = getLanguage();
    setGoogleCookie(language);
    createLanguageMenu(language);
    if (language !== "en") initGoogleTranslate(language);
  });
})();
