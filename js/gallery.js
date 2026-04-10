/* ============================================
   LUMO — gallery.js
   Before/after comparison sliders + category filters
   ============================================ */
(function () {
  'use strict';

  // ---- Before/After drag slider ----
  document.querySelectorAll('.portfolio-item').forEach(item => {
    const after = item.querySelector('.portfolio-item__after');
    const handle = item.querySelector('.portfolio-item__handle');
    if (!after || !handle) return;

    let dragging = false;

    function setPos(x) {
      const rect = item.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    }

    function onMove(e) {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    }
    function onDown(e) {
      dragging = true;
      e.preventDefault();
      onMove(e);
      if (window.LumoAnalytics) window.LumoAnalytics.track('portfolio_view');
    }
    function onUp() { dragging = false; }

    item.addEventListener('mousedown', onDown);
    item.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    // Click-to-set (outside of drag)
    item.addEventListener('click', (e) => {
      const x = e.clientX;
      setPos(x);
    });
  });

  // ---- Category filters ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();
