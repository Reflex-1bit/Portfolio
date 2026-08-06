import type { TimelineItem } from '../data/content'
import './ProjectBook.css'

type Props = {
  item: TimelineItem | null
  visible: boolean
}

/** 3D book cover — floats outside the phone panel */
export function ProjectBook({ item, visible }: Props) {
  if (!item?.image) return null

  const demo = item.links?.find((l) => l.primary)

  return (
    <aside
      className={`project-book${visible ? ' project-book--on' : ''}`}
      aria-label={item.title}
    >
      <p className="project-book__label">ASSET // {item.dateLabel}</p>
      <div className="project-book__stage">
        <div className="project-book__book">
          <div className="project-book__pages" aria-hidden="true" />
          <div className="project-book__spine" aria-hidden="true" />
          <div className="project-book__cover">
            <img
              src={item.image}
              alt={item.imageAlt ?? item.title}
              loading="lazy"
              decoding="async"
            />
            <div className="project-book__shine" aria-hidden="true" />
            {demo && (
              <a className="project-book__demo" href={demo.href} target="_blank" rel="noreferrer">
                <span aria-hidden="true">▶</span> LIVE DEMO
              </a>
            )}
          </div>
        </div>
        <div className="project-book__shadow" aria-hidden="true" />
      </div>
      <p className="project-book__caption">{item.title}</p>
    </aside>
  )
}
