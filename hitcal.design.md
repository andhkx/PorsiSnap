---
version: alpha
name: Hitcal
description: "Hitung kalori makanan dari foto dan kenali kebutuhan kalori harianmu secara instan bersama Hitcal."
sourceUrl: "https://hitcal.vercel.app/"

colors:
  primary: "#0f172a"
  on-primary: "#ffffff"
  background: "#ffffff"
  surface: "#2563eb"
  border: "#0f172a"
  text: "#0f172a"
  text-muted: "#ffffff"
  accent: "#2563eb"

typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 900
    lineHeight: 1.25
  heading:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 900
    lineHeight: 1.56
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 900
    lineHeight: 1.33
    letterSpacing: 0.6px

spacing:
  base: 4px
  scale: [4, 8, 12, 16, 20, 24, 28, 32, 112, 128]

radius:
  sm: 16px
  md: 20px
  lg: 24px
  pill: 9999px

shadows:
  card: "rgb(15, 23, 42) 4px 4px 0px 0px"
  elevated: "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(37, 99, 235, 0.35) 0px 6px 16px 0px, rgb(15, 23, 42) 3px 3px 0px 0px"

motion:
  duration-fast: 120ms
  duration-base: 200ms
  duration-slow: 300ms
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"
---

## Rationale

Measured design tokens extracted from https://hitcal.vercel.app/. The frontmatter above is the design system — real colors, type scale, spacing, radius, shadows, motion, and breakpoints read from the live page. Upgrade to Pro for the full written system (rationale, component guidance, and accessibility notes).
