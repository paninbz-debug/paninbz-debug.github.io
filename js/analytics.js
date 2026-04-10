/* ============================================
   LUMO — analytics.js
   Thin wrapper around Яндекс.Метрика / GA event goals
   Replace YM_ID with real counter id on deploy
   ============================================ */
(function () {
  'use strict';

  const YM_ID = null; // e.g. 12345678 — подставить при деплое

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
