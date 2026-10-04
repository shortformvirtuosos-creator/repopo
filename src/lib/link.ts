import { config } from '../config'
import { sanitize, clean } from './text'

/** Share link that carries the visitor's family: ?p=Hodžić&g=Zenica */
export function buildLink(name: string, town: string): string {
  const url = new URL(config.siteUrl)
  url.search = ''
  url.hash = ''
  if (name) url.searchParams.set('p', name)
  if (town) url.searchParams.set('g', town)
  return url.toString()
}

export type Incoming = { name: string; town: string } | null

export function readIncoming(): Incoming {
  const q = new URLSearchParams(window.location.search)
  const name = clean(sanitize(q.get('p') ?? ''))
  const town = clean(sanitize(q.get('g') ?? ''))
  return name ? { name, town } : null
}

export function displayHost(): string {
  try {
    const u = new URL(config.siteUrl)
    return (u.host + u.pathname).replace(/\/$/, '')
  } catch {
    return config.siteUrl
  }
}
