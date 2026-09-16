/* CBI — interactions: nav, contact panel, lightbox, filters, tabs, reveals */
(function () {
  "use strict";

  var backdrop = document.querySelector("[data-backdrop]");
  var sidebar = document.getElementById("sidebar");
  var navToggle = document.querySelector("[data-nav-toggle]");

  /* ---------------------------------------------- mobile nav */
  function closeNav() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("show");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (navToggle && sidebar) {
    navToggle.addEventListener("click", function () {
      var open = sidebar.classList.toggle("open");
      if (backdrop) backdrop.classList.toggle("show", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeNav);

  /* ---------------------------------------------- contact panel */
  var contactPanel = document.getElementById("contact-panel");
  function openContact() {
    if (!contactPanel) return;
    contactPanel.hidden = false;
    document.body.style.overflow = "hidden";
    closeNav();
    var first = contactPanel.querySelector("a, button");
    if (first) first.focus();
  }
  function closeContact() {
    if (!contactPanel) return;
    contactPanel.hidden = true;
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-contact-open]").forEach(function (el) {
    el.addEventListener("click", openContact);
  });
  document.querySelectorAll("[data-contact-close]").forEach(function (el) {
    el.addEventListener("click", closeContact);
  });
  if (contactPanel) {
    contactPanel.addEventListener("click", function (e) {
      if (e.target === contactPanel) closeContact();
    });
  }

  /* ---------------------------------------------- lightbox */
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox ? lightbox.querySelector("img") : null;
  var lbCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
  var galleryItems = [];
  var galleryIndex = 0;

  function collectGallery() {
    galleryItems = Array.prototype.slice.call(
      document.querySelectorAll("[data-lightbox]")
    );
  }
  function showItem(i) {
    if (!galleryItems.length) return;
    galleryIndex = (i + galleryItems.length) % galleryItems.length;
    var el = galleryItems[galleryIndex];
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    var src = el.getAttribute("data-full") || (img && img.getAttribute("src")) || el.getAttribute("src") || "";
    var alt = el.getAttribute("data-caption") || (img && img.getAttribute("alt")) || el.getAttribute("alt") || "";
    if (lbImg) {
      lbImg.src = src;
      lbImg.alt = alt;
    }
    if (lbCaption) lbCaption.textContent = alt;
  }
  function openLightbox(el) {
    if (!lightbox) return;
    collectGallery();
    var idx = galleryItems.indexOf(el);
    showItem(idx >= 0 ? idx : 0);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeNav();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox]");
    if (trigger) {
      e.preventDefault();
      openLightbox(trigger);
      return;
    }
    if (e.target.closest("[data-lightbox-close]")) {
      closeLightbox();
      return;
    }
    if (e.target.closest("[data-lightbox-prev]")) {
      showItem(galleryIndex - 1);
      return;
    }
    if (e.target.closest("[data-lightbox-next]")) {
      showItem(galleryIndex + 1);
      return;
    }
    if (lightbox && !lightbox.hidden && e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      closeContact();
      closeNav();
    }
    if (lightbox && !lightbox.hidden) {
      if (e.key === "ArrowLeft") showItem(galleryIndex - 1);
      if (e.key === "ArrowRight") showItem(galleryIndex + 1);
    }
  });

  /* ---------------------------------------------- equipment filter */
  var pills = document.querySelectorAll(".filter-pill");
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      var tier = pill.getAttribute("data-tier");
      document.querySelectorAll(".equip-card").forEach(function (card) {
        var show = tier === "all" || card.getAttribute("data-tier") === tier;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------------------------------------------- generic tabs */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var btns = group.querySelectorAll(".tab-btn");
    var panels = document.querySelectorAll(
      group.getAttribute("data-tabs-target")
        ? '[data-tab-group="' + group.getAttribute("data-tabs-target") + '"] .tab-panel'
        : ".tab-panel"
    );
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-tab");
        btns.forEach(function (b) { b.classList.toggle("active", b === btn); });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== id;
        });
      });
    });
  });

  /* ---------------------------------------------- reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }
})();
