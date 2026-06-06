---
created: 2026-04-30
status: actionable
type: research-findings-applied
source: RESEARCH_premium_brand_2026_lumo.md
description: Findings из ресёрча премиум-бренда для LUMO. Касается Phase 4 (фотосессия) + полировки текущего сайта. Также применимо к direct-olog при росте бренда.
---

# Premium Brand Research → LUMO redesign + brand polish

Source: `~/Downloads/_Vault/01-regulations/research/RESEARCH_premium_brand_2026_lumo.md` (884 строки).

Касается:
- **LUMO** primary — Phase 4+ (фотосессия) + текущий полишинг.
- **direct-olog** secondary — если хотим элевировать бренд позже.
- **DESIGN_SYSTEM_dpa_services.md** — добавить premium-секцию.

## P0 — Tone of Voice (7 принципов)

### 1. Сдержанность и understatement
- **Что:** «Жидкий металл, нанесённый как ремесло» вместо «Лучший в мире жидкий металл!». Никаких «!» вообще.
- **Применение:** аудит текущих copy на LUMO. Удалить все «!», превосходные степени, маркетинговые штампы.

### 2. Признание ограничений (что бренд НЕ делает)
- **Что:** премиум-бренды явно говорят «мы не делаем X» — это сигнал статуса. Например LUMO: «Не выдерживает ацетон» — пишем честно.
- **Применение:** добавить секцию «Что AuraMetal не выдерживает» с честным списком (ацетон, царапины глубокие, etc.).

### 3. Язык материала вместо языка маркетинга
- **Что:** «pot life 20 минут», «P80→P2000 + Dialux Jaune», «полисилазан 9H+ до 1000°C» — конкретные техдетали > эпитеты.
- **Применение:** все секции про материалы — переписать на конкретику.

### 4. Long-form patience (текст уважает время читателя)
- **Что:** статьи на 1500-3000 слов вместо bullet-soup. Премиум-аудитория читает.
- **Применение:** journal-секция LUMO — лонгриды.

### 5. Третье лицо «дома», а не первое лицо «продавца»
- **Что:** «Мастер LUMO ведёт каждый этап» вместо «Мы поставим вам».
- **Применение:** copy-аудит на личные местоимения.

### 6. Конкретность вместо абстракции
- **Что:** «Латунь, нанесённая в 5 слоёв с полировкой Dialux Jaune» вместо «премиальное металлическое покрытие».
- **Применение:** все material-карточки.

### 7. Отказ от хайпа
- **Что:** не использовать urgency, FOMO, «only 5 left», timer-bars.
- **Применение:** убрать любые такие в LUMO copy (если есть).

## P1 — Типографика

### 8. Кириллица: serif для наследия / гротеск для современной роскоши
- **Что:** для LUMO рекомендованная пара:
  - Заголовки: **Unbounded** (вариативный гротеск) ИЛИ **Cormorant Garamond Cyrillic** (serif с историей)
  - Lead-параграфы: **Cormorant Garamond Cyrillic** (если заголовки Unbounded) ИЛИ **Inter** (если Cormorant)
  - Body: **Inter**
  - Spec/numbers: **JetBrains Mono**
- **Применение:** проверь текущий шрифт-стек LUMO. Sprint 9 уже подключает self-host fonts.

### 9. Микро-типографика как признак статуса
- **Что:** правильная типографика — это:
  - Russian quotation marks: «двойные ёлочки» и „двойные нижние"
  - Em-dash без пробелов внутри: «слово — слово»
  - Optical kerning, не metric
  - Hanging punctuation на пунктуации
  - Пробел before «;»: нет; before «:»: нет (в русском)
  - `&nbsp;` после «не», «и», «в», «на», коротких союзов перед короткими словами
- **Применение:** typography-helper utility для LUMO + copy-pass со всеми russian-specific правилами.

### 10. White space
- **Что:** премиум = много воздуха. `.prose-lumo { line-height: 1.7; max-width: 65ch; }` для лонгридов.
- **Применение:** Tailwind utilities в LUMO.

## P2 — Цветовая палитра

### 11. Monochromatic foundation + accent metal
- **Что:** dark base (`#0A0A0A` глубокий чёрный или `#070C18` темно-синий) + один metal accent (медь/латунь/бронза). НЕ rainbow.
- **Применение:** проверь LUMO палитру — должен быть один доминирующий accent на bg.

### 12. Не использовать чистый белый и чистый чёрный
- **Что:** чистый `#FFFFFF` и `#000000` — анти-премиум. Использовать `#FAF8F4` (off-white) и `#0F0E0C` (near-black).
- **Применение:** глобальный замени `#000` → `#0F0E0C` и `#FFF` → `#FAF8F4` (для премиум-проектов).

## P3 — Композиция

### 13. Asymmetry > symmetry
- **Что:** премиум сайты часто асимметричные — заголовок left-aligned, image right, разные scale per section. Симметрия — массмаркет.
- **Применение:** Hero LUMO — text+image не 50/50, а 35/65 или 60/40.

### 14. Hero-hold: не показывать всё сразу
- **Что:** hero без CTA-кнопки в hero. Только image + минимальный slogan. CTA — следующая секция.
- **Применение:** проверь LUMO hero — нет ли там агрессивной CTA.

## P4 — Микро-интеракции

### 15. Slow animations
- **Что:** premium animations медленные — 600-1200ms ease-out, не 200ms. Scroll-reveal с stagger 100ms.
- **Применение:** Framer-Motion durations в LUMO — пересмотреть.

### 16. Magnetic CTA
- **Что:** CTA-кнопка следует за курсором при hover. Реализуется через Framer Motion `useMotionValue` + `mouseX`/`mouseY`.
- **Применение:** заменить статичные CTA на magnetic.

### 17. Image tilt on hover
- **Что:** product/case карточки слегка наклоняются (tilt 3-5deg) при hover.
- **Применение:** для cases gallery LUMO.

### 18. Cursor-follow (опционально)
- **Что:** кастомный cursor (точка / shape) для luxury-vibe. На мобильном — не показывать.
- **Применение:** только при наличии конкретного дизайн-эталона.

### 19. Smooth scroll snap
- **Что:** Lenis (Sprint 9) + scroll-snap для секций.
- **Применение:** Sprint 9 уже добавляет Lenis в LUMO.

## P5 — Reference-эталоны (для studying)

Из ресёрча — конкретные изученные премиум-сайты:
- **Hermès** — наследие, серифы, asymmetry, slow animation
- **Loro Piana** — материал-first, photography
- **Aesop** — sans-serif minimalism, длинные colonn-tex
- **De Castelli** — металл, поэтика «текучее проявление металла»
- **VeroMetal** — direct competitor, эталон tone «жидкий металл»
- **Patek Philippe** — naracja через time/heritage
- **B&O** — physical product premium
- **Vitsœ** — modular furniture, transparency in pricing
- **Officine Buly** — длинные descriptions, history
- **Linear / Notion** — modern premium SaaS

Применение: для каждой следующей итерации LUMO — смотреть конкретный референс на конкретный паттерн.

## Чек-лист применения

- [ ] P0-1...7 TOV-аудит текущего LUMO copy
- [ ] P1-8 typography pair confirmation
- [ ] P1-9 micro-typography utility (russian quotes, em-dash, nbsp)
- [ ] P1-10 white space utilities
- [ ] P2-11/12 палитра audit
- [ ] P3-13/14 composition review
- [ ] P4-15/16/17 микро-интеракции (magnetic CTA, tilt)
- [ ] P5 reference-deep-dive для каждой итерации

## Sprint mapping

→ **Sprint 14 — LUMO Premium Polish (Phase 4)** (~6-8 часов). После твоей фотосессии — полировка copy + typography + animations. Major redesign не нужен (структура уже на месте), нужна именно tone-of-voice и microinteraction-полировка.
