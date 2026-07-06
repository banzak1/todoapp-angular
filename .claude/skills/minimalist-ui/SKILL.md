---
name: minimalist-ui
description: |
  Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. Linear/Vercel-style design.
triggers:
  - "minimalist ui"
  - "editorial product UI"
  - "linear style"
  - "warm monochrome"
  - "clean design"
  - "modern look"
  - "vercel style"
---

# Premium Utilitarian Minimalism & Editorial UI

## Absolute Negative Constraints

- DO NOT use "Inter", "Roboto", or "Open Sans" typefaces — use premium alternatives.
- DO NOT use generic thin-line icon libraries (Lucide, Feather, Heroicons).
- DO NOT use Tailwind's default heavy drop shadows — shadows must be ultra-diffuse (< 0.05 opacity).
- DO NOT use primary colored backgrounds for large elements or sections.
- DO NOT use gradients, neon colors, or glassmorphism (beyond subtle navbar blur).
- DO NOT use `rounded-full` for large containers, cards, or primary buttons.
- DO NOT use emojis in code, markup, text, headings, or alt text.

## Typographic Architecture

- Primary Sans-Serif: `'SF Pro Display', 'Geist Sans', 'Helvetica Neue', 'Switzer', sans-serif`
- Editorial Serif (Hero Headings): `'Newsreader', 'Playfair Display', 'Instrument Serif', serif` with tight tracking (-0.02em to -0.04em) and tight line-height (1.1).
- Monospace: `'Geist Mono', 'SF Mono', 'JetBrains Mono', monospace`
- Body text never absolute black. Use off-black/charcoal with line-height 1.6.

## Color Palette (Warm Monochrome + Spot Pastels)

- Canvas/Background: `#FFFFFF` or warm off-white `#F7F6F3` / `#FBFBFA`
- Primary Surface (Cards): `#FFFFFF` or `#F9F9F8`
- Structural Borders: Ultra-light gray `#EAEAEA` or `rgba(0,0,0,0.06)`
- Accent Colors (washed-out pastels only for tags/badges):
  - Pale Red: `bg #FDEBEC, text #9F2F2D`
  - Pale Blue: `bg #E1F3FE, text #1F6C9F`
  - Pale Green: `bg #EDF3EC, text #346538`
  - Pale Yellow: `bg #FBF3DB, text #956400`

## Component Specifications

- Bento Box Grids: Asymmetrical CSS Grid. Cards: `border: 1px solid #EAEAEA`, radius `8px-12px`, internal padding `24px-40px`.
- Primary CTAs: Solid `#111111` bg, `#FFFFFF` text. Radius `4px-6px`. No box-shadow. Hover: color shift to `#333333` or micro-scale `transform: scale(0.98)`.
- Tags/Badges: Pill-shaped (`border-radius: 9999px`), very small (`text-xs`), uppercase with wide tracking.
- Accordions: Strip containers. Separate with `border-bottom: 1px solid #EAEAEA`. Use `+`/`−` toggle icons.
- Keyboard shortcuts: `<kbd>` tags with `border: 1px solid #EAEAEA`, radius `4px`, mono font.

## Iconography

- Use "Phosphor Icons (Bold weight)" or "Radix UI Icons" for a thicker-stroke, technical aesthetic.
- Standardize stroke width across all icons.

## Motion & Micro-Animations

- Scroll entry: `translateY(12px)` + `opacity: 0` → visible over `600ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hover states: Cards lift with ultra-subtle shadow (`0 2px 8px rgba(0,0,0,0.04)` over 200ms).
- Buttons: `scale(0.98)` on `:active`.
- Staggered reveals: Cascade delay (`animation-delay: calc(var(--index) * 80ms)`).
- Animate exclusively via `transform` and `opacity`.

## Source

- Open Design: https://github.com/nexu-io/open-design
