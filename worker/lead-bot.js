/**
 * LUMO — обработчик заявок с сайта → Telegram.
 *
 * Принимает POST (JSON) от форм сайта и отправляет сообщение в Telegram.
 * Токен бота и chat_id хранятся СЕКРЕТАМИ на стороне Cloudflare и НЕ попадают на сайт.
 *
 * Деплой: см. worker/README.md
 * Секреты (Settings → Variables and Secrets):
 *   BOT_TOKEN  — токен бота от @BotFather
 *   CHAT_ID    — куда слать заявки (например 687941614)
 *
 * Необязательная переменная:
 *   ALLOW_ORIGIN — домен сайта для CORS (по умолчанию "*").
 *                  Рекомендуется указать "https://xn----7sbbfcqscungiichud1a5d.xn--p1ai"
 */

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return reply({ ok: false, error: 'method' }, 405, cors);

    let d;
    try { d = await request.json(); } catch (_) { return reply({ ok: false, error: 'json' }, 400, cors); }

    // honeypot: бот заполнил скрытое поле — тихо игнорируем
    if (d.company) return reply({ ok: true }, 200, cors);

    const name  = String(d.name  || '').trim().slice(0, 200);
    const phone = String(d.phone || '').trim().slice(0, 50);
    if (!name || !phone) return reply({ ok: false, error: 'fields' }, 400, cors);

    const service  = String(d.service  || '').slice(0, 200);
    const estimate = String(d.estimate || '').slice(0, 200);
    const comment  = String(d.comment  || '').slice(0, 2000);
    const page     = String(d.page     || '').slice(0, 300);
    const source   = String(d.source   || '').slice(0, 50);

    const text = [
      '🔔 Новая заявка с сайта LUMO',
      'Имя: ' + name,
      'Телефон: ' + phone,
      service  ? 'Услуга: ' + service       : '',
      estimate ? 'Расчёт: ' + estimate      : '',
      comment  ? 'Комментарий: ' + comment  : '',
      page     ? 'Страница: ' + page        : '',
      source   ? 'Источник: ' + source      : '',
    ].filter(Boolean).join('\n');

    const tg = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, disable_web_page_preview: true }),
    });

    if (!tg.ok) return reply({ ok: false, error: 'telegram' }, 502, cors);
    return reply({ ok: true }, 200, cors);
  },
};

function reply(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
