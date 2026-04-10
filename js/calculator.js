/* ============================================
   LUMO — calculator.js
   Real-time price estimation based on TZ + market data (April 2025)
   ============================================ */
(function () {
  'use strict';

  const calc = document.querySelector('.calculator');
  if (!calc) return;

  // Tabs
  const tabs = calc.querySelectorAll('.calculator__tab');
  const panels = calc.querySelectorAll('.calculator__panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.tab;
      calc.querySelector(`.calculator__panel[data-tab="${key}"]`).classList.add('active');
      calcUpdate();
    });
  });

  // Price data — ranges from market analysis (Приложение Г.3)
  const prices = {
    plastic: {
      grill:    [4500, 12000],
      mirror:   [3000, 6000],
      molding:  [2000, 4000],
      overlay:  [1500, 3000],
      emblem:   [1500, 3000],
      handle:   [1500, 3500],
      bumper:   [6000, 15000],
      moto:     [2500, 8000],
      other:    [2000, 6000]
    },
    discs: {
      R15: [5000, 6500],
      R16: [5500, 7000],
      R17: [6500, 8500],
      R18: [7000, 9000],
      R19: [8500, 10500],
      R20: [9000, 11000],
      R21: [10500, 13000],
      R22: [11500, 14000]
    },
    antichrome: {
      grill:   [4000, 8000],
      molding: [2500, 5000],
      overlay: [2000, 4500],
      frame:   [2500, 5500],
      other:   [2500, 6000]
    }
  };

  // Size multipliers for plastic
  const sizeMul = { small: 0.8, medium: 1.0, large: 1.25 };
  // Chrome color multipliers
  const colorMul = { silver: 1.0, gold: 1.2, black: 1.3, bronze: 1.25 };
  // Disc construction
  const discTypeMul = { stamp: 1.0, cast: 1.1, forged: 1.2 };
  // Antihrom paint mode
  const paintAdd = { matte: 0, gloss: 0, body: 500, ral: 300 };

  function getInput(panel, name) {
    const el = panel.querySelector(`[name="${name}"]:checked`) || panel.querySelector(`[name="${name}"]`);
    return el ? el.value : null;
  }
  function getQty(panel, name) {
    const el = panel.querySelector(`[name="${name}"]`);
    const n = parseInt(el && el.value, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, 20);
  }
  function fmt(n) { return Math.round(n).toLocaleString('ru-RU') + ' ₽'; }

  function calcPlastic(panel) {
    const type = getInput(panel, 'p-type') || 'grill';
    const size = getInput(panel, 'p-size') || 'medium';
    const qty  = getQty(panel, 'p-qty');
    const color = getInput(panel, 'p-color') || 'silver';
    const base = prices.plastic[type];
    const mul = sizeMul[size] * colorMul[color] * qty;
    return [base[0] * mul, base[1] * mul];
  }

  function calcDiscs(panel) {
    const dia = getInput(panel, 'd-dia') || 'R17';
    const type = getInput(panel, 'd-type') || 'cast';
    const qty = parseInt(getInput(panel, 'd-qty') || '1', 10);
    const polish = (getInput(panel, 'd-cond') === 'polish') ? 500 : 0;
    const base = prices.discs[dia];
    const typeK = discTypeMul[type];
    let lo = (base[0] * typeK + polish) * qty;
    let hi = (base[1] * typeK + polish) * qty;
    if (qty === 4) { lo *= 0.9; hi *= 0.9; }
    return [lo, hi];
  }

  function calcAnti(panel) {
    const type = getInput(panel, 'a-type') || 'grill';
    const paint = getInput(panel, 'a-paint') || 'matte';
    const qty = getQty(panel, 'a-qty');
    const base = prices.antichrome[type];
    const add = paintAdd[paint];
    return [(base[0] + add) * qty, (base[1] + add) * qty];
  }

  function calcUpdate() {
    const activePanel = calc.querySelector('.calculator__panel.active');
    if (!activePanel) return;
    const key = activePanel.dataset.tab;
    let range;
    if (key === 'plastic') range = calcPlastic(activePanel);
    else if (key === 'discs') range = calcDiscs(activePanel);
    else range = calcAnti(activePanel);

    const out = calc.querySelector('.calc-result__price');
    if (out) {
      out.innerHTML = `от <span>${fmt(range[0])}</span> до <span>${fmt(range[1])}</span>`;
    }
  }

  calc.addEventListener('change', calcUpdate);
  calc.addEventListener('input', calcUpdate);
  calcUpdate();

  // "Get exact calculation" — scroll to form and prefill service
  const requestBtn = calc.querySelector('.calc-result__cta');
  if (requestBtn) {
    requestBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const active = calc.querySelector('.calculator__tab.active');
      const map = { plastic: 'Хромирование пластика', discs: 'Хромирование дисков', antichrome: 'Антихром' };
      const service = active ? map[active.dataset.tab] : '';
      const form = document.querySelector('#lead-form');
      if (form) {
        const sel = form.querySelector('select[name="service"]');
        if (sel && service) sel.value = service;
        const price = calc.querySelector('.calc-result__price').textContent.trim();
        const comment = form.querySelector('textarea[name="comment"]');
        if (comment) comment.value = `Расчёт калькулятора: ${price}`;
        const top = form.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      if (window.LumoAnalytics) window.LumoAnalytics.track('calculator_complete');
    });
  }
})();
