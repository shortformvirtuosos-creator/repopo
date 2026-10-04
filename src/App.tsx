import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { Stage } from './ui/Stage'
import { Texts } from './ui/Scenes'
import { Chrome, Loader, ShareOverlay, startProgress } from './ui/Chrome'
import { SCENES } from './scenes'
import { MOMENTS, STARTS, TOTAL, buildScroll, initSmoothScroll, playIntro, prepareIntro, scrollToTime } from './lib/scroll'
import { currentLayout } from './lib/place'
import { startPlacing } from './lib/place'
import { preloadSharePhoto } from './lib/shareImage'
import { store } from './state/store'

export default function App({ fontsReady }: { fontsReady: Promise<unknown> }) {
  useLayoutEffect(() => {
    const stopPlacing = startPlacing()
    prepareIntro()
    return stopPlacing
  }, [])

  useEffect(() => {
    initSmoothScroll()
    const stopProgress = startProgress()
    const stopScroll = buildScroll()
    // for scripts/screens.mjs
    Object.assign(window, { __ceif: { scrollToTime, MOMENTS, STARTS, TOTAL, layout: currentLayout } })
    return () => {
      stopScroll()
      stopProgress()
    }
  }, [])

  // the loader waits for the fonts and the first photograph
  const ready = useMemo(() => {
    const img = document.querySelector<HTMLImageElement>('#plate-0 img')
    const photo = img ? img.decode().catch(() => null) : Promise.resolve()
    return Promise.all([fontsReady, photo])
  }, [fontsReady])

  const onLoaded = useCallback(() => {
    store.set({ intro: 'done' })
    playIntro()
    preloadSharePhoto()
  }, [])

  return (
    <>
      <Stage />
      <Texts />
      <Chrome />
      {/* the tall scroll track: one marker per scene */}
      <main id="track" style={{ height: `calc(${TOTAL + 1} * var(--sh))` }}>
        {SCENES.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className="mark"
            style={{ top: `calc(${STARTS[i]} * var(--sh))`, height: `calc(${s.length} * var(--sh))` }}
          />
        ))}
      </main>
      <ShareOverlay />
      <Loader ready={ready} onDone={onLoaded} />
    </>
  )
}
