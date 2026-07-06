# Noor Design System

A Kotlin Multiplatform / Compose design system for the **Noor** app by **Paigham** — a modern Islamic / Qur'an companion app spanning iOS and Android.

The name *Noor* (نُور) is Arabic for **light**. The brand pairs a serene jade‑green primary with a warm gold (*Brand* token, sampled from manuscript illumination) and a generous Arabic typography pairing for Qur'anic script.

## Sources

| What | Where |
| --- | --- |
| Codebase (Compose Multiplatform UI library) | Local mount: `noor/` (Kotlin, `app.paigham.noor`) |
| Token definitions | `noor/src/commonMain/kotlin/app/paigham/noor/tokens/` (Colors, Typography, Fonts, Radius, Spacing, GradientTokens, ImmersiveOverlayTokens) |
| Components | `noor/src/commonMain/kotlin/app/paigham/noor/components/` (appbar, badges, bottombar, buttons, checkbox, dialog, iconbuttons, indicator, inputs, loader, menu, navbar, reaction, surface, switch, tabbar, text) |
| Theme entry | `noor/src/commonMain/kotlin/app/paigham/noor/NoorTheme.kt`, `Noor.kt` |
| Drawables | `noor/src/commonMain/composeResources/drawable/` (`check.xml`, `favorite_filled.xml`) — vector paths from Google Material Symbols |
| Fonts | `noor/src/commonMain/composeResources/font/` — DM Serif Display, Nunito, AlQuran-IndoPak (QuranWBW), QWBWSurah |
| Iconography | `compose.materialIconsExtended` — Material Symbols family (web equivalent: [`material-symbols`](https://fonts.google.com/icons) via Google Fonts CDN) |
| Library deps | Compose Multiplatform • Material 3 • Haze (blur) • compose-shimmer • Compose Unstyled (primitives) |

**Reader does not need access** to the sources above — everything used in this design system has been distilled into the files in this folder.

---

## Index

| File / Folder | Purpose |
| --- | --- |
| `README.md` | This document (overview, content & visual foundations, iconography) |
| `SKILL.md` | Cross-compatible Agent Skill front-matter for Claude Code |
| `colors_and_type.css` | All design tokens as CSS variables + base typography classes |
| `fonts/` | Real font files copied from the codebase |
| `assets/` | Logos, icon mark, SVG icons used across the system |
| `preview/` | Small HTML preview cards (one concept per card) — feeds the Design System tab |
| `ui_kits/mobile/` | Hi‑fi recreation of the Noor mobile app — open `ui_kits/mobile/index.html` |
| `ui_kits/mobile/README.md` | Component / screen inventory for the mobile kit |

---

## Product context

Noor is a Qur'an / Islamic-living mobile app. The codebase exposes a fully‑themed Compose Multiplatform UI library used to build the iOS and Android clients. Surfaces we see hinted at:

- **Qur'an reading** — Arabic ayat rendering with two Quran fonts (IndoPak script + QWBW Surah), plus English/transliteration translations rendered in Nunito.
- **Social / community feed** — `ReactionButton` with long-press emoji popup (❤️ / 🤲 / 👏 / 😮 / 😔), reaction summaries, comment-like body text.
- **Settings & forms** — text inputs with floating labels and inline validation (shake on error), OTP entry, checkboxes, switches.
- **Onboarding / auth** — phone input, OTP, *ImmersiveOverlaySurface* (a full-screen animated gradient warp used for "moments" — completing a goal, finishing a surah, etc.).
- **Navigation** — bottom NavBar with radial glow under the active item, app TabBar segmented control, AppBar with progressive haze (frosted glass) at top.

---

## Content fundamentals

### Tone

Calm, respectful, devotional but **never** preachy. Plain, warm, second-person.

- **You / your** — the reader is addressed directly. Never "the user." Never "we."
- **Active voice, present tense.** "Tap to reveal the translation." Not "Translation can be revealed by tapping."
- **Sentence case** for everything — buttons, headings, settings rows. Title Case is reserved for proper nouns (Qur'an, Surah Al‑Fatiha, Ramadan, Allah).
- **No emoji in product copy** — the reaction picker is the only place emoji appear, and they're a feature, not decoration. Tasbih beads, crescents and stars are never drawn with emoji.
- **No exclamation marks** in headers or buttons. Exclamation marks are used sparingly inside notifications when there is a genuine reason to celebrate ("Surah Yāsīn complete.").
- **Honor the Arabic.** Transliterations use diacritics (*Surah Al-Baqarah*, *Allāhu Akbar*). The honorific ﷺ (PBUH) follows Muhammad. *In shā' Allāh*, *Al-ḥamdu lillāh*, *Subḥān Allāh* are italicised on first mention and unitalicised thereafter.
- **Numbers**: Use Arabic-Indic numerals (٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩) only inside Arabic ayat blocks. Everywhere else use Western numerals.

### Voice examples

| Place | Copy |
| --- | --- |
| Empty-state title | "Begin with a single ayah." |
| Empty-state body | "Pick a surah, mark a daily goal, and we'll keep your place." |
| Primary CTA | "Start reading" • "Continue" • "Mark complete" |
| Destructive | "Delete bookmark" • "Remove from playlist" |
| Toast (success) | "Bookmark saved." |
| Toast (error) | "Could not load this surah. Check your connection." |
| Permission ask | "Allow notifications to be reminded at prayer times." |
| Settings row | "Show transliteration" / "Translation language" / "Reciter" |

### Don't

- ❌ "Hey there!" / "Oops!" / "Awesome!" — too breezy for the subject matter.
- ❌ "Let's get started 🚀" — no emoji in copy, no rocket metaphors.
- ❌ "Click here" — it's a touch UI; *tap*, *swipe*, *hold*.
- ❌ "Quran" — always *Qur'an* (or *Qurʾān*) in long-form prose; *Quran* is acceptable in URL paths and code identifiers only.
- ❌ Title Case headings (`Daily Reading Goal`) — use sentence case (`Daily reading goal`).

---

## Visual foundations

### Mood

**Quiet, generous, illuminated.** The dominant impression is white (or near-black, in dark mode) space, with one or two carefully placed warm or jade accents. The system uses *light* as a literal motif — the signature `ImmersiveOverlaySurface` is an animated burst of color that bleeds in from the bottom of the screen, mimicking sunrise through *mashrabiya* lattice.

### Palette

- **Primary action** is *Jade Green* (#00C950 light / #00BC7D dark). Always reserved for the single most important next action on a screen, plus active states in nav.
- **Brand gold** (#C9AD7B) appears sparingly — surah name accents, the Qur'an mark in the logo, gradient-card borders. Never used as a primary CTA color.
- **Secondary** is *Teal* (#009689) for supporting actions and badges.
- **Chart / accent set**: Vermilion, Teal, Midnight Teal, Amber, Tangerine (light) — Sapphire Blue, Emerald Green, Amber Orange, Amethyst Purple, Hot Pink (dark). These power the six gradient schemes.
- **Surface card** in light mode is *Snow Drift* (#FAFAFA) — one shade off pure white so cards sit visibly on a white background without a heavy border.
- **Borders** are extremely subtle (#E4E4E7 light, white-alpha-10 dark) — the system relies on tonal separation, not strong outlines.

### Type

- **Display / titles**: *DM Serif Display* — a high-contrast didone serif. Used in title weights only (Regular). Letter-spacing is tightened by -0.5px at H1–H3 to compensate for its open default tracking.
- **Body**: *Nunito* — rounded humanist sans with friendly terminals. Used at Regular / Medium / Bold. Body sizes form a clear scale (12 / 14 / 16 / 18 / 20 / 22 / 24 / 28 / 32).
- **Arabic**: *AlQuran IndoPak by QuranWBW* (default, IndoPak/sub-continental script) **or** *QWBW Surah* (clean ottoman style, for surah names and headings). Arabic is rendered RTL, ~1.6× larger than body text, with line-height ≥ 1.9 to give diacritics room.
- Hierarchy is built primarily through **size and family swap** (serif vs sans), rarely through color weight changes. Color is reserved for state, not hierarchy.

### Spacing

A 2-base scale: `2, 4, 8, 10, 12, 16, 24, 32`. The system leans into `8` (md), `12` (xl), `16` (2xl), `24` (huge) for almost every gap and padding decision. Touch targets are 32 / 40 / 48 (small / medium / large button heights), inputs are 46px tall.

### Corner radii

| Token | Px | Used on |
| --- | --- | --- |
| `xs` | 2 | hairline accents |
| `sm` | 4 | tiny chips |
| `md` | 8 | dense controls |
| `lg` | 10 | small buttons |
| `xl` | 12 | small buttons / cards |
| `2xl` | **16** | the default — buttons, inputs, dialogs, gradient cards |
| `huge` | 24 | sheets, hero cards |
| `circle` | 360 | badges, switches, icon buttons, nav glow |

The **xxLarge (16px)** radius is the everyday choice. The system rounds generously but never to extreme pill-shapes except for badges and icon buttons.

### Cards

Cards use `PlainSurface` and come in four flavours:

1. **`PlainSurface` (default)** — `surface.primary` background, hairline border tinted with the accent at 30% alpha, 0dp elevation. No shadow.
2. **`PlainSurface.elevated`** — 12dp shadow tinted by accent (`ambientColor = accent @ 60%`, `spotColor = accent @ 50%`). Used for modals and floating UI.
3. **`PlainSurface.subtle`** — 4dp shadow, `surface.secondary` bg, no border. Quiet supporting cards.
4. **`PlainSurface.flat`** — `surface.secondary` bg, border, no shadow. List-row containers.

A **fifth special** is `GradientSurface.radial` / `.linear` — uses the six `GradientScheme`s and draws a 2dp gradient border in `accent @ 50% → secondary @ 40%`. Shadow is also tinted with the accent (24dp default).

### Backgrounds

Pure flat backgrounds are the default. There are **no repeating patterns or textures**. The two ways the system gets "rich" backgrounds:

1. **Gradient surfaces** for cards/heroes (radial or linear, alpha-low, see above).
2. **ImmersiveOverlaySurface** — full-screen animated gradient warp with two bursting circles + a semi-circle expansion from the bottom. Trigger: completing a goal, finishing a surah, prayer-time arrival. Behind it, content warps Z-back with blur. Five preset schemes: emerald, brand (gold), coral, amethyst, sapphire.

Photographs are **rare**. When used (rare: e.g. Mecca background, mosque hero), they're high-key, warm, slightly desaturated — never high-contrast or grainy.

### Blur / transparency

Heavy use of **Haze blur** (Material's UltraThin / Regular tiers):

- **AppBar** — progressive vertical haze (intensity 1 at top → 0 at bottom). Status bar icons adapt to the surface under the haze.
- **BottomBar / NavBar / TabBar** — `HazeMaterials.ultraThin(surface.primary)` for a fully frosted bar.
- **Dialog / SheetDialog** — `HazeMaterials.regular` for a stronger frost.

Opacity layers used: 0.10 (border-on-dark), 0.15 (input bg-on-dark), 0.30 (gradient bg), 0.40 / 0.60 (scrims), 0.80 (gunmetal overlay dark).

### Animation

A **soft, springy, low-motion** identity.

| Where | Spec |
| --- | --- |
| Sheet expand / overlay enter | `EaseOutCubic` (cubic-bezier 0.33,1,0.68,1), ~750ms |
| Overlay content bounce-in | Spring, DampingRatio Medium-Bouncy, Stiffness Low |
| Nav indicator slide | `animateDpAsState` default tween (~300ms) |
| Switch thumb | 120ms `FastOutSlowInEasing` |
| Carousel indicator | 300ms tween |
| Checkbox check stroke draw | 300ms tween, 175ms delay (`FastOutSlowInEasing`) |
| Revolving loader | 3000ms perimeter rotation + 1500ms head/tail scrub (Linear / FastOutSlowInEasing) |
| Error shake (form fields) | `rememberErrorShakeOffset` — small horizontal shake with haptic |
| Carousel auto-advance progress | Linear |

No bouncy "wobble" except deliberately on overlay-content arrival. Hover states are not part of the mobile system (Compose targets touch); the analog for press is a haptic feedback call (`HapticFeedbackType.KeyboardTap` / `SegmentTick` / `ToggleOn` / `ToggleOff` / `GestureThresholdActivate`).

### Press / focus states

- **Buttons** scale not at all; they emit a haptic tap. Filled buttons cast a shadow tinted by their fill colour (`spotColor = bg`); on press the haptic is the only feedback (no opacity change, no scale).
- **Inputs**, when focused, show a 1px focused-border in `action.primary` plus a 1px inner-inset border for a double-border halo. On error: 1px error-border + horizontal shake + optional vibrate.
- **Disabled** controls drop to `status.disabled` background + `status.disabledAlt` foreground. No greyscale filter.

### Shadows

Shadows are **coloured**, not black. Buttons cast a shadow tinted by their background fill (the same Jade for primary, the tonal colour for tonal). Gradient cards cast shadow in the accent colour. Plain elevated cards use the accent colour passed to them, at 50–60% alpha.

This is the single most distinctive visual signature of the system: a green button casts a green glow.

### Layout rules

- Two fixed bars: a haze-backed **AppBar** at top, a haze-backed **NavBar** at bottom on the main shell.
- Safe-area aware on both bars (`statusBars` + `navigationBars` insets).
- Sheets / Dialogs use `surface.scrim` (40% black light / 60% black dark) plus the same haze treatment as bars.
- Primary CTA is **always pinned bottom-center** on auth / form screens, full-width, large size.
- Page padding is `2xl` (16) outside on phones, `huge` (24) inside hero cards.

---

## Iconography

The codebase uses **Compose `materialIconsExtended`** plus two custom vector drawables (`check.xml`, `favorite_filled.xml`) — themselves Material Symbols path data. So the entire iconography of the app is **Google Material Symbols**.

- **Style**: Material Symbols Rounded, weight 400, fill 0 (outlined) for navigation and most surfaces; fill 1 (filled) for active states and the `favorite_filled` reaction. Optical size 24.
- **Stroke / fill weight**: Stroke-weight 400 (default). The system does NOT mix line weights — never put a thin-weight icon next to a heavy one.
- **Size**: 16dp (small in chips), 20dp (inline with text), 24dp (default), 32dp (toolbar). All sizes are even-numbered px.
- **Color**: Icons inherit `LocalContentColor` — they take the color of their parent surface's content slot. In nav, the active item gets `action.primary`, inactive gets `status.disabled-alt`.
- **Custom drawable usage**: `check.xml` is used as the checkmark inside the Checkbox (drawn with a clipped reveal animation). `favorite_filled.xml` is the empty-state heart for the Like / Reaction button.
- **Emoji** is used **only** inside `ReactionButton` (the 5 default reactions: ❤️ 🤲 👏 😮 😔). It is never used in product copy, button labels, headings, or empty states.
- **Unicode glyphs as icons**: not used. Diacritics within Arabic text are honoured but glyphs aren't pressed into icon service.

**Web equivalent** (used in this design system's HTML previews and UI kits): we load the Material Symbols Rounded font from Google Fonts:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block" />
```

Then use `<span class="material-symbols-rounded">favorite</span>`. `FILL,0..1` lets us toggle filled state per-instance.

**Substitutions flagged**:

- `DM Serif Display`, `Nunito` are real font files from the codebase ✅
- `AlQuran IndoPak by QuranWBW v4.2.2 WL` is the real Quran font file ✅
- `QWBW Surah` is the real surah-headings font file ✅
- **Material Symbols Rounded** loaded from Google Fonts CDN ✅ (matches the codebase's `materialIconsExtended` rendering exactly)
