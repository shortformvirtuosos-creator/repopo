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
  finish: number
  /** Family from an incoming share link. */
  shared: { name: string; town: string } | null
  /** Index of the example currently engraved while the inputs are empty. */
  example: number
  sceneReady: boolean
  intro: 'loading' | 'done'
  overlay: Overlay
  sharing: boolean
  poured: boolean
  focused: boolean
  holding: boolean
  section: number
}

type Listener = () => void

let state: State = {
  name: '',
  town: '',
  finish: 0,
  shared: null,
  example: 0,
  sceneReady: false,
  intro: 'loading',
  overlay: null,
  sharing: false,
  poured: false,
  focused: false,
  holding: false,
  section: 0,
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
