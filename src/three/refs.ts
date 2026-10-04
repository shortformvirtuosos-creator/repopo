import type * as THREE from 'three'

/** Live scene objects other parts need to read world positions from. */
export const refs: {
  /** Inner group of the active džezva (its local space has the base at y=0). */
  model: THREE.Object3D | null
  /** Group of the cup used for the pour. */
  cup: THREE.Object3D | null
} = { model: null, cup: null }

/** DOM nodes updated from the render loop. */
export const domRefs: {
  hot: (HTMLElement | null)[]
  holdFill: HTMLElement | null
} = { hot: [null, null, null], holdFill: null }
