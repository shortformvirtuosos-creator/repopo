import { useCallback, useEffect, useMemo } from 'react'
import { Stage } from './three/Stage'
import { Chrome, Loader, ShareOverlay } from './ui/Chrome'
import { Ending, Engrave, Features, FinishPicker, Hero, Pour, TheSet } from './ui/Sections'
import { buildScroll, initSmoothScroll, playIntro } from './lib/scroll'
import { startDomLoop } from './lib/dom'
import { store } from './state/store'

export default function App({ fontsReady }: { fontsReady: Promise<unknown> }) {
  useEffect(() => {
    initSmoothScroll()
    const stopDom = startDomLoop()
    const stopScroll = buildScroll()
    return () => {
      stopScroll()
      stopDom()
    }
  }, [])

  const onLoaded = useCallback(() => {
    store.set({ intro: 'done' })
    playIntro()
  }, [])

  const stage = useMemo(() => <Stage />, [])

  return (
    <>
      <div id="bg" aria-hidden="true" />
      <div id="flood" aria-hidden="true" />
      {stage}
      <Chrome />
      <main id="main">
        <Hero />
        <Engrave />
        <FinishPicker />
        <Features />
        <Pour />
        <TheSet />
        <Ending />
      </main>
      <ShareOverlay />
      <Loader fontsReady={fontsReady} onDone={onLoaded} />
    </>
  )
}
