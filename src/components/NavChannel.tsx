import type { TimelineItem } from '../data/content'
import './NavChannel.css'

type Props = {
  items: TimelineItem[]
  activeIndex: number
  zapping: boolean
}

/** Horizontal ctOS channel — segments pulse on advance */
export function NavChannel({ items, activeIndex, zapping }: Props) {
  const pct = ((activeIndex + 1) / items.length) * 100

  return (
    <div className={`nav-channel${zapping ? ' nav-channel--zap' : ''}`} aria-hidden="true">
      <div className="nav-channel__track">
        <div className="nav-channel__fill" style={{ width: `${pct}%` }} />
        <div className="nav-channel__bolt" style={{ left: `${pct}%` }} />
      </div>
      <div className="nav-channel__nodes">
        {items.map((item, i) => (
          <span
            key={item.id}
            className={`nav-channel__node${i === activeIndex ? ' nav-channel__node--on' : ''}${i < activeIndex ? ' nav-channel__node--past' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
