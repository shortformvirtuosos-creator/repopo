export const reducedMotion = (): boolean =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Phone or small tablet with a touch screen. */
export const isPhone = (): boolean =>
  typeof matchMedia !== 'undefined' &&
  matchMedia('(pointer: coarse)').matches &&
  Math.min(window.screen.width, window.screen.height) < 820

export const isPortrait = (): boolean => window.innerWidth / window.innerHeight < 0.9
