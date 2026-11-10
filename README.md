# DevSuite site

**Build with clarity.** A promotional website that presents three independent products as one family:

| Product | Role | Live demo |
| --- | --- | --- |
| **MobileRoad** | Plan & Manage | <https://mobile-road.vercel.app/> |
| **Architecter** | Design & Architect | <https://architecter-rho.vercel.app/> |
| **CodebaseXplorer** | Explore & Understand | <https://codebasexplorer.vercel.app/> |

This is a standalone showcase, not a fourth application: no accounts, no database, no API. "DevSuite" is a working brand name.

## What is on the page

1. **Hero.** A WebGL composition of three glass objects on one orbit: a roadmap ribbon (MobileRoad), connected blocks with travelling pulses (Architecter) and layered code panels (CodebaseXplorer).
2. **Journey.** The stage is pinned while you scroll: the composition separates into three tools and each step lights up. It is presented as a way of thinking, not as an integration between the products.
3. **Products.** One chapter per product with its real screens (tabs switch views; Architecter shows its flow simulation recording).
4. **Philosophy.** "AI should assist. You stay in control." with an animated diagram of how a suggestion becomes a change.
5. **Final call to action.** The three objects come back together above direct links to the demos.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Bootstrap 5 (reset and grid only) plus custom CSS in `src/app/globals.css`. No Tailwind, no shadcn/ui
- [Motion](https://motion.dev) for scroll-linked and interface animation
- Three.js with React Three Fiber and drei for the scene, loaded with `next/dynamic` after the first paint
- Lexend through `next/font`

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check` | Lint, type check and build |
| `npm run assets` | Re-creates the product screenshots in `public/products/` (see below) |

## Changing content

Nothing about the brand or the products is hard-coded in components.

- **Brand, navigation, hero copy, metadata:** `src/config/site.ts`
- **Products** (names, copy, capabilities, links, accent, screens) and the three principles: `src/data/products.ts`
- **Colors, type and spacing:** the custom properties at the top of `src/app/globals.css`
- **Logo mark:** `src/components/ui/Logo.tsx` and `src/app/icon.svg`

To add a screen to a product, put the image in `public/products/<product>/`, import it in `src/data/products.ts` and add an entry to that product's `views`.

A GitHub link is only shown for a product when `repoUrl` is set. Set it only for repositories that are public.

### Site URL

The URL used for metadata, `robots.txt` and `sitemap.xml` is resolved in this order:

1. `NEXT_PUBLIC_SITE_URL` (set it when a real domain exists; this also enables the canonical URL)
2. `VERCEL_PROJECT_PRODUCTION_URL` (provided by Vercel)
3. `http://localhost:3000`

## Product assets

The screenshots are copies of the originals in each product repository (`docs/images` or `docs/screenshots`), converted to WebP. `npm run assets` regenerates them and expects the three repositories as sibling folders (`../MobileRoad`, `../Architecter`, `../codebasexplorer`); it only reads from them.

The Architecter flow recording was converted once from `docs/flow-animation.gif` with ffmpeg:

```bash
ffmpeg -i ../Architecter/docs/flow-animation.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 24 -an public/products/architecter/flow-animation.mp4
```

## How the 3D scene works

- `src/lib/immersive.ts` decides once per page load whether to run WebGL. It is skipped for reduced motion, data saver, low memory or few CPU cores, and when WebGL 2 is missing. In that case the page uses a regular (non-pinned) layout with an SVG composition (`StaticComposition.tsx`), which is also what the server renders.
- `src/components/visuals/sceneState.ts` holds the scroll and pointer values the scene reads every frame. `Stage.tsx` and `FinalCTA.tsx` write them.
- `src/components/visuals/SceneCanvas.tsx` contains the objects and the scroll-driven layout. Rendering pauses while no section that shows the scene is on screen.

## Accessibility and motion

Semantic landmarks, one `h1`, a skip link, keyboard-operable tabs and mobile menu (focus is kept inside, Escape closes), visible focus rings and meaningful alternative text on every product screen. With `prefers-reduced-motion`, the preloader, the 3D scene, scroll reveals, the video and looping animations are all disabled and the content is shown as is.

## Deployment

The site is a standard Next.js project and deploys to Vercel without configuration.

```bash
npm i -g vercel
vercel link
vercel deploy
vercel deploy --prod
```

`vercel deploy` creates a preview; check it before promoting with `--prod`. No environment variables are required.

## Project structure

```
src/
  app/            Layout, page, global styles, robots, sitemap, social image
  components/
    layout/       Header, Footer
    sections/     Stage (hero + journey), ProductShowcase, PhilosophySection, FinalCTA
    products/     ProductPreview
    visuals/      SceneCanvas (WebGL), StaticComposition (SVG), sceneState
    ui/           Button, Logo, Preloader, RevealObserver, CurrentYear
  config/site.ts  Brand and site configuration
  data/products.ts Product data
  lib/            Helpers
public/products/  Product screenshots and the flow recording
scripts/          Asset pipeline
```
