import { useEffect, useRef, type RefObject } from 'react'
import './WormholeCanvas.css'

type Props = {
  active: boolean
  /** Element sitting on the phone glass — camera dives into this */
  screenRef: RefObject<HTMLElement | null>
  onDone: () => void
}

/**
 * Camera suck-into-phone:
 * wormhole lives inside the phone glass; as the phone zooms toward camera,
 * the portal grows until you are pulled through the screen.
 */
export function WormholeCanvas({ active, screenRef, onDone }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let raf = 0
    const start = performance.now()
    const DURATION = 2400

    const STREAKS = 16
    const angles = Array.from({ length: STREAKS }, (_, i) => (i / STREAKS) * Math.PI * 2)

    const resize = () => {
      w = canvas.width = Math.floor(window.innerWidth * dpr)
      h = canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    const easeInCubic = (t: number) => t * t * t
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / DURATION)
      const t =
        raw < 0.45
          ? easeInCubic(raw / 0.45) * 0.45
          : 0.45 + easeOutCubic((raw - 0.45) / 0.55) * 0.55

      const screen = screenRef.current
      const rect = screen?.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let cx = (rect ? rect.left + rect.width / 2 : vw * 0.5) * dpr
      let cy = (rect ? rect.top + rect.height / 2 : vh * 0.48) * dpr
      let rw = (rect ? Math.max(rect.width, 8) : vw * 0.12) * dpr
      let rh = (rect ? Math.max(rect.height, 8) : vh * 0.14) * dpr

      const expand = Math.max(0, (t - 0.5) / 0.5)
      if (expand > 0) {
        const fill = expand * expand
        cx += (w * 0.5 - cx) * fill
        cy += (h * 0.5 - cy) * fill
        rw += (w * 1.25 - rw) * fill
        rh += (h * 1.25 - rh) * fill
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, w, h)

      ctx.save()
      ctx.beginPath()
      ctx.ellipse(cx, cy, rw * 0.52, rh * 0.52, 0, 0, Math.PI * 2)
      ctx.clip()

      ctx.fillStyle = `rgba(0, 6, 12, ${Math.min(1, 0.65 + t * 0.4)})`
      ctx.fillRect(0, 0, w, h)

      const maxR = Math.max(rw, rh) * 0.98
      const pull = t * t * 2.6
      const sx = rw / Math.max(rw, rh)
      const sy = rh / Math.max(rw, rh)

      for (let i = 0; i < 9; i++) {
        const phase = (i / 9 + pull) % 1
        const r = maxR * (0.05 + phase * 0.98)
        const alpha = (1 - phase) * 0.75 * Math.min(1, t * 2.8)
        if (alpha < 0.03) continue
        ctx.beginPath()
        ctx.ellipse(cx, cy, r * sx, r * sy, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 232, 255, ${alpha})`
        ctx.lineWidth = Math.max(1, dpr * (1 + phase * 2))
        ctx.stroke()
      }

      ctx.lineWidth = Math.max(1, dpr * 1.25)
      const streakIn = maxR * 0.03
      const streakOut = maxR * (0.18 + t * 0.9)
      for (let i = 0; i < STREAKS; i++) {
        const a = angles[i] + pull * 0.45
        const alpha = Math.min(1, t * 2.4) * (0.28 + (i % 3) * 0.14)
        const cos = Math.cos(a)
        const sin = Math.sin(a)
        ctx.strokeStyle = `rgba(0, 232, 255, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(cx + cos * streakIn * sx, cy + sin * streakIn * sy)
        ctx.lineTo(cx + cos * streakOut * sx, cy + sin * streakOut * sy)
        ctx.stroke()
      }

      const core = (5 + t * 20) * dpr
      ctx.beginPath()
      ctx.arc(cx, cy, core, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${0.8 * Math.min(1, t * 2.2)})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, core * 2.4, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,232,255,${0.3 * t})`
      ctx.fill()

      ctx.restore()

      if (expand < 0.9) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, rw * 0.52, rh * 0.52, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 232, 255, ${0.65 * (1 - expand)})`
        ctx.lineWidth = Math.max(1.5, dpr * 2.2)
        ctx.stroke()
      }

      if (raw > 0.9) {
        const flash = (raw - 0.9) / 0.1
        ctx.fillStyle = `rgba(0, 12, 18, ${flash})`
        ctx.fillRect(0, 0, w, h)
      }

      if (raw < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        doneRef.current()
      }
    }

    resize()
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, screenRef])

  if (!active) return null

  return <canvas ref={ref} className="wormhole-canvas" aria-hidden="true" />
}
