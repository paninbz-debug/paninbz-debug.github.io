## 14. Premium UI-libs (S9.10) — Aceternity, Magic UI, Lenis

Из `RESEARCH_top_claude_code_sites_2026.md` §3.3, §6.3 — converged best-practice 2026 для премиум-фронтов. **Не ставим пакетами** (это copy-paste коллекции), а копируем нужные компоненты per-проект.

### 14.1 Aceternity UI — hero blocks

Источник: https://ui.aceternity.com/components

**Что брать:**

| Компонент | Когда | Замечания |
|---|---|---|
| **Hero Highlight** | Premium лендинги (lumo, ofislab) | Анимированный градиент-blob за заголовком; зайдёт под brand brass/gold |
| **Background Beams** | Hero direct-olog v3 redesign, marketolog | Тонкие mesh-линии, dark-by-default |
| **Spotlight** | Любой dark hero | Cursor-follow свет; используем 1 раз на странице |
| **Text Generate Effect** | Hero subheadline | Имитация AI-typing; работает только в hero, не в body |
| **Magnetic Button** | Финальный CTA | Притягивается к курсору в радиусе 80px |

**Установка per-проект (paste-mode):**

```bash
# не npm install — копируем компонент
# 1) https://ui.aceternity.com/components/<name>
# 2) копируем .tsx + Tailwind classes в components/aceternity/
# 3) framer-motion + clsx должны быть в зависимостях
pnpm add framer-motion clsx tailwind-merge
```

### 14.2 Magic UI — marquees, bento, animated lists

Источник: https://magicui.design/docs

**Что брать:**

| Компонент | Когда | Замечания |
|---|---|---|
| **Marquee** | Logo strip, testimonial reel | direct-olog landing «Доверяют клиенты» |
| **Bento Grid** | Features section premium-сервисов | lumo, ofislab, marketolog |
| **Animated List** | Live-feed на дашборде | Например, последние 10 действий по аккаунту |
| **Typing Animation** | Демо CTA | Альтернатива Aceternity Text Generate Effect |
| **Border Beam** | Premium pricing card | Glow вокруг рекомендуемого тарифа |
| **Number Ticker** | Hero metrics | «Сэкономлено: 1,234,567 ₽» |

**Установка per-проект (paste-mode):**

```bash
# https://magicui.design/docs/components/<name>
# копируем .tsx, нужны те же deps что у Aceternity:
pnpm add framer-motion clsx tailwind-merge
```

### 14.3 Lenis — smooth scroll

Источник: https://lenis.darkroom.engineering/

**Применяем:**

- ✅ lumo (premium), ofislab (premium), avit-olog landing, marketolog landing, direct-olog v3 redesign landing
- ❌ Дашборды (interferes with scroll-restore on route change). Для дашборда лучше native scrolling.

**Установка per-проект:**

```bash
pnpm add lenis
```

```tsx
// app/layout.tsx или components/SmoothScroll.tsx (client component)
'use client'
import { ReactLenis } from 'lenis/react'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {children}
    </ReactLenis>
  )
}
```

### 14.4 Anti-pattern напоминание

**НЕ стакать > 2 component libraries** (см. `[[VIBECODER_ANTIPATTERNS]]`). Базовый стек:

- shadcn/ui (always) +
- одно из: Aceternity OR Magic UI

Не оба сразу. Style drift убивает.

---

## 15. Reference-сайты для следующих редизайнов (S9.11)

Из `RESEARCH_top_claude_code_sites_2026.md` §8.5 — короткие ссылки на эталоны 2026, чтобы не охотиться по Awwwards.

### 15.1 anthropic.com (особенно `/product/claude-code`)

**Чем брать:**

- **Типографика** — outsized variable type 180–280px на desktop, 16–18px body. Tiempos / Cormorant + Inter pair.
- **White space** — 8–12 vh padding на hero sections, prose width 65ch.
- **Content-first hero** — не картинка-блокбастер, а сильный текст и продуманное spacing.
- **Brass / gold accent** на dark — главная палитра 2026 для AI-tools.

**Когда применять:** direct-olog v3 redesign (premium AI-positioning), lumo (если уйдём в премиум-tech от премиум-luxury).

### 15.2 stackone.com

**Чем брать:**

- **B2B marketing site на Astro** — converged stack для content-heavy маркетинга.
- **86K LOC за 2 недели Claude Code** — proof-point того, что qualitative+volume возможно.
- **MDX + content collections + Pagefind search** — паттерн для content marketing.

**Когда применять:** ofislab (B2B B2C-mix), marketolog (B2B-positioning), любой content-heavy маркетинговый сайт.

### 15.3 zenml.io

**Чем брать:**

- **Large content-platform** — миграция с Webflow за неделю.
- **LLMOps database UI** — паттерн dashboard внутри marketing site.
- **Dark sidebar + light content** — гибридная схема, лучше чем чистый dark/light на больших сайтах.

**Когда применять:** marketolog (если будет blog/docs section), direct-olog (для doc.direct-olog.ru если откроем).

### 15.4 vercel.com

**Чем брать:**

- **Gold standard для dev-tooling marketing** — самый цитируемый референс 2026.
- **Quiet animation** — анимация ровно там где нужно, 5–15% offset parallax max.
- **Hover-magnetic CTAs** + product UI shots в glass-card frame.
- **Mono-on-mono с одним acid-accent** — palette pattern.

**Когда применять:** direct-olog v3 (dev-tool позиционирование), любой SaaS-лендинг где целевая аудитория — техлиды / маркетологи-автоматизаторы.

### 15.5 linear.app

**Чем брать:**

- **Minimal/dark/precision** — эталон для SaaS dashboard layouts.
- **Subtle gradient мaslach** на background, едва заметные.
- **Microinteractions** — hover на табы, expand-rows, skeleton-loaders. По 1-2 штуке в каждой проекции.
- **Icon system** — single weight, single style, монохромные.

**Когда применять:** дашборд direct-olog (sidebar + main pane), дашборд marketolog, дашборд ai-marketolog.

### 15.6 Дополнительные (для дашборд-сторон)

- **railway.app** — pricing page reference (3-tier с popular badge), цветной gradient в pricing card.
- **clerk.com** — auth flow reference, pre-fill social proof.
- **planetscale.com** — landing CTA + product UI screenshots.

Все три — на shadcn + Tailwind spine.

### 15.7 Премиум-«ремонтная» эстетика для LUMO/Office-lab/Натура (Sprint 9 add)

- **rezistnn.ru** — резистентные перегородки. Эталон **тёмный графит +
  янтарь, серьёзная типографика, минимум CTA**. Подсмотреть: hero
  full-bleed, низкий contrast, plate-printing вибра. Когда: LUMO.
- **mafarchitec.com** — архитектурное бюро, скандинавский минимализм,
  крупные фотографии материалов крупным планом. Когда: LUMO premium-зона
  + Office-lab product-grid.
- **propoly.ru** — производство мебели для офисов. Bento-сетка с большим
  hero, аккуратные section-divider'ы. Когда: Office-lab landing + product
  pages.
- **noir-restaurant** (Modjo) — editorial italic-serif для accent-слов,
  нейтрально-тёмная палитра. Когда: hero-секции для LUMO/Натуры.

**Принцип:** эти референсы — для **«премиум-офлайн»** позиционирования
(LUMO, Office-lab, Натура). НЕ применяем для SaaS-фронтов
(direct-olog/marketolog) — там стек Vercel/Linear (§15.4-15.5).

---

## 16. История правок

- **Sprint 9 (2026-05-03)** — §15.7 добавлен (premium-ремонт references:
  rezistnn / mafarchitec / propoly / noir). CLAUDE.md cap ≤200 подтверждён
  в 6/6 репах. Ссылки на `04-knowledge/superpowers/index.md`,
  `01-regulations/HOOKS_REGLAMENT.md`, `04-knowledge/CLAUDE_BASELINE.md`.
- **Sprint 14 (2026-05-01)** — §14 (Lenis / Aceternity / Magic UI стек),
  §15.1-15.6 (reference-сайты с конкретным mapping на DPA-проекты).
- **Sprint 4-5 (2026-04-29)** — §1-§13 базовый design system из direct-olog.

---
