import { createRoot } from 'react-dom/client'
// Self-hosted fonts. Each file only downloads when its characters are on screen.
import '@fontsource/anton/400.css'
import '@fontsource/oswald/cyrillic-700.css' // Anton has no Cyrillic; Oswald covers it
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/800.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App'
import { store } from './state/store'
import { readIncoming } from './lib/link'
import { reducedMotion } from './lib/env'
import { ENGRAVE_FONT, ENGRAVE_WEIGHT } from './lib/engrave'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

document.documentElement.classList.add(reducedMotion() ? 'rm' : 'motion', 'is-locked')

// A shared link (?p=Hodžić&g=Zenica) shows that family's džezva.
const incoming = readIncoming()
if (incoming) store.set({ name: incoming.name, town: incoming.town, shared: incoming })

const SAMPLE = 'ČĆŠŽĐ čćšžđ 0123456789 °·…'
const shared = incoming ? `${incoming.name} ${incoming.town} ${incoming.name.toLocaleUpperCase('bs')}` : ''
const fontsReady = Promise.all(
  [
    `${ENGRAVE_WEIGHT} 64px ${ENGRAVE_FONT}`,
    '800 64px "Playfair Display"',
    '400 64px "Anton"',
    '400 16px "Inter"',
    '500 16px "Inter"',
    '600 16px "Inter"',
  ].map((f) => document.fonts.load(f, `${SAMPLE} ABCabc ${shared}`).catch(() => null)),
)

createRoot(document.getElementById('root')!).render(<App fontsReady={fontsReady} />)
