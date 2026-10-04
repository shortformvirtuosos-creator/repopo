import { useSyncExternalStore } from 'react'

export type Overlay = {
  img: string
  link: string
  file: string
  phone: boolean
} | null

export type State = {
  /** What the visitor typed (already filtered). */
  name: string
  town: string
  /** Family from an incoming share link, until the visitor starts their own. */
  shared: { name: string; town: string } | null
  /** Index of the example engraved while the fields are empty. */
  example: number
  intro: 'loading' | 'done'
  overlay: Overlay
  sharing: boolean
  /** The phone layout is in use (portrait screens). */
  phone: boolean
}

type Listener = () => void

let state: State = {
  name: '',
  town: '',
  shared: null,
  example: 0,
  intro: 'loading',
  overlay: null,
  sharing: false,
  phone: false,
}

const listeners = new Set<Listener>()

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    let changed = false
    for (const k in patch) {
      if ((patch as Record<string, unknown>)[k] !== (state as Record<string, unknown>)[k]) changed = true
    }
    if (!changed) return
    state = { ...state, ...patch }
    listeners.forEach((l) => l())
  },
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => select(state))
}
