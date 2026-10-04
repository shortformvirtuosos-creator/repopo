// The engraving on the copper band of 1-pot.
//
// The two lines are set flat, then wrapped round the band: every output pixel
// is traced back onto the band's surface (a slice of a cone, see BAND in
// src/scenes.ts), so letters bunch up towards the sides and follow the slight
// dip of the band seen from above. The result is two layers meant to be laid
// over the photo: `dark` (multiply: the cut letters) and `light` (screen: the
// thin edge of light under each cut).

import { BAND } from '../scenes'
import { copy, YEAR } from '../copy'
import { upper } from './text'

export const ENGRAVE_FONT = '"Playfair Display", Georgia, serif'
export const ENGRAVE_WEIGHT = 700

const DARK = [46, 20, 9] as const
const LIGHT = [255, 212, 176] as const
/** Letter spacing, in em. */
const TRACKING = 0.07

export type Engraving = {
  dark: HTMLCanvasElement
  light: HTMLCanvasElement
  /** Where the two canvases go, in photo px. */
  x: number
  y: number
  w: number
  h: number
}

export function engravingLines(name: string, town: string): [string, string] {
  return [copy.engrave.line1(upper(name)), copy.engrave.line2(upper(town), YEAR)]
}

let capRatio = 0
function measureCap(ctx: CanvasRenderingContext2D) {
  if (capRatio) return capRatio
  ctx.font = `${ENGRAVE_WEIGHT} 100px ${ENGRAVE_FONT}`
  const m = ctx.measureText('HIEN')
  capRatio = m.actualBoundingBoxAscent > 10 ? m.actualBoundingBoxAscent / 100 : 0.708
  return capRatio
}

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas')
  c.width = Math.max(1, w)
  c.height = Math.max(1, h)
  return c
}

function setTracking(ctx: CanvasRenderingContext2D, px: number) {
  const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  if ('letterSpacing' in c) c.letterSpacing = `${px}px`
  return 'letterSpacing' in c
}

/**
 * Render the engraving for a photo `natW`×`natH` px, at `k` output px per photo px.
 * Pass `into` to reuse canvases (they are resized as needed).
 */
export function renderEngraving(
  lines: [string, string],
  natW: number,
  natH: number,
  k: number,
  into?: { dark: HTMLCanvasElement; light: HTMLCanvasElement },
): Engraving {
  const axis = BAND.axis * natW
  const top = BAND.top * natH
  const bottom = BAND.bottom * natH
  const rTop = BAND.rTop * natW
  const rBot = BAND.rBottom * natW
  const R = (v: number) => rTop + ((v - top) / (bottom - top)) * (rBot - rTop)
  const Rc = R((top + bottom) / 2)
  const halfArc = Rc * BAND.maxAngle

  const bx = BAND.box[0] * natW
  const by = BAND.box[1] * natH
  const bw = (BAND.box[2] - BAND.box[0]) * natW
  const bh = (BAND.box[3] - BAND.box[1]) * natH

  // 1. the lines, set flat: x = arc length round the band, y = photo y
  const fw = Math.ceil(2 * halfArc * k) + 4
  const fh = Math.ceil(bh * k) + 2
  const flat = canvas(fw, fh)
  const fc = flat.getContext('2d', { willReadFrequently: true })!
  const cap = measureCap(fc)
  fc.fillStyle = '#fff'
  fc.textAlign = 'center'
  fc.textBaseline = 'alphabetic'
  let edge = 1
  lines.forEach((text, i) => {
    if (!text) return
    const spec = BAND.lines[i]
    const maxW = 2 * halfArc * 0.93
    let size = (spec.cap * natH) / cap // photo px
    fc.font = `${ENGRAVE_WEIGHT} ${100}px ${ENGRAVE_FONT}`
    const tracked = setTracking(fc, 100 * TRACKING)
    const w100 = fc.measureText(text).width - (tracked ? 100 * TRACKING : 0)
    size = Math.min(size, (maxW / w100) * 100)
    const px = size * k
    fc.font = `${ENGRAVE_WEIGHT} ${px}px ${ENGRAVE_FONT}`
    const t = setTracking(fc, px * TRACKING) ? px * TRACKING : 0
    const base = (spec.mid - BAND.box[1]) * natH * k + (cap * px) / 2
    fc.fillText(text, fw / 2 + t / 2, base)
    if (i === 0) edge = Math.min(3, Math.max(1, px * 0.034))
  })
  const src = fc.getImageData(0, 0, fw, fh).data
  const alpha = new Uint8Array(fw * fh)
  for (let i = 0; i < alpha.length; i++) alpha[i] = src[i * 4 + 3]

  const sample = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= fw - 1 || y >= fh - 1) return 0
    const x0 = x | 0
    const y0 = y | 0
    const dx = x - x0
    const dy = y - y0
    const i = y0 * fw + x0
    const a = alpha[i] + (alpha[i + 1] - alpha[i]) * dx
    const b = alpha[i + fw] + (alpha[i + fw + 1] - alpha[i + fw]) * dx
    return (a + (b - a) * dy) / 255
  }

  // 2. wrap: trace each output pixel back onto the band
  const ow = Math.ceil(bw * k)
  const oh = Math.ceil(bh * k)
  const dark = into?.dark ?? canvas(ow, oh)
  const light = into?.light ?? canvas(ow, oh)
  if (dark.width !== ow || dark.height !== oh) {
    dark.width = light.width = ow
    dark.height = light.height = oh
  }
  const dc = dark.getContext('2d')!
  const lc = light.getContext('2d')!
  const di = dc.createImageData(ow, oh)
  const li = lc.createImageData(ow, oh)
  const D = di.data
  const L = li.data
  const sinMax = Math.sin(BAND.maxAngle)

  for (let oy = 0; oy < oh; oy++) {
    const y = by + (oy + 0.5) / k
    for (let ox = 0; ox < ow; ox++) {
      const x = bx + (ox + 0.5) / k
      let v = y
      let s = 0
      let c = 1
      let ok = true
      for (let it = 0; it < 3; it++) {
        const r = R(v)
        s = (x - axis) / r
        if (s <= -sinMax || s >= sinMax) {
          ok = false
          break
        }
        c = Math.sqrt(1 - s * s)
        v = y - BAND.sag * r * c
      }
      if (!ok || v < top || v > bottom) continue
      const u = Math.asin(s) * Rc
      const fx = (u + halfArc) * k
      const fy = (v - by) * k
      const m = sample(fx, fy)
      const mu = sample(fx, fy - edge)
      if (m < 0.004 && mu < 0.004) continue
      const p = (oy * ow + ox) * 4
      // the cut: dark letters, darker still along their top inner wall
      const da = Math.min(1, 0.74 * m + 0.24 * m * (1 - mu))
      if (da > 0) {
        D[p] = DARK[0]
        D[p + 1] = DARK[1]
        D[p + 2] = DARK[2]
        D[p + 3] = da * 255
      }
      // light caught by the lower edge of each cut, fading towards the sides
      const la = mu * (1 - m) * 0.62 * (0.35 + 0.65 * c)
      if (la > 0) {
        L[p] = LIGHT[0]
        L[p + 1] = LIGHT[1]
        L[p + 2] = LIGHT[2]
        L[p + 3] = la * 255
      }
    }
  }
  dc.putImageData(di, 0, 0)
  lc.putImageData(li, 0, 0)
  return { dark, light, x: bx, y: by, w: bw, h: bh }
}
