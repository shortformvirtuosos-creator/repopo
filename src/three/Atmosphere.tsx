import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { current } from './Rig'
import { refs } from './refs'
import { DZ_POINTS, getCupGeometry } from './geometry'
import { live } from '../state/rig'

const NOISE = /* glsl */ `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
`

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

const AMBIENT_FRAG = /* glsl */ `
uniform float uTime; uniform float uAspect; uniform float uAmt;
varying vec2 vUv;
${NOISE}
void main(){
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  float t = uTime * 0.035;
  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, -t * 2.0)), fbm(p * 1.2 + vec2(5.2, -t * 1.7)));
  float n = fbm(p * 1.5 + q * 1.9 + vec2(t * 0.5, -t * 2.6));
  float wisps = smoothstep(0.48, 0.86, n);
  float fadeY = smoothstep(0.0, 0.5, vUv.y);
  float a = wisps * fadeY * 0.09 * uAmt;
  gl_FragColor = vec4(vec3(1.0, 0.95, 0.9), a);
}
`

const SHAFT_FRAG = /* glsl */ `
uniform float uTime; uniform float uAspect; uniform float uAmt; uniform vec2 uTarget;
varying vec2 vUv;
${NOISE}
void main(){
  vec2 apex = vec2(0.5 + (uTarget.x - 0.5) * 0.35, 1.12);
  vec2 d = vUv - apex; d.x *= uAspect;
  vec2 axis = normalize(vec2((uTarget.x - apex.x) * uAspect, uTarget.y - apex.y));
  float along = dot(d, axis);
  float across = abs(d.x * axis.y - d.y * axis.x);
  float width = 0.04 + along * 0.34;
  float cone = (1.0 - smoothstep(width * 0.1, width, across)) * smoothstep(0.05, 0.4, along) * (1.0 - smoothstep(0.75, 1.45, along));
  float dust = 0.6 + 0.4 * fbm(vec2(across * 5.0 + uTime * 0.02, along * 2.5 - uTime * 0.06));
  vec3 col = vec3(1.0, 0.7, 0.42) * cone * dust * 0.11 * uAmt;
  gl_FragColor = vec4(col, 1.0);
}
`

const STEAM_FRAG = /* glsl */ `
uniform float uTime; uniform float uAmt; uniform float uSeed;
varying vec2 vUv;
${NOISE}
void main(){
  float h = vUv.y;
  float x = vUv.x - 0.5;
  float t = uTime;
  float sway = (fbm(vec2(h * 1.4 - t * 0.11, uSeed)) - 0.5) * 0.55 * h;
  float w = mix(0.05, 0.36, pow(h, 0.75));
  float column = 1.0 - smoothstep(w * 0.2, w, abs(x - sway));
  float n = fbm(vec2(vUv.x * 3.0 + uSeed, h * 2.1 - t * 0.32));
  float n2 = fbm(vec2(vUv.x * 7.0 - uSeed, h * 4.6 - t * 0.55));
  float wisp = smoothstep(0.36, 0.8, n * 0.75 + n2 * 0.42);
  float env = smoothstep(0.0, 0.1, h) * (1.0 - smoothstep(0.42, 1.0, h));
  float a = column * wisp * env * uAmt * 0.5;
  gl_FragColor = vec4(vec3(1.0, 0.97, 0.94), a);
}
`

/** Screen-filling layers behind everything: drifting steam and one warm light cone. */
export function Backdrop() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const steam = useRef<THREE.Mesh>(null!)
  const shaft = useRef<THREE.Mesh>(null!)
  const mats = useMemo(() => {
    const ambient = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: AMBIENT_FRAG,
      uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uAmt: { value: 1 } },
      transparent: true,
      depthWrite: false,
    })
    const light = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: SHAFT_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uAmt: { value: 1 },
        uTarget: { value: new THREE.Vector2(0.5, 0.45) },
      },
      transparent: true,
      depthWrite: false,
      // add light to the colour but leave alpha alone, so the page shows through
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
    })
    return { ambient, light }
  }, [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const fwd = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const t = live.reduced ? state.clock.elapsedTime * 0.5 : state.clock.elapsedTime
    const aspect = size.width / size.height
    const place = (m: THREE.Mesh, dist: number) => {
      const h = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.getWorldDirection(fwd)
      m.position.copy(camera.position).addScaledVector(fwd, dist)
      m.quaternion.copy(camera.quaternion)
      m.scale.set(h * aspect * 1.02, h * 1.02, 1)
    }
    place(steam.current, 60)
    place(shaft.current, 59)
    mats.ambient.uniforms.uTime.value = t
    mats.ambient.uniforms.uAspect.value = aspect
    mats.light.uniforms.uTime.value = t
    mats.light.uniforms.uAspect.value = aspect
    mats.light.uniforms.uAmt.value = current.shaft
    if (refs.model) {
      tmp.set(0, 1.0, 0)
      refs.model.localToWorld(tmp).project(camera)
      const u = mats.light.uniforms.uTarget.value as THREE.Vector2
      u.set(tmp.x * 0.5 + 0.5, tmp.y * 0.5 + 0.5)
    }
  })

  return (
    <>
      <mesh ref={steam} material={mats.ambient} renderOrder={-10} frustumCulled={false}>
        <planeGeometry />
      </mesh>
      <mesh ref={shaft} material={mats.light} renderOrder={-9} frustumCulled={false}>
        <planeGeometry />
      </mesh>
    </>
  )
}

/** A column of steam that follows a point (the mouth of the džezva, or a cup). */
function SteamColumn({
  source,
  amount,
  seed,
  height,
  scale,
}: {
  source: (out: THREE.Vector3) => boolean
  amount: () => number
  scale: () => number
  seed: number
  height: number
}) {
  const camera = useThree((s) => s.camera)
  const mesh = useRef<THREE.Mesh>(null!)
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: STEAM_FRAG,
        uniforms: { uTime: { value: 0 }, uAmt: { value: 0 }, uSeed: { value: seed } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [seed],
  )
  const p = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    const m = mesh.current
    const ok = source(p)
    const amt = ok ? amount() : 0
    m.visible = amt > 0.01
    if (!m.visible) return
    const s = Math.max(0.2, scale())
    m.scale.set(height * 0.55 * s, height * s, 1)
    m.position.set(p.x, p.y + (height * s) / 2 - 0.02, p.z)
    m.rotation.set(0, Math.atan2(camera.position.x - p.x, camera.position.z - p.z), 0)
    mat.uniforms.uTime.value = state.clock.elapsedTime * (live.reduced ? 0.5 : 1)
    mat.uniforms.uAmt.value = amt
  })
  return (
    <mesh ref={mesh} material={mat} renderOrder={5} frustumCulled={false}>
      <planeGeometry />
    </mesh>
  )
}

export function Steam() {
  const cup = getCupGeometry()
  return (
    <>
      <SteamColumn
        seed={1.7}
        height={2.3}
        source={(out) => {
          if (!refs.model) return false
          out.copy(DZ_POINTS.mouth)
          refs.model.localToWorld(out)
          return true
        }}
        amount={() => current.steam * (0.75 + live.flow * 0.5 + live.fill * 0.5)}
        scale={() => current.s}
      />
      <SteamColumn
        seed={4.2}
        height={1.5}
        source={(out) => {
          if (!refs.cup || !refs.cup.visible) return false
          out.set(0, cup.top, 0)
          refs.cup.localToWorld(out)
          return true
        }}
        amount={() => Math.min(1, live.fill * 1.4) * Math.min(1, current.cupS) * 0.9}
        scale={() => current.cupS}
      />
    </>
  )
}
