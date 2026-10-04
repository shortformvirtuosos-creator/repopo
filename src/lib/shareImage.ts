// The 1080×1350 picture that gets shared: the pot from 1-pot with the family
// engraved on its band, "DŽEZVA PORODICE {PREZIME}" and the town above it,
// "Dođi na kafu." and the site address at the bottom.

import { BAND, PHOTOS, POT } from '../scenes'
import { copy } from '../copy'
import { engravingLines, renderEngraving } from './engrave'
import { displayHost } from './link'
import { upper } from './text'

export const SHARE_W = 1080
export const SHARE_H = 1350

const HEAD = 'Anton, Oswald, Impact, sans-serif'
const BODY = 'Inter, system-ui, sans-serif'

let photo: Promise<HTMLImageElement> | null = null

function loadPhoto(): Promise<HTMLImageElement> {
  if (!photo) {
    const files = PHOTOS['1-pot'].files
    const best = files[files.length - 1]
    photo = new Promise((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = () => {
        photo = null
        reject(new Error('photo'))
      }
      img.src = new URL(best.file, document.baseURI).toString()
    })
  }
  return photo
}

function tracked(ctx: CanvasRenderingContext2D, px: number) {
  const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  if ('letterSpacing' in c) {
    c.letterSpacing = `${px}px`
    return px
  }
  return 0
}

/** Centred text with tracking (the trailing space tracking adds is taken back). */
function centred(ctx: CanvasRenderingContext2D, text: string, y: number, spacing = 0) {
  const t = tracked(ctx, spacing)
  ctx.fillText(text, SHARE_W / 2 + t / 2, y)
  tracked(ctx, 0)
}

export async function renderShareImage(name: string, town: string): Promise<HTMLCanvasElement> {
  const img = await loadPhoto()
  const natW = img.naturalWidth
  const natH = img.naturalHeight
  await Promise.all(
    [`400 100px Anton`, `700 100px Oswald`, `600 30px Inter`, `500 26px Inter`].map((f) =>
      document.fonts.load(f, `${name} ${town} ${upper(name)} ČĆŠŽĐ`).catch(() => null),
    ),
  )

  const c = document.createElement('canvas')
  c.width = SHARE_W
  c.height = SHARE_H
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, SHARE_W, SHARE_H)

  // the pot, 580 px tall, centred on its axis, rim at y 470
  const potTop = 470
  const potH = 580
  const k = potH / ((POT[3] - POT[1]) * natH)
  const left = SHARE_W / 2 - BAND.axis * natW * k
  const top = potTop - POT[1] * natH * k
  ctx.drawImage(img, left, top, natW * k, natH * k)

  // the engraving, laid into the copper the same way as on the page
  const e = renderEngraving(engravingLines(name, town), natW, natH, k * 1.5)
  const ex = left + e.x * k
  const ey = top + e.y * k
  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(e.dark, ex, ey, e.w * k, e.h * k)
  ctx.globalCompositeOperation = 'screen'
  ctx.drawImage(e.light, ex, ey, e.w * k, e.h * k)
  ctx.globalCompositeOperation = 'source-over'

  // black above (the steam melts into it) and below (the stone fades out)
  const fadeTop = ctx.createLinearGradient(0, 0, 0, potTop - 8)
  fadeTop.addColorStop(0, '#000')
  fadeTop.addColorStop(0.8, '#000')
  fadeTop.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = fadeTop
  ctx.fillRect(0, 0, SHARE_W, potTop - 8)
  const potBottom = potTop + potH
  const fadeBottom = ctx.createLinearGradient(0, potBottom + 6, 0, potBottom + 104)
  fadeBottom.addColorStop(0, 'rgba(0,0,0,0)')
  fadeBottom.addColorStop(1, '#000')
  ctx.fillStyle = fadeBottom
  ctx.fillRect(0, potBottom + 6, SHARE_W, SHARE_H - potBottom - 6)

  // words
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  ctx.font = `400 50px ${HEAD}`
  centred(ctx, copy.shareImage.title, 122, 50 * 0.05)

  const surname = upper(name)
  let size = 150
  ctx.font = `400 ${size}px ${HEAD}`
  const w = ctx.measureText(surname).width
  if (w > 960) size = Math.floor((size * 960) / w)
  ctx.font = `400 ${size}px ${HEAD}`
  const nameBase = 122 + 20 + size * 1.04
  centred(ctx, surname, nameBase)

  if (town) {
    ctx.fillStyle = 'rgba(255,255,255,0.86)'
    ctx.font = `600 30px ${BODY}`
    centred(ctx, upper(town), nameBase + 58, 30 * 0.2)
  }

  ctx.fillStyle = '#fff'
  ctx.font = `400 64px ${HEAD}`
  centred(ctx, copy.shareImage.bottom, SHARE_H - 104)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = `500 26px ${BODY}`
  centred(ctx, displayHost(), SHARE_H - 54, 26 * 0.04)
  return c
}

/** Start loading the photo early so the first share is quick. */
export const preloadSharePhoto = () => loadPhoto().catch(() => null)
