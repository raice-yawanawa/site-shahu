/* Carrinho de compras 100% client-side.
   Guarda os itens no localStorage e finaliza o pedido abrindo o WhatsApp com uma
   mensagem já montada. Não há backend nem pagamento online. */
(function () {
  "use strict";

  var STORAGE_KEY = "shahu_cart_v1";
  var config = window.SHAHU || { whatsapp: "", brand: "SHAHU RAUTIHU KENEYA" };
  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  // --- Estado ---
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function save(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

  var items = load();

  function findIndex(slug) {
    for (var i = 0; i < items.length; i++) { if (items[i].slug === slug) return i; }
    return -1;
  }

  function add(data) {
    var idx = findIndex(data.slug);
    if (idx >= 0) {
      items[idx].qty += 1;
    } else {
      var priceNum = data.price === "" || data.price == null ? null : parseFloat(data.price);
      items.push({
        slug: data.slug,
        name: data.name,
        price: isNaN(priceNum) ? null : priceNum,
        url: data.url || "",
        image: data.image || "",
        qty: 1
      });
    }
    persistAndRender();
  }

  function setQty(slug, qty) {
    var idx = findIndex(slug);
    if (idx < 0) return;
    items[idx].qty = qty;
    if (items[idx].qty <= 0) items.splice(idx, 1);
    persistAndRender();
  }

  function remove(slug) {
    var idx = findIndex(slug);
    if (idx >= 0) { items.splice(idx, 1); persistAndRender(); }
  }

  function count() { return items.reduce(function (n, it) { return n + it.qty; }, 0); }

  function total() {
    return items.reduce(function (sum, it) {
      return sum + (it.price != null ? it.price * it.qty : 0);
    }, 0);
  }
  function hasUnpriced() { return items.some(function (it) { return it.price == null; }); }

  // --- Elementos ---
  var el = {
    drawer: document.querySelector("[data-cart]"),
    list: document.querySelector("[data-cart-items]"),
    empty: document.querySelector("[data-cart-empty]"),
    total: document.querySelector("[data-cart-total]"),
    count: document.querySelector("[data-cart-count]"),
    checkout: document.querySelector("[data-cart-checkout]"),
    open: document.querySelector("[data-cart-open]"),
    close: document.querySelector("[data-cart-close]")
  };

  function priceLabel(price) { return price == null ? "Sob consulta" : brl.format(price); }

  function render() {
    if (el.count) el.count.textContent = count();

    if (el.list) {
      el.list.innerHTML = "";
      items.forEach(function (it) {
        var row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML =
          '<img class="cart-item__img" src="' + it.image + '" alt="" ' +
            'onerror="this.src=\'/static/img/placeholder.svg\'">' +
          '<div>' +
            '<div class="cart-item__name">' + escapeHtml(it.name) + '</div>' +
            '<div class="cart-item__price">' + priceLabel(it.price) + '</div>' +
            '<div class="cart-item__qty">' +
              '<button type="button" data-dec aria-label="Diminuir">−</button>' +
              '<span>' + it.qty + '</span>' +
              '<button type="button" data-inc aria-label="Aumentar">+</button>' +
            '</div>' +
          '</div>' +
          '<button class="cart-item__remove" type="button" data-remove>Remover</button>';
        row.querySelector("[data-inc]").addEventListener("click", function () { setQty(it.slug, it.qty + 1); });
        row.querySelector("[data-dec]").addEventListener("click", function () { setQty(it.slug, it.qty - 1); });
        row.querySelector("[data-remove]").addEventListener("click", function () { remove(it.slug); });
        el.list.appendChild(row);
      });
    }

    var isEmpty = items.length === 0;
    if (el.empty) el.empty.style.display = isEmpty ? "block" : "none";
    if (el.checkout) el.checkout.disabled = isEmpty;
    if (el.total) {
      el.total.textContent = brl.format(total()) + (hasUnpriced() ? " +" : "");
    }
  }

  function persistAndRender() { save(items); render(); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // --- Abrir/fechar gaveta ---
  function openCart() {
    if (!el.drawer) return;
    el.drawer.classList.add("is-open");
    if (window.ShahuOverlay) window.ShahuOverlay.open("cart");
  }
  function closeCart() {
    if (!el.drawer) return;
    el.drawer.classList.remove("is-open");
    if (window.ShahuOverlay) window.ShahuOverlay.close("cart");
  }

  // --- Checkout via WhatsApp ---
  function checkout() {
    if (items.length === 0) return;
    var linhas = items.map(function (it) {
      var subtotal = it.price != null ? " — " + brl.format(it.price * it.qty) : " — Sob consulta";
      return "• " + it.qty + "x " + it.name + subtotal;
    });
    var msg =
      "Olá! Gostaria de fazer um pedido na " + config.brand + ":\n\n" +
      linhas.join("\n") +
      "\n\nTotal: " + brl.format(total()) +
      (hasUnpriced() ? " (+ itens sob consulta)" : "");
    var url = "https://wa.me/" + config.whatsapp + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  }

  // --- Listeners ---
  document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      add({
        slug: btn.dataset.slug,
        name: btn.dataset.name,
        price: btn.dataset.price,
        url: btn.dataset.url,
        image: btn.dataset.image
      });
      openCart();
    });
  });
  if (el.open) el.open.addEventListener("click", openCart);
  if (el.close) el.close.addEventListener("click", closeCart);
  if (el.checkout) el.checkout.addEventListener("click", checkout);
  if (window.ShahuOverlay) window.ShahuOverlay.onClose(closeCart);

  render();
})();
