import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { copy } from '../copy'
import { config } from '../config'
import { store, useStore } from '../state/store'
import { live } from '../state/rig'
import { lenis, scrollToSection } from '../lib/scroll'
import { copyText, share } from '../lib/share'
import { upper } from '../lib/text'

const DOT_LABELS = [
  copy.hero.lines.join(' '),
  copy.engrave.headline,
  copy.finish.headline,
  copy.features[0].title,
  copy.pour.headline,
  copy.set.headline,
  copy.ending.headline.join(' '),
]

export function Chrome() {
  const section = useStore((s) => s.section)
  const sharing = useStore((s) => s.sharing)
  return (
    <>
      <div className="progress" aria-hidden="true">
        <i id="progress-bar" />
      </div>
      <header className="chrome">
        <button className="wordmark" onClick={() => scrollToSection(0)} aria-label={config.brand}>
          {copy.chrome.wordmark}
        </button>
        <button className="btn btn-sm" onClick={share} aria-busy={sharing}>
          {copy.chrome.share}
        </button>
      </header>
      <nav className="dots">
        {DOT_LABELS.map((label, i) => (
          <button
            key={i}
            className={i === section ? 'on' : ''}
            aria-label={label}
            aria-current={i === section ? 'true' : undefined}
            onClick={() => scrollToSection(i)}
          >
            <i />
          </button>
        ))}
      </nav>
    </>
  )
}

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/** Water heats to 100 °C, boils, and the džezva drops in. */
export function Loader({ fontsReady, onDone }: { fontsReady: Promise<unknown>; onDone: () => void }) {
  const sceneReady = useStore((s) => s.sceneReady)
  const [n, setN] = useState(0)
  const [boiled, setBoiled] = useState(false)
  const [gone, setGone] = useState(false)
  const el = useRef<HTMLDivElement>(null)
  const ready = useRef({ scene: false, fonts: false })
  ready.current.scene = sceneReady

  useEffect(() => {
    // the static boot screen from index.html has done its job
    document.getElementById('boot')?.remove()
    let raf = 0
    let finished = false
    const t0 = performance.now()
    const dur = live.reduced ? 1100 : 2600
    fontsReady.then(() => (ready.current.fonts = true))
    // never keep anyone waiting forever (e.g. no WebGL)
    const giveUp = window.setTimeout(() => (ready.current = { scene: true, fonts: true }), 9000)
    const loop = (now: number) => {
      const ok = ready.current.scene && ready.current.fonts
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
            duration: live.reduced ? 0.4 : 0.9,
            ease: 'power2.inOut',
            onComplete: () => setGone(true),
          })
        }, 700)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(giveUp)
    }
  }, [fontsReady, onDone])

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

/** Full-screen picture when the phone can't share files directly (Instagram, Viber in-app browsers). */
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
