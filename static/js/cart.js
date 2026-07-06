/* Carrinho de compras 100% client-side.
   Guarda os itens no localStorage e finaliza o pedido abrindo o WhatsApp com uma
   mensagem já montada. Não há backend nem pagamento online. */
(function () {
  "use strict";

  var STORAGE_KEY = "shahu_cart_v1";
  var config = window.SHAHU || { whatsapp: "", brand: "SHAHU RAUTIHU KENEYA", base: "" };
  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  var placeholderImg = (config.base || "") + "/static/img/placeholder.svg";

  // Converte um caminho do site em URL absoluta (para colar na mensagem do WhatsApp).
  function absoluteUrl(u) {
    if (!u) return "";
    if (/^https?:\/\//.test(u)) return u;
    return window.location.origin + u;
  }

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
        madeToOrder: data.madeToOrder === true || data.madeToOrder === "true",
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

  function clear() {
    items = [];
    persistAndRender();
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
    clear: document.querySelector("[data-cart-clear]"),
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
          '<a class="cart-item__media" href="' + it.url + '">' +
            '<img class="cart-item__img" src="' + it.image + '" alt="' + escapeHtml(it.name) + '" ' +
              'onerror="this.src=\'' + placeholderImg + '\'">' +
          '</a>' +
          '<div>' +
            '<div class="cart-item__name"><a href="' + it.url + '">' + escapeHtml(it.name) + '</a></div>' +
            '<div class="cart-item__price">' + priceLabel(it.price) + '</div>' +
            (it.madeToOrder ? '<div class="cart-item__tag">Sob encomenda*</div>' : '') +
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
    if (el.clear) el.clear.hidden = isEmpty;
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
      var tag = it.madeToOrder ? " (sob encomenda*)" : "";
      var link = absoluteUrl(it.url);
      return "• " + it.qty + "x " + it.name + tag + subtotal + (link ? "\n  " + link : "");
    });
    var temEncomenda = items.some(function (it) { return it.madeToOrder; });
    var msg =
      "Olá! Gostaria de fazer um pedido na " + config.brand + ":\n\n" +
      linhas.join("\n") +
      "\n\nTotal: " + brl.format(total()) +
      (hasUnpriced() ? " (+ itens sob consulta)" : "") +
      (temEncomenda
        ? "\n\n*Itens sob encomenda: verificar políticas e condições para adquirir este produto."
        : "");
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
        image: btn.dataset.image,
        madeToOrder: btn.dataset.madeToOrder
      });
      openCart();
    });
  });
  // Botão "Perguntar sobre esta peça" (produtos indisponíveis): mensagem automática.
  document.querySelectorAll("[data-ask-whatsapp]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var nome = btn.dataset.name || "";
      var link = absoluteUrl(btn.dataset.url || "");
      var msg =
        "Olá, tenho interesse na peça " + nome +
        ", por favor, poderia me atualizar sobre próximas produções?" +
        (link ? "\n\n" + link : "");
      window.open(
        "https://wa.me/" + config.whatsapp + "?text=" + encodeURIComponent(msg),
        "_blank",
        "noopener"
      );
    });
  });

  if (el.open) el.open.addEventListener("click", openCart);
  if (el.close) el.close.addEventListener("click", closeCart);
  if (el.checkout) el.checkout.addEventListener("click", checkout);
  if (el.clear) el.clear.addEventListener("click", function () {
    if (items.length && window.confirm("Remover todos os itens do carrinho?")) clear();
  });
  if (window.ShahuOverlay) window.ShahuOverlay.onClose(closeCart);

  render();
})();
