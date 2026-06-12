# DESIGN_SYSTEM.md — Portfolio Design System & Tokens

This document details the UI design tokens, color palette, typography hierarchy, reusable components, and animation patterns for the Hardik Vatukiya Portfolio website.

---

## 1. Typography & Fonts

We load five primary Google Fonts inside [layout.tsx](file:///e:/Home/Hardik_Portfolio/frontend/app/layout.tsx) and expose them via CSS variables.

| CSS Variable | Font Family | Style / Type | Usage |
| :--- | :--- | :--- | :--- |
| `--font-display` | `Fraunces` | Serif | Display headlines, large section titles, project headers |
| `--font-body` | `Marcellus` | Serif | Body text, captions, structural list items |
| `--font-hero` | `Shadows Into Light` | Cursive / Handwritten | Stylized decorative texts (e.g. hero marquee) |
| `--font-sans` | `Geist` | Sans-Serif | Clean captions, user input, buttons, status badges |
| `--font-mono` | `Geist Mono` | Monospace | Dates, tags, logs, statistics, key indicators |

---

## 2. Color Palette (Tailwind v4 Theme Tokens)

CSS theme tokens are declared in [globals.css](file:///e:/Home/Hardik_Portfolio/frontend/app/globals.css) and automatically mapped to Tailwind colors.

* **Primary Background**: `var(--background)` (`#fdfdfd`) — Bright paper-like light mode.
* **Primary Foreground**: `var(--foreground)` (`#0a0a0a`) — Near-black for sharp typography contrast.
* **Accent Primary**: `var(--accent-primary)` (`#008f51`) — Forest green, used for branding, links, and success states.
* **Accent Secondary**: `var(--accent-secondary)` (`#0000dd`) — Royal blue, used for alternate branding links and secondary highlights.
* **Accent Lime**: `var(--accent-lime)` (`#c1ff4a`) — Lime yellow, used as high-visibility highlight overlays and interactive accents.
* **Card Background**: `var(--card-bg)` (`#ffffff`) — Pure white.
* **Background Secondary**: `var(--bg-secondary)` (`#f4f4f4`) — Light grey for offset blocks.
* **Background Tertiary**: `var(--bg-tertiary)` (`#e9e9e9`) — Mid grey.
* **Text Muted**: `var(--text-muted)` (`#555555`) — Dark grey for high-readability paragraph content.
* **Text Dim / Faint**: `var(--text-dim)` (`#a1a1aa`) / `var(--text-faint)` (`#71717a`) — Medium-light greys.
* **Borders**: `var(--border)` (`#e2e2e2`) — Subtle dividing lines.

---

## 3. Layout Patterns

* **Backdrop Grid Overlays**:
  The website features a fixed background grid pattern overlay:
  `bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]`
* **Backdrop Ambient Glow**:
  A soft radial gradient creates depth in the background:
  `bg-[radial-gradient(circle_800px_at_100%_200px,#d5e5ff10,transparent)]`
* **Section Layering**:
  Z-index styling is critical to prevent overlapping section bugs during scroll pinning:
  * Hero Section: `z-index: 10` (Light Background)
  * About Section: `z-index: 20` (Dark Background - Pinned)
  * Gallery Section: `z-index: 30` (Light Background)
  * Projects Section: `z-index: 35` (Light Background)
  * Journey Section: `z-index: 40` (Light Background)
  * Skill Section: `z-index: 50` (Dark Background)
  * Contact Section: `z-index: 5` (Lower index enables reveal from behind on scroll)

---

## 4. Reusable UI Components

### 1. Button Component (`<Button>`)
Exposed at [frontend/components/ui/Button.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/ui/Button.tsx). Features a dynamic confetti shape explosion on click when utilizing `variant="primary"`.

* **Variants**:
  * `primary`: Forest Green background. Triggers GSAP particles.
  * `secondary`: Royal Blue background.
  * `outline`: Border matching primary accent; fill animates on hover.
  * `ghost`: Transparent backdrop; subtle highlight on hover.
  * `danger`: Crimson Red background.
* **Sizes**: `sm`, `md`, `lg`.

### 2. Card Component (`<Card>`)
Exposed at [frontend/components/ui/Card.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/ui/Card.tsx). Provides basic wrappers.

* **Variants**:
  * `muted`: Pure white background (`bg-card-bg`).
  * `raised`: Off-white background (`bg-bg-secondary`).
  * `outline`: Transparent background with border outline.

### 3. Reveal Image (`<RevealImage>`)
Exposed at [frontend/components/ui/RevealImage.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/ui/RevealImage.tsx). Drop-in replacement for Next.js `<Image>` that utilizes CSS/GSAP clip-path masks to transition images into view without cumulative layout shift (CLS).

* **Transitions**: `top-down`, `bottom-up`, `left-right`, `right-left`, `center-h`, `center-v`, `diagonal-tl`, `diagonal-tr`, `iris`.
* **Triggers**: `"load"` (plays on mount) or `"scroll"` (plays when scrolled into view).

---

## 5. Responsive & Animation Rules

### Responsive Breakpoints
* Large screens (Desktop, `>=1024px`): Advanced pinning animations, reveals, and full desktop headers are active.
* Tablets/Mobile (`<1024px`): Pinned animations revert to normal vertical document flow, ensuring readable text sizing, appropriate hit targets (minimum `44x44px`), and preventing performance stutter.

### Animation Standards (GSAP & Motion)
* **Smooth Scrolling**: Implemented globally on the root body via Lenis.
* **Scroll-Triggered Reveals**: Use `toggleActions: "play none none reverse"` inside ScrollTrigger targets for scroll-dependent animations.
* **GSAP Contexts**: Always wrap GSAP animations within `gsap.context()` inside `useGSAP` or standard `useEffect` hooks so cleanup is handled reliably.

---

## 6. UI Pitfalls to Avoid
* **Hardcoded Hextones**: Never write hardcoded colors like `text-[#008f51]`. Use Tailwind theme tokens (e.g. `text-accent-primary`) to maintain system parity.
* **Lazy Loading Pin-targets**: Never place a GSAP ScrollTrigger pin target (e.g., About Section, Hero Section) inside a standard lazy loader. The container must mount eagerly to allow GSAP to measure top offset levels correctly.
* **Horizontal Scroll Overflows**: Since layout pinning extends document heights, enforce `overflow-x-hidden` on outer wrappers to prevent horizontal scroll bars on mobile displays.
