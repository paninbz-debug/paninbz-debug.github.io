/* ============================================
   LUMO — calculator.js
   Real-time price estimation calculator with modal form
   ============================================ */
(function () {
  'use strict';

  var calc = document.querySelector('.calculator');
  if (!calc) return;

  /* ---------- Price data (TZ April 2026) ---------- */
  var prices = {
    plastic: {
      grill:   { small: 15000, medium: 25000, large: 40000 },
      mirrors: { small: 12000, medium: 18000, large: 25000 },
      molding: { small: 8000,  medium: 15000, large: 22000 },
      overlay: { small: 10000, medium: 18000, large: 28000 },
      moto:    { small: 10000, medium: 16000, large: 25000 },
      small:   { small: 5000,  medium: 8000,  large: null }
    },
    discs: {
      R15: 12000, R16: 13000, R17: 14500, R18: 16000,
      R19: 17500, R20: 19000, R21: 20000, R22: 22000
    },
    antichrome: {
      grill:   9000,
      molding: 6000,
      overlay: 5000,
      small:   3000
    }
  };

  var multipliers = {
    color:      { silver: 1.0, gold: 1.2, blackchrome: 1.3, bronze: 1.25 },
    discType:   { stamped: 1.0, cast: 1.1, forged: 1.2 },
    discsQty:   { 1: 1.0, 2: 1.0, 4: 0.9 },
    discPolish: 500,
    antiPaint:  500
  };

  /* ---------- Helpers ---------- */
  function val(panel, name) {
    var el = panel.querySelector('[name="' + name + '"]:checked') ||
             panel.querySelector('[name="' + name + '"]');
    return el ? el.value : null;
  }

  function qty(panel, name) {
    var el = panel.querySelector('[name="' + name + '"]');
    var n = parseInt(el && el.value, 10);
    return isNaN(n) || n < 1 ? 0 : Math.min(n, 20);
  }

  function roundH(n) {
    return Math.round(n / 100) * 100;
  }

  function fmt(n) {
    return n.toLocaleString('ru-RU');
  }

  /* ---------- Tab switching (desktop) ---------- */
  var tabs = calc.querySelectorAll('.calculator__tab');
  var panels = calc.querySelectorAll('.calculator__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      calc.querySelector('.calculator__panel[data-tab="' + tab.dataset.tab + '"]')
        .classList.add('active');
      update();
    });
  });

  /* ---------- Mobile accordion ---------- */
  calc.querySelectorAll('.calculator__accordion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.calculator__panel');
      var key = panel.dataset.tab;
      var wasActive = panel.classList.contains('active');

      if (!wasActive) {
        panels.forEach(function (p) { p.classList.remove('active'); });
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panel.classList.add('active');
        var matchTab = calc.querySelector('.calculator__tab[data-tab="' + key + '"]');
        if (matchTab) matchTab.classList.add('active');
        update();
      }
    });
  });

  /* ---------- "Мелкие детали" — disable L size ---------- */
  var pType = calc.querySelector('[name="p-type"]');
  var largeOpt = calc.querySelector('.calc-option--large');
  var largeInput = largeOpt ? largeOpt.querySelector('input') : null;

  function syncLargeSize() {
    if (!pType || !largeOpt) return;
    var disabled = pType.value === 'small';
    largeOpt.classList.toggle('disabled', disabled);
    if (largeInput) largeInput.disabled = disabled;
    if (disabled && largeInput && largeInput.checked) {
      var med = calc.querySelector('[name="p-size"][value="medium"]');
      if (med) med.checked = true;
    }
  }

  if (pType) {
    pType.addEventListener('change', function () { syncLargeSize(); update(); });
    syncLargeSize();
  }

  /* ---------- Disc defects notice ---------- */
  var defectsNotice = document.getElementById('defects-notice');
  calc.querySelectorAll('[name="d-cond"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (defectsNotice) defectsNotice.hidden = r.value !== 'defects';
    });
  });

  /* ---------- Calculation functions ---------- */
  function calcPlastic(panel) {
    var type  = val(panel, 'p-type') || 'grill';
    var size  = val(panel, 'p-size') || 'small';
    var q     = qty(panel, 'p-qty');
    var color = val(panel, 'p-color') || 'silver';
    if (q === 0) return null;

    var base = prices.plastic[type];
    if (!base || base[size] === null) return null;

    return base[size] * q * multipliers.color[color];
  }

  function calcDiscs(panel) {
    var dia   = val(panel, 'd-dia') || 'R17';
    var type  = val(panel, 'd-type') || 'stamped';
    var q     = parseInt(val(panel, 'd-qty') || '1', 10);
    var cond  = val(panel, 'd-cond') || 'good';

    var base      = prices.discs[dia];
    var typeMul   = multipliers.discType[type];
    var polish    = cond === 'polish' ? multipliers.discPolish : 0;
    var qtyDisc   = multipliers.discsQty[q] || 1.0;

    return (base * typeMul * q + polish * q) * qtyDisc;
  }

  function calcAnti(panel) {
    var type  = val(panel, 'a-type') || 'grill';
    var paint = val(panel, 'a-paint') || 'matte';
    var q     = qty(panel, 'a-qty');
    if (q === 0) return null;

    var base = prices.antichrome[type];
    var add  = (paint === 'body' || paint === 'ral') ? multipliers.antiPaint : 0;

    return (base * q) + (add * q);
  }

  /* ---------- Update result display ---------- */
  var resultBox = document.getElementById('calc-result');
  var priceEl   = document.getElementById('calc-price');

  function update() {
    var activePanel = calc.querySelector('.calculator__panel.active');
    if (!activePanel) return;

    var key = activePanel.dataset.tab;
    var total;
    if (key === 'plastic')    total = calcPlastic(activePanel);
    else if (key === 'discs') total = calcDiscs(activePanel);
    else                      total = calcAnti(activePanel);

    if (total === null || total <= 0) {
      if (resultBox) resultBox.style.display = 'none';
      return;
    }

    if (resultBox) resultBox.style.display = '';

    var low  = roundH(total * 0.85);
    var high = roundH(total * 1.15);
    if (priceEl) {
      priceEl.innerHTML = 'от <span>' + fmt(low) + '</span> до <span>' + fmt(high) + '</span> \u20BD';
    }
  }

  calc.addEventListener('change', update);
  calc.addEventListener('input', update);
  update();

  /* ---------- Build summary data for modal ---------- */
  var serviceNames = {
    plastic: 'Хромирование пластика',
    discs: 'Хромирование дисков',
    antichrome: 'Антихром'
  };

  var sizeLabels = { small: 'S (до 20 см)', medium: 'M (20–50 см)', large: 'L (50+ см)' };
  var colorLabels = { silver: 'Серебро', gold: 'Золото', blackchrome: 'Чёрный хром', bronze: 'Бронза' };
  var discTypeLabels = { stamped: 'Штампованный', cast: 'Литой', forged: 'Кованый' };
  var condLabels = { good: 'Хорошее', polish: 'Требует полировки', defects: 'Есть дефекты' };

  function selectedText(sel) {
    return sel && sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
  }

  function getSummary() {
    var ap = calc.querySelector('.calculator__panel.active');
    if (!ap) return {};
    var key = ap.dataset.tab;
    var price = priceEl ? priceEl.textContent.trim() : '';
    var data = { service: serviceNames[key] || '', estimate: price };

    if (key === 'plastic') {
      data.detail   = selectedText(ap.querySelector('[name="p-type"]'));
      var sz = val(ap, 'p-size');
      data.size     = sizeLabels[sz] || sz;
      data.quantity = qty(ap, 'p-qty');
      var cl = val(ap, 'p-color');
      data.color    = colorLabels[cl] || cl;
    } else if (key === 'discs') {
      data.detail   = val(ap, 'd-dia');
      var dt = val(ap, 'd-type');
      data.discType = discTypeLabels[dt] || dt;
      data.quantity = parseInt(val(ap, 'd-qty') || '1', 10);
      var cn = val(ap, 'd-cond');
      data.condition = condLabels[cn] || cn;
    } else {
      data.detail   = selectedText(ap.querySelector('[name="a-type"]'));
      data.color    = selectedText(ap.querySelector('[name="a-paint"]'));
      data.quantity = qty(ap, 'a-qty');
    }

    return data;
  }

  /* ---------- Modal ---------- */
  var modal        = document.getElementById('calc-modal');
  var modalSummary = document.getElementById('calc-modal-summary');
  var modalForm    = document.getElementById('calc-modal-form');
  var calcDataIn   = document.getElementById('calc-data-input');
  var ctaBtn       = document.getElementById('calc-cta');

  function openModal() {
    if (!modal) return;
    var data = getSummary();

    // Render summary
    if (modalSummary) {
      var h = '<div class="calc-modal__summary-row"><strong>' + (data.service || '') + '</strong></div>';
      if (data.detail)    h += '<div class="calc-modal__summary-row">Деталь: ' + data.detail + '</div>';
      if (data.size)      h += '<div class="calc-modal__summary-row">Размер: ' + data.size + '</div>';
      if (data.discType)  h += '<div class="calc-modal__summary-row">Тип диска: ' + data.discType + '</div>';
      if (data.quantity)  h += '<div class="calc-modal__summary-row">Количество: ' + data.quantity + '</div>';
      if (data.color)     h += '<div class="calc-modal__summary-row">Цвет: ' + data.color + '</div>';
      if (data.condition) h += '<div class="calc-modal__summary-row">Состояние: ' + data.condition + '</div>';
      if (data.estimate)  h += '<div class="calc-modal__summary-row calc-modal__summary-price">' + data.estimate + '</div>';
      modalSummary.innerHTML = h;
    }

    if (calcDataIn) calcDataIn.value = JSON.stringify(data);

    // Reset form state in case modal was opened before
    var fields = modalForm ? modalForm.querySelector('.calc-modal__fields') : null;
    var success = modalForm ? modalForm.querySelector('.form__success') : null;
    if (fields) fields.style.display = '';
    if (success) success.classList.remove('visible');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.LumoAnalytics) window.LumoAnalytics.track('calc_to_form');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (ctaBtn) ctaBtn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });

  if (modal) {
    var closeBtn = modal.querySelector('.calc-modal__close');
    var overlay  = modal.querySelector('.calc-modal__overlay');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay)  overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  /* ---------- Modal form submit ---------- */
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields  = modalForm.querySelector('.calc-modal__fields');
      var success = modalForm.querySelector('.form__success');
      if (fields && success) {
        fields.style.display = 'none';
        success.classList.add('visible');
      }
      if (window.LumoAnalytics) window.LumoAnalytics.track('form_submit_from_calc');
    });
  }

  /* ---------- Phone mask for modal ---------- */
  if (modal) {
    var ph = modal.querySelector('input[type="tel"]');
    if (ph) {
      ph.addEventListener('input', function (e) {
        var x = e.target.value.replace(/\D/g, '');
        if (x.charAt(0) === '8') x = '7' + x.slice(1);
        if (x.charAt(0) !== '7') x = '7' + x;
        x = x.slice(0, 11);
        var o = '+7';
        if (x.length > 1)  o += ' (' + x.slice(1, 4);
        if (x.length >= 5) o += ') ' + x.slice(4, 7);
        if (x.length >= 8) o += '-' + x.slice(7, 9);
        if (x.length >= 10) o += '-' + x.slice(9, 11);
        e.target.value = o;
      });
    }
  }
})();
