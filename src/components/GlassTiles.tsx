import type { CSSProperties } from 'react'
import type { TimelineItem } from '../data/content'
import './GlassTiles.css'

type Props = {
  items: TimelineItem[]
  activeId: string | null
  onSelect: (id: string) => void
}

/** Stacked mini glass windows — headings for each entry in the active app */
export function GlassTiles({ items, activeId, onSelect }: Props) {
  if (items.length === 0) return null

  return (
    <div className="glass-tiles" aria-label="Dossier entries">
      {items.map((item, i) => {
        const active = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            className={`glass-tile${active ? ' glass-tile--on' : ''}`}
            style={{ '--tile-i': i } as CSSProperties}
            onClick={() => onSelect(item.id)}
            aria-current={active ? 'true' : undefined}
          >
            <span className="glass-tile__chrome" aria-hidden="true">
              <span className="glass-tile__corner glass-tile__corner--tl" />
              <span className="glass-tile__corner glass-tile__corner--tr" />
            </span>
            <span className="glass-tile__label">{item.dateLabel}</span>
            <span className="glass-tile__title">{item.title}</span>
            <span className="glass-tile__org">{item.org}</span>
            {active && <span className="glass-tile__pulse" aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}
