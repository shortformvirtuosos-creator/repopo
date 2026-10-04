import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Rig, current } from './Rig'
import { Backdrop, Steam } from './Atmosphere'
import { SetPieces } from './SetPieces'
import { ShareStudio } from './ShareStudio'
import { getDzezvaGeometry, radiusAt } from './geometry'
import { refs, domRefs } from './refs'
import { FOV } from '../state/rig'
import { store, useStore } from '../state/store'
import { isPhone } from '../lib/env'

export function Stage() {
  const phone = useMemo(isPhone, [])
  const wrap = useRef<HTMLDivElement>(null)
  return (
    <div className="gl" ref={wrap} id="gl" aria-hidden="true">
      <Canvas
        dpr={phone ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: FOV, near: 0.1, far: 200, position: [0, 0, 13] }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <World phone={phone} />
        </Suspense>
        <Pauser wrap={wrap} />
      </Canvas>
    </div>
  )
}

function World({ phone }: { phone: boolean }) {
  return (
    <>
      <Studio phone={phone} />
      <Rig />
      <Backdrop />
      <Steam />
      <SetPieces />
      <Hotspots />
      <ShareStudio />
      <Ready />
    </>
  )
}

/** Lighting: a dark room with a few soft light panels for reflections, plus one warm spot. */
function Studio({ phone }: { phone: boolean }) {
  const spot = useRef<THREE.SpotLight>(null!)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    scene.add(spot.current.target)
  }, [scene])
  useFrame(() => {
    spot.current.target.position.set(current.dx, current.dy, current.dz)
  })
  return (
    <>
      <Environment resolution={phone ? 128 : 256} frames={1}>
        <color attach="background" args={['#070504']} />
        {/* big warm softbox overhead */}
        <Lightformer form="rect" intensity={2.6} color="#ffe2c2" position={[0, 6, 1]} scale={[9, 6, 1]} />
        {/* tall strips left and right give the long highlights down the body */}
        <Lightformer form="rect" intensity={3.2} color="#fff1e2" position={[-5.5, 1.5, 3]} scale={[1.6, 9, 1]} />
        <Lightformer form="rect" intensity={4.2} color="#ffc995" position={[5.5, 1.2, -1.5]} scale={[1.2, 9, 1]} />
        {/* warm kicker from behind */}
        <Lightformer form="rect" intensity={1.6} color="#ff9e5e" position={[0, 2, -7]} scale={[7, 3, 1]} />
        {/* low front fill so the engraving reads */}
        <Lightformer form="rect" intensity={0.9} color="#ffd8b8" position={[0, -2.5, 7]} scale={[10, 2.2, 1]} />
        <Lightformer form="ring" intensity={2.2} color="#ffffff" position={[2.5, 4, 6]} scale={1.6} />
        {/* soft panel upper left in front, so the brass handle catches light */}
        <Lightformer form="rect" intensity={1.3} color="#ffe6cc" position={[-4.5, 3.5, 6]} scale={[4, 3, 1]} />
      </Environment>
      <ambientLight intensity={0.18} color="#ffd9b8" />
      <spotLight
        ref={spot}
        position={[2.6, 7.5, 5.5]}
        angle={0.42}
        penumbra={0.9}
        intensity={140}
        decay={2}
        color="#ffcf9e"
      />
    </>
  )
}

/**
 * Feature hotspots. Each dot sits on the part in question, on the side that
 * faces the camera, and is projected to the screen every frame.
 */
function Hotspots() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const geo = useMemo(() => getDzezvaGeometry(), [])
  const v = useMemo(() => new THREE.Vector3(), [])
  const local = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    const amts = [current.hot1, current.hot2, current.hot3]
    const model = refs.model
    if (model) {
      local.copy(camera.position)
      model.worldToLocal(local)
    }
    const face = Math.atan2(local.x, local.z)
    domRefs.hot.forEach((el, i) => {
      if (!el) return
      const a = amts[i]
      if (a < 0.01 || !model) {
        el.style.opacity = '0'
        return
      }
      // 0: hammered belly, 1: narrow neck, 2: tin lining seen through the mouth
      const [phi, y, r] =
        i === 0
          ? [face + 0.3, 0.5, radiusAt(geo.wall, 0.5) + 0.01]
          : i === 1
            ? [face + 0.15, 1.64, radiusAt(geo.wall, 1.64) + 0.01]
            : [face + Math.PI, 1.42, radiusAt(geo.innerWall, 1.42) - 0.01]
      v.set(Math.sin(phi) * r, y, Math.cos(phi) * r)
      model.localToWorld(v).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const yy = (1 - (v.y * 0.5 + 0.5)) * size.height
      el.style.opacity = a.toFixed(3)
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${yy.toFixed(1)}px, 0)`
    })
  })
  return null
}

/** Tell the loader the scene has drawn its first frames. */
function Ready() {
  const frames = useRef(0)
  useFrame(() => {
    frames.current++
    if (frames.current === 3) store.set({ sceneReady: true })
  })
  return null
}

/** Stop rendering while the canvas can't be seen (tab hidden, off screen, share sheet open). */
function Pauser({ wrap }: { wrap: React.RefObject<HTMLDivElement | null> }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const overlay = useStore((s) => !!s.overlay)
  const visible = useRef(true)
  useEffect(() => {
    const update = () => setFrameloop(document.hidden || overlay || !visible.current ? 'never' : 'always')
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      update()
    })
    if (wrap.current) io.observe(wrap.current)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [overlay, setFrameloop, wrap])
  return null
}

