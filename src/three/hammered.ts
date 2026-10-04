import * as THREE from 'three'

// Generated, tileable "hammered copper" maps. Every hammer strike leaves a
// shallow spherical dent; where dents overlap the deeper one wins, which gives
// the faceted, slightly irregular surface of hand-beaten metal.

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type HammeredMaps = {
  normal: THREE.DataTexture
  rough: THREE.DataTexture
  color: THREE.DataTexture
}

let cache: HammeredMaps | null = null

export function getHammeredMaps(): HammeredMaps {
  if (!cache) cache = makeHammeredMaps(512, 10, 23)
  return cache
}

function makeHammeredMaps(size: number, cells: number, seed: number): HammeredMaps {
  const rnd = mulberry32(seed)
  const n = cells
  const PER = 2
  const sx = new Float32Array(n * n * PER)
  const sy = new Float32Array(n * n * PER)
  const sr = new Float32Array(n * n * PER)
  const sd = new Float32Array(n * n * PER)
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++)
      for (let k = 0; k < PER; k++) {
        const id = (j * n + i) * PER + k
        sx[id] = (i + rnd()) / n
        sy[id] = (j + rnd()) / n
        sr[id] = (0.62 + rnd() * 0.42) / n
        sd[id] = 0.65 + rnd() * 0.35
      }

  const h = new Float32Array(size * size)
  for (let py = 0; py < size; py++) {
    const v = (py + 0.5) / size
    const cj = Math.floor(v * n)
    for (let px = 0; px < size; px++) {
      const u = (px + 0.5) / size
      const ci = Math.floor(u * n)
      let best = 0
      for (let dj = -1; dj <= 1; dj++) {
        const jj = (cj + dj + n) % n
        const oy = (cj + dj - jj) / n
        for (let di = -1; di <= 1; di++) {
          const ii = (ci + di + n) % n
          const ox = (ci + di - ii) / n
          for (let k = 0; k < PER; k++) {
            const id = (jj * n + ii) * PER + k
            const dx = u - (sx[id] + ox)
            const dy = v - (sy[id] + oy)
            const r = sr[id]
            const d2 = (dx * dx + dy * dy) / (r * r)
            if (d2 < 1) {
              const cap = sd[id] * (d2 - 1)
              if (cap < best) best = cap
            }
          }
        }
      }
      h[py * size + px] = best
    }
  }

  // fine grain so the highlights break up a little
  const grain = new Float32Array(size * size)
  for (let i = 0; i < grain.length; i++) grain[i] = rnd()

  const normal = new Uint8Array(size * size * 4)
  const rough = new Uint8Array(size * size * 4)
  const color = new Uint8Array(size * size * 4)
  const strength = 4.2 * (size / 512) * (10 / n)
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x
      const dhx = (at(x + 1, y) - at(x - 1, y)) * strength + (grain[i] - 0.5) * 0.03
      const dhy = (at(x, y + 1) - at(x, y - 1)) * strength + (grain[(i * 7) % grain.length] - 0.5) * 0.03
      let nx = -dhx
      let ny = -dhy
      let nz = 1
      const len = Math.hypot(nx, ny, nz)
      nx /= len
      ny /= len
      nz /= len
      normal[i * 4] = (nx * 0.5 + 0.5) * 255
      normal[i * 4 + 1] = (ny * 0.5 + 0.5) * 255
      normal[i * 4 + 2] = (nz * 0.5 + 0.5) * 255
      normal[i * 4 + 3] = 255

      const depth = Math.min(1, -h[i]) // 0 on ridges, ~1 in the centre of a dent
      const r = 0.8 + 0.14 * (1 - depth) + (grain[i] - 0.5) * 0.08
      rough[i * 4] = 255
      rough[i * 4 + 1] = Math.max(0, Math.min(255, r * 255))
      rough[i * 4 + 2] = 255
      rough[i * 4 + 3] = 255

      const c = 0.86 + 0.14 * (1 - depth * 0.8) + (grain[i] - 0.5) * 0.03
      const cv = Math.max(0, Math.min(255, c * 255))
      color[i * 4] = cv
      color[i * 4 + 1] = cv
      color[i * 4 + 2] = cv
      color[i * 4 + 3] = 255
    }
  }

  const mk = (data: Uint8Array, srgb: boolean) => {
    const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.magFilter = THREE.LinearFilter
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.generateMipmaps = true
    t.anisotropy = 8
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    t.needsUpdate = true
    return t
  }
  return { normal: mk(normal, false), rough: mk(rough, false), color: mk(color, true) }
}
