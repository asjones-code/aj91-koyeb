# Ravi Klaassens — Site Feature Analysis
> Reference: https://www.raviklaassens.com/  
> Purpose: Informing design direction for aj91.online

---

## Brand Identity

- **Name as logo** — "R—K" uses an em-dash ligature as a typographic mark rather than a wordmark or icon. Signals sophistication through restraint.
- **Positioning line** — "Design & Code for those who refuse to settle" + "Settling is easy. The work here isn't built for that." Confident, exclusive tone.
- **Availability signal** — "Availability from late May '26" displayed prominently. Creates scarcity and implies demand without shouting it.
- **Dual audience** — Separate value props for agencies vs. brands in the nav and hero. Not a generic "hire me" pitch.

---

## Navigation

- **Header nav**: For Agencies / Works / About / Contact — clean, 4 items max.
- **Footer directory**: Separate taxonomy (Sound, Narrative, Liaison) — adds depth without cluttering the header.
- **Redundant CTAs**: Email and phone appear in multiple places; normalises outreach without aggressive prompting.
- **Social links** (Instagram, LinkedIn): Present but subordinate — never compete with primary nav.

---

## Layout & Grid

- **Full-width, modular sections** — each section is full-bleed with defined internal padding. No boxed containers.
- **Card-based portfolio grid** — projects displayed as large cards, image-dominant, label minimal.
- **Negative space as structure** — whitespace between sections is generous; the grid "breathes".
- **Responsive without breakpoint jank** — layout adapts with a fluid grid, no visual collapse at mid-sizes.

---

## Typography

- **Variable weight hierarchy**: Bold headlines → medium subheadings → regular body. Three-weight system only.
- **Letter-spacing on headings**: Tight tracking (`-0.02em` to `-0.04em`) for a modern, confident feel.
- **Body copy**: High-x-height sans-serif; generous line-height (`~1.65`) for legibility.
- **No decorative fonts**: Typography does all the personality work — no display faces.

---

## Colour Palette

- **Monochromatic base**: Black / off-white / mid-grey. Portfolio images provide all colour.
- **No brand accent colour**: Intentional. The work provides colour; the shell stays neutral.
- **High contrast ratios**: Text on background always WCAG AA compliant by default.

---

## Interactive & Motion Elements

| Element | Behaviour |
|---|---|
| Project card hover | Image scale/reveal transition |
| Live clock | Real-time CET display in header (`9:00:24 CET`) — adds presence/liveness |
| Portfolio carousel | Pagination counter (`1 / 3`) — curated selection feel |
| CTA arrows | Directional → arrows on email/contact CTAs |
| Page transitions | Smooth scroll + likely Barba.js-style view transitions |

- **Real-time clock** is the standout unique element — turns a static page into something active without adding noise.

---

## Content Architecture

```
Hero (position + claim)
  → Portfolio grid (proof)
    → Service split: For Agencies / For Brands (targeting)
      → Insights / blog (authority / thought leadership)
        → Contact CTA (conversion)
```

- Every section has a clear job. No filler.
- Insights section doubles as SEO content and credibility signal.
- No testimonials page — the work speaks.

---

## What's Notably Absent (Deliberate Omissions)

- No skill bars or tech stack lists — implies seniority
- No client logos wall — selective rather than comprehensive
- No pricing page — positions as consultative, not commodity
- No chatbot or pop-up — respects the visitor

---

## Opportunities for aj91.online

| Ravi Feature | aj91 Equivalent / Adaptation |
|---|---|
| Live clock (CET) | Live timestamp + timezone, or a dynamic "currently building: X" signal |
| Dual audience split (Agencies / Brands) | Split between technical audience and general audience ("for builders / for leaders") |
| Availability banner | Open-to-work or availability state in header |
| Portfolio cards with pagination | Curated project cards (3-4 max) with expand-on-click |
| Insights / blog section on home | Surface Substack posts directly on the homepage |
| Em-dash brand mark | Already have "aj91" as wordmark — could add a typographic treatment |
| Monochromatic shell + colour from content | Current dark theme is close; could strip brand accent from structural chrome and let project imagery carry colour |
| Minimal nav (4 items) | Current nav has LinkedIn + Substack external links; consider moving these to footer and giving primary nav to internal pages |
| Footer directory | Separate footer taxonomy for writing / work / contact vs. header nav |
