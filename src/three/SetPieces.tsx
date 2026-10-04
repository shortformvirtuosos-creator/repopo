import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { current } from './Rig'
import { refs, domRefs } from './refs'
import { DZ_POINTS, getBowlGeometry, getCupGeometry, getTrayGeometry, radiusAt } from './geometry'
import { COPPER } from './finishes'
import { coffeeMaterial, hammeredMetal, lokumMaterial, plainMetal, porcelain, streamMaterial } from './materials'
import { live } from '../state/rig'
import { store } from '../state/store'

const ease = (x: number) => {
  const t = Math.min(1, Math.max(0, x))
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

let shadowTex: THREE.Texture | null = null
function shadowMaterial(opacity: number) {
  if (!shadowTex) {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grd.addColorStop(0, 'rgba(0,0,0,0.85)')
    grd.addColorStop(0.45, 'rgba(0,0,0,0.45)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 128)
    shadowTex = new THREE.CanvasTexture(c)
  }
  return new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity, toneMapped: false })
}

function Blob({ r, opacity = 0.55, amount }: { r: number; opacity?: number; amount?: () => number }) {
  const mat = useMemo(() => shadowMaterial(opacity), [opacity])
  useFrame(() => {
    if (amount) mat.opacity = opacity * amount()
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.004} scale={[r * 2.4, r * 2.4, 1]} material={mat} renderOrder={1}>
      <planeGeometry />
    </mesh>
  )
}

function Cup({ fill, shadow }: { fill: () => number; shadow?: () => number }) {
  const g = getCupGeometry()
  const coffee = useRef<THREE.Mesh>(null!)
  useFrame(() => {
    const f = fill()
    const m = coffee.current
    m.visible = f > 0.004
    if (!m.visible) return
    const y = g.floor + (g.top * 0.86 - g.floor) * Math.min(1, f)
    const r = radiusAt(g.innerWall, y) - 0.002
    m.position.y = y
    m.scale.set(r, r, 1)
  })
  return (
    <group>
      <mesh geometry={g.body} material={porcelain()} />
      <mesh geometry={g.band} material={plainMetal(COPPER)} />
      <mesh ref={coffee} rotation-x={-Math.PI / 2} material={coffeeMaterial()}>
        <circleGeometry args={[1, 48]} />
      </mesh>
      <Blob r={0.2} amount={shadow} />
    </group>
  )
}

function SugarBowl() {
  const g = getBowlGeometry()
  const copper = hammeredMetal(COPPER, 'bowl')
  return (
    <group>
      <mesh geometry={g.body} material={copper} />
      <mesh geometry={g.lid} material={copper} />
      <mesh geometry={g.knob} material={plainMetal(COPPER)} />
      <Blob r={0.24} />
    </group>
  )
}

/** Tray, cups, sugar bowl and lokum. One cup is also the one the visitor pours into. */
export function SetPieces() {
  const tray = useRef<THREE.Group>(null!)
  const cup1 = useRef<THREE.Group>(null!)
  const rest = useRef<(THREE.Group | null)[]>([])
  const dzBlob = useRef<THREE.Mesh>(null!)
  const dzBlobMat = useMemo(() => shadowMaterial(0.6), [])
  const trayMat = hammeredMetal(COPPER, 'tray')

  // [x, z, rotation, reveal delay]
  const places: [number, number, number, number][] = [
    [1.38, -0.18, 0, 0.18],
    [0.42, -1.3, 0.4, 0.28],
    [-0.36, 1.18, 0.35, 0.38],
    [-0.02, 1.4, -0.25, 0.44],
  ]

  useFrame(() => {
    const s = current.set
    const tk = ease(s / 0.55)
    const t = tray.current
    t.visible = s > 0.002
    t.position.set(0, -1.035 - (1 - tk) * 0.8, 0)
    t.scale.setScalar(0.6 + 0.4 * tk)
    rest.current.forEach((g, i) => {
      if (!g) return
      const k = ease((s - places[i][3]) / 0.5)
      g.visible = k > 0.002
      g.position.set(places[i][0], -1 - (1 - k) * 0.6, places[i][1])
      g.scale.setScalar(k)
    })
    const c = cup1.current
    c.visible = current.cupS > 0.003
    c.position.set(current.cupX, current.cupY, current.cupZ)
    c.scale.setScalar(Math.max(0.0001, current.cupS))
    refs.cup = c

    const b = dzBlob.current
    b.visible = s > 0.01
    b.position.set(current.dx, -0.996, current.dz)
    dzBlobMat.opacity = 0.6 * ease((s - 0.5) / 0.5)
  })

  return (
    <>
      <group ref={tray}>
        <mesh geometry={getTrayGeometry()} material={trayMat} />
      </group>
      <mesh ref={dzBlob} rotation-x={-Math.PI / 2} scale={[1.7, 1.7, 1]} material={dzBlobMat} renderOrder={1}>
        <planeGeometry />
      </mesh>
      <group ref={cup1}>
        <Cup fill={() => live.fill} shadow={() => ease((current.set - 0.6) / 0.4)} />
      </group>
      <group ref={(el) => void (rest.current[0] = el)}>
        <Cup fill={() => 0.82} />
      </group>
      <group ref={(el) => void (rest.current[1] = el)} rotation-y={places[1][2]}>
        <SugarBowl />
      </group>
      <group ref={(el) => void (rest.current[2] = el)} rotation-y={places[2][2]}>
        <RoundedBox args={[0.26, 0.23, 0.26]} radius={0.05} smoothness={3} position-y={0.115} material={lokumMaterial(false)} />
        <Blob r={0.16} opacity={0.4} />
      </group>
      <group ref={(el) => void (rest.current[3] = el)} rotation-y={places[3][2]}>
        <RoundedBox args={[0.24, 0.22, 0.24]} radius={0.05} smoothness={3} position-y={0.11} material={lokumMaterial(true)} />
        <Blob r={0.15} opacity={0.4} />
      </group>
      <Stream />
    </>
  )
}

// ------------------------------------------------------------------ pour

const SEGS = 40
const RAD = 6

function Stream() {
  const mesh = useRef<THREE.Mesh>(null!)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const n = (SEGS + 1) * (RAD + 1)
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    const idx: number[] = []
    for (let j = 0; j < SEGS; j++)
      for (let i = 0; i < RAD; i++) {
        const a = j * (RAD + 1) + i
        const b = a + RAD + 1
        idx.push(a, b, a + 1, b, b + 1, a + 1)
      }
    g.setIndex(idx)
    return g
  }, [])
  const st = useMemo(
    () => ({
      head: 0,
      tail: 0,
      p0: new THREE.Vector3(),
      p1: new THREE.Vector3(),
      p2: new THREE.Vector3(),
      c: new THREE.Vector3(),
      d: new THREE.Vector3(),
      n: new THREE.Vector3(),
      b: new THREE.Vector3(),
      up: new THREE.Vector3(0, 0, 1),
    }),
    [],
  )
  const cup = getCupGeometry()

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20)
    // tilt follows a critically damped spring: starts and stops softly
    const want = live.hold && live.pourActive && live.fill < 1 ? 1 : 0
    const k = 16
    live.tiltV += ((want - live.tilt) * k - live.tiltV * 2 * Math.sqrt(k)) * dt
    live.tilt = Math.min(1.05, Math.max(0, live.tilt + live.tiltV * dt))

    const flowing = want === 1 && live.tilt > 0.82
    if (flowing) {
      st.tail = 0
      st.head = Math.min(1, st.head + dt * (1.6 + st.head * 4))
    } else if (st.head > 0) {
      st.tail = Math.min(st.head, st.tail + dt * (1.6 + st.tail * 4))
      if (st.tail >= st.head - 0.001) st.head = st.tail = 0
    }
    live.flow += ((flowing && st.head >= 1 ? 1 : 0) - live.flow) * (1 - Math.exp(-6 * dt))
    if (flowing && st.head >= 1) {
      live.fill = Math.min(1, live.fill + dt * 0.19)
      if (live.fill >= 1) store.set({ poured: true, holding: false })
    }
    if (domRefs.holdFill) domRefs.holdFill.style.transform = `scaleX(${live.fill.toFixed(3)})`

    const m = mesh.current
    m.visible = st.head - st.tail > 0.002 && !!refs.model && !!refs.cup
    if (!m.visible) return

    st.p0.copy(DZ_POINTS.lip)
    refs.model!.localToWorld(st.p0)
    const y = cup.floor + (cup.top * 0.86 - cup.floor) * live.fill
    st.p2.set(0, y, 0)
    refs.cup!.localToWorld(st.p2)
    st.p2.x += (st.p0.x - st.p2.x) * 0.12
    st.p2.z += (st.p0.z - st.p2.z) * 0.12
    st.p1.set(
      st.p0.x + (st.p2.x - st.p0.x) * 0.85,
      st.p0.y - 0.04,
      st.p0.z + (st.p2.z - st.p0.z) * 0.85,
    )

    const pos = geo.attributes.position as THREE.BufferAttribute
    const nor = geo.attributes.normal as THREE.BufferAttribute
    const sc = Math.max(0.6, current.s)
    for (let j = 0; j <= SEGS; j++) {
      const t = st.tail + ((st.head - st.tail) * j) / SEGS
      const u = 1 - t
      st.c.set(0, 0, 0).addScaledVector(st.p0, u * u).addScaledVector(st.p1, 2 * u * t).addScaledVector(st.p2, t * t)
      st.d.set(0, 0, 0).addScaledVector(st.p0, -2 * u).addScaledVector(st.p1, 2 * u - 2 * t).addScaledVector(st.p2, 2 * t).normalize()
      st.n.crossVectors(st.d, st.up)
      if (st.n.lengthSq() < 1e-6) st.n.set(1, 0, 0)
      st.n.normalize()
      st.b.crossVectors(st.d, st.n).normalize()
      const r = (0.021 - 0.009 * t) * sc
      for (let i = 0; i <= RAD; i++) {
        const a = (i / RAD) * Math.PI * 2
        const ca = Math.cos(a)
        const sa = Math.sin(a)
        const nx = st.n.x * ca + st.b.x * sa
        const ny = st.n.y * ca + st.b.y * sa
        const nz = st.n.z * ca + st.b.z * sa
        const id = j * (RAD + 1) + i
        pos.setXYZ(id, st.c.x + nx * r, st.c.y + ny * r, st.c.z + nz * r)
        nor.setXYZ(id, nx, ny, nz)
      }
    }
    pos.needsUpdate = true
    nor.needsUpdate = true
    geo.computeBoundingSphere()
  })

  return <mesh ref={mesh} geometry={geo} material={streamMaterial()} frustumCulled={false} />
}
