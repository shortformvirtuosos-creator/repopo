import { useRef, type KeyboardEvent } from 'react'
import { copy, YEAR } from '../copy'
import { Headline } from './Headline'
import { store, useStore } from '../state/store'
import { clean, sanitize, titleCase, upper } from '../lib/text'
import { prepareShare, share } from '../lib/share'
import { focusSurname } from '../lib/scroll'

/**
 * The words, one group per scene, in a fixed layer over the photos. Every
 * `.zone` is placed by src/lib/layout.ts inside an area of its photo where
 * nothing important is underneath.
 */
export function Texts() {
  return (
    <div id="texts">
      <PotText />
      <section className="scene-text" id="t-explosion">
        <div className="zone z-main" data-zone="1:main">
          <div className="zone-in">
            <Headline lines={copy.explosion.lines} phoneLines={copy.explosion.phoneLines} />
            <p className="small" data-rise>
              {copy.explosion.small}
            </p>
          </div>
        </div>
      </section>
      <section className="scene-text" id="t-copper">
        <div className="zone z-main" data-zone="2:main">
          <div className="zone-in">
            <Headline lines={copy.copper.lines} phoneLines={copy.copper.phoneLines} />
            <p className="body" data-rise>
              {copy.copper.body}
            </p>
          </div>
        </div>
      </section>
      <section className="scene-text" id="t-pour">
        <div className="zone z-main" data-zone="3:main">
          <div className="zone-in">
            <Headline lines={copy.pour.lines} phoneLines={copy.pour.phoneLines} />
            <p className="body" data-rise>
              {copy.pour.body}
            </p>
          </div>
        </div>
      </section>
      <section className="scene-text" id="t-set">
        <div className="zone z-main" data-zone="4:main">
          <div className="zone-in">
            <Headline lines={copy.set.lines} />
          </div>
        </div>
      </section>
      <section className="scene-text" id="t-end">
        <div className="zone z-main" data-zone="4:main">
          <div className="zone-in">
            <Headline lines={copy.ending.lines} phoneLines={copy.ending.phoneLines} />
            <div className="actions" data-rise>
              <button className="btn btn-primary" onClick={share}>
                {copy.ending.share}
              </button>
            </div>
            <p className="footer only-phone" data-rise>
              {copy.ending.footer(YEAR)}
            </p>
          </div>
        </div>
        <div className="zone z-foot zone-foot only-desk" data-zone="4:foot">
          <div className="zone-in">
            <p className="footer" data-rise>
              {copy.ending.footer(YEAR)}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function PotText() {
  const shared = useStore((s) => s.shared)
  const lines = shared ? copy.pot.sharedLines(upper(shared.name)) : copy.pot.lines
  const makeOwn = () => {
    store.set({ shared: null, name: '', town: '' })
    focusSurname()
  }
  return (
    <section className="scene-text" id="t-pot">
      <div className="zone z-head" data-zone="0:head">
        <div className="zone-in">
          <Headline as="h1" lines={lines} />
          <p className={`sub${shared ? ' only-desk' : ''}`} data-rise>
            {copy.pot.sub}
          </p>
          {/* both states stay in the page (the scroll animation holds on to them); one is hidden */}
          <div className="actions only-phone" data-rise hidden={!shared}>
            <button className="btn btn-primary" onClick={makeOwn}>
              {copy.pot.sharedCta}
            </button>
          </div>
        </div>
      </div>
      <div className="zone z-ctrl" data-zone="0:ctrl">
        <div className="zone-in">
          <div className="ctrl" hidden={!shared}>
            <SharedCtrl onMake={makeOwn} />
          </div>
          <div className="ctrl" hidden={Boolean(shared)}>
            <Fields />
          </div>
        </div>
      </div>
    </section>
  )
}

function SharedCtrl({ onMake }: { onMake: () => void }) {
  const shared = useStore((s) => s.shared)
  return (
    <>
      <p className="live" data-rise>
        {shared ? copy.engrave.live(titleCase(shared.name), titleCase(shared.town)) : '\u00a0'}
      </p>
      <div className="actions" data-rise>
        <button className="btn btn-primary" onClick={onMake}>
          {copy.pot.sharedCta}
        </button>
      </div>
    </>
  )
}

function Fields() {
  const name = useStore((s) => s.name)
  const town = useStore((s) => s.town)
  const example = useStore((s) => s.example)
  const sharing = useStore((s) => s.sharing)
  const townRef = useRef<HTMLInputElement>(null)
  const ex = copy.engrave.examples[example]
  const p = clean(name)
  const g = clean(town)
  const liveLine = p ? copy.engrave.live(titleCase(p), titleCase(g)) : !g ? copy.engrave.live(ex[0], ex[1]) : ''

  const onName = (value: string) => {
    store.set({ name: sanitize(value) })
    prepareShare()
  }
  const onTown = (value: string) => {
    store.set({ town: sanitize(value) })
    prepareShare()
  }
  const onKey = (next?: () => void) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (next) next()
    else (e.target as HTMLInputElement).blur()
  }

  return (
    <>
      <div className="fields" data-rise>
        <label className="field">
          <span className="field-label">{copy.engrave.surname}</span>
          <input
            id="in-prezime"
            type="text"
            value={name}
            placeholder={ex[0]}
            maxLength={18}
            autoComplete="family-name"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            onChange={(e) => onName(e.target.value)}
            onKeyDown={onKey(() => townRef.current?.focus())}
          />
        </label>
        <label className="field">
          <span className="field-label">{copy.engrave.town}</span>
          <input
            id="in-grad"
            ref={townRef}
            type="text"
            value={town}
            placeholder={ex[1]}
            maxLength={18}
            autoComplete="address-level2"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            onChange={(e) => onTown(e.target.value)}
            onKeyDown={onKey()}
          />
        </label>
      </div>
      <p className={`live${p ? '' : ' is-example'}`} data-rise aria-live="polite">
        {liveLine || ' '}
      </p>
      <div className="actions" data-rise>
        <button className="btn btn-primary" onClick={share} aria-busy={sharing}>
          {copy.engrave.share}
        </button>
      </div>
    </>
  )
}
