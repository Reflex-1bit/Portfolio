import type { TimelineItem } from '../data/content'
import './DataRelay.css'

type Props = {
  items: TimelineItem[]
  activeIndex: number
  zapping: boolean
}

const SHORT: Record<TimelineItem['kind'], string> = {
  identity: 'ID',
  education: 'EDU',
  experience: 'JOB',
  project: 'PRJ',
  skills: 'SKL',
  leadership: 'LD',
  contact: 'LNK',
}

/** Left relay chain — lightning jumps between nodes on each advance */
export function DataRelay({ items, activeIndex, zapping }: Props) {
  return (
    <aside className="relay" aria-label="Data relay">
      <p className="relay__label">RELAY</p>
      <ol className="relay__chain">
        {items.map((item, i) => {
          const active = i === activeIndex
          const past = i < activeIndex

          return (
            <li
              key={item.id}
              className={`relay__node${active ? ' relay__node--active' : ''}${past ? ' relay__node--past' : ''}`}
            >
              {i > 0 && (
                <span
                  className={`relay__arc${active && zapping ? ' relay__arc--zap' : ''}${past ? ' relay__arc--lit' : ''}`}
                  aria-hidden="true"
                />
              )}
              <span className="relay__hex">
                <span className="relay__hex-core">{SHORT[item.kind]}</span>
              </span>
              {active && <span className="relay__pulse" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
      <p className="relay__hint">WHEEL / ↑↓</p>
    </aside>
  )
}
