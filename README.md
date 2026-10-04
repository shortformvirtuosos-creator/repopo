# ĆEIF — džezva s tvojim prezimenom

A one-page share piece built from five photographs of a hand-hammered copper
džezva. Visitors type their family surname and town, see them engraved on the
džezva's copper band, and share a picture of it. Everything on the page is in
Bosnian (latin script, ijekavica). There is nothing to buy.

Built with Vite, React, TypeScript, GSAP + ScrollTrigger and Lenis, plain CSS.
Fonts are self-hosted from `@fontsource` (Anton headlines, Inter text,
Playfair Display for the engraving; Oswald fills in Cyrillic, which Anton
lacks). At runtime the page makes no requests to other servers.

## Run it

```bash
npm install
npm run images     # WebP copies of flow/*.png -> public/photos (only when the photos change)
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

`dist/` uses relative paths, so you can upload it to any folder
(`https://example.com/`, `https://example.com/ceif/`, …).

## The page

Each scene is one full-screen photograph, held in place while you scroll
through it. The photo zooms in by 6% as you scroll, then cross-fades into the
next. Headlines slide up out of a mask.

0. Loader: the water heats from 0 to 100 °C, "Proključalo.".
1. `1-pot`: "NIJE TURSKA. / BOSANSKA JE.", the Prezime and Grad fields, the
   live line and "Podijeli". The family is engraved on the pot's plain copper
   band; while the fields are empty six example families take turns.
   Desktop: headline left of the pot, fields right of it. Phones: the headline
   first, the fields on the next scroll.
2. `2-explosion`: "KAFA SE NE PIJE S NOGU."
3. `3-copper`: "KOVANA RUKOM."
4. `4-pour`: "PRVO PJENA. PA PRIČA."
5. `5-set`: "DOĐI NA KAFU.", then "TVOJE PREZIME. TVOJA DŽEZVA.", "Podijeli"
   and the footer.

## Photos

The originals live in `flow/` (`1-pot`, `2-explosion`, `3-copper`, `4-pour`,
`5-set`; `.png`, or `.jpg` when there is no PNG). They are never modified.
`npm run images` writes 2560 and 1280 px wide WebP copies to `public/photos/`
(a source narrower than 2560 px is not upscaled) and their real sizes to
`src/photos.json`.

To swap in new files with the same framing, replace them in `flow/` and run
`npm run images`. If the framing changes, update `src/scenes.ts` (below).

## Where things live

| What | File |
| --- | --- |
| Brand and site URL | `src/config.ts` |
| Every word on the page | `src/copy.ts` |
| Photos, crops, text areas, the engraving band | `src/scenes.ts` |
| Fitting photos and text to the screen | `src/lib/layout.ts`, `src/lib/place.ts` |
| Engraving (wrapped round the band) | `src/lib/engrave.ts` |
| Scroll timeline, loader intro | `src/lib/scroll.ts` |
| Share image (1080×1350) | `src/lib/shareImage.ts` |
| Sharing (Web Share API, fallback sheet, link) | `src/lib/share.ts`, `src/lib/link.ts` |
| Styles | `src/styles.css` |

### `src/config.ts`

```ts
export const config = {
  brand: 'ĆEIF',
  siteUrl: 'https://example.com', // share links and link previews point here
}
```

Set `siteUrl` to the real address before building. It is used for the share
link (`?p=Hodžić&g=Zenica`), the address printed on the share image and the
`og:url` / `og:image` tags.

### `src/scenes.ts`

Every position is a fraction of the photo (0 = left/top edge, 1 = right/bottom),
read off the 2000×1116 frames: divide a pixel position by 2000 (x) or 1116 (y).

- `desktop.crop` says which side of a photo gets cut when the screen's shape
  differs from it; `phone.focus` is the photo x that stays in the middle of a
  portrait screen.
- `zones` are the areas of each photo that text may cover. The layout maps them
  to the screen at the start and the end of the zoom and keeps text inside both,
  so no word lands on the pot, handle, steam, splash, cups or tray at any size.
  Headlines are sized to fit their zone.
- `keepClear` lists the pot, handle, steam and so on. The wordmark and the top
  "Podijeli" fade out while a photo they would cover is on screen (for
  example the handle tips that reach the top right corner of photos 2 and 4).
- `BAND` is the plain band on `1-pot`: its axis, top and bottom edges, its
  half-width at each edge (it is a slice of a cone), how much its middle dips
  when seen from slightly above, and where the two engraved lines sit. The
  engraving is drawn inside the photo's own layer, so it stays on the band at
  every screen size and through the zoom.

### Engraving

`src/lib/engrave.ts` sets "PORODICA {PREZIME}" / "{GRAD} · {godina}" flat, then
traces every pixel of the band back onto the cone, so letters bunch up towards
the sides and follow the band's curve. It returns two layers: dark cut letters
(blended with `multiply`) and the thin light edge under each cut (`screen`).
The share image uses the same layers.

## Share flow

"Podijeli" draws a 1080×1350 PNG: the pot from `1-pot` with the family
engraved, "DŽEZVA PORODICE {PREZIME}" and the town above it, "Dođi na kafu."
and the site address at the bottom.

- On phones that can share files it opens the system share sheet with the image
  and the text "Evo naše džezve. Dođi na kafu. {link}".
- Where file sharing isn't available (Instagram and Viber in-app browsers,
  desktop) the picture opens full screen with "Drži prst na slici da je
  sačuvaš" (on phones) and "Kopiraj link".
- If no surname has been typed yet, it brings up the fields instead.

Opening a shared link shows that family on the band, with the headline
"DŽEZVA PORODICE {PREZIME}." and the button "Napravi svoju".

## Screenshots and the link-preview image

```bash
npm run build
npm run screens       # 1440×900 + 390×844 + public/og.jpg
npm run build         # rebuild so dist/ includes the new og.jpg
```

`scripts/screens.mjs` serves `dist/` from a subfolder, shoots every scene on
both screens, types latin and Cyrillic names, saves share images, opens a
shared link and writes everything to `docs/screens/`. It also fails if any
visible word leaves its zone or sits on a photo's `keepClear` areas, or if the
page asks another server for anything. It needs a Chromium for Playwright
(`npx playwright-core install chromium`, or set `CHROMIUM_PATH`).

## Performance and accessibility

- Only the photos on screen are painted; the others are hidden. Phones get
  the photo file that suits their screen (`srcset`).
- With `prefers-reduced-motion: reduce` there is no smooth scrolling, no zoom
  and no sliding; scenes simply fade.
- User text is filtered to letters (latin or Cyrillic), spaces and hyphens,
  max 18 characters, and is only ever drawn to a canvas or rendered as text.
