# Oresajo Fiyinfoluwa Eniola — Data Analyst Portfolio

A dark-themed portfolio for a Data Analyst, built with React, TypeScript,
Tailwind CSS, Framer Motion, and Lucide React. Showcases Excel and Power BI
dashboards, data cleaning and analysis work.

## Stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS 3
- Framer Motion 12
- Lucide React

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into /dist
npm run preview  # preview the production build
```

## Structure

```
src/
  App.tsx                  # hash router: home vs. #/work (all projects)
  index.css                # global reset, Kanit font, .hero-heading gradient
  data/
    projects.ts            # single source of truth for project cards
  components/
    HeroSection.tsx        # navbar, gradient h1, magnetic portrait
    MarqueeSection.tsx     # two scroll-driven image rows (data-viz tiles)
    AboutSection.tsx       # corner decor + char-by-char scroll text
    ServicesSection.tsx    # white panel, numbered skills list
    ProjectsSection.tsx    # 3 featured cards + "More Projects" button
    AllProjectsPage.tsx    # #/work — full grid, one image per project
    ContactSection.tsx     # email, phone, WhatsApp
    FooterSection.tsx
    FadeIn.tsx / Magnet.tsx / AnimatedText.tsx
    ContactButton.tsx / LiveProjectButton.tsx
```

## Content to replace

- `public/portrait.png` — swap for a photo of Oresajo.
- `public/projects/*.svg` — swap each for a real dashboard screenshot
  (keep the same file paths, referenced in `src/data/projects.ts`).
- `public/marquee/marquee_0*.svg` — swap for AI-generated data-viz images
  (see `IMAGE-PROMPTS.md`).

## Data / source work

The `/data` folder holds the original Excel and Power BI project files the
portfolio is based on.

## Notes

- Section order: Hero → Marquee → About → Skills → Projects → Contact.
- Fonts load from Google Fonts (Kanit 300–900) via `index.html`.
