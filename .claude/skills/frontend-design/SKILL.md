---
name: frontend-design
description: |
  Create distinctive, production-grade frontend interfaces with strong visual direction, polished typography, considered layout, and working HTML/CSS/JS or framework code. Use for websites, landing pages, dashboards, React components, application screens, and UI beautification.
triggers:
  - "frontend design"
  - "ui design"
  - "web design"
  - "production ui"
  - "landing page"
  - "dashboard design"
  - "redesign"
  - "improve layout"
  - "beautify ui"
  - "modern"
license: Apache-2.0 (adapted from Anthropic skills)
---

# frontend-design

> Adapted from Anthropic's official `frontend-design` skill and nexu-io/open-design.

Use this skill when asked to build or improve a frontend interface: a website, landing page, dashboard, application screen, or a visual redesign of an existing UI.

The goal is not just "make it nicer." The goal is to ship working frontend code with a clear design point of view, strong craft, and enough product detail that the result feels designed for the user's actual context.

## Workflow

1. Understand the brief before choosing the look.
2. Commit to one specific aesthetic direction.
3. Design the real interface, not a placeholder poster.
4. Build production-grade frontend code.
5. Refine visual craft.
6. Self-review before final delivery.

## Absolute Negative Constraints

- DO NOT use generic placeholder names like "John Doe" or "Lorem Ipsum".
- DO NOT use AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen".
- DO NOT use over-rounded cards, generic glass cards, or decorative blobs.
- DO NOT use emojis anywhere in code or text content.

## Component Standards

- Every interactive element must have hover, focus, active, and disabled states.
- Use CSS variables for repeated colors, spacing, shadows, and type scale.
- Buttons: 8px radius, clear visual hierarchy (primary/secondary/ghost/danger).
- Cards: 1px border, 12px radius, generous padding, no shadow by default.
- Inputs: 1px border, 8px radius, accent border on focus with visible focus ring.
- Tags/Badges: pill-shaped, uppercase, small typography, muted palette.
- Loading states: skeleton loaders matching content shape.
- Empty states: icon + title + description + CTA.
- Error states: context-specific message with retry action.

## Responsive Rules

- Desktop ≥ 1024px: 12-col grid, 24px gutters.
- Tablet 640–1023px: 8-col grid, 16px gutters.
- Phone < 640px: 4-col grid, 12px gutters; cards stack vertically.

## Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Open Design mirror: https://github.com/nexu-io/open-design
