/* ============================================
   LUMO — gallery.js
   Portfolio category filters + click tracking
   ============================================ */
(function () {
  'use strict';

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
      if (window.LumoAnalytics) window.LumoAnalytics.track('portfolio_filter', { category: cat });
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (window.LumoAnalytics) window.LumoAnalytics.track('portfolio_view');
    });
  });
})();
