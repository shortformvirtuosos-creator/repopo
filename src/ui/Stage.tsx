import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BAND, PHOTOS, SCENES, ZOOM } from '../scenes'
import { copy } from '../copy'
import { store } from '../state/store'
import { clean } from '../lib/text'
import { ENGRAVE_FONT, ENGRAVE_WEIGHT, engravingLines, renderEngraving } from '../lib/engrave'
import { reducedMotion } from '../lib/env'

/** What is engraved right now: the visitor's family, a shared one, or the next example. */
export function engravedFamily(): [string, string] {
  const s = store.get()
  const name = clean(s.name)
  const town = clean(s.town)
  if (name || town) return [name, town]
  return copy.engrave.examples[s.example]
}

const pct = (n: number) => `${(n * 100).toFixed(3)}%`

/** Full-screen photographs, stacked. Positions come from src/lib/layout.ts. */
export function Stage() {
  return (
    <div id="stage" aria-hidden="true">
      {SCENES.map((s, i) => {
        const info = PHOTOS[s.photo]
        const files = info.files
        return (
          <div className="photo" id={`photo-${i}`} key={s.id}>
            <div className="plate" id={`plate-${i}`}>
              <div className="plate-inner">
                <img
                  src={files[0].file}
                  srcSet={files.map((f) => `${f.file} ${f.w}w`).join(', ')}
                  sizes={`${Math.ceil(Math.max(window.innerWidth, window.innerHeight * (info.w / info.h)))}px`}
                  width={info.w}
                  height={info.h}
                  alt=""
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  draggable={false}
                />
                {s.seams?.map(([x0, y0, x1, y1], k) => (
                  <div className="seam" key={k} style={{ left: pct(x0), top: pct(y0), width: pct(x1 - x0), height: pct(y1 - y0) }} />
                ))}
                {i === 0 && <Engraving />}
              </div>
            </div>
            <div className="fade" />
          </div>
        )
      })}
    </div>
  )
}

/**
 * The family name cut into the band of 1-pot. It lives inside the photo's
 * plate, so it zooms and moves with the photo at every screen size.
 */
function Engraving() {
  const wrap = useRef<HTMLDivElement>(null)
  const dark = useRef<HTMLCanvasElement>(null)
  const light = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current!
    const plate = el.parentElement!
    let drawn = ''
    let raf = 0
    let alive = true

    const draw = async () => {
      const [name, town] = engravedFamily()
      const lines = engravingLines(name, town)
      const W = plate.offsetWidth
      const H = plate.offsetHeight
      if (!W || !H) return
      const k = Math.min(3, (window.devicePixelRatio || 1) * ZOOM)
      const key = `${lines.join('|')}|${W}|${H}|${k}`
      if (key === drawn) return
      await document.fonts.load(`${ENGRAVE_WEIGHT} 40px ${ENGRAVE_FONT}`, lines.join(' ')).catch(() => null)
      if (!alive) return
      drawn = key
      renderEngraving(lines, W, H, k, { dark: dark.current!, light: light.current! })
      el.dataset.ready = '1'
    }
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => void draw())
    }

    // while the fields are empty, the examples take turns
    let timer = 0
    let fading: gsap.core.Tween | null = null
    const examplesOn = () => {
      const s = store.get()
      return !clean(s.name) && !clean(s.town) && !s.overlay
    }
    const cycle = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!examplesOn() || document.hidden) return cycle()
        const next = (store.get().example + 1) % copy.engrave.examples.length
        if (reducedMotion()) {
          store.set({ example: next })
          return cycle()
        }
        fading = gsap.to(el, {
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.in',
          onComplete: () => {
            store.set({ example: next })
            void draw().then(() => {
              fading = gsap.to(el, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' })
            })
            cycle()
          },
        })
      }, 2600)
    }
    cycle()

    let last = engravedFamily().join('|')
    const unsub = store.subscribe(() => {
      const now = engravedFamily().join('|')
      if (now === last) return
      last = now
      if (!examplesOn()) {
        fading?.kill()
        gsap.set(el, { autoAlpha: 1 })
      }
      schedule()
    })
    const ro = new ResizeObserver(schedule)
    ro.observe(plate)
    void draw()
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      fading?.kill()
      unsub()
      ro.disconnect()
    }
  }, [])

  const [x0, y0, x1, y1] = BAND.box
  return (
    <div className="engraving" ref={wrap} style={{ left: pct(x0), top: pct(y0), width: pct(x1 - x0), height: pct(y1 - y0) }}>
      <canvas className="engr-dark" ref={dark} />
      <canvas className="engr-light" ref={light} />
    </div>
  )
}
