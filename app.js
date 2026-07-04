/* ==========================================================================
   Casa Costa — app.js
   Age gate, crest rendering, full-screen view crossfade router, reveal-on-scroll.
   No dependencies, no build step.
   ========================================================================== */
(function () {
  "use strict";

  var AGE_KEY = "casaCostaAgeVerified";
  var VIEWS = ["home", "house", "reserve", "pairings", "heritage", "membership", "visit"];
  var DEFAULT_VIEW = "home";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Crest — built once as an SVG string, mounted with unique ids per
     instance so <textPath> references never collide across multiple
     mounts on the same page (nav, hero, footer, age gate).
     --------------------------------------------------------------------- */
  var crestCounter = 0;

  function crestSVG(variant) {
    crestCounter += 1;
    var uid = "c" + crestCounter;
    var gradId = "crestGold-" + uid;
    var pathId = "crestPath-" + uid;
    var isFoil = variant === "foil";
    var stroke = isFoil ? "url(#" + gradId + ")" : "currentColor";
    var fill = isFoil ? "url(#" + gradId + ")" : "currentColor";

    return (
      '<svg viewBox="0 0 240 240" class="crest-svg" role="img" aria-hidden="true" focusable="false">' +
        "<defs>" +
          (isFoil
            ? '<linearGradient id="' + gradId + '" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#F3D896"/>' +
                '<stop offset="45%" stop-color="#B8935A"/>' +
                '<stop offset="100%" stop-color="#8A6A38"/>' +
              "</linearGradient>"
            : "") +
          '<path id="' + pathId + '" d="M 54.8,89.6 A 72,72 0 0 1 185.2,89.6" fill="none"/>' +
        "</defs>" +
        '<circle cx="120" cy="120" r="102" fill="none" stroke="' + stroke + '" stroke-width="1.4"/>' +
        '<circle cx="120" cy="120" r="94" fill="none" stroke="' + stroke + '" stroke-width="2.4"/>' +
        '<text font-family="Cinzel, serif" font-size="15" font-weight="600" letter-spacing="3" fill="' + fill + '">' +
          '<textPath href="#' + pathId + '" startOffset="50%" text-anchor="middle">CASA COSTA</textPath>' +
        "</text>" +
        '<path d="M120,98 C111,110 102,122 102,134 C102,147 110,155 120,155 C130,155 138,147 138,134 ' +
          'C138,124 132,115 126,107 C127,117 122,123 118,123 C113,123 111,117 114,110 C116,105 118,101 120,98 Z" ' +
          'fill="' + (isFoil ? fill : "none") + '" stroke="' + stroke + '" stroke-width="' + (isFoil ? 0 : 1.4) + '"/>' +
        '<line x1="76" y1="167" x2="164" y2="167" stroke="' + stroke + '" stroke-width="1"/>' +
        '<text x="120" y="181" font-family="EB Garamond, serif" font-size="8" letter-spacing="2.2" text-anchor="middle" fill="' + fill + '">EST. YBOR LINEAGE</text>' +
        '<text x="120" y="193" font-family="EB Garamond, serif" font-size="7.5" letter-spacing="1.2" text-anchor="middle" fill="' + fill + '">GAINESVILLE, FLORIDA</text>' +
      "</svg>"
    );
  }

  function mountCrests() {
    var nodes = document.querySelectorAll("[data-crest]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var variant = el.getAttribute("data-crest") === "flat" ? "flat" : "foil";
      el.innerHTML = crestSVG(variant);
    }
  }

  /* ---------------------------------------------------------------------
     View router — full-screen crossfade "pages" over a hash URL.
     --------------------------------------------------------------------- */
  var current = null;
  var siteNav = document.getElementById("site-nav");

  function getViewFromHash() {
    var h = (location.hash || "").replace("#", "");
    return VIEWS.indexOf(h) !== -1 ? h : DEFAULT_VIEW;
  }

  function updateNavState(id) {
    var links = document.querySelectorAll(".nav-link");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var isActive = a.getAttribute("data-view") === id;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  }

  function initReveal(viewEl) {
    var targets = viewEl.querySelectorAll(".reveal:not(.reveal--in)");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < targets.length; i++) targets[i].classList.add("reveal--in");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--in");
            io.unobserve(entry.target);
          }
        });
      },
      { root: viewEl, threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  }

  function showView(id, opts) {
    opts = opts || {};
    if (id === current) return;
    var next = document.getElementById("view-" + id);
    if (!next) return;
    var prev = current ? document.getElementById("view-" + current) : null;

    if (prev) {
      prev.classList.add("leaving");
      prev.classList.remove("active");
      if ("inert" in prev) prev.inert = true;
      window.setTimeout(function () {
        prev.classList.remove("leaving");
      }, prefersReduced ? 0 : 650);
    }

    next.classList.add("active");
    if ("inert" in next) next.inert = false;
    next.scrollTop = 0;
    if (siteNav) siteNav.classList.remove("scrolled");

    current = id;
    updateNavState(id);
    if (opts.updateHash !== false) {
      history.pushState(null, "", "#" + id);
    }
    initReveal(next);
    closeMobileNav();
  }

  /* nav link clicks (desktop + mobile share .nav-link) */
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("[data-view]");
    if (!link) return;
    e.preventDefault();
    showView(link.getAttribute("data-view"));
  });

  window.addEventListener("popstate", function () {
    showView(getViewFromHash(), { updateHash: false });
  });

  /* scroll-based nav background — views scroll internally, not <body> */
  function bindScrollShadows() {
    VIEWS.forEach(function (id) {
      var el = document.getElementById("view-" + id);
      if (!el) return;
      el.addEventListener(
        "scroll",
        function () {
          if (!el.classList.contains("active") || !siteNav) return;
          siteNav.classList.toggle("scrolled", el.scrollTop > 40);
        },
        { passive: true }
      );
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav overlay
     --------------------------------------------------------------------- */
  var toggleBtn = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var mobileClose = document.getElementById("mobile-nav-close");

  function openMobileNav() {
    mobileNav.classList.add("open");
    toggleBtn.setAttribute("aria-expanded", "true");
  }
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }
  if (toggleBtn) toggleBtn.addEventListener("click", openMobileNav);
  if (mobileClose) mobileClose.addEventListener("click", closeMobileNav);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  /* ---------------------------------------------------------------------
     Age gate
     --------------------------------------------------------------------- */
  var gate = document.getElementById("age-gate");
  var mainEl = document.getElementById("main-content");
  var booted = false;

  function boot() {
    if (booted) return;
    booted = true;
    mountCrests();
    bindScrollShadows();
    var startView = getViewFromHash();
    showView(startView, { updateHash: false });
    if (startView === DEFAULT_VIEW) showDedication();
  }

  /* ---------------------------------------------------------------------
     Dedication — the opening beat. Fades in over the home view on entry,
     dismissed by the reader. Only appears when landing on home.
     --------------------------------------------------------------------- */
  var dedication = document.getElementById("dedication");
  var dedEnter = document.getElementById("ded-enter");
  var dedDismissed = false;

  function dismissDedication() {
    if (!dedication || dedDismissed) return;
    dedDismissed = true;
    dedication.classList.remove("visible");
    dedication.classList.add("dismissing");
    if (mainEl && "inert" in mainEl) mainEl.inert = false;
    if (siteNav && "inert" in siteNav) siteNav.inert = false;
    window.setTimeout(function () {
      dedication.setAttribute("hidden", "hidden");
    }, prefersReduced ? 0 : 1500);
  }

  function showDedication() {
    if (!dedication) return;
    dedication.removeAttribute("hidden");
    if (mainEl && "inert" in mainEl) mainEl.inert = true;
    if (siteNav && "inert" in siteNav) siteNav.inert = true;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        dedication.classList.add("visible");
      });
    });
    if (dedEnter) dedEnter.addEventListener("click", dismissDedication);
    dedication.addEventListener("click", function (e) {
      if (e.target === dedication) dismissDedication();
    });
    document.addEventListener("keydown", function (e) {
      if (!dedDismissed && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) {
        dismissDedication();
      }
    });
  }

  function resolveGate() {
    var verified = false;
    try {
      verified = localStorage.getItem(AGE_KEY) === "true";
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — fall through to gate */
    }
    if (verified) {
      gate.setAttribute("hidden", "hidden");
      if ("inert" in mainEl) mainEl.inert = false;
      if (siteNav && "inert" in siteNav) siteNav.inert = false;
      boot();
    } else {
      if ("inert" in mainEl) mainEl.inert = true;
      if (siteNav && "inert" in siteNav) siteNav.inert = true;
    }
  }

  var gateEnter = document.getElementById("gate-enter");
  var gateLeave = document.getElementById("gate-leave");

  if (gateEnter) {
    gateEnter.addEventListener("click", function () {
      try {
        localStorage.setItem(AGE_KEY, "true");
      } catch (e) {
        /* ignore — gate simply reappears next visit */
      }
      gate.classList.add("hidden");
      if ("inert" in mainEl) mainEl.inert = false;
      if (siteNav && "inert" in siteNav) siteNav.inert = false;
      window.setTimeout(
        function () {
          gate.setAttribute("hidden", "hidden");
        },
        prefersReduced ? 0 : 700
      );
      boot();
    });
  }

  if (gateLeave) {
    gateLeave.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  /* ---------------------------------------------------------------------
     Visit page — decorative inquiry button (no real submission)
     --------------------------------------------------------------------- */
  var inquiryBtn = document.getElementById("inquiry-btn");
  var inquiryNote = document.getElementById("inquiry-note");
  if (inquiryBtn && inquiryNote) {
    inquiryBtn.addEventListener("click", function () {
      inquiryNote.textContent = "Thank you — we'll be in touch when the room is ready.";
    });
  }

  /* init gate immediately (nav + main are inert until resolved) */
  if ("inert" in mainEl) mainEl.inert = true;
  resolveGate();
})();
