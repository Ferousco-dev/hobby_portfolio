# Image prompts — marquee band (between Hero and About)

That scrolling band shows **7 tiles**. Generate 7 images in ChatGPT
(GPT-4o / DALL·E) and save them, replacing the placeholder files:

```
public/marquee/marquee_01.svg  →  marquee_01.png (or .webp)
public/marquee/marquee_02.svg  →  marquee_02.png
... through marquee_07 ...
```

> If you export as `.png`/`.webp` instead of `.svg`, update the file
> extensions in `src/components/MarqueeSection.tsx` (the `ROW_1` / `ROW_2`
> arrays) to match.

**Aspect ratio:** landscape, roughly **3:2 (e.g. 1200×800)**. Each tile is
displayed at 420×270 with rounded corners.

---

## Shared style (paste this at the end of every prompt)

> Dark modern UI aesthetic, near-black background (#0C0C0C), clean flat
> vector illustration, subtle glow, high contrast, minimal, no text, no
> watermark, professional data-analytics theme, landscape 3:2.

---

## The 7 prompts

**1 — Data cleaning**
> A stylised before/after data table: a messy spreadsheet with duplicates and
> errors transforming into a clean, tidy table, arrow between them, cool blue
> accent (#38bdf8). [+ shared style]

**2 — Excel dashboard**
> A sleek Excel-style sales dashboard with KPI cards, a bar chart and a donut
> chart, emerald green accent (#217346). [+ shared style]

**3 — Pivot table analysis**
> An abstract pivot-table concept: rows and columns collapsing into grouped
> summaries with small bar charts, purple accent (#a78bfa). [+ shared style]

**4 — Power BI report**
> A modern Power BI report canvas with a line chart, map and slicers on a dark
> background, gold/yellow accent (#F2C811). [+ shared style]

**5 — KPI cards**
> Four glowing KPI metric cards showing revenue, profit, cost and customers
> with small trend sparklines, green accent (#2ea36b). [+ shared style]

**6 — Trend charts**
> An elegant multi-line trend chart with an area gradient fill showing growth
> over months, pink accent (#f472b6). [+ shared style]

**7 — Insights**
> A magnifying glass over a bar chart revealing a highlighted insight, a
> lightbulb icon nearby, blue accent (#38bdf8). [+ shared style]

---

### Tip
Ask ChatGPT to keep a **consistent style across all 7** so the band looks like
one set. You can paste all prompts in one message and say:
"Generate these as a matching set, same style and lighting."
