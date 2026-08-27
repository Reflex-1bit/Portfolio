import { useCallback, useEffect, useState } from 'react'
import './BlueprintPortfolio.css'

type SheetId = 'work-sheet' | 'stack-sheet' | null
type NoteId = 'contact-note' | null

export function BlueprintPortfolio() {
  const [sheet, setSheet] = useState<SheetId>(null)
  const [note, setNote] = useState<NoteId>(null)
  const [sheetKey, setSheetKey] = useState(0)

  const closeAll = useCallback(() => {
    setSheet(null)
    setNote(null)
  }, [])

  const openSheet = (id: Exclude<SheetId, null>) => {
    if (sheet === id) {
      closeAll()
      return
    }
    setNote(null)
    setSheetKey((k) => k + 1)
    setSheet(id)
  }

  const openNote = (id: Exclude<NoteId, null>) => {
    if (note === id) {
      closeAll()
      return
    }
    setSheet(null)
    setNote(id)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAll])

  return (
    <div className="bp">
      <div className="bp__grain" aria-hidden="true" />
      <div className="bp__crease" aria-hidden="true" />

      <div className="bp__board" onClick={closeAll}>
        <div className="bp__dwg-code">
          DRAWING NO. <span className="bp__hl">AS—2026·γ</span>
          <br />
          SHEET 1 OF 1 &nbsp;·&nbsp; SCALE NTS
        </div>

        <div className="bp__draft">
          <span className="bp__strike">SOFTWARE ENGINEER</span>
        </div>
        <div className="bp__correction">systems builder</div>

        <div className="bp__name">
          <div className="bp__line" data-txt="ADITYA">
            ADITYA
          </div>
          <div className="bp__line bp__line--two" data-txt="SHARMA">
            SHARMA
          </div>
        </div>

        <p className="bp__tagline">
          Computer Engineering, Waterloo.{' '}
          <b>Building the systems under the hood</b> — inference pipelines,
          embedded ML, occasional flying things.
        </p>

        <svg className="bp__diagram" viewBox="0 0 600 260" aria-hidden="true">
          <path d="M10,150 C120,80 260,70 420,110 C480,124 540,150 590,145 C540,175 460,200 340,195 C200,190 90,190 10,150 Z" />
          <line className="bp__dim" x1="10" y1="220" x2="590" y2="220" />
          <line className="bp__dim" x1="10" y1="210" x2="10" y2="230" />
          <line className="bp__dim" x1="590" y1="210" x2="590" y2="230" />
          <text x="270" y="240">
            CHORD — 240mm
          </text>
          <line className="bp__dim" x1="560" y1="60" x2="560" y2="150" />
          <text x="500" y="45">
            AoA 4.2°
          </text>
        </svg>

        <div className="bp__ruler" aria-hidden="true">
          <div className="bp__ruler-spine" />
          <div className="bp__ruler-ticks" />
          <div className="bp__ruler-major" style={{ top: 0 }} />
          <div className="bp__ruler-major" style={{ top: '33.33%' }} />
          <div className="bp__ruler-major" style={{ top: '66.66%' }} />
          <div className="bp__ruler-major" style={{ top: '100%' }} />
          <div className="bp__ruler-label">SCALE — NOT TO SCALE</div>
        </div>
        <div className="bp__reg bp__reg--tr" aria-hidden="true" />
        <div className="bp__reg bp__reg--br" aria-hidden="true" />

        <button
          type="button"
          className={`bp__scrap bp__scrap--work${sheet === 'work-sheet' ? ' bp__scrap--on' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            openSheet('work-sheet')
          }}
        >
          PROJECTS ↗<small>selected builds</small>
        </button>
        <button
          type="button"
          className={`bp__scrap bp__scrap--stack${sheet === 'stack-sheet' ? ' bp__scrap--on' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            openSheet('stack-sheet')
          }}
        >
          EXPERIENCE<small>co-ops + fellowships</small>
        </button>
        <button
          type="button"
          className={`bp__scrap bp__scrap--contact${note === 'contact-note' ? ' bp__scrap--on' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            openNote('contact-note')
          }}
        >
          SAY HI →<small>a753shar@uwaterloo.ca</small>
        </button>

        <div
          className={`bp__note bp__note--contact${note === 'contact-note' ? ' bp__note--open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bp__pin" aria-hidden="true" />
          <button type="button" className="bp__note-close" onClick={closeAll} aria-label="Close">
            ✕
          </button>
          <h4>Get in Touch</h4>
          <div className="bp__row">
            <span>Email</span>
            <span>a753shar@uwaterloo.ca</span>
          </div>
          <div className="bp__row">
            <span>Status</span>
            <span>Open — Q1 &apos;27</span>
          </div>
        </div>

        <div className="bp__stamp" aria-hidden="true">
          <span>
            OPEN FOR
            <br />
            CO-OP — Q1 &apos;27
          </span>
        </div>

        <div className="bp__title-block">
          <div className="bp__tb-row">
            <div className="bp__cell">
              <div className="bp__k">DRAWN BY</div>
              <div className="bp__v">A. SHARMA</div>
            </div>
            <div className="bp__cell">
              <div className="bp__k">PROGRAM</div>
              <div className="bp__v">COMP ENG &apos;30</div>
            </div>
            <div className="bp__cell">
              <div className="bp__k">STATUS</div>
              <div className="bp__v bp__v--green">ACTIVE</div>
            </div>
            <div className="bp__cell">
              <div className="bp__k">REV</div>
              <div className="bp__v">04</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`bp__scroll${sheet === 'work-sheet' ? ' bp__scroll--open' : ''}`}>
        <div className="bp__backdrop" onClick={closeAll} />
        <div
          key={sheet === 'work-sheet' ? `work-${sheetKey}` : 'work'}
          className="bp__sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="bp__sheet-close" onClick={closeAll}>
            ✕ CLOSE
          </button>
          <div className="bp__sheet-head">DWG NO. AS—2026·γ &nbsp;·&nbsp; BILL OF MATERIALS</div>
          <h3>Selected Projects</h3>
          <div className="bp__sheet-body">
            <div className="bp__table-col">
              <table>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>DESCRIPTION</th>
                    <th>DISCIPLINE</th>
                    <th>NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bp__num">001</td>
                    <td>Aero Visual — airfoil ML &amp; flow sim</td>
                    <td className="bp__tag">ML / AERO</td>
                    <td>PyTorch model, R² = 0.96, live 3D flow viz (Three.js)</td>
                  </tr>
                  <tr>
                    <td className="bp__num">002</td>
                    <td>Sylva — land-suitability engine</td>
                    <td className="bp__tag">FULL-STACK</td>
                    <td>soil/terrain scoring across 600+ species, ESP32 sensor node</td>
                  </tr>
                  <tr>
                    <td className="bp__num">003</td>
                    <td>QUORUM — hedge fund simulator</td>
                    <td className="bp__tag">ML / SYSTEMS</td>
                    <td>5-agent debate feed, live market data via Alpaca</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bp__figs">
              <figure className="bp__fig">
                <div className="bp__fig-frame">
                  <img src="/preview/aero-visual.png" alt="Aero Visual flow visualization" />
                </div>
                <figcaption>
                  <b>FIG. 01</b> — Aero Visual
                  <br />
                  streamline flow model
                </figcaption>
              </figure>
              <figure className="bp__fig">
                <div className="bp__fig-frame">
                  <img src="/preview/sylva-node.png" alt="Sylva ESP32 sensor node" />
                </div>
                <figcaption>
                  <b>FIG. 02</b> — Sylva
                  <br />
                  ESP32 sensor node
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <div className={`bp__scroll${sheet === 'stack-sheet' ? ' bp__scroll--open' : ''}`}>
        <div className="bp__backdrop" onClick={closeAll} />
        <div
          key={sheet === 'stack-sheet' ? `stack-${sheetKey}` : 'stack'}
          className="bp__sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="bp__sheet-close" onClick={closeAll}>
            ✕ CLOSE
          </button>
          <div className="bp__sheet-head">DWG NO. AS—2026·γ &nbsp;·&nbsp; REVISION HISTORY</div>
          <h3>Experience</h3>
          <table>
            <thead>
              <tr>
                <th>REV</th>
                <th>ORGANIZATION</th>
                <th>ROLE</th>
                <th>CHANGE NOTES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bp__num">01</td>
                <td>Meraki Projects</td>
                <td className="bp__tag">SWE INTERN — MAY–AUG &apos;25</td>
                <td>FastAPI inference service, 10+ Node.js endpoints</td>
              </tr>
              <tr>
                <td className="bp__num">02</td>
                <td>Patry Group</td>
                <td className="bp__tag">AI WORKFLOW FELLOW — JAN–MAR &apos;26</td>
                <td>n8n pipeline + Claude API classification, 6–8 hrs/wk saved</td>
              </tr>
              <tr>
                <td className="bp__num">03</td>
                <td>NetDynamic Inc.</td>
                <td className="bp__tag">SWE INTERN — MAY–AUG &apos;26</td>
                <td>GCS-backed dedup cache, self-healing API integration system</td>
              </tr>
              <tr>
                <td className="bp__num">04</td>
                <td>— open —</td>
                <td className="bp__tag">WINTER &apos;27 CO-OP</td>
                <td>pending revision</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
