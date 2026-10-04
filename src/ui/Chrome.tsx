import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { copy } from '../copy'
import { config } from '../config'
import { store, useStore } from '../state/store'
import { lenis, scrollToTime } from '../lib/scroll'
import { copyText, share } from '../lib/share'
import { reducedMotion } from '../lib/env'
import { upper } from '../lib/text'

export function Chrome() {
  const sharing = useStore((s) => s.sharing)
  return (
    <>
      <div className="progress" aria-hidden="true">
        <i id="progress-bar" />
      </div>
      <header className="chrome">
        <button className="wordmark" onClick={() => scrollToTime(0)} aria-label={config.brand}>
          {copy.chrome.wordmark}
        </button>
        <button className="btn btn-sm" onClick={share} aria-busy={sharing}>
          {copy.chrome.share}
        </button>
      </header>
    </>
  )
}

/** The thin line at the top that shows how far down the page you are. */
export function startProgress(): () => void {
  const bar = document.getElementById('progress-bar')
  let last = -1
  const tick = () => {
    if (!bar) return
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    if (Math.abs(p - last) > 0.0005) {
      bar.style.transform = `scaleX(${p.toFixed(4)})`
      last = p
    }
  }
  gsap.ticker.add(tick)
  return () => gsap.ticker.remove(tick)
}

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/** Water heats to 100 °C and boils; then the first photograph comes up. */
export function Loader({ ready, onDone }: { ready: Promise<unknown>; onDone: () => void }) {
  const [n, setN] = useState(0)
  const [boiled, setBoiled] = useState(false)
  const [gone, setGone] = useState(false)
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // the static boot screen from index.html has done its job
    document.getElementById('boot')?.remove()
    let raf = 0
    let finished = false
    let ok = false
    const t0 = performance.now()
    const dur = reducedMotion() ? 1100 : 2600
    ready.then(() => (ok = true))
    // never keep anyone waiting forever
    const giveUp = window.setTimeout(() => (ok = true), 9000)
    const loop = (now: number) => {
      let v = 100 * easeInOutSine(Math.min(1, (now - t0) / dur))
      if (!ok) v = Math.min(v, 96)
      setN(Math.floor(v))
      if (v >= 100 && ok && !finished) {
        finished = true
        setBoiled(true)
        window.setTimeout(() => {
          onDone()
          if (!el.current) return
          gsap.to(el.current, {
            autoAlpha: 0,
            duration: reducedMotion() ? 0.4 : 0.9,
            ease: 'power2.inOut',
            onComplete: () => setGone(true),
          })
        }, 750)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(giveUp)
    }
  }, [ready, onDone])

  if (gone) return null
  return (
    <div className="loader" ref={el} role="status" aria-live="polite">
      <div className="temp">
        <span className="num">{n}</span>
        <span className="unit">{copy.loader.unit}</span>
      </div>
      <p className="msg">{boiled ? copy.loader.boiled : copy.loader.heating}</p>
    </div>
  )
}

/** Full-screen picture when the phone can't share files directly (Instagram, Viber in-app browsers) and on desktop. */
export function ShareOverlay() {
  const ov = useStore((s) => s.overlay)
  const name = useStore((s) => s.name)
  const [copied, setCopied] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!ov) return
    setCopied(false)
    lenis?.stop()
    document.documentElement.classList.add('is-locked')
    closeBtn.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && store.set({ overlay: null })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('is-locked')
      lenis?.start()
    }
  }, [ov])

  if (!ov) return null
  const close = () => store.set({ overlay: null })
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={copy.chrome.share}>
      <button className="sheet-close" ref={closeBtn} aria-label={copy.shareSheet.close} onClick={close}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      </button>
      <div className="sheet-body">
        <img className="sheet-img" src={ov.img} alt={`${copy.shareImage.title} ${upper(name)}`} />
        {ov.phone && <p className="sheet-hint">{copy.shareSheet.hold}</p>}
        <div className="sheet-actions">
          {!ov.phone && (
            <a className="btn btn-primary" href={ov.img} download={ov.file}>
              {copy.shareSheet.save}
            </a>
          )}
          <button
            className="btn"
            onClick={async () => {
              if (await copyText(ov.link)) {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2200)
              }
            }}
          >
            {copied ? copy.shareSheet.copied : copy.shareSheet.copyLink}
          </button>
        </div>
      </div>
    </div>
  )
}
