import { useEffect, useRef, useState } from 'react'
import { RainCanvas } from './RainCanvas'
import { WormholeCanvas } from './WormholeCanvas'
import { profile } from '../data/content'
import './BootScene.css'

const LOAD_LINES = [
  'ctOS_BRIDGE // INIT',
  'SCANNING LOCAL NODE…',
  'HANDSHAKE: WATERLOO_GRID',
  `TARGET: ${profile.handle}`,
  'INJECTING PROFILE PAYLOAD…',
  'BYPASS COMPLETE',
]

type Props = {
  onComplete: () => void
}

/** Landing → camera dives into phone screen wormhole */
export function BootScene({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const [ready, setReady] = useState(false)
  const [sucking, setSucking] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let p = 0
    const id = window.setInterval(() => {
      p = Math.min(100, p + 1.6 + Math.random() * 2.2)
      setProgress(p)
      setLineIdx(Math.min(LOAD_LINES.length - 1, Math.floor((p / 100) * LOAD_LINES.length)))
      if (p >= 100) {
        window.clearInterval(id)
        setReady(true)
      }
    }, 55)
    return () => window.clearInterval(id)
  }, [])

  const startHack = () => {
    if (!ready || sucking) return
    setSucking(true)
    videoRef.current?.pause()
  }

  return (
    <section
      className={`boot${sucking ? ' boot--suck' : ''}`}
      aria-label="System boot"
    >
      <div className="boot__street">
        <video
          ref={videoRef}
          className="boot__video"
          src="/street-rain.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="boot__street-grade" />
        {!sucking && <RainCanvas />}
      </div>

      <div className="boot__hud">
        <p className="boot__sys">ctOS // PORTFOLIO_NODE</p>
        <p className="boot__loc">{profile.location.toUpperCase()}</p>
      </div>

      <div className="boot__phone-stage">
        <img
          className="boot__phone"
          src="/hand-phone-color.png"
          alt=""
          draggable={false}
          decoding="async"
        />
        <div ref={screenRef} className="boot__screen-portal" aria-hidden="true" />
        <div className="boot__screen-glow" aria-hidden="true" />

        <div className="boot__hack-panel">
          <p className="boot__hack-title">INITIATE BREACH</p>
          <p className="boot__hack-line" key={lineIdx}>
            &gt; {LOAD_LINES[lineIdx]}
          </p>
          <div className="boot__bar">
            <div className="boot__bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="boot__pct">{Math.floor(progress)}%</p>
          <button
            type="button"
            className={`boot__cta${ready ? ' boot__cta--ready' : ''}`}
            onClick={startHack}
            disabled={!ready || sucking}
          >
            {ready ? '▶  ENTER SYSTEM' : 'LOADING ASSETS…'}
          </button>
        </div>
      </div>

      <div className="boot__prompts">
        <span>(A) SELECT</span>
        <span>SCROLL LOCKED</span>
      </div>

      <p className={`boot__worm-tag${sucking ? ' boot__worm-tag--on' : ''}`}>
        WORMHOLE // ENTERING DEVICE
      </p>

      <WormholeCanvas active={sucking} screenRef={screenRef} onDone={onComplete} />
    </section>
  )
}
