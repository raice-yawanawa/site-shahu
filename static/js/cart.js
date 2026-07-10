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

  // ---------------------------------------------------------------- Tabela de frete
  // Preços estimados (Correios 2024/2025) para origem Rio Branco - AC (CEP 69905-632),
  // peso aproximado de 300 g. Atualizar quando os Correios reajustarem a tabela.
  var FRETE = {
    AC: { pac: 24.10, sedex: 47.20 },
    AM: { pac: 24.10, sedex: 47.20 },
    RO: { pac: 24.10, sedex: 49.80 },
    RR: { pac: 27.50, sedex: 54.80 },
    AP: { pac: 27.50, sedex: 54.80 },
    PA: { pac: 27.50, sedex: 53.10 },
    TO: { pac: 28.30, sedex: 56.40 },
    MA: { pac: 29.20, sedex: 58.20 },
    PI: { pac: 30.10, sedex: 60.10 },
    CE: { pac: 30.80, sedex: 62.30 },
    RN: { pac: 30.80, sedex: 63.50 },
    PB: { pac: 30.80, sedex: 63.50 },
    PE: { pac: 30.80, sedex: 63.50 },
    AL: { pac: 31.20, sedex: 64.20 },
    SE: { pac: 31.20, sedex: 64.20 },
    BA: { pac: 31.50, sedex: 66.80 },
    MT: { pac: 29.80, sedex: 59.20 },
    MS: { pac: 31.20, sedex: 63.40 },
    GO: { pac: 31.20, sedex: 63.40 },
    DF: { pac: 31.20, sedex: 64.10 },
    MG: { pac: 34.50, sedex: 68.20 },
    ES: { pac: 34.50, sedex: 69.50 },
    RJ: { pac: 36.20, sedex: 73.80 },
    SP: { pac: 36.50, sedex: 76.40 },
    PR: { pac: 38.90, sedex: 78.50 },
    SC: { pac: 38.90, sedex: 80.20 },
    RS: { pac: 40.20, sedex: 84.60 }
  };

  // ---------------------------------------------------------------- Estado do frete
  var shipping = { method: null, cost: 0, pacCost: null, sedexCost: null, uf: "", cep: "" };

  function resetShipping() {
    shipping.method = null;
    shipping.cost = 0;
    shipping.pacCost = null;
    shipping.sedexCost = null;
    shipping.uf = "";
    shipping.cep = "";
  }

  // ---------------------------------------------------------------- Itens do carrinho
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
    resetShipping();
    persistAndRender();
  }

  function count() { return items.reduce(function (n, it) { return n + it.qty; }, 0); }

  function itemsTotal() {
    return items.reduce(function (sum, it) {
      return sum + (it.price != null ? it.price * it.qty : 0);
    }, 0);
  }

  function total() { return itemsTotal() + shipping.cost; }

  function hasUnpriced() { return items.some(function (it) { return it.price == null; }); }

  // ---------------------------------------------------------------- Elementos
  var el = {
    drawer: document.querySelector("[data-cart]"),
    list: document.querySelector("[data-cart-items]"),
    empty: document.querySelector("[data-cart-empty]"),
    total: document.querySelector("[data-cart-total]"),
    count: document.querySelector("[data-cart-count]"),
    checkout: document.querySelector("[data-cart-checkout]"),
    clear: document.querySelector("[data-cart-clear]"),
    open: document.querySelector("[data-cart-open]"),
    close: document.querySelector("[data-cart-close]"),
    shippingSection: document.querySelector("[data-shipping]"),
    shippingCepInput: document.querySelector("[data-shipping-cep]"),
    shippingBtn: document.querySelector("[data-shipping-calc]"),
    shippingError: document.querySelector("[data-shipping-error]"),
    shippingOptions: document.querySelector("[data-shipping-options]"),
    shippingLine: document.querySelector("[data-cart-shipping-line]"),
    shippingLabel: document.querySelector("[data-cart-shipping-label]"),
    shippingValue: document.querySelector("[data-cart-shipping-value]")
  };

  function priceLabel(price) { return price == null ? "Sob consulta" : brl.format(price); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------------------------------------------------------------- Render carrinho
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
            '<div class="cart-item__price">' +
              (it.price == null
                ? '<span class="cart-item__consulta">Sob consulta</span>'
                : priceLabel(it.price)) +
            '</div>' +
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
    if (el.shippingSection) el.shippingSection.hidden = isEmpty;

    if (el.total) {
      el.total.textContent = brl.format(total()) + (hasUnpriced() ? " +" : "");
    }

    // Linha de frete selecionado no rodapé
    if (el.shippingLine) {
      if (shipping.method) {
        el.shippingLine.hidden = false;
        if (el.shippingLabel) {
          el.shippingLabel.textContent =
            shipping.method === "pickup" ? "Retirada" :
            shipping.method === "pac"    ? "Frete PAC (est.)" : "Frete SEDEX (est.)";
        }
        if (el.shippingValue) {
          el.shippingValue.textContent =
            shipping.method === "pickup" ? "Grátis" : brl.format(shipping.cost);
        }
      } else {
        el.shippingLine.hidden = true;
      }
    }
  }

  function persistAndRender() { save(items); render(); }

  // ---------------------------------------------------------------- Cálculo de frete
  function formatCep(raw) {
    var digits = raw.replace(/\D/g, "");
    if (digits.length > 5) return digits.slice(0, 5) + "-" + digits.slice(5, 8);
    return digits;
  }

  function showShippingError(msg) {
    if (el.shippingError) { el.shippingError.textContent = msg; el.shippingError.hidden = false; }
    if (el.shippingOptions) el.shippingOptions.hidden = true;
  }

  function clearShippingError() {
    if (el.shippingError) el.shippingError.hidden = true;
  }

  function renderShippingOptions() {
    if (!el.shippingOptions) return;
    el.shippingOptions.innerHTML = "";

    var opts = [
      { id: "pickup", label: "Retirar comigo (a combinar)", price: 0,                  priceLabel: "Grátis" },
      { id: "pac",    label: "PAC",                         price: shipping.pacCost,   priceLabel: brl.format(shipping.pacCost) + " (est.)" },
      { id: "sedex",  label: "SEDEX",                       price: shipping.sedexCost, priceLabel: brl.format(shipping.sedexCost) + " (est.)" }
    ];

    opts.forEach(function (opt) {
      var div = document.createElement("div");
      div.className = "shipping__option" + (shipping.method === opt.id ? " shipping__option--active" : "");
      div.innerHTML =
        '<input class="shipping__radio" type="radio" name="shipping_method" id="sm_' + opt.id + '"' +
          (shipping.method === opt.id ? " checked" : "") + '>' +
        '<label class="shipping__option-label" for="sm_' + opt.id + '">' + escapeHtml(opt.label) + '</label>' +
        '<span class="shipping__option-price">' + opt.priceLabel + '</span>';

      div.addEventListener("click", function () {
        shipping.method = opt.id;
        shipping.cost = opt.price;
        renderShippingOptions();
        render();
      });

      el.shippingOptions.appendChild(div);
    });

    var hint = document.createElement("p");
    hint.className = "shipping__hint";
    hint.textContent = "Estimativa para ~300 g · postado em Rio Branco/AC · Correios 2024/25";
    el.shippingOptions.appendChild(hint);

    el.shippingOptions.hidden = false;
  }

  function estimateShipping() {
    if (!el.shippingCepInput) return;
    var raw = el.shippingCepInput.value.replace(/\D/g, "");
    clearShippingError();

    if (raw.length !== 8) {
      showShippingError("Digite um CEP válido com 8 dígitos.");
      return;
    }

    if (el.shippingBtn) { el.shippingBtn.disabled = true; el.shippingBtn.textContent = "Buscando…"; }

    fetch("https://viacep.com.br/ws/" + raw + "/json/")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (el.shippingBtn) { el.shippingBtn.disabled = false; el.shippingBtn.textContent = "Estimar"; }

        if (data.erro) {
          showShippingError("CEP não encontrado. Verifique e tente novamente.");
          resetShipping();
          render();
          return;
        }

        var uf = (data.uf || "").toUpperCase();
        var tabela = FRETE[uf];
        if (!tabela) {
          showShippingError("Estado não encontrado na tabela de frete.");
          resetShipping();
          render();
          return;
        }

        shipping.uf = uf;
        shipping.cep = raw.slice(0, 5) + "-" + raw.slice(5);
        shipping.pacCost = tabela.pac;
        shipping.sedexCost = tabela.sedex;
        shipping.method = null;
        shipping.cost = 0;

        renderShippingOptions();
        render();
      })
      .catch(function () {
        if (el.shippingBtn) { el.shippingBtn.disabled = false; el.shippingBtn.textContent = "Estimar"; }
        showShippingError("Erro ao consultar o CEP. Verifique sua conexão.");
      });
  }

  // ---------------------------------------------------------------- Abrir/fechar gaveta
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

  // ---------------------------------------------------------------- Checkout via WhatsApp
  function checkout() {
    if (items.length === 0) return;
    var linhas = items.map(function (it) {
      var subtotal = it.price != null ? " — " + brl.format(it.price * it.qty) : " — Sob consulta";
      var tag = it.madeToOrder ? " (sob encomenda*)" : "";
      var link = absoluteUrl(it.url);
      return "• " + it.qty + "x " + it.name + tag + subtotal + (link ? "\n  " + link : "");
    });
    var temEncomenda = items.some(function (it) { return it.madeToOrder; });

    var freteBloco = "";
    if (shipping.method === "pickup") {
      freteBloco = "\n\n🚚 Entrega: Retirada com a artesã (a combinar)";
    } else if (shipping.method === "pac") {
      freteBloco = "\n\n🚚 Previsão de frete: PAC — " + brl.format(shipping.pacCost) +
        " (CEP " + shipping.cep + "/" + shipping.uf + ")";
    } else if (shipping.method === "sedex") {
      freteBloco = "\n\n🚚 Previsão de frete: SEDEX — " + brl.format(shipping.sedexCost) +
        " (CEP " + shipping.cep + "/" + shipping.uf + ")";
    }

    var totalLabel = (shipping.method && shipping.method !== "pickup")
      ? brl.format(itemsTotal()) + (hasUnpriced() ? " +" : "") +
        " + frete " + brl.format(shipping.cost) +
        " = " + brl.format(total()) + (hasUnpriced() ? " +" : "")
      : brl.format(total()) + (hasUnpriced() ? " (+ itens sob consulta)" : "");

    var msg =
      "Olá! Gostaria de fazer um pedido na " + config.brand + ":\n\n" +
      linhas.join("\n") +
      "\n\nTotal dos itens: " + brl.format(itemsTotal()) +
      (hasUnpriced() ? " (+ itens sob consulta)" : "") +
      freteBloco +
      "\nTotal geral: " + totalLabel +
      (hasUnpriced()
        ? "\n\nItens marcados como \"Sob consulta\": o valor será combinado diretamente no atendimento."
        : "") +
      (temEncomenda
        ? "\n\n*Itens sob encomenda: verificar políticas e condições para adquirir este produto."
        : "");

    var url = "https://wa.me/" + config.whatsapp + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  }

  // ---------------------------------------------------------------- Listeners
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

  // Máscara de CEP e botão de estimativa
  if (el.shippingCepInput) {
    el.shippingCepInput.addEventListener("input", function () {
      this.value = formatCep(this.value);
    });
    el.shippingCepInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") estimateShipping();
    });
  }
  if (el.shippingBtn) el.shippingBtn.addEventListener("click", estimateShipping);

  if (window.ShahuOverlay) window.ShahuOverlay.onClose(closeCart);

  render();
})();
