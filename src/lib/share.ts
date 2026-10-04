import { copy } from '../copy'
import { FINISHES } from '../three/finishes'
import { shareApi } from '../three/ShareStudio'
import { store } from '../state/store'
import { buildLink } from './link'
import { isPhone } from './env'
import { clean, slug } from './text'
import { scrollToSection } from './scroll'

type Rendered = { key: string; blob: Blob; dataUrl: string }

let cached: Rendered | null = null
let pending: Promise<Rendered> | null = null
let pendingKey = ''

const keyOf = () => {
  const s = store.get()
  return [clean(s.name), clean(s.town), s.finish].join('|')
}

function toBlob(c: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/png'))
}

async function render(): Promise<Rendered> {
  const key = keyOf()
  if (cached?.key === key) return cached
  if (pending && pendingKey === key) return pending
  pendingKey = key
  pending = (async () => {
    // the share renderer lives inside the 3D scene; wait for it if needed
    for (let i = 0; i < 100 && !shareApi.render; i++) await new Promise((r) => setTimeout(r, 50))
    if (!shareApi.render) throw new Error('renderer not ready')
    const canvas = await shareApi.render()
    const blob = await toBlob(canvas)
    const dataUrl = canvas.toDataURL('image/png')
    const out = { key, blob, dataUrl }
    if (keyOf() === key) cached = out
    return out
  })()
  try {
    return await pending
  } finally {
    pending = null
  }
}

/** Phones need the picture ready before the tap, or the share sheet may refuse to open. */
let prepTimer = 0
export function prepareShare() {
  if (!isPhone()) return
  window.clearTimeout(prepTimer)
  prepTimer = window.setTimeout(() => {
    if (clean(store.get().name)) render().catch(() => null)
  }, 900)
}

export function focusSurname() {
  scrollToSection(1, () => {
    const el = document.getElementById('in-prezime') as HTMLInputElement | null
    el?.focus({ preventScroll: true })
  })
}

/** The "Podijeli" button. */
export async function share() {
  const s = store.get()
  const name = clean(s.name)
  if (!name) {
    focusSurname()
    return
  }
  if (s.sharing) return
  const town = clean(s.town)
  const finish = FINISHES[s.finish]
  const link = buildLink(name, town, finish.id)
  const file = `dzezva-porodice-${slug(name) || 'ceif'}.png`
  const phone = isPhone()

  let img: Rendered
  store.set({ sharing: true })
  try {
    img = await render()
  } catch {
    store.set({ sharing: false })
    return
  }
  store.set({ sharing: false })

  if (phone && typeof navigator.canShare === 'function') {
    const f = new File([img.blob], file, { type: 'image/png' })
    if (navigator.canShare({ files: [f] })) {
      try {
        await navigator.share({ files: [f], text: copy.shareText(link) })
        return
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return
        // otherwise fall through to the full-screen picture
      }
    }
  }
  store.set({ overlay: { img: img.dataUrl, link, file, phone } })
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}
