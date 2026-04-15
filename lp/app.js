// ===== LUMO.chrome — A/B landing =====

// Smooth scroll for in-page nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Phone input — simple Russian mask
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
  phoneInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7')) v = '7' + v;
    v = v.slice(0, 11);
    let out = '+7';
    if (v.length > 1) out += ' (' + v.slice(1, 4);
    if (v.length >= 4) out += ') ' + v.slice(4, 7);
    if (v.length >= 7) out += '-' + v.slice(7, 9);
    if (v.length >= 9) out += '-' + v.slice(9, 11);
    e.target.value = out;
  });
}

// Lead form submit
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const text = `Здравствуйте! Меня зовут ${data.name}. Хочу расчёт: ${data.type}. Телефон: ${data.phone}`;
    const wa = 'https://wa.me/74951234567?text=' + encodeURIComponent(text);
    window.open(wa, '_blank');

    const btn = form.querySelector('button');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Отправлено ✓';
    btn.style.background = '#4ade80';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      form.reset();
    }, 2500);
  });
}

// Reveal-on-scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.step, .work, .price-card, .story__text p').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .6s ease ${i * 0.05}s, transform .6s ease ${i * 0.05}s`;
  io.observe(el);
});
