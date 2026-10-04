import gsap from 'gsap'
import { BASE_ACCENT, FINISHES, NEAR_BLACK } from '../three/finishes'
import { live, target, updateTarget } from '../state/rig'
import { store } from '../state/store'

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const mix = (a: string, b: string, t: number) => {
  const x = hex(a)
  const y = hex(b)
  const k = Math.min(1, Math.max(0, t))
  return `rgb(${Math.round(x[0] + (y[0] - x[0]) * k)}, ${Math.round(x[1] + (y[1] - x[1]) * k)}, ${Math.round(x[2] + (y[2] - x[2]) * k)})`
}

/**
 * Page colour, accents and the scroll progress line. The background is
 * near-black at the top and floods with the picked finish from the finish
 * picker onwards.
 */
export function startDomLoop(): () => void {
  const root = document.documentElement
  const bgEl = document.getElementById('bg')!
  const floodEl = document.getElementById('flood')!
  const bar = document.getElementById('progress-bar')
  const meta = document.querySelector('meta[name="theme-color"]')
  let shownBg = FINISHES[store.get().finish].bg
  let shownFinish = store.get().finish
  let lastBg = ''
  let lastAcc = ''
  let lastInk = ''
  let lastMeta = ''
  let lastP = -1
  let floodTween: gsap.core.Tween | null = null

  const tick = () => {
    updateTarget()
    const f = FINISHES[store.get().finish]
    const k = target.flood
    const bg = mix(NEAR_BLACK, shownBg, k)
    if (bg !== lastBg) {
      bgEl.style.backgroundColor = bg
      lastBg = bg
    }
    const acc = mix(BASE_ACCENT, f.accent, k)
    if (acc !== lastAcc) {
      root.style.setProperty('--accent', acc)
      lastAcc = acc
    }
    const ink = k > 0.5 ? f.accentInk : '#1b0d06'
    if (ink !== lastInk) {
      root.style.setProperty('--accent-ink', ink)
      lastInk = ink
    }
    const metaColor = mix(NEAR_BLACK, shownBg, Math.round(k * 4) / 4)
    if (meta && metaColor !== lastMeta) {
      meta.setAttribute('content', metaColor)
      lastMeta = metaColor
    }
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (Math.abs(p - lastP) > 0.0005) {
        bar.style.transform = `scaleX(${p.toFixed(4)})`
        lastP = p
      }
    }
  }
  gsap.ticker.add(tick)

  // picking a finish floods the screen with its colour from the džezva outwards
  const unsub = store.subscribe(() => {
    const fi = store.get().finish
    if (fi === shownFinish) return
    shownFinish = fi
    const next = FINISHES[fi].bg
    floodTween?.kill()
    if (live.reduced || target.flood < 0.3) {
      shownBg = next
      floodEl.style.visibility = 'hidden'
      return
    }
    floodEl.style.backgroundColor = mix(NEAR_BLACK, next, target.flood)
    floodEl.style.visibility = 'visible'
    floodTween = gsap.fromTo(
      floodEl,
      { clipPath: 'circle(0% at 50% 46%)' },
      {
        clipPath: 'circle(150% at 50% 46%)',
        duration: 1.1,
        ease: 'power2.inOut',
        onComplete: () => {
          shownBg = next
          tick()
          floodEl.style.visibility = 'hidden'
        },
      },
    )
  })

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    live.pointerX = (e.clientX / window.innerWidth) * 2 - 1
    live.pointerY = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  return () => {
    gsap.ticker.remove(tick)
    unsub()
    window.removeEventListener('pointermove', onPointer)
  }
}
