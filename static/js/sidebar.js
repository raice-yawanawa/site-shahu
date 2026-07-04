/* Sidebar móvel + controlador de overlay compartilhado com o carrinho.
   Este arquivo é carregado antes do cart.js e expõe window.ShahuOverlay. */
(function () {
  "use strict";

  var overlayEl = document.querySelector("[data-overlay]");
  var openOwners = new Set();
  var closeCallbacks = [];

  var Overlay = {
    open: function (owner) {
      openOwners.add(owner);
      if (overlayEl) {
        overlayEl.hidden = false;
        requestAnimationFrame(function () { overlayEl.classList.add("is-visible"); });
      }
    },
    close: function (owner) {
      openOwners.delete(owner);
      if (openOwners.size === 0 && overlayEl) {
        overlayEl.classList.remove("is-visible");
        setTimeout(function () { if (openOwners.size === 0) overlayEl.hidden = true; }, 220);
      }
    },
    onClose: function (fn) { closeCallbacks.push(fn); }
  };
  window.ShahuOverlay = Overlay;

  function closeAll() { closeCallbacks.forEach(function (fn) { fn(); }); }
  if (overlayEl) overlayEl.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  // --- Sidebar (gaveta no mobile) ---
  var toggle = document.querySelector("[data-menu-toggle]");
  var sidebar = document.querySelector("[data-sidebar]");
  if (!toggle || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    Overlay.open("sidebar");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    Overlay.close("sidebar");
  }

  toggle.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) closeSidebar();
    else openSidebar();
  });
  Overlay.onClose(closeSidebar);

  // Ao navegar por um link do menu, fecha a gaveta.
  sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeSidebar);
  });
})();
