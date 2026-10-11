---
name: screenshot-to-code
description: Turn a screenshot or design mockup into a runnable single-file HTML page via a generate-render-compare-fix loop. Use when asked to convert an image to HTML or code, or replicate a page from a picture. Triggers include 截图转代码, 图片转代码, 设计稿转HTML, 还原页面. Not for designs without a reference image.
---

# Screenshot to Code

Convert a reference image into a single-file HTML page that visually matches it,
by iterating: generate → render → self-review → fix. The loop, not the first
draft, is what produces fidelity.

## Workflow

1. **Read** the reference image with the Read tool. If several images are given,
   decide their relationship first (pages of one site → link them; tabs/views →
   add navigation; unrelated → separate sections).
2. **Inventory** before writing any code:
   - Layout regions and their order (header / sidebar / cards / footer), column
     ratios, alignment
   - Every visible text string and every number — they must be reproduced
     verbatim, including Chinese text
   - Palette (sample actual colors from the image), icon shapes, font feel
   - Charts: type, axis orientation, relative bar heights / line shapes
3. **Generate** one `index.html` following the rules below.
4. **Render** it to PNG with `scripts/render.mjs` (see Rendering).
5. **Compare** — Read the rendered PNG next to the original image and go through
   the Comparison checklist.
6. **Fix** every discrepancy found in one batch of targeted edits, re-render,
   re-compare. At most 3 fix rounds. Anything still off after round 3 goes into
   the delivery notes instead of more edits.
7. **Deliver** the HTML file, the final render, and a short fidelity report
   (what matches; what deviates and why).

## Generation rules

- Single `index.html`. Default stack: HTML + Tailwind via CDN. Other stacks in
  `references/stacks.md`.
- Use the exact text and exact numbers from the screenshot. Never lorem ipsum,
  never paraphrase.
- Recreate charts with divs or inline SVG sized to the proportions in the image.
  No chart libraries.
- Recreate photos/illustrations in the mockup as CSS gradient or solid-color
  blocks with the correct aspect ratio and position. Never embed the original
  screenshot itself into the page. Only use real image URLs if the user supplies
  them.
- Icons: Font Awesome CDN when icon shape is recognizable; otherwise closest
  emoji/CSS shape.
- Chinese pages: font stack `"PingFang SC", "Microsoft YaHei", sans-serif`;
  match the source font weight (dashboards are often 600/700).
- Prefer flexible layout (flex/grid + padding) over pixel-perfect fixed heights
  so content never overflows; but preserve the visual proportions of regions.
- Tailwind arbitrary values (`w-[185px]`, `text-[13.5px]`, `bg-[#0F172A]`) are
  encouraged — fidelity beats class-name elegance.

Required tags for the default stack:

```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
```

## Rendering

Render the current file with the bundled script (needs Chrome or Edge installed;
works on Windows/macOS/Linux):

```bash
node <skill-dir>/scripts/render.mjs index.html preview.png
# options: --width 1440 --height 2400 (viewport size), --mobile (390px viewport)
```

The script waits for CDN assets (Tailwind CDN is a JIT script — it needs a
moment) and writes a full-viewport PNG. If the page is visibly cut off at the
bottom, re-render with a larger `--height`. If Chrome/Edge is missing, fall
back to any available headless browser method, but always produce an actual
render — never review code without seeing it.

## Comparison checklist

Go through all items, in this order:

1. Region structure and order match (nothing added, nothing missing)
2. Alignment and column ratios match
3. All text verbatim, all numbers exact
4. Spacing rhythm (padding/margins) proportionally similar
5. Colors: background, cards, text, accents, chart series
6. Icon shapes and chart shapes/heights
7. Nothing overflows or overlaps; page background fills the viewport

## Delivery

Report, per area, one of: matched / approximated (why) / simplified (why).
Honest deviation notes are part of the deliverable, not an apology.
