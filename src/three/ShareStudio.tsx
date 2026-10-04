import { useEffect, useMemo, useRef } from 'react'
import { createPortal, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Dzezva } from './Dzezva'
import { FINISHES } from './finishes'
import { engraveLines, getShareEngraving, loadFontsFor } from './engravingDriver'
import { PIVOT } from './Rig'
import { store, useStore } from '../state/store'
import { copy } from '../copy'
import { clean, upper } from '../lib/text'
import { displayHost } from '../lib/link'

// The share picture is rendered into its own scene at 1080x1350, offscreen.
// The visible canvas is never read.

export const SHARE_W = 1080
export const SHARE_H = 1350

export const shareApi: { render: null | (() => Promise<HTMLCanvasElement>) } = { render: null }

const DZ_POS = new THREE.Vector3(0.22, 1.32, 0)
const DZ_SCALE = 1.12

const HEAD = '"Anton", "Oswald", Impact, sans-serif'
const BODY = '"Inter", system-ui, sans-serif'

export function ShareStudio() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const studio = useMemo(() => new THREE.Scene(), [])
  const camera = useMemo(() => {
    const c = new THREE.PerspectiveCamera(24, SHARE_W / SHARE_H, 0.1, 100)
    c.position.set(0, 0.35, 11.4)
    c.lookAt(0, 0.35, 0)
    return c
  }, [])
  const finishIdx = useStore((s) => s.finish)
  const engraving = getShareEngraving()
  const spot = useRef<THREE.SpotLight>(null!)

  useEffect(() => {
    spot.current.target.position.set(0, 0.8, 0)
    studio.add(spot.current.target)
    shareApi.render = async () => {
      const st = store.get()
      const name = clean(st.name)
      const town = clean(st.town)
      const finish = FINISHES[st.finish]
      const [l1, l2] = engraveLines(name, town)
      const title = copy.shareImage.title
      await loadFontsFor([l1, l2, title, upper(name), upper(town), copy.shareImage.bottom].join(' '))
      engraving.drawFinal(l1, l2)
      studio.environment = scene.environment
      const pixels = renderPixels(gl, studio, camera)
      // where the base of the džezva lands, for the contact shadow
      const base = new THREE.Vector3(DZ_POS.x, DZ_POS.y - PIVOT * DZ_SCALE, DZ_POS.z).project(camera)
      const foot = { x: (base.x * 0.5 + 0.5) * SHARE_W, y: (1 - (base.y * 0.5 + 0.5)) * SHARE_H }
      return compose(pixels, finish.bg, upper(name), upper(town), foot)
    }
    return () => {
      shareApi.render = null
    }
  }, [gl, scene, studio, camera, engraving])

  return createPortal(
    <>
      <ambientLight intensity={0.25} />
      <spotLight ref={spot} position={[3, 7, 7]} angle={0.4} penumbra={1} intensity={120} color="#ffd6ad" />
      <group position={DZ_POS} rotation={[0.07, -0.2, 0, 'YXZ']} scale={DZ_SCALE}>
        <group position={[0, -PIVOT, 0]}>
          <Dzezva finish={FINISHES[finishIdx]} engraving={engraving.texture} />
        </group>
      </group>
    </>,
    studio,
  )
}

function renderPixels(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Uint8Array {
  const samples = Math.min(4, gl.capabilities.maxSamples || 0)
  const rtA = new THREE.WebGLRenderTarget(SHARE_W, SHARE_H, { type: THREE.HalfFloatType, samples })
  const rtB = new THREE.WebGLRenderTarget(SHARE_W, SHARE_H, { type: THREE.UnsignedByteType })
  const output = new OutputPass()
  const prevTarget = gl.getRenderTarget()
  const prevColor = gl.getClearColor(new THREE.Color())
  const prevAlpha = gl.getClearAlpha()
  const buf = new Uint8Array(SHARE_W * SHARE_H * 4)
  try {
    gl.setClearColor(0x000000, 0)
    gl.setRenderTarget(rtA)
    gl.clear(true, true, true)
    gl.render(scene, camera)
    // tone mapping + sRGB, same as on screen
    output.render(gl, rtB, rtA, 0, false)
    gl.readRenderTargetPixels(rtB, 0, 0, SHARE_W, SHARE_H, buf)
  } finally {
    gl.setRenderTarget(prevTarget)
    gl.setClearColor(prevColor, prevAlpha)
    rtA.dispose()
    rtB.dispose()
    output.dispose()
  }
  return buf
}

function fitFont(g: CanvasRenderingContext2D, text: string, family: string, weight: string, max: number, width: number) {
  g.font = `${weight} 100px ${family}`
  const w = g.measureText(text).width || 1
  return Math.min(max, (width / w) * 100)
}

function compose(px: Uint8Array, bg: string, name: string, town: string, foot: { x: number; y: number }): HTMLCanvasElement {
  const W = SHARE_W
  const H = SHARE_H
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)

  // soft contact shadow under the džezva
  g.save()
  g.translate(foot.x, foot.y + 4)
  g.scale(1, 0.14)
  const sh = g.createRadialGradient(0, 0, 0, 0, 0, 330)
  sh.addColorStop(0, 'rgba(0,0,0,0.42)')
  sh.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = sh
  g.beginPath()
  g.arc(0, 0, 330, 0, Math.PI * 2)
  g.fill()
  g.restore()

  // the render: flip rows and undo the premultiplied edges
  const img = new ImageData(W, H)
  const d = img.data
  for (let y = 0; y < H; y++) {
    const src = (H - 1 - y) * W * 4
    const dst = y * W * 4
    for (let x = 0; x < W * 4; x += 4) {
      const a = px[src + x + 3]
      if (a === 0) continue
      const k = a < 255 ? 255 / a : 1
      d[dst + x] = Math.min(255, px[src + x] * k)
      d[dst + x + 1] = Math.min(255, px[src + x + 1] * k)
      d[dst + x + 2] = Math.min(255, px[src + x + 2] * k)
      d[dst + x + 3] = a
    }
  }
  const layer = document.createElement('canvas')
  layer.width = W
  layer.height = H
  layer.getContext('2d')!.putImageData(img, 0, 0)
  g.drawImage(layer, 0, 0)

  const M = 72
  g.fillStyle = '#ffffff'
  g.textBaseline = 'alphabetic'

  // wordmark
  g.font = `400 58px ${HEAD}`
  g.textAlign = 'left'
  g.fillText(copy.chrome.wordmark, M, 112)

  // Anton: caps are 0.86em tall and carons/accents reach 1.11em, so each
  // line is spaced by the full accent height to keep Č Ć Š Ž clear.
  const title = copy.shareImage.title
  const s1 = fitFont(g, title, HEAD, '400', 112, W - M * 2)
  const s2 = fitFont(g, name, HEAD, '400', 196, W - M * 2)
  const bottom = 1292
  const townSize = 44
  const nameBase = town ? 1132 : 1190
  const titleBase = nameBase - s2 * 1.16 - 6
  g.font = `400 ${s2}px ${HEAD}`
  g.fillText(name, M, nameBase)
  g.font = `400 ${s1}px ${HEAD}`
  g.fillText(title, M, titleBase)

  if (town) {
    g.font = `600 ${townSize}px ${BODY}`
    const gg = g as CanvasRenderingContext2D & { letterSpacing?: string }
    if ('letterSpacing' in gg) gg.letterSpacing = '4px'
    g.fillStyle = 'rgba(255,255,255,0.88)'
    g.fillText(town, M, nameBase + townSize + 36)
    if ('letterSpacing' in gg) gg.letterSpacing = '0px'
  }

  g.fillStyle = 'rgba(255,255,255,0.92)'
  g.font = `500 34px ${BODY}`
  g.fillText(copy.shareImage.bottom, M, bottom)
  g.textAlign = 'right'
  g.fillStyle = 'rgba(255,255,255,0.7)'
  g.font = `400 30px ${BODY}`
  g.fillText(displayHost(), W - M, bottom)
  return c
}
