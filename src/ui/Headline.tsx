import { useLayoutEffect, useRef } from 'react'

/**
 * Anton headline whose phrases mask in from below. Each phrase is its own
 * mask with extra room on top so carons and accents (Č Ć Š Ž) never clip.
 * Phrases wrap naturally; any phrase wider than the column is shrunk to fit.
 */
export function Headline({
  phrases,
  className = '',
  as: Tag = 'h2',
  block = false,
}: {
  phrases: string[]
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  /** Force one phrase per line. */
  block?: boolean
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // shrink the whole headline (not single lines) until its widest phrase fits
    const fit = () => {
      el.style.fontSize = ''
      const parent = el.parentElement ?? el
      const ps = getComputedStyle(parent)
      const avail = parent.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight)
      let widest = 0
      el.querySelectorAll<HTMLElement>('.mask > span').forEach((s) => {
        widest = Math.max(widest, s.scrollWidth)
      })
      if (avail > 0 && widest > avail) {
        const size = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${((size * avail) / widest) * 0.97}px`
      }
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [phrases])
  return (
    <Tag ref={ref} className={`headline ${block ? 'is-block ' : ''}${className}`} aria-label={phrases.join(' ')}>
      {phrases.map((p, i) => (
        <span className="mask" key={i} aria-hidden="true">
          <span>{p}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Split a headline into two phrases at a word boundary. */
export function phrases(text: string, firstWords: number): string[] {
  const w = text.split(' ')
  return [w.slice(0, firstWords).join(' '), w.slice(firstWords).join(' ')].filter(Boolean)
}
