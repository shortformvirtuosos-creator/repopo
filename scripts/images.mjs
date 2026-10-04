// Resized WebP copies of the five photographs in flow/.
//
//   npm run images
//
// Reads flow/<name>.png (or .jpg/.jpeg/.webp when there is no PNG), never
// touches those files, and writes public/photos/<name>-2560.webp and
// <name>-1280.webp plus src/photos.json (real pixel sizes, used for srcset and
// for placing the engraving). A source narrower than 2560 is not upscaled:
// its "-2560" copy keeps the source width.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'flow')
const OUT = path.join(ROOT, 'public/photos')
const MANIFEST = path.join(ROOT, 'src/photos.json')

const NAMES = ['1-pot', '2-explosion', '3-copper', '4-pour', '5-set']
const WIDTHS = [1280, 2560]
const EXT = ['.png', '.jpg', '.jpeg', '.webp']

fs.mkdirSync(OUT, { recursive: true })
const manifest = {}

for (const name of NAMES) {
  const ext = EXT.find((e) => fs.existsSync(path.join(SRC, name + e)))
  if (!ext) throw new Error(`missing flow/${name}.png`)
  const file = path.join(SRC, name + ext)
  const meta = await sharp(file).metadata()
  const files = []
  for (const target of WIDTHS) {
    const w = Math.min(target, meta.width)
    const h = Math.round((meta.height * w) / meta.width)
    const out = `photos/${name}-${target}.webp`
    await sharp(file)
      .resize({ width: w, height: h, kernel: 'lanczos3' })
      .webp({ quality: target > 1280 ? 82 : 80, effort: 6, smartSubsample: true })
      .toFile(path.join(ROOT, 'public', out))
    files.push({ file: out, w, h })
  }
  manifest[name] = { source: path.relative(ROOT, file), w: meta.width, h: meta.height, files }
  console.log(`${name}: ${path.relative(ROOT, file)} ${meta.width}x${meta.height} -> ${files.map((f) => `${f.w}w`).join(', ')}`)
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`wrote ${path.relative(ROOT, MANIFEST)}`)
