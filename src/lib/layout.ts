// Where every photo and every block of text goes on the current screen.
//
// Each photo covers the screen (no bars). Text zones are areas of the photo
// (see src/scenes.ts) mapped to the screen at both ends of the slow zoom and
// intersected, so text placed inside them never ends up over the subject.

import { SCENES, ZOOM, aspect, type Box, type Scene } from '../scenes'

export type Rect = { x: number; y: number; w: number; h: number }

export type PlateLayout = {
  left: number
  top: number
  width: number
  height: number
  /** zoom origin in px, relative to the plate */
  ox: number
  oy: number
}

export type SceneLayout = {
  plate: PlateLayout
  zones: Record<string, Rect>
  /** Screen boxes (at both ends of the zoom) of what nothing may cover. */
  clear: Rect[]
  /** phone only: black fade behind the text at the top (solid black, 62% at `mid`, clear at `end`) */
  fade: { solid: number; mid: number; end: number } | null
}

export type Layout = { phone: boolean; W: number; H: number; scenes: SceneLayout[] }

/** Portrait screens use the phone layout (crop centred on the subject, text on top). */
export const PHONE_QUERY = '(max-aspect-ratio: 4/5), (max-width: 599px)'
/** The opposite of PHONE_QUERY. */
export const DESK_QUERY = '(min-aspect-ratio: 801/1000) and (min-width: 600px)'
export const isPhoneLayout = () => matchMedia(PHONE_QUERY).matches

export function insets(phone: boolean, W: number) {
  return phone
    ? { side: 20, top: 74, bottom: 18 }
    : { side: Math.round(Math.min(64, Math.max(28, W * 0.034))), top: 92, bottom: 40 }
}

function plateFor(scene: Scene, W: number, H: number, phone: boolean): PlateLayout {
  const A = aspect(scene.photo)
  const width = Math.max(W, H * A)
  const height = width / A
  let left: number
  let top: number
  let origin: [number, number]
  if (phone) {
    const p = scene.phone
    left = Math.min(0, Math.max(W - width, W / 2 - p.focus * width))
    top = Math.round(p.drop * H) + (H - height) / 2
    origin = p.origin
  } else {
    const d = scene.desktop
    left = (W - width) * d.crop[0]
    top = (H - height) * d.crop[1]
    origin = d.origin
  }
  return { left, top, width, height, ox: origin[0] * width, oy: origin[1] * height }
}

/** Screen position of a photo point at zoom z. */
function toScreen(p: PlateLayout, u: number, v: number, z: number): [number, number] {
  return [p.left + p.ox + (u * p.width - p.ox) * z, p.top + p.oy + (v * p.height - p.oy) * z]
}

function boxOnScreen(p: PlateLayout, box: Box, z: number): Rect {
  const [x0, y0] = toScreen(p, box[0], box[1], z)
  const [x1, y1] = toScreen(p, box[2], box[3], z)
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

export const overlaps = (a: Rect, b: Rect, pad = 6) =>
  a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad

function zoneRect(p: PlateLayout, box: Box, W: number, H: number, phone: boolean): Rect {
  const [a0, b0] = toScreen(p, box[0], box[1], 1)
  const [a1, b1] = toScreen(p, box[2], box[3], 1)
  const [c0, d0] = toScreen(p, box[0], box[1], ZOOM)
  const [c1, d1] = toScreen(p, box[2], box[3], ZOOM)
  const m = insets(phone, W)
  const x0 = Math.max(a0, c0, m.side)
  const y0 = Math.max(b0, d0, m.top)
  const x1 = Math.min(a1, c1, W - m.side)
  const y1 = Math.min(b1, d1, H - m.bottom)
  return { x: Math.round(x0), y: Math.round(y0), w: Math.max(0, Math.round(x1 - x0)), h: Math.max(0, Math.round(y1 - y0)) }
}

/** `Hs` is the height text may use (the small viewport on phones, where browser bars can cover the bottom). */
export function computeLayout(W: number, H: number, phone: boolean, Hs = H): Layout {
  const scenes = SCENES.map((scene) => {
    const plate = plateFor(scene, W, H, phone)
    const boxes = phone ? scene.phone.zones : scene.desktop.zones
    const zones: Record<string, Rect> = {}
    for (const k in boxes) zones[k] = zoneRect(plate, boxes[k], W, Math.min(H, Hs), phone)
    let fade: SceneLayout['fade'] = null
    if (phone) {
      // solid black behind the text, melting away in the 50 px between the
      // zones and the subject (the zones in src/scenes.ts leave that gap)
      const bottom = Math.max(...Object.entries(zones).filter(([k]) => k !== 'foot').map(([, r]) => r.y + r.h))
      const solid = Math.max(plate.top + 24, bottom - 40)
      const mid = Math.max(solid + 30, bottom)
      fade = { solid, mid, end: mid + 50 }
    }
    const clear = scene.keepClear.flatMap((b) => [1, ZOOM].map((z) => boxOnScreen(plate, b, z)))
    return { plate, zones, fade, clear }
  })
  return { phone, W, H, scenes }
}
