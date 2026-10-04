import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Dzezva } from './Dzezva'
import { FINISHES } from './finishes'
import { getEngraving, driveEngraving } from './engravingDriver'
import { refs } from './refs'
import { FOV, KEYS, live, poses, target, updateTarget, type Pose } from '../state/rig'
import { store } from '../state/store'
import { clean } from '../lib/text'

const cur: Pose = { ...target }
let started = false
let typing = 0
let lock = 0
let still = ''
const ptr = { x: 0, y: 0 }

const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt))
const smoothstep = (x: number) => x * x * (3 - 2 * x)

/** Half the model height: the džezva turns around its middle, not its base. */
export const PIVOT = 0.98

const BAND_MID = 0.59 // height of the engraving's centre on the model
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
const focus: Pose = { ...target }

/**
 * While typing, bring the engraving close: the belly fills the free space
 * between the header and the input (on phones: above the keyboard).
 */
function focusPose(): Pose {
  const base = poses.engrave
  Object.assign(focus, base)
  const ih = window.innerHeight
  const iw = window.innerWidth
  const vv = window.visualViewport
  const visTop = (vv?.offsetTop ?? 0) + 72
  const visBottom = vv ? vv.offsetTop + vv.height : ih
  const el = document.activeElement as HTMLElement | null
  const portrait = iw / ih < 0.9
  let bottom = el?.tagName === 'INPUT' && portrait ? el.getBoundingClientRect().top - 36 : visBottom - 40
  bottom = Math.min(bottom, visBottom - 16)
  if (bottom - visTop < 110) return focus
  const H = 2 * base.cz * TAN
  const W = (H * iw) / ih
  const unit = ih / H
  const regionH = (bottom - visTop) / unit
  const s = Math.min(portrait ? 2.25 : 2.2, (regionH * 0.85) / 0.78, ((portrait ? 0.92 : 0.42) * W) / 1.1)
  const midY = (0.5 - (visTop + bottom) / 2 / ih) * H
  focus.s = s
  focus.dy = midY + (PIVOT - BAND_MID) * s
  focus.ry = base.ry - (portrait ? 0 : 0.06)
  focus.rx = 0.02
  focus.sway = 0
  focus.bob = 0.2
  return focus
}

export function Rig() {
  const camera = useThree((s) => s.camera)
  const group = useRef<THREE.Group>(null!)
  const items = useRef<(THREE.Group | null)[]>([])
  const inner = useRef<(THREE.Group | null)[]>([])
  const engraving = getEngraving()

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const t = state.clock.elapsedTime
    const now = performance.now()
    driveEngraving(now)
    updateTarget()

    const st = store.get()
    const hasText = !!(clean(st.name) || clean(st.town))
    typing = damp(typing, hasText || st.focused ? 1 : 0, 3, dt)
    // while the keyboard is open the page may scroll; keep the engraving in view
    lock = damp(lock, st.focused ? 1 : 0, 4, dt)

    const snap = !started || (live.reduced && live.snap)
    started = true
    live.snap = false
    const lam = live.reduced ? 0 : 5.5
    const eng = lock > 0.001 ? focusPose() : poses.engrave
    let moving = 0
    for (const k of KEYS) {
      const goal = target[k] + (eng[k] - target[k]) * lock * (k === 'flood' ? 0 : 1)
      cur[k] = snap ? goal : lam ? damp(cur[k], goal, lam, dt) : cur[k]
      moving = Math.max(moving, Math.abs(goal - cur[k]))
    }
    // lets automated screenshots wait until the camera has come to rest
    const isStill = moving < 0.004 && Math.abs(lock - (st.focused ? 1 : 0)) < 0.01 ? '1' : '0'
    if (isStill !== still) document.documentElement.dataset.still = still = isStill

    // camera
    ptr.x = damp(ptr.x, live.reduced ? 0 : live.pointerX, 2.5, dt)
    ptr.y = damp(ptr.y, live.reduced ? 0 : live.pointerY, 2.5, dt)
    const px = ptr.x
    const py = ptr.y
    camera.position.set(cur.cx + px * 0.18, cur.cy - py * 0.1, cur.cz)
    camera.lookAt(cur.tx, cur.ty, cur.tz)

    // the džezva
    const g = group.current
    const drop = smoothstep(Math.min(1, Math.max(0, live.drop)))
    const sway = Math.sin(t * 0.42) * cur.sway * (1 - typing)
    const bob = Math.sin(t * 0.9) * 0.045 * cur.bob
    const tilt = smoothstep(Math.min(1, Math.max(0, live.tilt)))
    g.position.set(cur.dx, cur.dy + bob + (1 - drop) * 7.5, cur.dz)
    g.rotation.set(cur.rx + py * 0.05, cur.ry + sway + (1 - drop) * 1.1 + px * 0.12, cur.rz - tilt * 0.92, 'XYZ')
    g.scale.setScalar(cur.s)

    // finish carousel: four džezvas on a ring, the active one in front
    const n = FINISHES.length
    const pos = live.carousel
    const active = ((Math.round(pos) % n) + n) % n
    const fan = cur.fan
    for (let i = 0; i < n; i++) {
      const it = items.current[i]
      if (!it) continue
      let k = i - pos
      k = ((((k + n / 2) % n) + n) % n) - n / 2
      const a = (k * Math.PI * 2) / n
      const near = Math.max(0, 1 - Math.abs(k))
      // the others shrink away early, so they never cross a close-up
      const show = i === active ? 1 : smoothstep(Math.min(1, Math.max(0, (fan - 0.3) / 0.6)))
      it.visible = show > 0.01
      it.position.set(Math.sin(a) * cur.ring * fan, 0, (Math.cos(a) - 1) * cur.ring * fan)
      it.rotation.set(0.2 * smoothstep(near) * fan, Math.sin(a) * 0.55 * fan, 0, 'YXZ')
      it.scale.setScalar((1 - 0.24 * (1 - smoothstep(near)) * fan) * Math.max(0.001, show))
    }
    refs.model = inner.current[active]
    g.updateMatrixWorld(true)
  }, -2)

  return (
    <group ref={group}>
      {FINISHES.map((f, i) => (
        <group key={f.id} ref={(el) => void (items.current[i] = el)}>
          <group position={[0, -PIVOT, 0]} ref={(el) => void (inner.current[i] = el)}>
            <Dzezva finish={f} engraving={engraving.texture} />
          </group>
        </group>
      ))}
    </group>
  )
}

/** Smoothed pose the scene is showing right now (read by other components). */
export const current = cur
