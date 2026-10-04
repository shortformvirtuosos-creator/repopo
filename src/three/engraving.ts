import * as THREE from 'three'

// The engraving is drawn into one canvas that feeds two material slots:
//   red   -> bumpMap  (255 = metal surface, darker = deeper cut)
//   green -> alphaMap (where the cut letters are)
// The overlay mesh sits on the belly, so the letters read as cut into the metal.

export const ENGRAVE_FONT = '"Playfair Display", "Times New Roman", serif'
export const ENGRAVE_WEIGHT = 800

type Glyph = { ch: string; born: number }

const CUT_MS = 420
// stroke width (in em) and depth value; drawn inside the letter only, so the
// edges are shallow and the middle of each stroke is deepest: a V-cut.
const BEVEL: [number, number][] = [
  [0.1, 112],
  [0.058, 168],
  [0.026, 222],
]

/** The polished field the letters are cut into (fractions of the band). */
export const CARTOUCHE = { left: 0.02, right: 0.98, top: 0.1, bottom: 0.92 }

let cartouche: THREE.CanvasTexture | null = null

/** Mask for the smooth, polished field (green channel = opaque). */
export function getCartoucheTexture(): THREE.CanvasTexture {
  if (cartouche) return cartouche
  const W = 1024
  const H = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = '#000'
  g.fillRect(0, 0, W, H)
  const x = W * CARTOUCHE.left
  const y = H * CARTOUCHE.top
  const w = W * (CARTOUCHE.right - CARTOUCHE.left)
  const h = H * (CARTOUCHE.bottom - CARTOUCHE.top)
  const r = H * 0.06
  g.fillStyle = '#fff'
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
  g.fill()
  cartouche = new THREE.CanvasTexture(c)
  cartouche.anisotropy = 8
  return cartouche
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export class Engraving {
  readonly canvas: HTMLCanvasElement
  readonly texture: THREE.CanvasTexture
  private ctx: CanvasRenderingContext2D
  private layer: HTMLCanvasElement
  private lctx: CanvasRenderingContext2D
  private lines: [Glyph[], Glyph[]] = [[], []]
  private fadeFrom = 1
  private fadeTo = 1
  private fadeStart = 0
  private fadeDur = 1
  private busyUntil = 0
  private dirty = true
  private settled = false
  private measures = new Map<string, number>()
  readonly W: number
  readonly H: number

  constructor(width: number, aspect: number) {
    this.W = width
    this.H = Math.round(width / aspect)
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.W
    this.canvas.height = this.H
    this.ctx = this.canvas.getContext('2d')!
    this.layer = document.createElement('canvas')
    this.layer.width = this.W
    this.layer.height = this.H
    this.lctx = this.layer.getContext('2d')!
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.anisotropy = 8
    this.texture.generateMipmaps = true
    this.texture.minFilter = THREE.LinearMipmapLinearFilter
    this.clearCanvas()
  }

  get text(): [string, string] {
    return [this.lines[0].map((g) => g.ch).join(''), this.lines[1].map((g) => g.ch).join('')]
  }

  /** Fonts changed (e.g. a Cyrillic subset finished loading): redraw. */
  invalidate() {
    this.measures.clear()
    this.dirty = true
  }

  clear() {
    this.lines = [[], []]
    this.fadeFrom = this.fadeTo = 1
    this.dirty = true
  }

  fade(to: number, ms: number, now: number) {
    this.fadeFrom = this.currentFade(now)
    this.fadeTo = to
    this.fadeStart = now
    this.fadeDur = Math.max(1, ms)
    this.busyUntil = Math.max(this.busyUntil, now + ms + 20)
    this.settled = false
  }

  /** Set both lines; new letters are cut in one after another. */
  set(l1: string, l2: string, now: number, stagger = 55, delay = 0) {
    const [a, newA] = this.diff(this.lines[0], l1, now + delay, stagger)
    const [b] = this.diff(this.lines[1], l2, now + delay + newA * stagger, stagger)
    this.lines = [a, b]
    let last = now
    for (const g of [...a, ...b]) last = Math.max(last, g.born)
    this.busyUntil = Math.max(this.busyUntil, last + CUT_MS + 30)
    this.dirty = true
    this.settled = false
  }

  /** Time when the last letter finishes cutting. */
  get doneAt() {
    return this.busyUntil
  }

  /** Draw immediately with every letter fully cut (used for the share image). */
  drawFinal(l1: string, l2: string) {
    this.lines = [Array.from(l1).map((ch) => ({ ch, born: -1e9 })), Array.from(l2).map((ch) => ({ ch, born: -1e9 }))]
    this.fadeFrom = this.fadeTo = 1
    this.draw(performance.now())
    this.texture.needsUpdate = true
    this.dirty = false
  }

  /** Call every frame; returns true when the texture changed. */
  update(now: number): boolean {
    // keep drawing until one frame lands after the animation ended, so a slow
    // frame can never leave half-cut letters on the džezva
    if (!this.dirty && this.settled) return false
    this.draw(now)
    this.texture.needsUpdate = true
    this.dirty = false
    this.settled = now > this.busyUntil
    return true
  }

  private diff(old: Glyph[], text: string, start: number, stagger: number): [Glyph[], number] {
    const chars = Array.from(text)
    let p = 0
    while (p < old.length && p < chars.length && old[p].ch === chars[p]) p++
    let s = 0
    while (
      s < old.length - p &&
      s < chars.length - p &&
      old[old.length - 1 - s].ch === chars[chars.length - 1 - s]
    )
      s++
    const out: Glyph[] = old.slice(0, p)
    const fresh = chars.length - p - s
    for (let i = 0; i < fresh; i++) out.push({ ch: chars[p + i], born: start + i * stagger })
    out.push(...old.slice(old.length - s))
    return [out, fresh]
  }

  private currentFade(now: number) {
    const t = Math.min(1, Math.max(0, (now - this.fadeStart) / this.fadeDur))
    return this.fadeFrom + (this.fadeTo - this.fadeFrom) * ease(t)
  }

  private clearCanvas() {
    this.ctx.globalAlpha = 1
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.fillStyle = 'rgb(255,0,0)'
    this.ctx.fillRect(0, 0, this.W, this.H)
  }

  private measure(font: string, text: string): number {
    const key = font + '|' + text
    let w = this.measures.get(key)
    if (w === undefined) {
      this.lctx.font = font
      w = this.lctx.measureText(text).width
      this.measures.set(key, w)
    }
    return w
  }

  private draw(now: number) {
    const { W, H, lctx } = this
    this.clearCanvas()
    lctx.clearRect(0, 0, W, H)
    lctx.textBaseline = 'alphabetic'
    lctx.lineJoin = 'round'

    const spec = [
      { glyphs: this.lines[0], max: H * 0.29, avail: W * 0.86, base: H * 0.44, track: 0.035 },
      { glyphs: this.lines[1], max: H * 0.17, avail: W * 0.72, base: H * 0.78, track: 0.12 },
    ]
    let line1Done = 0
    spec.forEach((ln, li) => {
      if (!ln.glyphs.length) return
      const text = ln.glyphs.map((g) => g.ch).join('')
      const ref = `${ENGRAVE_WEIGHT} 100px ${ENGRAVE_FONT}`
      const n = ln.glyphs.length
      const w100 = this.measure(ref, text) + (n - 1) * ln.track * 100
      const size = Math.min(ln.max, (ln.avail / w100) * 100)
      const font = `${ENGRAVE_WEIGHT} ${size.toFixed(2)}px ${ENGRAVE_FONT}`
      const track = ln.track * size
      const total = this.measure(font, text) + (n - 1) * track
      let x0 = (W - total) / 2
      const pad = size * 0.12
      lctx.font = font
      for (let i = 0; i < n; i++) {
        const g = ln.glyphs[i]
        const before = this.measure(font, text.slice(0, i)) + i * track
        const adv = this.measure(font, text.slice(0, i + 1)) - this.measure(font, text.slice(0, i))
        const x = x0 + before
        const p = ease(Math.min(1, Math.max(0, (now - g.born) / CUT_MS)))
        if (li === 0 && i === n - 1) line1Done = p
        if (p <= 0 || g.ch === ' ') continue
        lctx.save()
        lctx.beginPath()
        lctx.rect(x - pad, 0, (adv + pad * 2) * p, H)
        lctx.clip()
        lctx.globalCompositeOperation = 'source-over'
        lctx.fillStyle = 'rgb(38,255,0)'
        lctx.fillText(g.ch, x, ln.base)
        lctx.globalCompositeOperation = 'source-atop'
        for (const [w, r] of BEVEL) {
          lctx.lineWidth = w * size
          lctx.strokeStyle = `rgb(${r},255,0)`
          lctx.strokeText(g.ch, x, ln.base)
        }
        lctx.restore()
      }
      x0 = 0
    })

    // a thin cut rule with a small diamond between the two lines
    if (this.lines[0].length && line1Done > 0) {
      const cx = W / 2
      const y = H * 0.565
      const half = W * 0.2 * line1Done
      lctx.save()
      lctx.globalCompositeOperation = 'source-over'
      lctx.fillStyle = 'rgb(150,255,0)'
      lctx.fillRect(cx - half, y - H * 0.004, half * 2, H * 0.008)
      const d = H * 0.022 * line1Done
      lctx.beginPath()
      lctx.moveTo(cx, y - d)
      lctx.lineTo(cx + d, y)
      lctx.lineTo(cx, y + d)
      lctx.lineTo(cx - d, y)
      lctx.closePath()
      lctx.fillStyle = 'rgb(70,255,0)'
      lctx.fill()
      lctx.restore()
    }

    this.ctx.globalAlpha = this.currentFade(now)
    this.ctx.drawImage(this.layer, 0, 0)
    this.ctx.globalAlpha = 1
    this.drawBorder()
  }

  /** Two fine cut lines framing the polished field; always there. */
  private drawBorder() {
    const { ctx, W, H } = this
    ctx.fillStyle = 'rgb(120,255,0)'
    for (const y of [CARTOUCHE.top + 0.035, CARTOUCHE.bottom - 0.035]) {
      ctx.fillRect(W * (CARTOUCHE.left + 0.012), H * y - H * 0.003, W * (CARTOUCHE.right - CARTOUCHE.left - 0.024), H * 0.006)
    }
  }
}
