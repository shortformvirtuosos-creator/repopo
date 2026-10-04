import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import gsap from 'gsap'
import { copy, YEAR } from '../copy'
import { config } from '../config'
import { Headline, phrases } from './Headline'
import { store, useStore } from '../state/store'
import { live } from '../state/rig'
import { FINISHES } from '../three/finishes'
import { domRefs } from '../three/refs'
import { clean, sanitize, titleCase, upper } from '../lib/text'
import { focusSurname, prepareShare, share } from '../lib/share'

// ------------------------------------------------------------------ 1. hero

export function Hero() {
  const shared = useStore((s) => s.shared)
  const lines = shared ? copy.hero.sharedLines(upper(shared.name)) : copy.hero.lines
  const onCta = () => {
    if (shared) store.set({ name: '', town: '' })
    focusSurname()
  }
  return (
    <section id="s-hero" className="sec sec-hero">
      <div className="screen">
        <div className="back hero-head">
          <Headline as="h1" phrases={lines} block className="xl" />
        </div>
        <div className="front hero-foot">
          <p className="lede" data-fade>
            {copy.hero.sub}
          </p>
          <button className="btn btn-primary" data-fade onClick={onCta}>
            {shared ? copy.hero.sharedCta : copy.hero.cta}
          </button>
        </div>
        <div className="front hint" data-fade aria-hidden="true">
          <span>{copy.hero.hint}</span>
          <i />
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ 2. engraving

export function Engrave() {
  const name = useStore((s) => s.name)
  const town = useStore((s) => s.town)
  const example = useStore((s) => s.example)
  const ex = copy.engrave.examples[example]
  const p = clean(name)
  const g = clean(town)
  const isExample = !p && !g
  const liveLine = p ? copy.engrave.live(titleCase(p), titleCase(g)) : isExample ? copy.engrave.live(ex[0], ex[1]) : ''
  const townRef = useRef<HTMLInputElement>(null)

  const onFocus = () => store.set({ focused: true })
  const onBlur = () => store.set({ focused: false })
  return (
    <section id="s-engrave" className="sec sec-engrave">
      <div className="screen">
        <div className="back enter-head engrave-head">
          <Headline phrases={phrases(copy.engrave.headline, 3)} className="lg" />
        </div>
        <div className="front engrave-ui">
          <div className="fields" data-rise>
            <label className="field">
              <span className="field-label">{copy.engrave.surname}</span>
              <input
                id="in-prezime"
                type="text"
                value={name}
                placeholder={ex[0]}
                maxLength={18}
                autoComplete="family-name"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => {
                  store.set({ name: sanitize(e.target.value) })
                  prepareShare()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') townRef.current?.focus()
                }}
              />
            </label>
            <label className="field">
              <span className="field-label">{copy.engrave.town}</span>
              <input
                id="in-grad"
                ref={townRef}
                type="text"
                value={town}
                placeholder={ex[1]}
                maxLength={18}
                autoComplete="address-level2"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => {
                  store.set({ town: sanitize(e.target.value) })
                  prepareShare()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                }}
              />
            </label>
          </div>
          <p className={'live-line' + (isExample ? ' is-example' : '')} data-rise aria-live="polite">
            {liveLine}
          </p>
          <div data-rise>
            <button className="btn btn-primary" onClick={share}>
              {copy.engrave.share}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ 3. finish picker

const N = FINISHES.length
const mod = (i: number) => ((i % N) + N) % N
let carouselTween: gsap.core.Tween | null = null

function goTo(target: number) {
  carouselTween?.kill()
  store.set({ finish: mod(target) })
  if (live.reduced) {
    live.carousel = target
    live.snap = true
    return
  }
  carouselTween = gsap.to(live, { carousel: target, duration: 1.0, ease: 'power3.inOut' })
}

export function FinishPicker() {
  const finish = useStore((s) => s.finish)
  const f = FINISHES[finish]
  const item = copy.finish.items[f.id]
  const drag = useRef({ on: false, x: 0, start: 0, moved: false, id: -1 })

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    drag.current = { on: true, x: e.clientX, start: live.carousel, moved: false, id: e.pointerId }
    carouselTween?.kill()
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.on || e.pointerId !== d.id) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 8) {
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (d.moved) live.carousel = d.start - dx / Math.max(240, e.currentTarget.clientWidth * 0.55)
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.on || e.pointerId !== d.id) return
    d.on = false
    if (!d.moved) return
    const delta = live.carousel - d.start
    const step = Math.abs(delta) < 0.12 ? 0 : delta > 0 ? Math.max(1, Math.round(delta)) : Math.min(-1, Math.round(delta))
    goTo(Math.round(d.start) + step)
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') goTo(Math.round(live.carousel) + 1)
    if (e.key === 'ArrowLeft') goTo(Math.round(live.carousel) - 1)
  }

  return (
    <section id="s-finish" className="sec sec-finish">
      <div className="screen">
        <div className="back enter-head finish-head">
          <Headline phrases={phrases(copy.finish.headline, 1)} className="lg" />
        </div>
        <div
          className="front finish-stage"
          tabIndex={0}
          role="group"
          aria-label={copy.finish.headline}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        />
        <div className="front finish-info" data-rise>
          <button className="arrow" aria-label={copy.a11y.prev} onClick={() => goTo(Math.round(live.carousel) - 1)}>
            <Chevron dir={-1} />
          </button>
          <div className="finish-text" aria-live="polite" key={f.id}>
            <h3 className="finish-name">{item.name}</h3>
            <p className="finish-line">{item.line}</p>
          </div>
          <button className="arrow" aria-label={copy.a11y.next} onClick={() => goTo(Math.round(live.carousel) + 1)}>
            <Chevron dir={1} />
          </button>
        </div>
      </div>
    </section>
  )
}

function Chevron({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d={dir > 0 ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  )
}

// ------------------------------------------------------------------ 4. feature walk

export function Features() {
  return (
    <section id="s-features" className="sec sec-features" data-step="0">
      <div className="pin front feat-layer">
        {copy.features.map((f, i) => (
          <div className={`feat feat-${i}`} key={i}>
            <Headline phrases={[f.title]} className="md" as="h3" />
            <p className="feat-body">{f.body}</p>
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <span key={i} className="hot" ref={(el) => void (domRefs.hot[i] = el)} aria-hidden="true">
            <i />
          </span>
        ))}
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ 5. pour

export function Pour() {
  const poured = useStore((s) => s.poured)
  const holding = useStore((s) => s.holding)
  const start = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    live.hold = true
    store.set({ holding: true })
  }
  const stop = () => {
    live.hold = false
    store.set({ holding: false })
  }
  useEffect(() => stop, [])
  return (
    <section id="s-pour" className="sec sec-pour">
      <div className="pin back enter-head pour-head">
        <Headline phrases={phrases(copy.pour.headline, 2)} className="lg" />
      </div>
      <div className="pin front pour-ui">
        <div className="pour-bottom" data-rise>
          {!poured ? (
            <button
              className={'btn hold' + (holding ? ' is-holding' : '')}
              onPointerDown={start}
              onPointerUp={stop}
              onPointerCancel={stop}
              onLostPointerCapture={stop}
              onContextMenu={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                  e.preventDefault()
                  live.hold = true
                  store.set({ holding: true })
                }
              }}
              onKeyUp={(e) => {
                if (e.key === ' ' || e.key === 'Enter') stop()
              }}
              onBlur={stop}
            >
              <span className="hold-fill" ref={(el) => void (domRefs.holdFill = el)} />
              <span className="hold-label">{copy.pour.hint}</span>
            </button>
          ) : (
            <div className="after">
              <p className="after-big">{copy.pour.after}</p>
              <p className="after-small">{copy.pour.afterSmall}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ 6. the set

export function TheSet() {
  return (
    <section id="s-set" className="sec sec-set">
      <div className="pin back enter-head set-head">
        <Headline phrases={phrases(copy.set.headline, 1)} className="lg" />
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ 7. ending

export function Ending() {
  const handle = config.instagram.replace(/^@/, '').trim()
  return (
    <section id="s-end" className="sec sec-end">
      <div className="screen">
        <div className="back enter-head end-head">
          <Headline phrases={copy.ending.headline} className="lg" />
        </div>
        <div className="front end-ui">
          <div data-rise>
            <button className="btn btn-primary" onClick={share}>
              {copy.ending.share}
            </button>
          </div>
          {handle && (
            <a
              className="ig"
              data-rise
              href={`https://www.instagram.com/${encodeURIComponent(handle)}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.ending.instagram}
            </a>
          )}
          <footer className="foot">{copy.ending.footer(YEAR)}</footer>
        </div>
      </div>
    </section>
  )
}
