import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { getDzezvaGeometry } from './geometry'
import { cartoucheMaterial, finishMaterials, grooveMaterial } from './materials'
import { getCartoucheTexture } from './engraving'
import type { Finish } from './finishes'

// One component for the džezva. It is built in code from a lathe profile,
// unless public/models/dzezva.glb exists at build time; then that model is
// loaded instead (see README for the naming the model should follow).

type Props = {
  finish: Finish
  engraving: THREE.Texture
}

export function Dzezva(props: Props) {
  const glb = useGlb()
  if (glb) return <DzezvaModel {...props} model={glb} />
  return <DzezvaProcedural {...props} />
}

function DzezvaProcedural({ finish, engraving }: Props) {
  const g = getDzezvaGeometry()
  const m = finishMaterials(finish)
  const groove = grooveMaterial(finish, engraving)
  return (
    <group>
      <mesh geometry={g.body} material={m.body} />
      <mesh geometry={g.rim} material={m.rim} />
      <mesh geometry={g.inner} material={m.inside} />
      <mesh geometry={g.band} material={cartoucheMaterial(finish, getCartoucheTexture())} renderOrder={2} />
      <mesh geometry={g.band} material={groove} renderOrder={3} />
      <mesh geometry={g.handle} material={m.handle} />
      <mesh geometry={g.bracket} material={m.handle} />
      {g.rivets.map((p, i) => (
        <mesh key={i} geometry={g.rivet} material={m.handle} position={p} />
      ))}
    </group>
  )
}

// ------------------------------------------------------------------ .glb

let glbPromise: Promise<THREE.Object3D | null> | null = null

function loadGlb(): Promise<THREE.Object3D | null> {
  if (!__DZEZVA_GLB__) return Promise.resolve(null)
  glbPromise ??= import('three/examples/jsm/loaders/GLTFLoader.js')
    .then(({ GLTFLoader }) => new GLTFLoader().loadAsync(import.meta.env.BASE_URL + 'models/dzezva.glb'))
    .then((gltf) => gltf.scene as THREE.Object3D)
    .catch(() => null)
  return glbPromise
}

function useGlb(): THREE.Object3D | null {
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  useEffect(() => {
    let alive = true
    loadGlb().then((m) => alive && setModel(m))
    return () => {
      alive = false
    }
  }, [])
  return model
}

function DzezvaModel({ finish, engraving, model }: Props & { model: THREE.Object3D }) {
  const scene = useMemo(() => {
    const s = model.clone(true)
    const m = finishMaterials(finish)
    const groove = grooveMaterial(finish, engraving)
    s.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const n = mesh.name.toLowerCase()
      if (n.includes('engrav')) {
        mesh.material = groove
        mesh.renderOrder = 3
      } else if (n.includes('handle')) mesh.material = m.handle
      else if (n.includes('rim')) mesh.material = m.rim
      else if (n.includes('inside') || n.includes('inner')) mesh.material = m.inside
      else if (n.includes('body')) mesh.material = m.body
    })
    return s
  }, [model, finish, engraving])
  return <primitive object={scene} />
}
