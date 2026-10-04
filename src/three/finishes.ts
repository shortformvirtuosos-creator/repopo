import type { FinishId } from '../copy'

export type Metal = { color: string; metalness: number; roughness: number; env?: number }

export type Finish = {
  id: FinishId
  /** Flat page background while this finish is picked. */
  bg: string
  /** Accent for lines, dots and buttons on that background. */
  accent: string
  /** Text colour that sits on top of a filled accent button. */
  accentInk: string
  body: Metal
  rim: Metal
  handle: Metal
  /** Colour of the cut letters. */
  groove: Metal
}

export const COPPER: Metal = { color: '#e7936a', metalness: 1, roughness: 0.3, env: 1.25 }
export const BRASS: Metal = { color: '#e6bf72', metalness: 1, roughness: 0.27, env: 1.2 }
/** Handles are satin rather than polished, so the thin strip catches light from any angle. */
export const BRASS_HANDLE: Metal = { color: '#e9c47a', metalness: 1, roughness: 0.42, env: 1.8 }
export const COPPER_HANDLE: Metal = { color: '#ea9a70', metalness: 1, roughness: 0.42, env: 1.8 }
export const TIN: Metal = { color: '#dcdddf', metalness: 1, roughness: 0.36, env: 1.55 }

export const FINISHES: Finish[] = [
  {
    id: 'bakar',
    bg: '#14463F',
    accent: '#E8A17A',
    accentInk: '#1b0d06',
    body: COPPER,
    rim: COPPER,
    handle: BRASS_HANDLE,
    groove: { color: '#240b03', metalness: 0.5, roughness: 0.62, env: 0.45 },
  },
  {
    id: 'kalaj',
    bg: '#6E1A26',
    accent: '#E4E6E8',
    accentInk: '#2a0a10',
    body: TIN,
    rim: TIN,
    handle: BRASS_HANDLE,
    groove: { color: '#1c1d20', metalness: 0.5, roughness: 0.62, env: 0.45 },
  },
  {
    id: 'crna',
    bg: '#9C4520',
    accent: '#140E0B',
    accentInk: '#ffffff',
    body: { color: '#141211', metalness: 0.35, roughness: 0.7, env: 0.9 },
    rim: COPPER,
    handle: COPPER_HANDLE,
    // On black the letters are cut through to the copper underneath.
    groove: { color: '#e7936a', metalness: 1, roughness: 0.35, env: 1.2 },
  },
  {
    id: 'mesing',
    bg: '#152F4F',
    accent: '#E8C77E',
    accentInk: '#1d1405',
    body: BRASS,
    rim: BRASS,
    handle: BRASS_HANDLE,
    groove: { color: '#2a1c06', metalness: 0.5, roughness: 0.62, env: 0.45 },
  },
]

export const NEAR_BLACK = '#0b0908'
export const BASE_ACCENT = '#E8A17A'
