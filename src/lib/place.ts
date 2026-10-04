// Puts the computed layout on the page: photo plates, phone fades, text zones,
// and headline sizes that fit each zone.

import { computeLayout, isPhoneLayout, overlaps, type Layout, type Rect } from './layout'
import { store } from '../state/store'

let current: Layout | null = null
export const currentLayout = () => current

/** Per scene: would the wordmark / the top "Podijeli" sit on something that must stay clear? */
let clash: { mark: boolean; share: boolean }[] = []
export const chromeClash = () => clash

function chromeRect(sel: string): Rect | null {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

function fitZone(zone: HTMLElement, rect: Rect, phone: boolean, H: number) {
  const inner = zone.firstElementChild as HTMLElement | null
  const hl = zone.querySelector<HTMLElement>('.headline')
  if (!inner) return
  if (!hl) return
  const visible = () => Array.from(hl.querySelectorAll<HTMLElement>('.hl-set')).filter((s) => s.offsetParent !== null)
  const max = phone ? Math.min(92, H * 0.11) : Math.min(210, H * 0.21)
  const min = phone ? 26 : 34
  let size = max
  hl.style.fontSize = `${size}px`
  for (let i = 0; i < 4; i++) {
    let widest = 0
    visible().forEach((set) =>
      set.querySelectorAll<HTMLElement>('.mask > span').forEach((s) => {
        widest = Math.max(widest, s.offsetWidth)
      }),
    )
    const h = inner.offsetHeight
    const f = Math.min(1, rect.w / Math.max(1, widest), rect.h / Math.max(1, h))
    if (f > 0.995) break
    // the headline is most of the height: scale it, then measure again
    const hh = hl.offsetHeight
    const rest = h - hh
    const byHeight = hh > 0 ? Math.max(0.2, (rect.h - rest) / hh) : 1
    const next = size * Math.min(rect.w / Math.max(1, widest), byHeight, 1) * 0.985
    size = Math.max(min, Math.min(size, next))
    hl.style.fontSize = `${size}px`
  }
}

export function place() {
  const stage = document.getElementById('stage')
  const texts = document.getElementById('texts')
  if (!stage || !texts) return
  const W = stage.clientWidth
  const H = stage.clientHeight
  const phone = isPhoneLayout()
  const layout = computeLayout(W, H, phone, texts.clientHeight || H)
  current = layout
  document.documentElement.dataset.layout = phone ? 'phone' : 'desk'
  store.set({ phone })

  layout.scenes.forEach((s, i) => {
    const plate = document.getElementById(`plate-${i}`)
    if (plate) {
      const p = s.plate
      plate.style.left = `${p.left}px`
      plate.style.top = `${p.top}px`
      plate.style.width = `${p.width}px`
      plate.style.height = `${p.height}px`
      plate.style.transformOrigin = `${p.ox}px ${p.oy}px`
    }
    const fade = document.querySelector<HTMLElement>(`#photo-${i} .fade`)
    if (fade) {
      if (s.fade) {
        const { solid, mid, end } = s.fade
        fade.style.display = 'block'
        fade.style.height = `${Math.ceil(end)}px`
        fade.style.background = `linear-gradient(to bottom, #000 0px, #000 ${solid}px, rgba(0,0,0,0.62) ${mid}px, rgba(0,0,0,0) ${end}px)`
      } else {
        fade.style.display = 'none'
      }
    }
  })

  const mark = chromeRect('.chrome .wordmark')
  const btn = chromeRect('.chrome .btn-sm')
  clash = layout.scenes.map((s) => {
    // on phones the chrome sits on the solid black of the fade
    const covered = (r: Rect) => s.fade !== null && s.fade.solid >= r.y + r.h + 4
    const hits = (r: Rect | null) => r !== null && !covered(r) && s.clear.some((c) => overlaps(r, c))
    return { mark: hits(mark), share: hits(btn) }
  })
  window.dispatchEvent(new Event('ceif:placed'))

  document.querySelectorAll<HTMLElement>('#texts .zone').forEach((zone) => {
    const [i, name] = (zone.dataset.zone ?? '').split(':')
    const rect = layout.scenes[Number(i)]?.zones[name]
    if (!rect) return
    zone.style.left = `${rect.x}px`
    zone.style.top = `${rect.y}px`
    zone.style.width = `${rect.w}px`
    zone.style.height = `${rect.h}px`
    fitZone(zone, rect, phone, H)
  })
}

/** Keep everything placed as the window changes. */
export function startPlacing(): () => void {
  let raf = 0
  const again = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(place)
  }
  place()
  document.fonts?.ready.then(again)
  window.addEventListener('resize', again)
  window.addEventListener('orientationchange', again)
  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', again)
    window.removeEventListener('orientationchange', again)
  }
}
