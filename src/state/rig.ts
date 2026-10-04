// The scene is driven by "poses": where the džezva, the camera and the set
// pieces are for each section. Scroll timelines only move one progress value
// per transition (0 -> 1, eased); the pose in between is interpolated here.
// That keeps every scrubbed timeline independent and exactly reversible.

export const KEYS = [
  'dx', 'dy', 'dz', 'rx', 'ry', 'rz', 's',
  'cx', 'cy', 'cz', 'tx', 'ty', 'tz',
  'fan', 'ring', 'set', 'cupX', 'cupY', 'cupZ', 'cupS',
  'steam', 'shaft', 'flood', 'sway', 'bob', 'hot1', 'hot2', 'hot3',
] as const

export type Key = (typeof KEYS)[number]
export type Pose = Record<Key, number>
export type PoseName = 'hero' | 'engrave' | 'finish' | 'f1' | 'f2' | 'f3' | 'pour' | 'set' | 'setB' | 'end'

export const CHAIN: PoseName[] = ['hero', 'engrave', 'finish', 'f1', 'f2', 'f3', 'pour', 'set', 'setB', 'end']

/** One progress value per transition: segs[i] moves CHAIN[i] -> CHAIN[i + 1]. */
export const segs = CHAIN.slice(1).map(() => ({ p: 0 }))

export const SEG = {
  heroEngrave: 0,
  engraveFinish: 1,
  finishF1: 2,
  f1f2: 3,
  f2f3: 4,
  f3Pour: 5,
  pourSet: 6,
  setOrbit: 7,
  setEnd: 8,
} as const

export const FOV = 30
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
const TAU = Math.PI * 2

const BASE: Pose = {
  dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0, s: 1,
  cx: 0, cy: 0, cz: 13, tx: 0, ty: 0, tz: 0,
  fan: 0, ring: 1.9, set: 0, cupX: 0.75, cupY: -1.6, cupZ: 0.6, cupS: 0,
  steam: 1, shaft: 1, flood: 0, sway: 0, bob: 1, hot1: 0, hot2: 0, hot3: 0,
}

const P = (o: Partial<Pose>): Pose => ({ ...BASE, ...o })

/** Position of the set on the tray (tray top surface is y = -1). */
const SET_DZ = { dx: -0.55, dy: 0, dz: -0.35 }
const SET_CUP = { cupX: 0.78, cupY: -1, cupZ: 0.72 }

function computePoses(w: number, h: number): Record<PoseName, Pose> {
  const aspect = w / h
  const portrait = aspect < 0.9

  // camera distance so the main shots fit the screen
  const D = portrait ? Math.max(13, 3.25 / (2 * TAN * aspect)) : Math.max(11, 7.6 / (2 * TAN * aspect))
  const H = 2 * D * TAN
  const W = H * aspect
  // world y for a point that should sit at `f` (0 = top, 1 = bottom) of the screen
  const fy = (f: number) => H / 2 - f * H
  const cam = (d: number) => ({ cz: d })

  // close-ups: camera at distance d, looking at (tx, ty, tz)
  const close = (d: number, aimY: number, shiftX: number, aimZ = 0) => {
    const hh = 2 * d * TAN
    const ww = hh * aspect
    const tx = shiftX * ww
    const ty = aimY
    return { cx: tx, cy: ty, cz: aimZ + d, tx, ty, tz: aimZ, _h: hh }
  }
  const strip = <T extends Record<string, number>>(o: T) => {
    const { _h, ...rest } = o as T & { _h?: number }
    void _h
    return rest
  }

  if (portrait) {
    const c1 = close(D * 0.44, 0, 0)
    const c2 = close(D * 0.46, 0, 0)
    const c3 = close(D * 0.42, 0, 0, 0.6)
    const setD = Math.max(17, 5.0 / (2 * TAN * aspect))
    const setAng = 0.36
    return {
      hero: P({ ...cam(D), dy: fy(0.535), s: 1.04, ry: -0.55, rx: 0.1, sway: 0.22 }),
      engrave: P({ ...cam(D), dy: fy(0.505), s: 1.38, ry: 0, rx: 0.06, sway: 0.42, bob: 0.6 }),
      finish: P({ ...cam(D), dy: fy(0.54), s: 1.05, fan: 1, ring: 1.95, flood: 1, sway: 0.06, shaft: 0.25 }),
      f1: P({
        ...strip(c1), cy: -0.16 * c1._h, ty: -0.16 * c1._h,
        ry: Math.PI - 0.35, rx: 0.04, s: 1, flood: 1, bob: 0.3, shaft: 0.25, hot1: 1,
      }),
      f2: P({
        ...strip(c2), cy: 0.15 - 0.14 * c2._h, ty: -0.14 * c2._h,
        ry: TAU - 0.35, rx: 0.04, s: 1, flood: 1, bob: 0.3, shaft: 0.25, hot2: 1,
      }),
      f3: P({
        ...strip(c3), cy: 0.62 - 0.12 * c3._h + 1.4, ty: 0.62 - 0.12 * c3._h,
        ry: TAU - 2.35, rx: 0.95, s: 1, flood: 1, bob: 0.3, shaft: 0.25, hot3: 1,
      }),
      pour: P({
        ...cam(D), cy: 2.4, dx: -0.4, dy: fy(0.44), ry: TAU - 0.4, rx: 0.03, s: 0.95,
        cupX: 0.74, cupY: fy(0.79), cupZ: 0.55, cupS: 1.35, flood: 1, steam: 1.1, bob: 0.4, shaft: 0.25,
      }),
      set: P({
        ...SET_DZ, ...SET_CUP, ry: TAU - 0.45, s: 1, set: 1, cupS: 1, flood: 1, bob: 0, shaft: 0.25,
        cx: 0, cy: setD * 0.4, cz: setD * 0.92, tx: 0, ty: 0.15, tz: 0,
      }),
      setB: P({
        ...SET_DZ, ...SET_CUP, ry: TAU - 0.45, s: 1, set: 1, cupS: 1, flood: 1, bob: 0, shaft: 0.25,
        cx: Math.sin(setAng) * setD * 0.92, cy: setD * 0.36, cz: Math.cos(setAng) * setD * 0.92, tx: 0, ty: 0.15, tz: 0,
      }),
      end: P({
        ...SET_DZ, ...SET_CUP, ry: TAU - 0.12, s: 1, set: 1, cupS: 1, flood: 1, bob: 0, shaft: 0.25,
        cx: -0.35, cy: 3.4, cz: 12.8, tx: -0.45, ty: 0.45, tz: -0.35,
      }),
    }
  }

  const c1 = close(D * 0.42, 0, -0.2)
  const c2 = close(D * 0.38, 0.62, -0.2)
  const c3 = close(D * 0.42, 0.62, -0.2, 0.6)
  const setD = Math.max(11.5, 6.4 / (2 * TAN * aspect))
  const setAng = 0.32
  return {
    hero: P({ ...cam(D), dy: fy(0.745), s: 1.05, ry: -0.5, rx: 0.1, sway: 0.2 }),
    engrave: P({ ...cam(D), dx: -W * 0.2, dy: fy(0.52), s: 1.5, ry: 0.06, rx: 0.05, sway: 0.42, bob: 0.6 }),
    finish: P({ ...cam(D), dy: fy(0.47), s: 1.0, fan: 1, ring: 2.6, flood: 1, sway: 0.06, shaft: 0.25 }),
    f1: P({ ...strip(c1), ry: Math.PI - 0.35, rx: 0.04, s: 1, flood: 1, bob: 0.3, shaft: 0.25, hot1: 1 }),
    f2: P({ ...strip(c2), ry: TAU - 0.95, rx: 0.04, s: 1, flood: 1, bob: 0.3, shaft: 0.25, hot2: 1 }),
    f3: P({ ...strip(c3), cy: c3.cy + 1.4, ry: TAU - 2.35, rx: 0.95, s: 1, flood: 1, bob: 0.3, shaft: 0.25, hot3: 1 }),
    pour: P({
      ...cam(D), cy: 2.2, dx: -0.75, dy: fy(0.44), ry: TAU - 0.4, rx: 0.03, s: 1.0,
      cupX: 0.45, cupY: fy(0.84), cupZ: 0.55, cupS: 1.4, flood: 1, steam: 1.1, bob: 0.4, shaft: 0.25,
    }),
    set: P({
      ...SET_DZ, ...SET_CUP, ry: TAU - 0.45, s: 1, set: 1, cupS: 1, flood: 1, bob: 0, shaft: 0.25,
      cx: 0, cy: setD * 0.38, cz: setD * 0.93, tx: 0, ty: 0.75, tz: 0,
    }),
    setB: P({
      ...SET_DZ, ...SET_CUP, ry: TAU - 0.45, s: 1, set: 1, cupS: 1, flood: 1, bob: 0, shaft: 0.25,
      cx: Math.sin(setAng) * setD * 0.93, cy: setD * 0.34, cz: Math.cos(setAng) * setD * 0.93, tx: 0, ty: 0.75, tz: 0,
    }),
    end: P({
      ...SET_DZ, ...SET_CUP, ry: TAU - 0.12, s: 1, set: 1, cupS: 1, flood: 1, bob: 0, shaft: 0.25,
      cx: -0.3, cy: 4.4, cz: 15.5, tx: -0.45, ty: 1.55, tz: -0.35,
    }),
  }
}

export let poses: Record<PoseName, Pose> = computePoses(1440, 900)

export function layout() {
  poses = computePoses(window.innerWidth, window.innerHeight)
}

/** Pose the scroll position asks for right now. */
export const target: Pose = { ...BASE }

export function updateTarget() {
  const first = poses[CHAIN[0]]
  for (const k of KEYS) target[k] = first[k]
  for (let i = 0; i < segs.length; i++) {
    const p = segs[i].p
    if (p <= 0) continue
    const a = poses[CHAIN[i]]
    const b = poses[CHAIN[i + 1]]
    for (const k of KEYS) target[k] = a[k] + (b[k] - a[k]) * p
  }
}

/** Interactive state that is not tied to scroll. */
export const live = {
  /** Continuous carousel position (finish index, may be fractional while moving). */
  carousel: 0,
  /** Intro drop, 0 = above the screen, 1 = landed. */
  drop: 0,
  pointerX: 0,
  pointerY: 0,
  reduced: false,
  /** Reduced motion: copy the target straight into the scene on the next frame. */
  snap: true,
  pourActive: false,
  hold: false,
  tilt: 0,
  tiltV: 0,
  flow: 0,
  fill: 0,
}
