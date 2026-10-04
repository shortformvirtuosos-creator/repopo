// Screenshots of every section, the engraving with latin and Cyrillic input,
// a share image and the og.jpg link preview. Runs against the built site in
// headless Chromium (software WebGL is fine, just slow).
//
//   npm run build
//   npm run screens                 # phone + desktop + og.jpg
//   npm run screens -- phone        # one device only
//
// Needs a Chromium for Playwright: `npx playwright-core install chromium`
// (or set CHROMIUM_PATH to an existing Chrome/Chromium binary).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { serve } from './serve.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'docs/screens')
fs.mkdirSync(OUT, { recursive: true })

const DEVICES = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
}

const which = process.argv.slice(2).filter((a) => a in DEVICES || a === 'og')
const jobs = which.length ? which : ['phone', 'desktop', 'og']

const launch = () =>
  chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  })

const wait = (page, ms) => page.waitForTimeout(ms)

async function open(browser, opts, url) {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  page.setDefaultTimeout(180000)
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
  page.on('console', (m) => m.type() === 'error' && console.log('  [console]', m.text()))
  page.on('request', (r) => {
    const u = r.url()
    if (!u.startsWith(url.split('?')[0].replace(/[^/]*$/, '')) && !/^(data|blob):/.test(u)) console.log('  [external request]', u)
  })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForSelector('.loader', { state: 'detached', timeout: 120000 })
  await wait(page, 3000)
  await settle(page, 1500)
  return { ctx, page }
}

/** Wait until the 3D camera has come to rest (the page sets data-still). */
async function settle(page, extra = 1200) {
  await wait(page, 600)
  await page.waitForSelector('html[data-still="1"]', { timeout: 120000 }).catch(() => console.log('  (did not settle)'))
  await wait(page, extra)
}

/** Scroll so that `frac` of the section's scroll range has passed. */
async function scrollTo(page, id, frac = 0, extra = 1200) {
  await page.evaluate(
    ([id, f]) => {
      const el = document.getElementById(id)
      const range = Math.max(0, el.offsetHeight - innerHeight)
      window.scrollTo(0, el.offsetTop + range * f)
    },
    [id, frac],
  )
  await settle(page, extra)
}

async function typeInto(page, sel, text) {
  await page.click(sel, { clickCount: 3 })
  await page.keyboard.press('Backspace')
  await page.keyboard.type(text, { delay: 90 })
}

async function saveShareImage(page, file) {
  await page.waitForSelector('.sheet-img', { timeout: 60000 })
  const src = await page.getAttribute('.sheet-img', 'src')
  fs.writeFileSync(path.join(OUT, file), Buffer.from(src.split(',')[1], 'base64'))
}

async function device(browser, base, name) {
  const shot = (page, n) => page.screenshot({ path: path.join(OUT, `${name}-${n}.png`) })
  console.log(`${name}: loading`)
  const { ctx, page } = await open(browser, DEVICES[name], base)
  await shot(page, '01-hero')

  console.log(`${name}: engraving`)
  await scrollTo(page, 's-engrave')
  await shot(page, '02-engraving-examples')
  await typeInto(page, '#in-prezime', 'Čaušević')
  await typeInto(page, '#in-grad', 'Živinice')
  await settle(page, 3500)
  await shot(page, '03-engraving-causevic')

  // share image from the latin name (desktop shows the full-screen picture)
  await page.evaluate(() => document.activeElement?.blur())
  await wait(page, 1500)
  await page.click('.engrave-ui .btn')
  await saveShareImage(page, `share-${name}-causevic.png`)
  await wait(page, 800)
  await shot(page, '04-share-sheet')
  await page.click('.sheet-close')
  await wait(page, 800)

  await typeInto(page, '#in-prezime', 'Петровић')
  await typeInto(page, '#in-grad', 'Бијељина')
  await settle(page, 3500)
  await shot(page, '05-engraving-cyrillic')
  if (name === 'phone') {
    await page.evaluate(() => document.activeElement?.blur())
    await wait(page, 1200)
    await page.click('.engrave-ui .btn')
    await saveShareImage(page, `share-${name}-petrovic.png`)
    await page.click('.sheet-close')
    await wait(page, 600)
  }
  await page.evaluate(() => document.activeElement?.blur())
  await page.fill('#in-prezime', 'Čaušević')
  await page.fill('#in-grad', 'Živinice')
  await page.evaluate(() => document.activeElement?.blur())

  console.log(`${name}: finishes`)
  await scrollTo(page, 's-finish', 0, 7000)
  await shot(page, '06-finish-bakar')
  for (const [i, f] of [[1, 'kalaj'], [2, 'crna'], [3, 'mesing']]) {
    await page.click('.finish-info .arrow:last-of-type')
    await wait(page, 1500)
    await settle(page, 1500)
    await shot(page, `0${6 + i}-finish-${f}`)
  }
  // back to copper for the rest
  await page.click('.finish-info .arrow:last-of-type')
  await settle(page, 500)

  console.log(`${name}: feature walk`)
  await scrollTo(page, 's-features', 0.12, 7000)
  await shot(page, '10-feature-hammered')
  await scrollTo(page, 's-features', 0.5, 7000)
  await shot(page, '11-feature-neck')
  await scrollTo(page, 's-features', 0.88, 7000)
  await shot(page, '12-feature-tin')

  console.log(`${name}: pour`)
  await scrollTo(page, 's-pour', 0.25, 7000)
  await shot(page, '13-pour')
  const btn = await page.$('.btn.hold')
  const box = await btn.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await wait(page, 9000)
  await shot(page, '14-pouring')
  await page.waitForSelector('.after', { timeout: 180000 })
  await page.mouse.up()
  await wait(page, 4000)
  await settle(page, 1000)
  await shot(page, '15-poured')

  console.log(`${name}: set and ending`)
  await scrollTo(page, 's-set', 0.15, 8000)
  await shot(page, '16-set')
  await scrollTo(page, 's-end', 0, 8000)
  await shot(page, '17-ending')
  await ctx.close()

  console.log(`${name}: shared link`)
  const shared = await open(browser, DEVICES[name], base + '?p=Hod%C5%BEi%C4%87&g=Zenica&f=mesing')
  await shared.page.screenshot({ path: path.join(OUT, `${name}-18-shared-link.png`) })
  await shared.ctx.close()
}

async function og(browser, base) {
  console.log('og: hero at 1200x630')
  const { ctx, page } = await open(browser, { viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 }, base)
  await wait(page, 1500)
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
console.log('done')
