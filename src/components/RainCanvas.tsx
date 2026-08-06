import { useEffect, useRef } from 'react'
import './RainCanvas.css'

/** Canvas rain streaks — Watch Dogs night-street feel */
export function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    const drops: { x: number; y: number; len: number; speed: number; opacity: number }[] = []

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio
      h = canvas.height = window.innerHeight * devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      drops.length = 0
      const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 9000))
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: (8 + Math.random() * 18) * devicePixelRatio,
          speed: (6 + Math.random() * 10) * devicePixelRatio,
          opacity: 0.15 + Math.random() * 0.35,
        })
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1 * devicePixelRatio
      for (const d of drops) {
        d.y += d.speed
        d.x += d.speed * 0.12
        if (d.y > h) {
          d.y = -d.len
          d.x = Math.random() * w
        }
        if (d.x > w) d.x = 0
        ctx.strokeStyle = `rgba(180, 220, 255, ${d.opacity})`
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x + d.len * 0.15, d.y + d.len)
        ctx.stroke()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="rain-canvas" aria-hidden="true" />
}
