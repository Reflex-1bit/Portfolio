import { useCallback, useEffect, useRef, useState } from 'react'
import { timeline } from '../data/content'
import { GlassPanel } from './GlassPanel'
import { GlassTiles } from './GlassTiles'
import { NavChannel } from './NavChannel'
import {
  appForItem,
  appIsSingle,
  firstIndexForApp,
  itemsForApp,
  PhoneLauncher,
  type PhoneAppId,
} from './PhoneLauncher'
import { ProjectBook } from './ProjectBook'
import { RainCanvas } from './RainCanvas'
import './MainGrid.css'

const AUTO_MS = 6000

export function MainGrid() {
  const [activeApp, setActiveApp] = useState<PhoneAppId>('readme')
  const [activeIndex, setActiveIndex] = useState(0)
  const [zapping, setZapping] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const lockRef = useRef(false)
  const touchY = useRef<number | null>(null)
  const autoPausedRef = useRef(false)
  const pauseTimerRef = useRef<number | null>(null)

  const appItems = itemsForApp(activeApp)
  const activeId = timeline[activeIndex]?.id ?? null
  const activeItem = timeline[activeIndex] ?? timeline[0]
  const total = timeline.length

  const pauseAuto = useCallback(() => {
    autoPausedRef.current = true
    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = window.setTimeout(() => {
      autoPausedRef.current = false
    }, AUTO_MS * 2)
  }, [])

  const jumpTo = useCallback((next: number, dir: 'up' | 'down') => {
    const clamped = Math.min(total - 1, Math.max(0, next))
    if (clamped === activeIndex) return
    pauseAuto()
    setDirection(dir)
    setActiveIndex(clamped)
    setActiveApp(appForItem(timeline[clamped]))
    setZapping(true)
    window.setTimeout(() => setZapping(false), 450)
  }, [activeIndex, pauseAuto, total])

  const jumpToId = useCallback((id: string) => {
    const index = timeline.findIndex((item) => item.id === id)
    if (index < 0) return
    jumpTo(index, index > activeIndex ? 'down' : 'up')
  }, [activeIndex, jumpTo])

  const goNext = useCallback(() => {
    const pool = itemsForApp(activeApp)
    const poolIndex = pool.findIndex((item) => item.id === activeId)
    if (poolIndex >= 0 && poolIndex < pool.length - 1) {
      const nextId = pool[poolIndex + 1].id
      jumpToId(nextId)
      return
    }
    if (activeIndex >= total - 1) jumpTo(0, 'down')
    else jumpTo(activeIndex + 1, 'down')
  }, [activeApp, activeId, activeIndex, jumpTo, jumpToId, total])

  const goPrev = useCallback(() => {
    const pool = itemsForApp(activeApp)
    const poolIndex = pool.findIndex((item) => item.id === activeId)
    if (poolIndex > 0) {
      jumpToId(pool[poolIndex - 1].id)
      return
    }
    if (activeIndex <= 0) jumpTo(total - 1, 'up')
    else jumpTo(activeIndex - 1, 'up')
  }, [activeApp, activeId, activeIndex, jumpTo, jumpToId, total])

  const selectApp = useCallback((app: PhoneAppId) => {
    pauseAuto()
    setActiveApp(app)
    const index = firstIndexForApp(app)
    if (index >= 0) {
      setDirection(index > activeIndex ? 'down' : 'up')
      setActiveIndex(index)
      setZapping(true)
      window.setTimeout(() => setZapping(false), 450)
    }
  }, [activeIndex, pauseAuto])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (autoPausedRef.current || lockRef.current) return
      goNext()
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [goNext])

  useEffect(() => {
    const unlock = () => {
      lockRef.current = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (lockRef.current) return
      if (Math.abs(e.deltaY) < 18) return
      lockRef.current = true
      window.setTimeout(unlock, 520)
      if (e.deltaY > 0) goNext()
      else goPrev()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goPrev()
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current === null) return
      const endY = e.changedTouches[0]?.clientY ?? touchY.current
      const delta = touchY.current - endY
      touchY.current = null
      if (Math.abs(delta) < 40) return
      if (delta > 0) goNext()
      else goPrev()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
    }
  }, [goNext, goPrev])

  return (
    <section className="main-grid" aria-label="Portfolio dossier">
      <div className="main-grid__world">
        <video
          className="main-grid__video"
          src="/street-rain.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="main-grid__grade" />
        <div className="main-grid__keylight" aria-hidden="true" />
        <div className="main-grid__bloom" aria-hidden="true" />
        <div className="main-grid__vignette" aria-hidden="true" />
        <RainCanvas />
        <div className={`main-grid__static${zapping ? ' main-grid__static--on' : ''}`} />
        {zapping && <div className="main-grid__zap-flash" aria-hidden="true" />}
      </div>

      <div className="main-grid__stage">
        <div className="main-grid__phone-col">
          <PhoneLauncher
            activeApp={activeApp}
            activeIndex={activeIndex}
            total={total}
            zapping={zapping}
            onAppSelect={selectApp}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>

        <div className="main-grid__glass-col">
          {!appIsSingle(activeApp) && (
            <NavChannel
              items={appItems}
              activeIndex={Math.max(0, appItems.findIndex((item) => item.id === activeId))}
              zapping={zapping}
            />
          )}

          <p className="main-grid__cue">
            <span className="main-grid__cue-tag">{activeApp.toUpperCase()}</span>
            <span className="main-grid__cue-sep">//</span>
            <span>{activeItem.title}</span>
          </p>

          <div className={`main-grid__glass-row${appIsSingle(activeApp) ? ' main-grid__glass-row--solo' : ''}`}>
            {!appIsSingle(activeApp) && (
              <GlassTiles
                items={appItems}
                activeId={activeId}
                onSelect={jumpToId}
              />
            )}

            <div className="main-grid__detail">
              <ProjectBook
                item={activeItem}
                visible={Boolean(activeItem?.image)}
              />
              <GlassPanel
                activeId={activeId}
                zapping={zapping}
                direction={direction}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
