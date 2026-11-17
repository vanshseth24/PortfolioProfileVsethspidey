# 🕷️ Vansh Seth — Spider-Comic Portfolio

A comic-book / Spider-Man styled personal portfolio built with **plain HTML, CSS and JavaScript**
(no UI framework). Vite is only used as a dev server + bundler, so the whole site ships as a
single `dist/index.html`.

## 📁 Structure

```
index.html              → all the markup (semantic sections + inline SVG art)
src/css/style.css       → design system, layout, every component
src/css/animations.css  → keyframes, scroll-reveal + comic motion
src/js/main.js          → nav, reveals, typewriter, skills, filters, form, resume, easter eggs
src/js/webfx.js         → spider-sense cursor, living web canvas, tilt, FX words
```

## ✨ Features

- **Comic panel design system** — halftone dots, hard black outlines, sticker badges, speech
  bubbles, torn newsprint edges and spider-webs spun into the section corners.
- **Hero** with slam-in title, typewriter tagline, animated inline-SVG spider mask and live
  stat counters.
- **Daily Bugle ticker** marquee.
- **Powers** section with tabbed skill categories and animated "power meters".
- **Mission files** — filterable project panels with spider-sense hover pings.
- **AI Lab** — the research topics currently being tracked.
- **Journey** timeline, validated contact form with comic error messages, and a
  client-side generated resume download.
- **FX layer** — custom crosshair cursor, canvas web that reacts to the mouse, floating
  `POW! / THWIP!` sound-effect words and a full-screen web blast.
- **Easter egg:** try the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) for Multiverse mode.
- Fully responsive, keyboard friendly and `prefers-reduced-motion` aware.

## 🚀 Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # outputs a single self-contained dist/index.html
```
