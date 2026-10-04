// Screenshots of every scene at 1440×900 and 390×844, scene 1 with latin and
// Cyrillic names, the share image, a shared link and the og.jpg link preview.
// Runs the built site in headless Chromium.
//
//   npm run build
//   npm run screens                 # phone + desktop + og.jpg
//   npm run screens -- phone        # one device only
//
// Needs a Chromium for Playwright: `npx playwright-core install chromium`
// (or set CHROMIUM_PATH to an existing Chrome/Chromium binary).
//
// Besides the pictures it checks that every visible word sits inside its
// zone and on screen, and that the page asks nothing of other servers.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { serve } from './serve.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'docs/screens')
fs.mkdirSync(OUT, { recursive: true })
// start clean when shooting everything
if (process.argv.length <= 2) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f))

const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}

const which = process.argv.slice(2).filter((a) => a in DEVICES || a === 'og')
const jobs = which.length ? which : ['desktop', 'phone', 'og']
const problems = []

const launch = () => chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const wait = (page, ms) => page.waitForTimeout(ms)

async function open(browser, opts, url, { loader } = {}) {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  page.setDefaultTimeout(60000)
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
  page.on('console', (m) => m.type() === 'error' && console.log('  [console]', m.text()))
  const origin = new URL(url).origin
  page.on('request', (r) => {
    const u = r.url()
    if (!u.startsWith(origin) && !/^(data|blob):/.test(u)) problems.push(`external request: ${u}`)
  })
  await page.goto(url, { waitUntil: 'load' })
  if (loader) {
    await wait(page, 900)
    await loader(page)
  }
  await page.waitForSelector('.loader', { state: 'detached', timeout: 30000 })
  await wait(page, 3200)
  return { ctx, page }
}

/** Jump to a moment on the scroll timeline (in screen heights) and let it settle. */
async function at(page, t, ms = 900) {
  await page.evaluate((t) => window.__ceif.scrollToTime(t, undefined, true), t)
  await wait(page, ms)
}

async function typeInto(page, sel, text) {
  await page.click(sel, { clickCount: 3 })
  await page.keyboard.press('Backspace')
  await page.keyboard.type(text, { delay: 40 })
}

/** Every visible word must be inside its zone and on screen. */
async function checkText(page, label) {
  const bad = await page.evaluate(() => {
    const out = []
    const vw = innerWidth
    const vh = innerHeight
    document.querySelectorAll('#texts .zone').forEach((zone) => {
      const z = zone.getBoundingClientRect()
      const items = zone.querySelectorAll('.mask > span, [data-rise]')
      items.forEach((el) => {
        const cs = getComputedStyle(el)
        if (el.offsetParent === null || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) return
        // a headline line that has slid out of its mask is not visible
        const mask = el.parentElement?.classList.contains('mask') ? el.parentElement.getBoundingClientRect() : null
        if (mask && (r.bottom <= mask.top + 1 || r.top >= mask.bottom - 1)) return
        const t = 2
        if (r.left < z.left - t || r.right > z.right + t || r.top < z.top - t || r.bottom > z.bottom + t)
          out.push(`${zone.dataset.zone}: "${el.textContent.trim().slice(0, 30)}" outside its zone`)
        if (r.left < 0 || r.right > vw || r.top < 0 || r.bottom > vh) out.push(`${zone.dataset.zone}: "${el.textContent.trim().slice(0, 30)}" off screen`)
      })
    })
    return out
  })
  bad.forEach((b) => problems.push(`${label}: ${b}`))

  // nothing readable or clickable on the pot, handle, steam, splash, cups or tray of any photo on screen
  const onSubject = await page.evaluate(() => {
    const out = []
    const lay = window.__ceif.layout()
    if (!lay) return ['no layout']
    const shown = (el) => {
      const cs = getComputedStyle(el)
      return el.offsetParent !== null && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05
    }
    const hit = (a, b) => a.left < b.x + b.w && b.x < a.right && a.top < b.y + b.h && b.y < a.bottom
    const photos = lay.scenes.map((_, i) => i).filter((i) => {
      const cs = getComputedStyle(document.getElementById('photo-' + i))
      return cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05
    })
    const els = [...document.querySelectorAll('#texts .mask > span, #texts [data-rise], .chrome .wordmark, .chrome .btn-sm')].filter((el) => {
      if (!shown(el)) return false
      const mask = el.parentElement?.classList.contains('mask') ? el.parentElement.getBoundingClientRect() : null
      const r = el.getBoundingClientRect()
      return !(mask && (r.bottom <= mask.top + 1 || r.top >= mask.bottom - 1))
    })
    for (const i of photos) {
      const s = lay.scenes[i]
      // on phones the top of the photo is under the black fade; only what shows through counts
      // (black is at least half opaque until 19% of the way from `mid` to `end`)
      const darkUntil = s.fade ? s.fade.mid + (s.fade.end - s.fade.mid) * 0.19 : -1
      for (const [k, c0] of s.clear.entries()) {
        const top = Math.max(c0.y, darkUntil)
        const c = { x: c0.x, y: top, w: c0.w, h: c0.y + c0.h - top }
        if (c.h <= 0) continue
        for (const el of els) {
          const r = el.getBoundingClientRect()
          if (hit(r, c)) out.push(`"${el.textContent.trim().slice(0, 24)}" sits on the subject of photo ${i + 1} (keepClear box ${k >> 1})`)
        }
      }
    }
    return [...new Set(out)]
  })
  onSubject.forEach((b) => problems.push(`${label}: ${b}`))
}

async function saveShareImage(page, file) {
  await page.waitForSelector('.sheet-img', { timeout: 30000 })
  const src = await page.getAttribute('.sheet-img', 'src')
  fs.writeFileSync(path.join(OUT, file), Buffer.from(src.split(',')[1], 'base64'))
}

async function device(browser, base, name) {
  const shot = async (page, n) => {
    await checkText(page, `${name}-${n}`)
    await page.screenshot({ path: path.join(OUT, `${name}-${n}.jpg`), type: 'jpeg', quality: 88 })
  }
  const M = { pot: 0, potFields: 1.2 }
  console.log(`${name}: loader`)
  const { ctx, page } = await open(browser, DEVICES[name], base, {
    loader: (p) => p.screenshot({ path: path.join(OUT, `${name}-0-loader.jpg`), type: 'jpeg', quality: 88 }),
  })
  const moments = await page.evaluate(() => window.__ceif.MOMENTS)
  Object.assign(M, moments)

  console.log(`${name}: scene 1`)
  await shot(page, '1-pot')
  if (name === 'phone') {
    await at(page, M.potFields)
    await shot(page, '1-pot-fields')
  }
  // examples change every few seconds: catch one more
  await wait(page, 2800)
  await shot(page, '1-pot-example')

  await typeInto(page, '#in-prezime', 'Čaušević')
  await typeInto(page, '#in-grad', 'Živinice')
  await page.evaluate(() => document.activeElement?.blur())
  await wait(page, 900)
  await shot(page, '1-pot-causevic')

  console.log(`${name}: share image`)
  await page.click('[data-zone="0:ctrl"] .ctrl:not([hidden]) .btn-primary')
  await saveShareImage(page, `share-causevic.png`)
  await wait(page, 600)
  await shot(page, 'share-sheet')
  await page.click('.sheet-close')
  await wait(page, 600)

  await typeInto(page, '#in-prezime', 'Петровић')
  await typeInto(page, '#in-grad', 'Бијељина')
  await page.evaluate(() => document.activeElement?.blur())
  await wait(page, 900)
  await shot(page, '1-pot-petrovic')
  if (name === 'phone') {
    await page.click('[data-zone="0:ctrl"] .ctrl:not([hidden]) .btn-primary')
    await saveShareImage(page, `share-petrovic.png`)
    await page.click('.sheet-close')
    await wait(page, 600)
  }

  // the rest of the page with a latin name typed
  await typeInto(page, '#in-prezime', 'Čaušević')
  await typeInto(page, '#in-grad', 'Živinice')
  await page.evaluate(() => document.activeElement?.blur())

  for (const [key, file] of [
    ['explosion', '2-explosion'],
    ['copper', '3-copper'],
    ['pour', '4-pour'],
    ['set', '5-set'],
    ['ending', '5-ending'],
  ]) {
    console.log(`${name}: ${file}`)
    await at(page, M[key], 1400)
    await shot(page, file)
  }
  // a crossfade between two photos
  await at(page, (await page.evaluate(() => window.__ceif.STARTS))[2], 900)
  await shot(page, 'x-crossfade')
  await ctx.close()

  console.log(`${name}: shared link`)
  const shared = await open(browser, DEVICES[name], base + '?p=Hod%C5%BEi%C4%87&g=Zenica')
  await checkText(shared.page, `${name}-shared-link`)
  await shared.page.screenshot({ path: path.join(OUT, `${name}-1-shared-link.jpg`), type: 'jpeg', quality: 88 })
  await shared.ctx.close()
}

async function og(browser, base) {
  console.log('og: scene 1 at 1200x630')
  const { ctx, page } = await open(browser, { viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 }, base)
  await wait(page, 2800)
  await page.screenshot({ path: path.join(ROOT, 'public/og.jpg'), type: 'jpeg', quality: 86 })
  await ctx.close()
}

const srv = await serve(path.join(ROOT, 'dist'), '/ceif/')
const browser = await launch()
try {
  for (const job of jobs) {
    if (job === 'og') await og(browser, srv.url)
    else await device(browser, srv.url, job)
  }
} finally {
  await browser.close()
  srv.close()
}
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`)
  problems.forEach((p) => console.log('  - ' + p))
  process.exitCode = 1
} else {
  console.log('\nall words inside their zones, no outside requests')
}
