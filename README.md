# Feranmi

A dark-themed 3D creator landing page built with React, TypeScript, Tailwind CSS,
Framer Motion, and Lucide React.

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
  App.tsx                  # composes all sections
  index.css                # global reset, Kanit font, .hero-heading gradient
  components/
    HeroSection.tsx        # navbar, gradient h1, magnetic portrait
    MarqueeSection.tsx     # two scroll-driven image rows
    AboutSection.tsx       # corner 3D decor + char-by-char scroll text
    ServicesSection.tsx    # white panel, numbered service list
    ProjectsSection.tsx    # sticky-stacking, scale-down project cards
    FadeIn.tsx             # whileInView fade wrapper (motion.create)
    Magnet.tsx             # mouse-following magnetic hover
    AnimatedText.tsx       # scroll-driven per-character opacity reveal
    ContactButton.tsx      # gradient pill CTA
    LiveProjectButton.tsx  # ghost/outline pill
```

## Notes

- Section order: Hero → Marquee → About → Services → Projects.
- Fonts load from Google Fonts (Kanit 300–900) via `index.html`.
- All imagery is hot-linked from the URLs in the brief; swap them for local
  assets in `/public` if you want to self-host.
# hobby_portfolio
