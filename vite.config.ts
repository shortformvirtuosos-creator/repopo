import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { config } from './src/config.ts'
import { copy } from './src/copy.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Fill the link-preview tags in index.html from src/config.ts and src/copy.ts. */
function meta(): Plugin {
  const site = config.siteUrl.replace(/\/+$/, '')
  const values: Record<string, string> = {
    PAGE_TITLE: copy.meta.title,
    BRAND: config.brand,
    OG_TITLE: copy.meta.ogTitle,
    OG_DESCRIPTION: copy.meta.ogDescription,
    SITE_URL: site + '/',
    OG_IMAGE: site + '/og.jpg',
    LOADER_UNIT: copy.loader.unit,
    LOADER_HEATING: copy.loader.heating,
  }
  return {
    name: 'ceif-meta',
    transformIndexHtml(html) {
      return html.replace(/%([A-Z_]+)%/g, (m, k: string) => (k in values ? esc(values[k]) : m))
    },
  }
}

// If a real model is dropped into public/models/dzezva.glb it replaces the
// procedural džezva (checked when the dev server starts or the site is built).
const hasGlb = fs.existsSync(path.resolve(import.meta.dirname, 'public/models/dzezva.glb'))

export default defineConfig({
  // relative asset paths: dist/ works from any subpath
  base: './',
  plugins: [react(), meta()],
  define: {
    __DZEZVA_GLB__: JSON.stringify(hasGlb),
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
  },
})
