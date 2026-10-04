// Scrolling. The photos and words live in fixed layers; scrolling through the
// tall #track scrubs one timeline whose time is measured in screen heights:
// each photo zooms in slowly, then cross-fades into the next one, and the
// headlines slide up out of their masks.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { SCENES, ZOOM } from '../scenes'
import { DESK_QUERY, PHONE_QUERY } from './layout'
import { reducedMotion } from './env'
import { chromeClash } from './place'

gsap.registerPlugin(ScrollTrigger)

export let lenis: Lenis | null = null
let master: gsap.core.Timeline | null = null

/** Where each scene starts on the timeline (screen heights). */
export const STARTS = SCENES.reduce<number[]>((a, _s, i) => (a.push(i ? a[i - 1] + SCENES[i - 1].length : 0), a), [])
export const TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].length

/** Half the cross-fade between two photos. */
const X = 0.26

/** Moments worth landing on (used by buttons and the screenshot script). */
export const MOMENTS = {
  pot: 0,
  /** phone: the fields are in */
  potFields: 1.45,
  explosion: STARTS[1] + 0.7,
  copper: STARTS[2] + 0.7,
  pour: STARTS[3] + 0.7,
  set: STARTS[4] + 0.6,
  ending: TOTAL,
}

const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function initSmoothScroll() {
  if (reducedMotion()) return
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
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

/** Scroll position for a moment on the timeline. */
function yFor(t: number) {
  const st = master?.scrollTrigger
  if (!st) return 0
  return st.start + ((st.end - st.start) * Math.min(TOTAL, Math.max(0, t))) / TOTAL
}

export function scrollToTime(t: number, then?: () => void, immediate = false) {
  const y = yFor(t)
  if (Math.abs(window.scrollY - y) < 2) {
    // already there (Lenis would not call back)
    then?.()
    return
  }
  if (lenis && !immediate) {
    const d = Math.abs(window.scrollY - y) / window.innerHeight
    lenis.scrollTo(y, { duration: Math.min(2.4, 0.6 + d * 0.35), easing: inOut, onComplete: () => then?.() })
  } else {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
    then?.()
  }
}

/** Bring the surname field into view and focus it. */
export function focusSurname() {
  const phone = matchMedia(PHONE_QUERY).matches
  scrollToTime(phone ? MOMENTS.potFields : 0, () => {
    // after React has shown the fields (when coming from a shared link)
    requestAnimationFrame(() => {
      const el = document.getElementById('in-prezime') as HTMLInputElement | null
      el?.focus({ preventScroll: true })
    })
  })
}

const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel)

/** Build the scroll timeline. Rebuilt when the screen switches between the phone and desktop layouts. */
export function buildScroll(): () => void {
  const mm = gsap.matchMedia()
  mm.add({ phone: PHONE_QUERY, desk: DESK_QUERY }, (ctx) => {
    build(Boolean(ctx.conditions?.phone))
  })
  const onFonts = () => ScrollTrigger.refresh()
  document.fonts?.ready.then(onFonts)
  window.addEventListener('ceif:placed', updateChrome)
  return () => {
    window.removeEventListener('ceif:placed', updateChrome)
    mm.revert()
    master = null
  }
}

/** Hide the wordmark or the top "Podijeli" while a photo that it would cover is on screen. */
function updateChrome() {
  const st = master?.scrollTrigger
  const t = st ? st.progress * TOTAL : 0
  const clash = chromeClash()
  let mark = false
  let share = false
  SCENES.forEach((_, i) => {
    const from = i === 0 ? -1 : STARTS[i] - X
    const to = i === SCENES.length - 1 ? TOTAL + 1 : STARTS[i + 1] + X
    if (t < from || t > to || !clash[i]) return
    mark ||= clash[i].mark
    share ||= clash[i].share
  })
  const root = document.documentElement.classList
  root.toggle('clear-mark', mark)
  root.toggle('clear-share', share)
}

function build(phone: boolean) {
  const reduced = reducedMotion()
  const v = phone ? '.v-phone' : '.v-desk'
  const lines = (scope: string) => q(`${scope} ${v} .mask > span, ${scope} .v-all .mask > span`)
  const rise = (scope: string) => q(`${scope} [data-rise]`)
  const zoom = reduced ? 1 : ZOOM

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '#track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduced ? true : lenis ? true : 0.5,
      onUpdate: updateChrome,
      onRefresh: updateChrome,
    },
  })
  master = tl
  tl.set({}, {}, TOTAL)

  // photos: slow zoom, cross-fade into the next, hide the one underneath
  SCENES.forEach((_, i) => {
    const photo = `#photo-${i}`
    const plate = `#plate-${i}`
    const z0 = i === 0 ? 0 : STARTS[i] - X
    const z1 = i === SCENES.length - 1 ? TOTAL : STARTS[i + 1] + X
    tl.fromTo(plate, { scale: 1 }, { scale: zoom, duration: z1 - z0 }, z0)
    if (i > 0) tl.fromTo(photo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 * X, ease: 'power1.inOut' }, STARTS[i] - X)
    if (i < SCENES.length - 1) tl.set(photo, { autoAlpha: 0 }, STARTS[i + 1] + X + 0.001)
  })

  const enter = (scope: string, at: number) => {
    const ls = lines(scope)
    if (ls.length) {
      if (reduced) tl.fromTo(ls, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, at)
      else tl.fromTo(ls, { yPercent: 130 }, { yPercent: 0, duration: 0.34, stagger: 0.05, ease: 'power3.out' }, at)
    }
    const rs = rise(scope)
    if (rs.length) tl.fromTo(rs, { autoAlpha: 0, y: reduced ? 0 : 26 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }, at + 0.12)
  }
  const exit = (scope: string, at: number) => {
    const ls = lines(scope)
    if (ls.length) {
      if (reduced) tl.fromTo(ls, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2, immediateRender: false }, at)
      else tl.fromTo(ls, { yPercent: 0 }, { yPercent: -130, duration: 0.28, stagger: 0.035, ease: 'power3.in', immediateRender: false }, at)
    }
    const rs = rise(scope)
    if (rs.length) tl.fromTo(rs, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: reduced ? 0 : -18, duration: 0.22, ease: 'power2.in', immediateRender: false }, at)
  }

  // 1. the pot. Desktop: headline and fields together. Phone: headline, then the fields.
  if (phone) {
    exit('#t-pot .z-head', 0.5)
    enter('#t-pot .z-ctrl', 0.78)
    exit('#t-pot .z-ctrl', STARTS[1] - 0.56)
  } else {
    exit('#t-pot .z-head', STARTS[1] - 0.6)
    exit('#t-pot .z-ctrl', STARTS[1] - 0.6)
  }

  // 2–4
  ;['#t-explosion', '#t-copper', '#t-pour'].forEach((id, k) => {
    const i = k + 1
    enter(id, STARTS[i] + 0.04)
    exit(id, STARTS[i + 1] - 0.56)
  })

  // 5. "Dođi na kafu.", then the ending on the same photo
  const s5 = STARTS[4]
  enter('#t-set', s5 + 0.04)
  exit('#t-set', s5 + 0.95)
  enter('#t-end', s5 + 1.25)
}

/** The page arrives after the loader: the photo fades up, the headline masks in. */
export function playIntro() {
  const phone = matchMedia(PHONE_QUERY).matches
  const v = phone ? '.v-phone' : '.v-desk'
  const lines = q(`#t-pot ${v} .mask > span, #t-pot .v-all .mask > span`)
  const rise = q(phone ? '#t-pot .z-head [data-rise]' : '#t-pot .z-head [data-rise], #t-pot .z-ctrl [data-rise]')
  if (reducedMotion()) {
    gsap.set('#stage', { autoAlpha: 1 })
    gsap.set(lines, { yPercent: 0, autoAlpha: 1 })
    gsap.set(rise, { autoAlpha: 1, y: 0 })
    unlockScroll()
    return
  }
  const tl = gsap.timeline()
  tl.fromTo('#stage', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
  tl.fromTo('#plate-0 .plate-inner', { scale: 1.035 }, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
  tl.to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' }, 0.55)
  tl.to(rise, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power2.out' }, 0.95)
  tl.add(unlockScroll, 1.1)
}

/** Before the loader finishes: scene 1 is hidden and waits for the intro. */
export function prepareIntro() {
  gsap.set('#stage', { autoAlpha: 0 })
  gsap.set(q('#t-pot .mask > span'), { yPercent: reducedMotion() ? 0 : 130, autoAlpha: reducedMotion() ? 0 : 1 })
  gsap.set(q('#t-pot .z-head [data-rise]'), { autoAlpha: 0, y: reducedMotion() ? 0 : 20 })
  if (!matchMedia(PHONE_QUERY).matches) gsap.set(q('#t-pot .z-ctrl [data-rise]'), { autoAlpha: 0, y: reducedMotion() ? 0 : 20 })
}
