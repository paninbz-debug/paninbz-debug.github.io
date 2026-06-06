/* ============================================
   LUMO — analytics.js
   Thin wrapper around Яндекс.Метрика / GA event goals
   Replace YM_ID with real counter id on deploy
   ============================================ */
(function () {
  'use strict';

  // ← Вставь номер счётчика Яндекс.Метрики (например 99887766). Пока 0 — Метрика не грузится.
  const YM_ID = 0;

  // Инициализация счётчика Яндекс.Метрики (грузится только если задан YM_ID)
  if (YM_ID) {
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) return; }
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(YM_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }

  function track(goal, params) {
    try {
      if (typeof window.ym === 'function' && YM_ID) {
        window.ym(YM_ID, 'reachGoal', goal, params || {});
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', goal, Object.assign({ event_category: 'leads' }, params || {}));
      }
    } catch (_) { /* no-op */ }
  }

  window.LumoAnalytics = { track };

  // Phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => track('phone_click'));
  });

  // Scroll depth: 50% and 90%
  let hit50 = false, hit90 = false;
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    if (total <= 0) return;
    const pct = (window.scrollY / total) * 100;
    if (!hit50 && pct >= 50) { hit50 = true; track('scroll_50'); }
    if (!hit90 && pct >= 90) { hit90 = true; track('scroll_90'); }
  }, { passive: true });
})();
