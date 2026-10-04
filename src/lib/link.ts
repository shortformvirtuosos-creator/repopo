import { config } from '../config'
import type { FinishId } from '../copy'
import { FINISHES } from '../three/finishes'
import { sanitize, clean } from './text'

/** Share link that carries the visitor's choice: ?p=Hodžić&g=Zenica&f=bakar */
export function buildLink(name: string, town: string, finish: FinishId): string {
  const url = new URL(config.siteUrl)
  url.search = ''
  url.hash = ''
  if (name) url.searchParams.set('p', name)
  if (town) url.searchParams.set('g', town)
  url.searchParams.set('f', finish)
  return url.toString()
}

export type Incoming = { name: string; town: string; finish: number } | null

export function readIncoming(): Incoming {
  const q = new URLSearchParams(window.location.search)
  const name = clean(sanitize(q.get('p') ?? ''))
  const town = clean(sanitize(q.get('g') ?? ''))
  const fi = FINISHES.findIndex((f) => f.id === q.get('f'))
  if (!name) return fi >= 0 ? { name: '', town: '', finish: fi } : null
  return { name, town, finish: Math.max(0, fi) }
}

export function displayHost(): string {
  try {
    const u = new URL(config.siteUrl)
    return (u.host + u.pathname).replace(/\/$/, '')
  } catch {
    return config.siteUrl
  }
}
