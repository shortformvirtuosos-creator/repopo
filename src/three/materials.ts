import * as THREE from 'three'
import { getHammeredMaps } from './hammered'
import { TIN, type Finish, type Metal } from './finishes'

const cache = new Map<string, THREE.Material>()

function memo<T extends THREE.Material>(key: string, make: () => T): T {
  let m = cache.get(key) as T | undefined
  if (!m) {
    m = make()
    cache.set(key, m)
  }
  return m
}

/** Hammered metal: colour, normal and roughness maps from the generated dents. */
export function hammeredMetal(m: Metal, key = m.color + m.roughness): THREE.MeshStandardMaterial {
  return memo('hm:' + key, () => {
    const maps = getHammeredMaps()
    const mat = new THREE.MeshStandardMaterial({
      color: m.color,
      metalness: m.metalness,
      // the roughness map averages ~0.87, so scale up to land on the target
      roughness: Math.min(1, m.roughness / 0.87),
      map: maps.color,
      normalMap: maps.normal,
      roughnessMap: maps.rough,
      envMapIntensity: m.env ?? 1,
    })
    mat.normalScale.set(1, 1)
    return mat
  })
}

export function plainMetal(m: Metal): THREE.MeshStandardMaterial {
  return memo('pm:' + m.color + m.roughness + m.metalness, () =>
    new THREE.MeshStandardMaterial({
      color: m.color,
      metalness: m.metalness,
      roughness: m.roughness,
      envMapIntensity: m.env ?? 1,
      side: THREE.DoubleSide,
    }),
  )
}

export function tinInside(): THREE.MeshStandardMaterial {
  return memo('tin-inside', () => {
    const maps = getHammeredMaps()
    const mat = new THREE.MeshStandardMaterial({
      color: TIN.color,
      metalness: 1,
      roughness: 0.42,
      vertexColors: true,
      normalMap: maps.normal,
      envMapIntensity: 1,
    })
    mat.normalScale.set(0.45, 0.45)
    return mat
  })
}

/** Smooth, polished field on the belly that carries the engraving. */
export function cartoucheMaterial(f: Finish, mask: THREE.Texture): THREE.MeshStandardMaterial {
  return memo('cartouche:' + f.id, () =>
    new THREE.MeshStandardMaterial({
      color: f.body.color,
      metalness: f.body.metalness,
      roughness: Math.max(0.2, f.body.roughness * 0.85),
      envMapIntensity: f.body.env ?? 1,
      alphaMap: mask,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  )
}

/** The cut letters: only drawn where the engraving mask is, with a bevel from the bump channel. */
export function grooveMaterial(f: Finish, tex: THREE.Texture): THREE.MeshStandardMaterial {
  return memo('groove:' + f.id + ':' + tex.uuid, () =>
    new THREE.MeshStandardMaterial({
      color: f.groove.color,
      metalness: f.groove.metalness,
      roughness: f.groove.roughness,
      envMapIntensity: f.groove.env ?? 1,
      alphaMap: tex,
      bumpMap: tex,
      bumpScale: 4,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    }),
  )
}

export function finishMaterials(f: Finish) {
  return {
    body: hammeredMetal(f.body, f.id + '-body'),
    rim: hammeredMetal(f.rim, f.id + '-rim'),
    handle: plainMetal(f.handle),
    inside: tinInside(),
  }
}

export function porcelain(): THREE.MeshPhysicalMaterial {
  return memo('porcelain', () =>
    new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.2,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.9,
    }),
  )
}

/** Coffee surface with foam, drawn once into a canvas. */
export function coffeeMaterial(): THREE.MeshStandardMaterial {
  return memo('coffee', () => {
    const s = 256
    const c = document.createElement('canvas')
    c.width = c.height = s
    const g = c.getContext('2d')!
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    grd.addColorStop(0, '#b98a5c')
    grd.addColorStop(0.7, '#a87749')
    grd.addColorStop(0.9, '#6f4426')
    grd.addColorStop(1, '#3a2010')
    g.fillStyle = grd
    g.fillRect(0, 0, s, s)
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 420; i++) {
      const a = rnd() * Math.PI * 2
      const r = Math.sqrt(rnd()) * s * 0.44
      g.beginPath()
      g.arc(s / 2 + Math.cos(a) * r, s / 2 + Math.sin(a) * r, 0.6 + rnd() * 2.6, 0, Math.PI * 2)
      g.fillStyle = rnd() > 0.5 ? 'rgba(80,45,22,0.35)' : 'rgba(225,190,150,0.35)'
      g.fill()
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.38, metalness: 0, envMapIntensity: 0.7 })
  })
}

export function streamMaterial(): THREE.MeshStandardMaterial {
  return memo('stream', () =>
    new THREE.MeshStandardMaterial({ color: '#2b1509', roughness: 0.12, metalness: 0, envMapIntensity: 1.2 }),
  )
}

export function lokumMaterial(pink: boolean): THREE.MeshStandardMaterial {
  return memo('lokum' + pink, () =>
    new THREE.MeshStandardMaterial({ color: pink ? '#f2c4cc' : '#fbf6f4', roughness: 0.95, metalness: 0 }),
  )
}
