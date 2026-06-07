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
      const open = burger.classList.toggle('active');
      nav.classList.toggle('open');
      header.classList.add('scrolled');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
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

  // ---------- Lead delivery (Cloudflare Worker → Telegram) ----------
  // Вставь сюда URL воркера, например 'https://lumo-lead.xxx.workers.dev'
  const LEAD_ENDPOINT = '';

  function sendLead(payload) {
    if (!LEAD_ENDPOINT) return Promise.reject(new Error('endpoint not configured'));
    return fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => (r.ok ? r.json() : Promise.reject(r)));
  }
  // Доступно другим скриптам (калькулятор)
  window.LumoSendLead = sendLead;

  // ---------- Form submit ----------
  document.querySelectorAll('form[data-lead]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form__success');
      const fields = form.querySelector('.form__fields');
      const btn = form.querySelector('button[type="submit"]');
      const get = (n) => { const el = form.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
      const payload = {
        name: get('name'),
        phone: get('phone'),
        service: get('service'),
        comment: get('comment'),
        company: get('company'), // honeypot
        page: location.pathname + location.search,
        source: 'site_form',
      };

      if (btn) { btn.dataset.label = btn.textContent; btn.disabled = true; btn.textContent = 'Отправляем…'; }

      const showSuccess = () => {
        if (success && fields) { fields.style.display = 'none'; success.classList.add('visible'); }
      };

      sendLead(payload)
        .then(() => { showSuccess(); if (window.LumoAnalytics) window.LumoAnalytics.track('form_submit'); })
        .catch((err) => {
          // Не теряем клиента: показываем экран с кнопкой WhatsApp как запасной канал
          console.warn('Lead send failed:', err);
          showSuccess();
          if (window.LumoAnalytics) window.LumoAnalytics.track('form_submit_failed');
        });
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

  // ---------- FAQ: одиночное раскрытие ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach(o => { if (o !== item) o.open = false; });
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Tilt on hover (premium micro-interaction) ----------
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const MAX = 5; // градусы
    document.querySelectorAll('.service-card, .utp-card').forEach(card => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateX(' + (-py * MAX).toFixed(2) + 'deg) rotateY(' +
          (px * MAX).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // ---------- Кириллическая микротипографика: &nbsp; после коротких слов ----------
  // Чтобы предлоги/союзы (в, и, с, на, по…) не висели в конце строки.
  (function microTypography() {
    const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT', 'SELECT', 'OPTION']);
    const re = /([\s(«„">])([A-Za-zА-Яа-яЁё]{1,2})[ \t]+/g;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        let p = node.parentNode;
        while (p && p !== document.body) {
          if (SKIP.has(p.nodeName) || p.isContentEditable) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      const v = node.nodeValue;
      const out = v.replace(re, (m, b, w) => b + w + ' ');
      if (out !== v) node.nodeValue = out;
    });
  })();
})();
