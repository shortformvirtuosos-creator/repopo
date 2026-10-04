# ĆEIF — džezva s tvojim prezimenom

A one-page 3D share piece built around a hand-hammered copper džezva. Visitors
type their family surname and town, watch them get engraved on the džezva,
and share a picture of it. Everything on the page is in Bosnian
(latin script, ijekavica). There is nothing to buy.

Built with Vite, React, TypeScript, three.js (@react-three/fiber, @react-three/drei),
GSAP + ScrollTrigger and Lenis. Fonts are self-hosted from `@fontsource`.
At runtime the page makes no requests to other servers.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

`dist/` uses relative paths, so you can upload it to any folder
(`https://example.com/`, `https://example.com/ceif/`, …).

## Where things live

| What | File |
| --- | --- |
| Brand, site URL, Instagram handle | `src/config.ts` |
| Every word on the page | `src/copy.ts` |
| Finish colours (metal and page background) | `src/three/finishes.ts` |
| Džezva, cups, tray, sugar bowl (built in code) | `src/three/geometry.ts` |
| Hammered-copper maps (generated) | `src/three/hammered.ts` |
| Engraving (canvas → colour + bump) | `src/three/engraving.ts` |
| Camera and džezva positions per section | `src/state/rig.ts` |
| Scroll timelines (one per section) | `src/lib/scroll.ts` |
| Share image (1080×1350, rendered offscreen) | `src/three/ShareStudio.tsx` |
| Sharing (Web Share API, fallback sheet, link) | `src/lib/share.ts` |
| Styles | `src/styles.css` |

### `src/config.ts`

```ts
export const config = {
  brand: 'ĆEIF',
  siteUrl: 'https://example.com', // share links and link previews point here
  instagram: '',                   // e.g. 'ceif.ba' — shows "Hoćeš pravu? Javi se na Instagramu."
}
```

Set `siteUrl` to the real address before building. It is used for the share
link (`?p=Hodžić&g=Zenica&f=bakar`), the URL printed on the share image and the
`og:url` / `og:image` tags. The Instagram link only appears when `instagram`
is not empty.

## Swapping in a real `.glb`

The džezva is generated in code. To use a modelled one instead, put it at

```
public/models/dzezva.glb
```

and rebuild (or restart `npm run dev`). The file is detected at build time and
loaded instead of the generated džezva.

For it to fit the scene and pick up the finishes:

- **Scale and orientation:** base on the ground at `y = 0`, about `1.96` units tall,
  pouring lip pointing to `+x`, handle to `−x`, the engraving side facing `+z`.
- **Mesh names** (case-insensitive, "contains"):
  - `body` gets the finish's hammered metal
  - `rim` gets the rim metal (copper on the black finish)
  - `handle` gets the handle metal
  - `inside` or `inner` gets the tin lining
  - `engrav…` gets the live engraving. Give this mesh UVs from 0 to 1 across the
    area where the two engraved lines should sit (U left→right, V bottom→top).
  - Anything else keeps the material from the file.
- Export without Draco or Meshopt compression (no decoder is bundled).

## Share flow

"Podijeli" renders a 1080×1350 PNG offscreen (its own scene and camera, tone
mapped like the page; it never reads the visible canvas):

- On phones that can share files it opens the system share sheet with the image
  and the text "Evo naše džezve. Dođi na kafu. {link}".
- Where file sharing isn't available (Instagram and Viber in-app browsers,
  desktop) the picture opens full screen with "Kopiraj link".
- If no surname has been typed yet, it scrolls to the engraving section instead.

Opening a shared link shows that family's džezva in the hero, with the
headline "DŽEZVA PORODICE {PREZIME}." and the button "Napravi svoju".

## Screenshots and the link-preview image

```bash
npm run build
npx playwright-core install chromium   # once, if you don't have a Chromium for Playwright
npm run screens                         # phone + desktop + public/og.jpg
npm run build                           # rebuild so dist/ includes the new og.jpg
```

`scripts/screens.mjs` serves `dist/` from a subfolder, scrolls through every
section at 390×844 and 1440×900, types latin and Cyrillic names into the
engraving, holds the pour button, saves share images, and writes everything to
`docs/screens/`. `public/og.jpg` (1200×630) is a screenshot of the hero.

## Performance and accessibility

- Device pixel ratio is capped at 1.5 on phones and 2 on desktop; no
  post-processing. The render loop stops while the tab is hidden, the canvas is
  off screen, or the share sheet is open.
- With `prefers-reduced-motion: reduce` there is no smooth scrolling and no
  scroll scrubbing; sections fade in and the 3D scene changes under a short fade.
- User text is filtered to letters (latin or Cyrillic), spaces and hyphens,
  max 18 characters, and is only ever drawn to a canvas or rendered as text.
