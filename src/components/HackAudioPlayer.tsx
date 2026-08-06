import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import { profile } from '../data/content'
import './HackAudioPlayer.css'

const BAR_COUNT = 48

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** DedSec-style local audio deck with live spectrum bars */
export function HackAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const rafRef = useRef(0)
  const idleRef = useRef(0)

  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)

  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return null

    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctxRef.current = new Ctx()
    }
    const ctx = ctxRef.current

    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.72
      analyserRef.current = analyser
    }

    if (!sourceRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audio)
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(ctx.destination)
    }

    return { ctx, analyser: analyserRef.current }
  }, [])

  const drawFrame = useCallback((live: boolean) => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
    }

    const g = canvas.getContext('2d')
    if (!g) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, w, h)

    const gap = 2
    const barW = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT
    const levels = new Array<number>(BAR_COUNT).fill(0)

    if (live && analyser) {
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)
      for (let i = 0; i < BAR_COUNT; i++) {
        const idx = Math.floor((i / BAR_COUNT) * (data.length * 0.72))
        levels[i] = data[idx] / 255
      }
    } else {
      idleRef.current += 0.04
      for (let i = 0; i < BAR_COUNT; i++) {
        const wave = Math.sin(idleRef.current + i * 0.28) * 0.5 + 0.5
        levels[i] = 0.08 + wave * 0.12
      }
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const amp = Math.max(0.04, levels[i])
      const barH = amp * (h - 4)
      const x = i * (barW + gap)
      const y = (h - barH) / 2

      const grad = g.createLinearGradient(x, y, x, y + barH)
      grad.addColorStop(0, 'rgba(180, 255, 255, 0.95)')
      grad.addColorStop(0.45, 'rgba(0, 232, 255, 0.9)')
      grad.addColorStop(1, 'rgba(0, 120, 160, 0.55)')
      g.fillStyle = grad
      g.fillRect(x, y, Math.max(1.5, barW), barH)

      g.fillStyle = 'rgba(0, 232, 255, 0.15)'
      g.fillRect(x, h / 2, Math.max(1.5, barW), barH * 0.35)
    }

    // scan hash line
    g.strokeStyle = 'rgba(0, 232, 255, 0.2)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(0, h / 2)
    g.lineTo(w, h / 2)
    g.stroke()
  }, [])

  useEffect(() => {
    const tick = () => {
      drawFrame(playing)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [drawFrame, playing])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      void ctxRef.current?.close()
    }
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    const graph = ensureAudioGraph()
    if (graph?.ctx.state === 'suspended') await graph.ctx.resume()

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }, [ensureAudioGraph, playing])

  const onSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const next = Number(e.target.value)
    audio.currentTime = next
    setTime(next)
  }

  const pct = duration > 0 ? (time / duration) * 100 : 0

  return (
    <div className={`hack-audio${playing ? ' hack-audio--live' : ''}`}>
      <div className="hack-audio__head">
        <p className="hack-audio__label">CURRENT FAV SONG // AUDIO_STREAM</p>
        <span className={`hack-audio__status${playing ? ' hack-audio__status--on' : ''}`}>
          {playing ? 'LIVE' : 'IDLE'}
        </span>
      </div>

      <canvas ref={canvasRef} className="hack-audio__viz" aria-hidden="true" />

      <div className="hack-audio__deck">
        <button
          type="button"
          className="hack-audio__play"
          onClick={() => void toggle()}
          aria-label={playing ? 'Pause' : 'Play'}
          aria-pressed={playing}
        >
          {playing ? '❚❚' : '▶'}
        </button>

        <div className="hack-audio__meta">
          <p className="hack-audio__title">{profile.favMusic.title}</p>
          <p className="hack-audio__artist">{profile.favMusic.artist}</p>
        </div>

        <span className="hack-audio__clock">
          {formatTime(time)} / {formatTime(duration)}
        </span>
      </div>

      <div className="hack-audio__seek-wrap">
        <input
          className="hack-audio__seek"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={onSeek}
          disabled={!ready}
          aria-label="Seek"
          style={{ '--seek-pct': `${pct}%` } as CSSProperties}
        />
      </div>

      <audio
        ref={audioRef}
        src={profile.favMusic.src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
          setReady(true)
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  )
}
