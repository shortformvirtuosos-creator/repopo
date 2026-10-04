import { Engraving, ENGRAVE_FONT, ENGRAVE_WEIGHT } from './engraving'
import { getDzezvaGeometry } from './geometry'
import { store } from '../state/store'
import { copy, YEAR } from '../copy'
import { clean, upper } from '../lib/text'
import { isPhone } from '../lib/env'

let main: Engraving | null = null
let share: Engraving | null = null

export function getEngraving(): Engraving {
  main ??= new Engraving(isPhone() ? 1024 : 2048, getDzezvaGeometry().bandAspect)
  return main
}

export function getShareEngraving(): Engraving {
  share ??= new Engraving(2048, getDzezvaGeometry().bandAspect)
  return share
}

/** The two engraved lines for a surname and town. */
export function engraveLines(name: string, town: string): [string, string] {
  return [copy.engrave.line1(upper(clean(name))), copy.engrave.line2(upper(clean(town)), YEAR)]
}

/** Make sure the glyphs for `text` are loaded (Cyrillic and latin-ext are separate files). */
export function loadFontsFor(text: string): Promise<unknown> {
  const fonts = [`${ENGRAVE_WEIGHT} 64px ${ENGRAVE_FONT}`, '400 64px "Anton"', '700 64px "Oswald"', '600 32px "Inter"']
  return Promise.all(fonts.map((f) => document.fonts.load(f, text).catch(() => null)))
}

const examples = copy.engrave.examples
const cycle = { phase: 'fade' as 'show' | 'fade', next: 0, idx: -1 }
let mode: 'idle' | 'typed' | 'examples' = 'idle'
let last: [string, string] = ['', '']

export function driveEngraving(now: number) {
  const eng = getEngraving()
  const st = store.get()
  const name = clean(st.name)
  const town = clean(st.town)

  if (name || town) {
    if (mode !== 'typed') {
      mode = 'typed'
      eng.clear()
      last = ['', '']
    }
    const lines = engraveLines(name, town)
    if (lines[0] !== last[0] || lines[1] !== last[1]) {
      last = lines
      const text = lines.join(' ')
      if (!document.fonts.check(`${ENGRAVE_WEIGHT} 64px ${ENGRAVE_FONT}`, text)) {
        loadFontsFor(text).then(() => eng.invalidate())
      }
      eng.set(lines[0], lines[1], now, 45)
    }
  } else {
    if (mode !== 'examples') {
      const was = mode
      mode = 'examples'
      last = ['', '']
      if (was === 'typed') eng.fade(0, 280, now)
      cycle.phase = 'fade'
      cycle.next = now + (was === 'typed' ? 320 : 0)
    }
    if (now >= cycle.next) {
      if (cycle.phase === 'show') {
        eng.fade(0, 420, now)
        cycle.phase = 'fade'
        cycle.next = now + 440
      } else {
        cycle.idx = (cycle.idx + 1) % examples.length
        const [p, g] = examples[cycle.idx]
        const [l1, l2] = engraveLines(p, g)
        eng.clear()
        eng.set(l1, l2, now, 42, 60)
        cycle.phase = 'show'
        cycle.next = eng.doneAt + 3000
        store.set({ example: cycle.idx })
      }
    }
  }
  eng.update(now)
}
