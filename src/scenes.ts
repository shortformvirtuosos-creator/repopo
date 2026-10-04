// The five photographs and where things sit on them.
//
// Every position is a fraction of the photo (0 = left/top edge, 1 = right/bottom
// edge), so nothing here depends on the file's pixel size. The numbers were read
// off the photos in flow/ (2000×1116 frames): divide a pixel position by 2000
// (x) or 1116 (y) to get the fraction.

import photos from './photos.json'

export type PhotoId = '1-pot' | '2-explosion' | '3-copper' | '4-pour' | '5-set'

/** [left, top, right, bottom] as fractions of the photo. */
export type Box = [number, number, number, number]

export type DesktopLayout = {
  /** Where the photo is cut when the screen's shape differs from it: 0 keeps the left/top edge, 1 keeps the right/bottom edge. */
  crop: [number, number]
  /** Point the slow zoom grows from. */
  origin: [number, number]
  /** Areas of the photo that text may cover (nothing important underneath, at either end of the zoom). */
  zones: Record<string, Box>
}

export type PhoneLayout = {
  /** Photo x that lands in the middle of the screen. */
  focus: number
  /** Move the photo down by this share of the screen height; the top melts into the black fade. */
  drop: number
  origin: [number, number]
  zones: Record<string, Box>
}

export type Scene = {
  id: string
  photo: PhotoId
  /** Scroll length, in screen heights. */
  length: number
  desktop: DesktopLayout
  phone: PhoneLayout
  /** The pot, handle, steam, splash, cups, tray: the wordmark and the top "Podijeli" fade out rather than sit on these. */
  keepClear: Box[]
  /** Hard edges in the photo's black that get a soft ramp (black on the left, clear on the right). */
  seams?: Box[]
}

/** How far each photo zooms in while you scroll through it. */
export const ZOOM = 1.06

export const SCENES: Scene[] = [
  {
    id: 's-pot',
    photo: '1-pot',
    length: 2.1,
    keepClear: [
      [745 / 2000, 380 / 1116, 1240 / 2000, 1000 / 1116], // pot
      [750 / 2000, 0, 1140 / 2000, 390 / 1116], // steam
      // handle, in pieces along the bar (hinge at x 1110, tip at 1740, 170)
      [1100 / 2000, 465 / 1116, 1180 / 2000, 625 / 1116],
      [1150 / 2000, 395 / 1116, 1305 / 2000, 530 / 1116],
      [1300 / 2000, 310 / 1116, 1455 / 2000, 448 / 1116],
      [1450 / 2000, 228 / 1116, 1605 / 2000, 366 / 1116],
      [1600 / 2000, 150 / 1116, 1755 / 2000, 285 / 1116],
    ],
    desktop: {
      crop: [0.5, 0.5],
      origin: [0.495, 0.63],
      zones: {
        // left of the pot and its steam (pot starts at x 745, steam at 750)
        head: [0.0, 0.08, 0.35, 0.8],
        // right of the pot (ends at x 1240), under the handle (its lower edge is at y 440 by x 1296)
        ctrl: [0.65, 0.435, 0.985, 0.79],
      },
    },
    phone: {
      focus: 0.496,
      drop: 0,
      origin: [0.496, 0.63],
      // everything above the rim (y 385); the steam behind it sits under the black fade
      zones: { head: [0, -1, 1, 0.3], ctrl: [0, -1, 1, 0.3] },
    },
  },
  {
    id: 's-explosion',
    photo: '2-explosion',
    length: 1.5,
    keepClear: [
      [1335 / 2000, 440 / 1116, 1750 / 2000, 890 / 1116], // pot
      // handle, in pieces from (1600, 505) to the tip at (1835, 50)
      [1580 / 2000, 380 / 1116, 1685 / 2000, 535 / 1116],
      [1630 / 2000, 250 / 1116, 1735 / 2000, 405 / 1116],
      [1680 / 2000, 120 / 1116, 1795 / 2000, 275 / 1116],
      [1735 / 2000, 20 / 1116, 1870 / 2000, 150 / 1116],
      [640 / 2000, 320 / 1116, 1460 / 2000, 840 / 1116], // splash
    ],
    // the light beam starts with a hard vertical edge at x 635
    seams: [[560 / 2000, 0, 820 / 2000, 420 / 1116]],
    desktop: {
      crop: [0.45, 0.5],
      origin: [0.77, 0.6],
      // the black left side, clear of the first splash drops (x 650)
      zones: { main: [0.0, 0.07, 0.305, 0.93] },
    },
    phone: {
      focus: 0.771,
      drop: 0.07,
      origin: [0.771, 0.6],
      // above the splash and the pot (rim at y 445), left of the handle (x 1690 at y 330)
      zones: { main: [0, -1, 0.828, 0.285] },
    },
  },
  {
    id: 's-copper',
    photo: '3-copper',
    length: 1.5,
    keepClear: [[720 / 2000, 0, 1, 1]], // the copper fills the right side
    desktop: {
      crop: [0, 0.5],
      origin: [0.7, 0.5],
      // the copper's edge runs from x 930 (top) to x 735 (bottom)
      zones: { main: [0.0, 0.07, 0.34, 0.92] },
    },
    phone: {
      focus: 0.55,
      drop: 0.24,
      origin: [0.55, 0.5],
      zones: { main: [0, -1, 1, 0.04] },
    },
  },
  {
    id: 's-pour',
    photo: '4-pour',
    length: 1.5,
    keepClear: [
      [1265 / 2000, 200 / 1116, 1765 / 2000, 720 / 1116], // pot
      // handle, in pieces from the hinge (1570, 410) to the tip (1900, 50)
      [1535 / 2000, 300 / 1116, 1685 / 2000, 455 / 1116],
      [1640 / 2000, 175 / 1116, 1795 / 2000, 335 / 1116],
      [1755 / 2000, 35 / 1116, 1925 / 2000, 215 / 1116],
      [1080 / 2000, 0, 1540 / 2000, 700 / 1116], // steam
      [1105 / 2000, 655 / 1116, 1465 / 2000, 980 / 1116], // cup
    ],
    desktop: {
      crop: [1, 0.5],
      origin: [0.68, 0.45],
      // left of the steam (x 1090) and above the stone at the bottom left
      zones: { main: [0.0, 0.07, 0.36, 0.93] },
    },
    phone: {
      focus: 0.7,
      drop: 0.12,
      origin: [0.7, 0.6],
      // above the džezva's rim (y 210)
      zones: { main: [0, -1, 1, 0.13] },
    },
  },
  {
    id: 's-set',
    photo: '5-set',
    length: 2.3,
    keepClear: [
      [810 / 2000, 330 / 1116, 1930 / 2000, 965 / 1116], // tray, pot, cups
      // handle, in pieces from the pot (995, 430) to the tip (690, 130)
      [895 / 2000, 325 / 1116, 1012 / 2000, 448 / 1116],
      [795 / 2000, 225 / 1116, 925 / 2000, 352 / 1116],
      [676 / 2000, 116 / 1116, 822 / 2000, 252 / 1116],
      [950 / 2000, 0, 1570 / 2000, 390 / 1116], // steam
    ],
    desktop: {
      crop: [0.65, 0.5],
      origin: [0.62, 0.55],
      // left of the handle's tip (x 690) and the tray
      zones: { main: [0.0, 0.07, 0.318, 0.93], foot: [0.0, 0.0, 0.318, 0.965] },
    },
    phone: {
      focus: 0.612,
      drop: 0.1,
      origin: [0.612, 0.6],
      // above the džezva and cups (y 340)
      zones: { main: [0, -1, 1, 0.245] },
    },
  },
]

/**
 * The plain copper band on 1-pot where the family name is engraved. The band is
 * a slice of a cone: its silhouette is `rTop` wide either side of `axis` at the
 * top edge and `rBottom` at the bottom edge. Seen from slightly above, the
 * middle of every horizontal line on it sits lower than its ends by `sag` × its
 * half-width.
 */
export const BAND = {
  axis: 990 / 2000,
  top: 650 / 1116,
  bottom: 766 / 1116,
  rTop: 151.5 / 2000,
  rBottom: 174.5 / 2000,
  sag: 0.019,
  /** Largest angle round the band (from the front) that letters may reach. */
  maxAngle: (60 * Math.PI) / 180,
  /** The two engraved lines: middle of the capitals and the largest cap height, as fractions of the photo height. */
  lines: [
    { mid: 694 / 1116, cap: 27 / 1116 },
    { mid: 734 / 1116, cap: 17 / 1116 },
  ],
  /** Area the engraving canvas covers. */
  box: [800 / 2000, 640 / 1116, 1180 / 2000, 775 / 1116] as Box,
}

/** Where the pot sits on 1-pot (body only; used to frame the share image). */
export const POT: Box = [745 / 2000, 385 / 1116, 1240 / 2000, 990 / 1116]

export type PhotoInfo = { w: number; h: number; files: { file: string; w: number; h: number }[] }
export const PHOTOS = photos as Record<PhotoId, PhotoInfo>

export const aspect = (id: PhotoId) => PHOTOS[id].w / PHOTOS[id].h
