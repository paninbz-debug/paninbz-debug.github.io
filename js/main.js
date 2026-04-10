/* ============================================
   LUMO — main.js
   Header behaviour, reveals, FAQ, form, burger, timer, messenger
   ============================================ */
(function () {
  'use strict';

  // ---------- Sticky header with smart hide ----------
  const header = document.querySelector('.header');
  let lastScroll = 0;
  let ticking = false;

  function handleScroll() {
    const y = window.scrollY;
    if (header) {
      if (y > 100) header.classList.add('scrolled');
      else header.classList.remove('scrolled');

      if (y > lastScroll && y > 300) header.classList.add('hidden');
      else header.classList.remove('hidden');
    }
    lastScroll = y;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // ---------- Burger menu ----------
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('open');
      header.classList.add('scrolled');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    }));
  }

  // ---------- Scroll reveal ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Counter animation ----------
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(target * eased).toLocaleString('ru-RU');
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('ru-RU') + (el.dataset.suffix || '');
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  // ---------- Phone mask ----------
  function phoneMask(input) {
    input.addEventListener('input', function (e) {
      let x = e.target.value.replace(/\D/g, '');
      if (x.startsWith('8')) x = '7' + x.slice(1);
      if (!x.startsWith('7')) x = '7' + x;
      x = x.slice(0, 11);
      let out = '+7';
      if (x.length > 1) out += ' (' + x.slice(1, 4);
      if (x.length >= 5) out += ') ' + x.slice(4, 7);
      if (x.length >= 8) out += '-' + x.slice(7, 9);
      if (x.length >= 10) out += '-' + x.slice(9, 11);
      e.target.value = out;
    });
  }
  document.querySelectorAll('input[type="tel"]').forEach(phoneMask);

  // ---------- Form submit ----------
  document.querySelectorAll('form[data-lead]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form__success');
      const fields = form.querySelector('.form__fields');
      if (success && fields) {
        fields.style.display = 'none';
        success.classList.add('visible');
      }
      if (window.LumoAnalytics) window.LumoAnalytics.track('form_submit');
    });
  });

  // ---------- Messenger widget ----------
  const messenger = document.querySelector('.messenger');
  const messengerToggle = document.querySelector('.messenger__toggle');
  if (messenger && messengerToggle) {
    setTimeout(() => messenger.classList.add('visible'), 2500);
    messengerToggle.addEventListener('click', () => messenger.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!messenger.contains(e.target)) messenger.classList.remove('open');
    });
    document.querySelectorAll('.messenger__btn--wa').forEach(b =>
      b.addEventListener('click', () => window.LumoAnalytics && window.LumoAnalytics.track('whatsapp_click'))
    );
    document.querySelectorAll('.messenger__btn--tg').forEach(b =>
      b.addEventListener('click', () => window.LumoAnalytics && window.LumoAnalytics.track('telegram_click'))
    );
  }

  // ---------- Promo countdown timer ----------
  const timer = document.querySelector('.promo__timer');
  if (timer) {
    const end = new Date();
    end.setMonth(end.getMonth() + 1, 1);
    end.setHours(0, 0, 0, 0);

    const dEl = timer.querySelector('[data-t-days]');
    const hEl = timer.querySelector('[data-t-hours]');
    const mEl = timer.querySelector('[data-t-minutes]');
    const sEl = timer.querySelector('[data-t-seconds]');

    function updateTimer() {
      const now = new Date();
      let diff = Math.max(0, end - now);
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);    diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      if (dEl) dEl.textContent = String(d).padStart(2, '0');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    }
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Year in footer ----------
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
