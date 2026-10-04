import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { SEG, layout, live, segs } from '../state/rig'
import { store } from '../state/store'

gsap.registerPlugin(ScrollTrigger)

export let lenis: Lenis | null = null

export const SECTION_IDS = ['s-hero', 's-engrave', 's-finish', 's-features', 's-pour', 's-set', 's-end']

const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function initSmoothScroll() {
  if (live.reduced) return
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis.stop()
}

export function unlockScroll() {
  document.documentElement.classList.remove('is-locked')
  lenis?.start()
  ScrollTrigger.refresh()
}

export function scrollToSection(i: number, then?: () => void) {
  const el = document.getElementById(SECTION_IDS[i])
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.8, easing: inOut, onComplete: () => then?.() })
  } else {
    el.scrollIntoView({ behavior: 'auto' })
    then?.()
  }
}

const lines = (scope: string) => gsap.utils.toArray<HTMLElement>(`${scope} .mask > span`)

/** Build every scroll-driven timeline. Returns a cleanup function. */
export function buildScroll(): () => void {
  ScrollTrigger.addEventListener('refreshInit', layout)
  layout()
  const ctx = gsap.context(() => (live.reduced ? buildReduced() : buildScrubbed()))

  SECTION_IDS.forEach((id, i) => {
    ScrollTrigger.create({
      trigger: '#' + id,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && store.set({ section: i }),
    })
  })
  ScrollTrigger.create({
    trigger: '#s-pour',
    start: 'top 30%',
    end: 'bottom 70%',
    onToggle: (self) => {
      live.pourActive = self.isActive
      if (!self.isActive) {
        live.hold = false
        store.set({ holding: false })
      }
    },
  })

  const onFonts = () => ScrollTrigger.refresh()
  document.fonts?.ready.then(onFonts)
  return () => {
    ScrollTrigger.removeEventListener('refreshInit', layout)
    ctx.revert()
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}

/** A transition into a section: scrubbed while its top travels from the bottom of the screen to the top. */
function enter(id: string, seg: number) {
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: '#' + id, start: 'top bottom', end: 'top top', scrub: true },
  })
  tl.fromTo(segs[seg], { p: 0 }, { p: 1, duration: 1 }, 0)
  const ls = lines('#' + id + ' .enter-head')
  if (ls.length) tl.fromTo(ls, { yPercent: 118 }, { yPercent: 0, duration: 0.42, stagger: 0.08, ease: 'power3.inOut' }, 0.42)
  const rise = gsap.utils.toArray<HTMLElement>('#' + id + ' [data-rise]')
  if (rise.length) tl.fromTo(rise, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.06 }, 0.58)
  return tl
}

function buildScrubbed() {
  // hero is revealed by the intro, then simply scrolls away
  gsap.set(lines('#s-hero'), { yPercent: 118 })
  gsap.set('#s-hero [data-fade]', { autoAlpha: 0, y: 18 })

  enter('s-engrave', SEG.heroEngrave)
  enter('s-finish', SEG.engraveFinish)
  enter('s-features', SEG.finishF1)

  // feature walk: one pinned, scrubbed timeline
  const f = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    scrollTrigger: { trigger: '#s-features', start: 'top top', end: 'bottom bottom', scrub: true },
  })
  const feat = (i: number) => ({
    lines: lines(`#s-features .feat-${i}`),
    body: `#s-features .feat-${i} .feat-body`,
  })
  const inAt = [0, 0.38, 0.7]
  const outAt = [0.26, 0.58]
  for (let i = 0; i < 3; i++) {
    const { lines: ls, body } = feat(i)
    f.fromTo(ls, { yPercent: 118 }, { yPercent: 0, duration: 0.08, stagger: 0.02 }, inAt[i])
    f.fromTo(body, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.inOut' }, inAt[i] + 0.03)
    if (i < 2) {
      f.to(ls, { yPercent: -118, duration: 0.07, stagger: 0.015 }, outAt[i])
      f.to(body, { autoAlpha: 0, y: -18, duration: 0.06, ease: 'power2.inOut' }, outAt[i])
    }
  }
  f.fromTo(segs[SEG.f1f2], { p: 0 }, { p: 1, duration: 0.13, ease: 'power2.inOut' }, 0.29)
  f.fromTo(segs[SEG.f2f3], { p: 0 }, { p: 1, duration: 0.13, ease: 'power2.inOut' }, 0.61)
  f.set({}, {}, 1)

  enter('s-pour', SEG.f3Pour)
  enter('s-set', SEG.pourSet)

  // the set: slow orbit while pinned
  gsap
    .timeline({ scrollTrigger: { trigger: '#s-set', start: 'top top', end: 'bottom bottom', scrub: true } })
    .fromTo(segs[SEG.setOrbit], { p: 0 }, { p: 1, duration: 1, ease: 'power1.inOut' })

  enter('s-end', SEG.setEnd)
}

/** Reduced motion: no scrubbing. Each section switches pose under a short fade. */
function buildReduced() {
  const canvas = document.getElementById('gl')
  let fading: gsap.core.Tween | null = null
  const jump = () => {
    fading?.kill()
    if (!canvas) {
      live.snap = true
      return
    }
    fading = gsap.to(canvas, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.inOut',
      onComplete: () => {
        live.snap = true
        fading = gsap.to(canvas, { opacity: 1, duration: 0.45, delay: 0.05, ease: 'power1.inOut' })
      },
    })
  }
  const setSeg = (i: number, on: boolean) => {
    const v = on ? 1 : 0
    if (segs[i].p !== v) {
      segs[i].p = v
      jump()
    }
  }
  const step = (id: string, seg: number) =>
    ScrollTrigger.create({
      trigger: '#' + id,
      start: 'top bottom',
      end: 'top top',
      onUpdate: (s) => setSeg(seg, s.progress >= 0.5),
      onRefresh: (s) => setSeg(seg, s.progress >= 0.5),
    })
  step('s-engrave', SEG.heroEngrave)
  step('s-finish', SEG.engraveFinish)
  step('s-features', SEG.finishF1)
  step('s-pour', SEG.f3Pour)
  step('s-set', SEG.pourSet)
  step('s-end', SEG.setEnd)

  const featEl = document.getElementById('s-features')
  ScrollTrigger.create({
    trigger: '#s-features',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (s) => {
      const k = s.progress < 0.36 ? 0 : s.progress < 0.68 ? 1 : 2
      featEl?.setAttribute('data-step', String(k))
      setSeg(SEG.f1f2, k >= 1)
      setSeg(SEG.f2f3, k >= 2)
    },
  })

  // sections fade in as they arrive
  document.querySelectorAll<HTMLElement>('.sec').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 75%', end: 'bottom 25%', toggleClass: 'is-in' })
  })
}

/** The hero arrives after the loader: the džezva drops in, the headline masks in. */
export function playIntro() {
  if (live.reduced) {
    live.drop = 1
    live.snap = true
    document.getElementById('s-hero')?.classList.add('is-in')
    unlockScroll()
    return
  }
  const tl = gsap.timeline()
  tl.to(live, { drop: 1, duration: 1.9, ease: 'power3.inOut' }, 0)
  tl.to(lines('#s-hero'), { yPercent: 0, duration: 1.2, stagger: 0.12, ease: 'power3.inOut' }, 0.85)
  tl.to('#s-hero [data-fade]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power2.inOut' }, 1.3)
  tl.add(unlockScroll, 1.2)
}
