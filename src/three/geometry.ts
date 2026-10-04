import * as THREE from 'three'

// All shapes are built in code from lathe profiles: [radius, height] pairs.
// A profile that runs upward along a wall (or inward along a top surface)
// produces outward-facing triangles.

export type P2 = [number, number]

const SEG = 96

function spline(ctrl: P2[], n: number): P2[] {
  const curve = new THREE.CatmullRomCurve3(
    ctrl.map(([r, y]) => new THREE.Vector3(r, y, 0)),
    false,
    'centripetal',
  )
  return curve.getSpacedPoints(n).map((v) => [v.x, v.y] as P2)
}

function line(a: P2, b: P2, n: number): P2[] {
  const out: P2[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

function join(...parts: P2[][]): P2[] {
  const out: P2[] = []
  for (const p of parts) {
    for (const q of p) {
      const last = out[out.length - 1]
      if (last && Math.abs(last[0] - q[0]) < 1e-6 && Math.abs(last[1] - q[1]) < 1e-6) continue
      out.push(q)
    }
  }
  return out
}

/** Offset a wall towards the axis by `t` (its outward normal is [dy, -dr]). */
function offsetIn(pts: P2[], t: number): P2[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const dr = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dr, dy) || 1
    const nr = dy / len
    const ny = -dr / len
    return [p[0] - nr * t, p[1] - ny * t] as P2
  })
}

function arcLengths(pts: P2[]): number[] {
  const out = [0]
  for (let i = 1; i < pts.length; i++)
    out.push(out[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  return out
}

/** Radius of a wall (sorted by height) at height y. */
export function radiusAt(pts: P2[], y: number): number {
  if (y <= pts[0][1]) return pts[0][0]
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][1] >= y) {
      const a = pts[i - 1]
      const b = pts[i]
      const t = (y - a[1]) / (b[1] - a[1] || 1)
      return a[0] + (b[0] - a[0]) * t
    }
  }
  return pts[pts.length - 1][0]
}

type LatheOpts = {
  segments?: number
  phiStart?: number
  phiLength?: number
  uRepeat?: number
  vStart?: number
  vUnit?: number
  deform?: (v: THREE.Vector3) => void
}

function lathe(pts: P2[], o: LatheOpts = {}): THREE.BufferGeometry {
  const segments = o.segments ?? SEG
  const geo = new THREE.LatheGeometry(
    pts.map(([r, y]) => new THREE.Vector2(Math.max(r, 0), y)),
    segments,
    o.phiStart ?? Math.PI, // seam at the back, away from the engraving
    o.phiLength ?? Math.PI * 2,
  )
  const n = pts.length
  const L = arcLengths(pts)
  const uv = geo.attributes.uv as THREE.BufferAttribute
  const uRep = o.uRepeat ?? 7
  const vUnit = o.vUnit ?? 0.6
  const v0 = o.vStart ?? 0
  for (let i = 0; i <= segments; i++)
    for (let j = 0; j < n; j++) uv.setXY(i * n + j, (i / segments) * uRep, (v0 + L[j]) / vUnit)

  if (o.deform) {
    const pos = geo.attributes.position as THREE.BufferAttribute
    const v = new THREE.Vector3()
    for (let k = 0; k < pos.count; k++) {
      v.fromBufferAttribute(pos, k)
      o.deform(v)
      pos.setXYZ(k, v.x, v.y, v.z)
    }
  }
  geo.computeVertexNormals()
  if ((o.phiLength ?? Math.PI * 2) >= Math.PI * 2 - 1e-6) {
    // weld the seam normals so the back seam doesn't show
    const nor = geo.attributes.normal as THREE.BufferAttribute
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    for (let j = 0; j < n; j++) {
      a.fromBufferAttribute(nor, j)
      b.fromBufferAttribute(nor, segments * n + j)
      a.add(b).normalize()
      nor.setXYZ(j, a.x, a.y, a.z)
      nor.setXYZ(segments * n + j, a.x, a.y, a.z)
    }
  }
  return geo
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------- džezva

export const DZ = {
  height: 1.962,
  thickness: 0.018,
  lipPhi: Math.PI / 2, // pouring lip points to +x
  handlePhi: -Math.PI / 2, // handle points to -x
  handleY: 1.2,
  handleLength: 2.55,
  handleAngle: THREE.MathUtils.degToRad(25),
  band: { y0: 0.2, y1: 0.98, halfArc: 1.25 },
}

const WALL: P2[] = [
  [0.53, 0],
  [0.592, 0.014],
  [0.624, 0.065],
  [0.634, 0.16],
  [0.628, 0.3],
  [0.6, 0.5],
  [0.548, 0.74],
  [0.482, 1.0],
  [0.418, 1.26],
  [0.368, 1.47],
  [0.342, 1.6],
  [0.341, 1.69],
  [0.36, 1.78],
  [0.4, 1.855],
  [0.447, 1.917],
  [0.474, 1.952],
]

function lipDeform(v: THREE.Vector3) {
  const phi = Math.atan2(v.x, v.z)
  let d = phi - DZ.lipPhi
  d = Math.atan2(Math.sin(d), Math.cos(d))
  const ang = Math.exp(-((d / 0.36) ** 2))
  const hgt = smooth(1.64, 1.965, v.y)
  const w = ang * hgt * hgt
  const k = 1 + 0.34 * w
  v.x *= k
  v.z *= k
  v.y += 0.05 * w * smooth(1.8, 1.965, v.y)
}

export type DzezvaGeometry = {
  body: THREE.BufferGeometry
  rim: THREE.BufferGeometry
  inner: THREE.BufferGeometry
  band: THREE.BufferGeometry
  handle: THREE.BufferGeometry
  bracket: THREE.BufferGeometry
  rivet: THREE.BufferGeometry
  rivets: THREE.Vector3[]
  bandAspect: number
  wall: P2[]
  innerWall: P2[]
}

let dzCache: DzezvaGeometry | null = null

export function getDzezvaGeometry(): DzezvaGeometry {
  if (dzCache) return dzCache
  const wall = spline(WALL, 120)
  const base = line([0, 0], WALL[0], 14)
  const T = DZ.thickness

  const innerAll = offsetIn(wall, T)
  const innerWall = innerAll.filter((p) => p[1] > T + 0.02)
  const innerBase = line([innerWall[0][0], T], [0, T], 12)

  // rolled rim: half circle from the outer lip edge over to the inner edge
  const top = wall[wall.length - 1]
  const itop = innerWall[innerWall.length - 1]
  const cx = (top[0] + itop[0]) / 2
  const cy = (top[1] + itop[1]) / 2
  const rr = Math.hypot(top[0] - itop[0], top[1] - itop[1]) / 2
  const a0 = Math.atan2(top[1] - cy, top[0] - cx)
  const roll: P2[] = []
  for (let i = 0; i <= 8; i++) {
    const a = a0 + (Math.PI * i) / 8
    roll.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }

  const split = wall.findIndex((p) => p[1] >= 1.7)
  const bodyPts = join(base, wall.slice(0, split + 1))
  const rimPts = join(wall.slice(split), roll)
  const innerPts = join([...innerWall].reverse(), innerBase)

  const bodyL = arcLengths(bodyPts)
  const body = lathe(bodyPts, { deform: lipDeform, uRepeat: 8, vUnit: 0.52 })
  const rim = lathe(rimPts, { deform: lipDeform, vStart: bodyL[bodyL.length - 1], uRepeat: 8, vUnit: 0.52 })
  const inner = lathe(innerPts, { deform: lipDeform, uRepeat: 5, vUnit: 0.75 })

  // darken the tin the deeper it goes (cheap cavity shading)
  {
    const pos = inner.attributes.position as THREE.BufferAttribute
    const col = new Float32Array(pos.count * 3)
    for (let k = 0; k < pos.count; k++) {
      const y = pos.getY(k)
      const c = 0.22 + 0.78 * Math.pow(smooth(0.0, 1.95, y), 1.4)
      col[k * 3] = col[k * 3 + 1] = col[k * 3 + 2] = c
    }
    inner.setAttribute('color', new THREE.BufferAttribute(col, 3))
  }

  // engraving band: same surface as the belly, lifted a hair
  const { y0, y1, halfArc } = DZ.band
  const cols = 72
  const rows = 28
  const bpos: number[] = []
  const buv: number[] = []
  const bnor: number[] = []
  const idx: number[] = []
  for (let j = 0; j <= rows; j++) {
    const y = y0 + ((y1 - y0) * j) / rows
    const r = radiusAt(wall, y)
    const dr = radiusAt(wall, y + 0.01) - radiusAt(wall, y - 0.01)
    const len = Math.hypot(dr, 0.02)
    const nr = 0.02 / len
    const ny = -dr / len
    for (let i = 0; i <= cols; i++) {
      const phi = -halfArc + (2 * halfArc * i) / cols
      const s = Math.sin(phi)
      const c = Math.cos(phi)
      const rr2 = r + nr * 0.0022
      bpos.push(rr2 * s, y + ny * 0.0022, rr2 * c)
      bnor.push(nr * s, ny, nr * c)
      buv.push(i / cols, j / rows)
    }
  }
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i
      const b = a + 1
      const c = a + cols + 1
      const d = c + 1
      idx.push(a, b, c, b, d, c)
    }
  const band = new THREE.BufferGeometry()
  band.setAttribute('position', new THREE.Float32BufferAttribute(bpos, 3))
  band.setAttribute('normal', new THREE.Float32BufferAttribute(bnor, 3))
  band.setAttribute('uv', new THREE.Float32BufferAttribute(buv, 2))
  band.setIndex(idx)
  const midR = radiusAt(wall, (y0 + y1) / 2)
  const slant = Math.hypot(y1 - y0, radiusAt(wall, y0) - radiusAt(wall, y1))
  const bandAspect = (2 * halfArc * midR) / slant

  // handle: a long tapered strip on edge with a round end and a hanging hole
  const L = DZ.handleLength
  const h0 = 0.064
  const h1 = 0.04
  const R = 0.074
  const ex = L - R
  const al = Math.asin(h1 / R)
  const x1 = ex - R * Math.cos(al)
  const shape = new THREE.Shape()
  shape.moveTo(-0.05, -h0)
  shape.lineTo(x1, -h1)
  shape.absarc(ex, 0, R, -(Math.PI - al), Math.PI - al, false)
  shape.lineTo(-0.05, h0)
  shape.closePath()
  const hole = new THREE.Path()
  hole.absarc(ex, 0, 0.027, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const handle = new THREE.ExtrudeGeometry(shape, {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 18,
  })
  handle.translate(0, 0, -0.011)
  handle.rotateZ(DZ.handleAngle)
  handle.rotateY(Math.PI)
  const rh = radiusAt(wall, DZ.handleY)
  handle.translate(-(rh - 0.01), DZ.handleY, 0)
  handle.computeVertexNormals()

  // riveted mounting plate under the handle
  const plateWall = wall.filter((p) => p[1] > 1.04 && p[1] < 1.37).map(([r, y]) => [r + 0.006, y] as P2)
  const bracket = lathe(plateWall, {
    segments: 16,
    phiStart: DZ.handlePhi - 0.3,
    phiLength: 0.6,
  })
  const rivet = new THREE.SphereGeometry(0.024, 14, 8)
  rivet.scale(0.5, 1, 1)
  const rivets = [1.1, 1.31].map((y) => new THREE.Vector3(-(radiusAt(wall, y) + 0.012), y, 0))

  dzCache = { body, rim, inner, band, handle, bracket, rivet, rivets, bandAspect, wall, innerWall }
  return dzCache
}

/** Points on the džezva in its own space (base at y=0), used for steam, the pour and hotspots. */
export const DZ_POINTS = {
  mouth: new THREE.Vector3(0, 1.96, 0),
  lip: new THREE.Vector3(0.66, 2.0, 0),
}

// ---------------------------------------------------------------- set pieces

const CUP_WALL: P2[] = [
  [0.118, 0],
  [0.136, 0.008],
  [0.142, 0.03],
  [0.134, 0.05],
  [0.15, 0.064],
  [0.19, 0.112],
  [0.236, 0.2],
  [0.27, 0.31],
  [0.292, 0.42],
  [0.302, 0.5],
  [0.305, 0.535],
]

export type CupGeometry = {
  body: THREE.BufferGeometry
  band: THREE.BufferGeometry
  innerWall: P2[]
  floor: number
  top: number
}

let cupCache: CupGeometry | null = null

export function getCupGeometry(): CupGeometry {
  if (cupCache) return cupCache
  const wall = spline(CUP_WALL, 70)
  const t = 0.017
  const floor = 0.075
  const innerWall = offsetIn(wall, t).filter((p) => p[1] > floor + 0.01)
  const top = wall[wall.length - 1]
  const itop = innerWall[innerWall.length - 1]
  const cx = (top[0] + itop[0]) / 2
  const cy = (top[1] + itop[1]) / 2
  const rr = Math.hypot(top[0] - itop[0], top[1] - itop[1]) / 2
  const a0 = Math.atan2(top[1] - cy, top[0] - cx)
  const roll: P2[] = []
  for (let i = 0; i <= 6; i++) {
    const a = a0 + (Math.PI * i) / 6
    roll.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  const pts = join(line([0, 0], CUP_WALL[0], 6), wall, roll, [...innerWall].reverse(), line([innerWall[0][0], floor], [0, floor], 6))
  const body = lathe(pts, { segments: 72 })
  const bandPts = wall.filter((p) => p[1] > 0.43 && p[1] < 0.465).map(([r, y]) => [r + 0.0025, y] as P2)
  const band = lathe(bandPts, { segments: 72 })
  cupCache = { body, band, innerWall, floor, top: top[1] }
  return cupCache
}

let trayCache: THREE.BufferGeometry | null = null
export function getTrayGeometry(): THREE.BufferGeometry {
  if (trayCache) return trayCache
  const outline: P2[] = [
    [0, 0],
    [1.0, 0],
    [2.0, 0],
    [2.07, 0.018],
    [2.12, 0.06],
    [2.165, 0.11],
    [2.183, 0.145],
    [2.175, 0.168],
    [2.15, 0.174],
    [2.12, 0.158],
    [2.09, 0.12],
    [2.05, 0.072],
    [2.0, 0.042],
    [1.95, 0.035],
  ]
  const rim = spline(outline.slice(2), 60)
  const pts = join(line([0, 0], [2.0, 0], 10), rim, line([1.95, 0.035], [0, 0.035], 30))
  trayCache = lathe(pts, { segments: 128, uRepeat: 22, vUnit: 0.6 })
  return trayCache
}

export type BowlGeometry = { body: THREE.BufferGeometry; lid: THREE.BufferGeometry; knob: THREE.BufferGeometry }
let bowlCache: BowlGeometry | null = null
export function getBowlGeometry(): BowlGeometry {
  if (bowlCache) return bowlCache
  const W: P2[] = [
    [0.15, 0],
    [0.172, 0.018],
    [0.165, 0.05],
    [0.2, 0.09],
    [0.258, 0.17],
    [0.284, 0.27],
    [0.27, 0.36],
    [0.238, 0.42],
    [0.228, 0.452],
  ]
  const wall = spline(W, 60)
  const inner = offsetIn(wall, 0.014).filter((p) => p[1] > 0.06)
  const body = lathe(join(line([0, 0], [0.15, 0], 6), wall, [...inner].reverse(), line([inner[0][0], 0.05], [0, 0.05], 6)), {
    segments: 72,
    uRepeat: 4,
  })
  const lidPts = spline(
    [
      [0.262, 0.445],
      [0.255, 0.468],
      [0.22, 0.51],
      [0.15, 0.555],
      [0.07, 0.582],
      [0.0, 0.59],
    ],
    30,
  )
  const lid = lathe(lidPts, { segments: 72, uRepeat: 4 })
  const knob = lathe(
    spline(
      [
        [0.0, 0.585],
        [0.022, 0.592],
        [0.016, 0.615],
        [0.04, 0.645],
        [0.03, 0.68],
        [0.0, 0.695],
      ],
      24,
    ),
    { segments: 32, uRepeat: 1 },
  )
  bowlCache = { body, lid, knob }
  return bowlCache
}
