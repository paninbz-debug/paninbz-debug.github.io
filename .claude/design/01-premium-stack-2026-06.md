---
created: 2026-06-07
type: knowledge-hub
project: dpa-shared
status: actionable
related: [[premium-design]] [[carousel-design-system]] [[superpowers/index]] [[../01-regulations/DESIGN_SYSTEM_dpa_services]] [[../01-regulations/research/findings/PREMIUM_BRAND_LUMO_FINDINGS_to_apply]] [[../01-regulations/research/findings/CLAUDE_CODE_STACK_FINDINGS_v2]]
description: Актуализация всего, что у нас используется для премиум-дизайна — инвентарь по проектам + что появилось нового к июню 2026 + что внедрять.
---

# Премиум-дизайн: стек 2026-06 (актуализация)

Сводка того, чем мы делаем премиум-дизайн (инвентарь по проектам) и что
появилось нового/удобнее к июню 2026. Цель — один источник правды вместо
разбросанных по проектам файлов.

---

## 1. Что у нас УЖЕ есть (инвентарь)

### Скиллы и базы знаний
| Что | Где лежит | Суть |
|---|---|---|
| **ui-ux-pro-max** (skill) | `Projects/Lumo/.claude/skills/ui-ux-pro-max/` | Главный движок. CSV-базы: 67 стилей, 96 палитр, 57 шрифт-пар, 99 UX-правил, 25 типов графиков, 13 стеков (React/Next/Vue/Svelte/SwiftUI/RN/Flutter/Tailwind/shadcn). Поиск через `scripts/search.py`. |
| **premium-design** (skill) | `~/.claude/skills/` (не в репах) | Шкала аудита 0-100 по 7 критериям (типографика ×2, цвет ×1.5, пространство ×2, медиа ×1.5, анимации, UX, контент). Стаб-ссылка: `04-knowledge/premium-design.md`. |
| **canvas-design** (Anthropic skill) | глобальный | Премиум-визуалы (постеры, презентации) через философский манифест → PNG/PDF. |
| **carousel-design-system v1.2** | `04-knowledge/carousel-design-system.md` | Для Instagram: 1080×1350 / 1080×1920, плотность 85-95%, темы dark_tech/dark_dramatic/light_reference, Unbounded+Montserrat+JetBrains Mono. |
| **superpowers/index** | `04-knowledge/superpowers/index.md` | Реестр extension-стека Claude Code (что включено и зачем). |

### Дизайн-системы по продуктам
| Продукт | Файл | Язык дизайна |
|---|---|---|
| **DPA SaaS** (direct-olog эталон) | `01-regulations/DESIGN_SYSTEM_dpa_services.md` (816 строк) | «Дорогой стартап с AI»: белый фон, Unbounded, синий→фиолетовый градиент `#4981F3→#6149F3`, blob-ы, `rounded-2xl`. Primary indigo `#4f46e5`. Без Framer Motion / shadcn. |
| **Modjo** (отель) | `Projects/Modjo/knowledge-base/redesign/` + `02-design-system.md` | Тёплый люкс à la Six Senses: warm off-white, clay `#B85C3A`, Cormorant Garamond + Montserrat, арочные фото, framer-motion, эталоны Aman/Rosewood/Mriya. |
| **LUMO** | `02-services/lumo/` + premium-brand findings | Жидкий металл, dark base + один metal-accent, understatement-копирайтинг. |
| **ofislab** | `02-services/ofislab/REFERENCE_ANALYSIS_v2.md`, `REDESIGN_V2_SPEC.md` | Редизайн по reference-анализу. |

### Источники блоков/компонентов (что уже знаем)
- **Aceternity UI** (`ui.aceternity.com`) — bento, Background Beams, spotlight, 3D-карты. Pro $199.
- **Magic UI** (`magicui.design`) — marquee, hero-паттерны, glassmorphism, animated beams.
- **shadcn/ui** + shadcn MCP — структурные компоненты, OKLCH-темы.
- **21st.dev Magic MCP** — генерация premium-UI из промпта («v0 в IDE»).

### Ключевые принципы (из наших research-находок)
- Премиум = **эмоция до цены, сценарий до каталога, воздух до плотности**.
- **Не чистый `#FFFFFF`/`#000000`** → off-white `#FAF8F4` + near-black `#0F0E0C`.
- Serif display + humanist sans; eyebrow UPPERCASE + `letter-spacing 0.2-0.28em`.
- Section padding ≥ 120px, body 16-18px, max-width 65ch.
- Медленные анимации 600-1200ms, magnetic CTA, tilt-on-hover; `prefers-reduced-motion` обязателен.
- Микротипографика кириллицы: «ёлочки», em-dash, `&nbsp;` после коротких союзов.
- Анти-хайп: без «!», таймеров, FOMO, «осталось 5 штук».

---

## 2. Что появилось НОВОГО к июню 2026 (чего нет в наших заметках)

### 🔴 P0 — самое важное: официальный Anthropic Frontend Design Skill
- **Что:** официальный скилл Anthropic, **277k+ установок**, обновлён в феврале 2026.
- **Зачем именно нам:** он сделан ровно для того, чтобы **выбить Claude из дефолтного "AI-slop"** — «фиолетовые градиенты на белом фоне, стек Inter/Roboto, предсказуемые карточки».
- **⚠️ Конфликт с нашим DPA-стеком:** наш `DESIGN_SYSTEM_dpa_services.md` — это буквально **синий→фиолетовый градиент на белом фоне**. То есть мы закодировали как «эталон» именно тот паттерн, который индустрия теперь считает признаком сгенерённого нейронкой сайта. Наши же premium-brand findings (off-white, один акцент, без чистого белого) уже спорят с этим. **Надо ревизовать DPA-лендинг.**

### P1 — обновления того, что у нас уже есть
- **ui-ux-pro-max v2.5.0** — у нас версия от апреля. Новая: 71k★ на GitHub, переработанные базы (50+ стилей, 97 палитр, 57 пар, 99 UX, 9 стеков). Стоит обновить папку скилла.
- **shadcn MCP стал official + зрелый:** теперь **6000+ блоков, 285k иконок**, публикует `llms.txt`, skills и MCP-сервер. Подключается к Claude Code/Cursor/v0/Lovable.

### P1 — новые источники блоков (дешевле/бесплатнее Aceternity)
- **react-bits** (`reactbits.dev`, open-source) — анимированные интерактивные компоненты, бесплатно. Хорошая замена платной Aceternity для эффектов.
- **ogBlocks** (`ogblocks.dev`) — 70+ премиум-анимированных блоков (Motion+Tailwind), copy-paste без установки. Позиционируется как «структурная» альтернатива «хаотичной» Aceternity.
- **HeroUI v3** (`heroui.com`) — современная либа с MCP-сервером, `llms.txt` и agent-skills из коробки; React 19 + Tailwind v4. Кандидат для новых проектов.
- **Vercel AI Elements** — готовые UI-примитивы именно под интерфейсы AI-агентов (чат, стриминг). Релевантно для дашбордов direct-olog/marketolog.

### P2 — новые инструменты/подходы
- **SuperDesign** (`@jasonzhou1993`) — open-source дизайн-агент прямо в IDE: параллельные Claude-агенты + infinite canvas. Если захотим генерить варианты пачками.
- **Claude Design** (продукт Anthropic, релиз 17.04.2026) — инлайн-выводы Voice/Video/3D/Shaders + слайдеры подстройки spacing/color/layout. Стоит посмотреть как песочницу.
- **awesome-claude-design** (`github.com/rohitg00/awesome-claude-design`) — DESIGN.md-промпты по «семействам эстетики» + remix-рецепты. Хороший каталог стилей.
- **Связка дня** (повторяется в гайдах 2026): **shadcn (структура) + Magic UI/react-bits (анимация) + Playwright MCP (проверка в браузере)** — Claude собирает и сам тестит лендинг.

---

## 3. Рекомендации — что делать

**Сейчас (1 вечер):**
1. Поставить официальный **Anthropic frontend-design skill** глобально — мгновенный апгрейд качества «из коробки» для всех проектов.
2. Обновить **ui-ux-pro-max до v2.5.0**.
3. Подключить зрелый **shadcn MCP** (6000+ блоков) во все 5 фронт-репов.

**Эта неделя:**
4. **Ревизия DPA-лендинга:** уйти от чистого `#FFF` + сине-фиолетового градиента в сторону off-white + один акцент (наши же premium-brand findings). Иначе сайт читается как «сделано нейронкой».
5. Добавить **react-bits** в закладки как бесплатный источник эффектов вместо платной Aceternity.

**Когда дойдут руки:**
6. Попробовать **SuperDesign / Claude Design** для генерации вариантов лендингов пачкой.
7. Для дашбордов — посмотреть **Vercel AI Elements** (готовые agent-UI примитивы).

---

## 4. Источники (web, июнь 2026)
- Anthropic frontend-design skill + обзор скиллов: pasqualepillitteri.it, snyk.io, khumam.medium.com
- ui-ux-pro-max v2.5.0: ui-ux-pro-max-skill.nextlevelbuilder.io, github.com/nextlevelbuilder/ui-ux-pro-max-skill
- shadcn MCP / shadcn.io: shadcn.io, ui.shadcn.com/docs/mcp
- 21st.dev Magic MCP: mcp.harishgarg.com/use/21stdev-magic
- Aceternity / Magic UI / react-bits / ogBlocks: ui.aceternity.com, magicui.design, reactbits.dev, ogblocks.dev, pkgpulse.com
- HeroUI v3: heroui.com, heroui.pro
- SuperDesign / Claude Design / awesome-claude-design: github.com/rohitg00/awesome-claude-design
