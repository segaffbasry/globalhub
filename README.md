# GlobalHUB homepage

A private redesign demo of the globalhub.co.uk homepage, built as a single route. The look follows heartaerospace.com: a full-bleed ink hero with 130px display type, a sticky giant wordmark with cards passing over it, editorial long-form lists and a quiet footer. The motion follows ankar.ai: short fades on its tween, springs for movement, a header that changes colour per section and a pill button hover. All copy, data, imagery and links come from the live GlobalHUB site.

## Run locally

`npm install`, then `npm run dev` (http://127.0.0.1:3018). `npm run build` and `npm start` for production. `npm run typecheck` checks TypeScript.

- `npm run content` re-snapshots the live data (Python 3 with Pillow).
- `python3 scripts/check_links.py` checks every outbound link after a build.

## What's on the homepage

| # | Section | Source on the live homepage | Scene |
| --- | --- | --- | --- |
| 1 | Preloader | Official logo, traced to vectors | ink |
| 2 | Hero | The 4 hero slides (title, text, both CTAs, photo) | ink |
| 3 | Pillars | Collaborate, Services, Products cards over the sticky logo | paper |
| 4 | Film | "What is GlobalHUB?", the YouTube film every slide links to | ink |
| 5 | Social Feed | The 5 latest posts, plus the log-in prompt | light |
| 6 | Featured businesses | The 8 featured companies with cover photos | ink |
| 7 | Services | Popular Services (6) and Recently added (6) | light |
| 8 | Browse by category | All 83 categories | charcoal |
| 9 | Why GlobalHUB? | The 6 reasons | light |
| 10 | Join | "Grow your business", £20.00 ex tax p/m, Join today, code GH3 | green |
| 11 | Footer | Email, 5 socials, legal links, company number | ink |

The order follows the live page. The film, which the live page only links to, gets its own scene. Popular and Recently added are merged into one spread. The live copy is kept verbatim, including its capitalisation, and nothing is invented.

## Content

- **Copy** is in `lib/home-content.ts`. **Header, menu and footer** data is in `lib/menu.ts`.
- **Live data**: the live homepage renders client-side from a public JSON API (`api.globalhub.co.uk/api/home-page-slides`, `social-feed`, `featured-companies`, `services`, `categories`). `scripts/fetch_content.py` calls the same endpoints and writes `content/home.json`.
  - It keeps only what the homepage displays. No emails, phone numbers or account data are stored.
  - "Popular" means the highest `popularity_count` and "Recently added" means the newest `created_at`, which reproduces the live lists exactly.
- **Links**: every card and menu link points at the matching live URL: `/company/{slug}`, `/service/{id}`, `/category/{slug}` and `/{services|collaborations|products}/category/{slug}`.
  - `scripts/check_links.py` checked all 373 outbound links, including every menu tab. All return 200. The live site returns a real 404 for unknown paths, so a 200 means the page exists.
  - The only in-page anchors are `#top` and `#main`. There are no `#` placeholders.
- **Images** are in `public/images/` as WebP, downloaded from `api.globalhub.co.uk/storage` (nothing is hotlinked):
  - `hero/`: the 4 slide photos
  - `posts/`: feed media
  - `companies/`: featured covers
  - `logos/`: company logos
  - `services/`: service images
  - `categories/`: 83 category thumbnails
  - `film/poster.webp`: the film's YouTube thumbnail
- **Social icons**: Simple Icons paths (`lib/brand-icons.ts`).

## Brand

- **Logo**: GlobalHUB only publishes a raster logo (2001×447 PNG). It was traced with vtracer, one pass per brand colour, into ten shapes: the orbit arc, G, l, o, b, a, l, H, U, B (`lib/logo-parts.ts`).
  - `Logo` in `components/ui.tsx` renders the shapes live. The green letters stay green, and the arc and "HUB" take `currentColor`, so one logo works on ink, white and green.
  - `Mark` is the arc and G alone, as on the official app icon.
  - `app/icon.png` and `app/favicon.ico` are the official files.
- **Palette**: four colours, all GlobalHUB's own. Green `#58B056` and charcoal `#444444` come from the logo. Ink `#212121` is the live site's text colour. White is the fourth.
  - The "paper" panel is a 6% charcoal tint of white, standing in for the live `#f4f4f4`.
  - No other hue appears anywhere, including hovers, focus rings and gradients.
  - Green is never used for small text on white (2.6:1). It is used as a fill with ink text (6.4:1), or as an accent on ink.
- **Type**: Outfit is the only family globalhub.co.uk loads, so it is used for everything. It is self-hosted in `app/fonts` (OFL, from @fontsource-variable).
  - Display settings follow Heart's measured type: 700 weight, -0.02em tracking, 1.0 line height.
  - Heart's labels are 12px/500 uppercase with 1.5px tracking.

## How it works

### Preloader (`components/Loader.tsx`)

The loader is the company signing its name. It is built from the traced logo on one GSAP timeline, 1.85s long, over the hero's opening ink.

| Time | Stage |
| --- | --- |
| 0.10–0.85s | The arc sweeps 80° around the G's bowl, like an orbit. The G settles from 55% scale on the reveal spring. |
| 0.32–0.87s | "lobal" rises letter by letter, 0.05s apart. |
| 0.55–1.11s | "HUB" wipes in from the left, one letter at a time. |
| 1.11–1.25s | Hold. |
| 1.25–1.85s | Exit: the handover fires, the logo lifts away and the ink curtain rises off the hero. |

- **Why this build**: the logo is an orbit ring around a letterform, followed by a two-colour word. So the ring orbits in, the green word builds as letters, and the heavy "HUB" is revealed as a block.
- **Handover**: at the start of the exit it removes `is-loading` from `<html>`, sets `data-intro="done"` and dispatches `intro:done`. The hero entrance and the header fade listen for that event, so the curtain and the entrance overlap. Lenis is stopped until then.
- **Never blocks**:
  - An inline head script adds `is-loading` before first paint.
  - If hydration is late (the timeline could not finish within about 2.4s of navigation), the loader is skipped.
  - A CSS fallback fades the loader at 2.6s if JS never runs.
  - The head script hands over at 4.5s whatever happens.
- It plays on each visit. Reduced motion and `<noscript>` hide it.
- The dev build exposes the timeline as `window.__intro` so its stages can be seeked and captured. It is not in production.

### Motion system (`components/motion.tsx`, `lib/ease.ts`)

The motion tokens were measured from ankar.ai's Framer bundle (`script_main.DVi7iZV9.mjs`):

- **Reveal spring**: `{stiffness 500, damping 60, mass 1}`, its most used spring. It settles in 0.64s.
- **Hover spring**: `{stiffness 600, damping 40}`. It settles in 0.33s with a 1.2% overshoot.
- **Appear tween**: 0.4s on `cubic-bezier(.5,0,.88,.77)`, with 0.1s steps.

`lib/ease.ts` solves the springs analytically to get GSAP eases. The same curves are sampled into CSS `linear()` values as `--ease-reveal` and `--ease-hover` in `app/globals.css`.

The five reveal moves:

| Move | Attribute | What it does |
| --- | --- | --- |
| Headings | `data-rise` | The whole phrase fades and rises 28px on the reveal spring, as one piece. |
| Paragraphs | `data-words` | Words slide up out of a line mask, 0.012s apart. |
| Labels and buttons | `data-appear` | Ankar's appear tween, a plain fade, 0.1s apart in reading order. |
| Cards | `data-card` | Batched as they enter: fade and rise 40px on the spring, 0.1s stagger. |
| Images | `data-image` (+ `data-parallax`) | The frame clips open from an inset. Parallax is ±5% (10% travel). |

- Every move plays once.
- Sections marked `data-soft` (categories, why, join, footer) run the same moves shorter and smaller.
- Per-word or per-letter motion appears only in the preloader and the hero headline.

### Other systems

- **Smooth scroll**: Lenis, driven by the GSAP ticker and wired into ScrollTrigger.
  - In-page anchors go through Lenis.
  - The menu and the preloader stop it.
- **Scenes and header** (the Ankar behaviour): Ankar has hard section fills and swaps its header variant per section, so each section here declares `data-tone`.
  - The section under the header sets `html[data-htone]`, and the header text, logo and Join pill recolour to match. On green, the green letters of the logo turn ink.
  - The header has no bar. It hides on scroll down and returns on scroll up or on focus.
- **Menu** (`components/chrome.tsx`): the three live dropdowns (Worldwide Services, Collaboration, Products & Parts) become tabs in a full-screen ink sheet.
  - The sheet drops from the top, then the tabs and all 83 category links rise.
  - The GSAP timeline reverses faster on close.
  - It traps focus, closes with Esc and returns focus to the trigger.
- **Hero** (`components/home/Hero.tsx`): the four live slides.
  - The photo crossfades and settles, and headline words rise out of masks.
  - Bottom right: counter, progress bars (click to jump) and a pause control.
  - Rotation is every 7s. It stops off screen and does not start with reduced motion.
- **Film** (`components/home/Film.tsx`): the official explainer is narrated, so it never autoplays.
  - A local poster with Heart's "Play video" pill stands in until someone presses play. Then the privacy-enhanced YouTube player loads.
  - It pauses when scrolled out of view.
  - `<noscript>` links to YouTube.
- **Photography**: always greyscale. Linked photos take a green multiply on hover, so images stay inside the palette. The live hero photos have a green gradient baked into their bottom edge, which the ink shade covers.

### Copied interaction: Ankar's "Book a demo" pill

This is `Pill` in `components/ui.tsx`, styled by `.pill` in `app/globals.css`. Measured on the live Framer component:

- **Box**: flex, 16px gap, padding 10px 16px, radius 500px, 38px tall. Label 14px/500 on an 18.2px line.
- **Hover**: only the fill changes, alpha 1 → 0.6, on the {600, 40} spring. The same spring runs back on leave.

Sampled side by side with the same rAF probe:

| | Ankar | This site |
| --- | --- | --- |
| Hover: reaches 0.6 | ≈180ms | ≈170ms |
| Hover: dip | 0.592 | 0.596 |
| Leave: back to 1 | 175ms | 175ms |

- Solid pills are white on dark scenes and ink on light scenes, like Ankar's White and Black variants.
- The outline pill shares the spring. Its hover state is not an Ankar measurement, so this build defines it.

### Accessibility and fallbacks

- **Keyboard**: skip link. Focus rings in each scene's contrast colour (green on ink, ink on light). The menu is a real dialog with tabs. The hero is a labelled carousel with a pause button. The feed rail scrolls by keyboard and has arrow buttons.
- **Reduced motion**: no smooth scroll, no loader and no slide rotation. Content appears without movement and CSS transitions are cut to near zero.
- **No JS**: `<noscript>` CSS hides the loader and shows every revealed element.

## Private demo settings

- `robots` is `noindex, nofollow` in `app/layout.tsx`. There is no sitemap.
- PostHog (EU) and the 25/50/75/100 `scroll_depth` events are in `lib/posthog.ts`, injected in the `<head>`.
  - The key can be overridden with `NEXT_PUBLIC_POSTHOG_KEY`.
  - Surveys are disabled and no visible UI is added.
  - The script never gets `id="posthog"`.

## Decisions (the brief left these open)

- **Palette**: green, charcoal, ink and white, from the logo and the live CSS as above.
- **Typography**: Outfit for both roles, because it is the brand's only face.
- **Copied interaction**: the Ankar pill hover.
- **Preloader frequency**: it plays on each visit.
- **Film**: play on demand rather than a muted background, because it is a talking-head explainer.
- **Pillar cards**: the live Collaborate/Services/Products cards are not links. Here they link to `/collaborations`, `/services` and `/products` on the live site.
