import { timeline, type TimelineItem } from '../data/content'
import { HackAudioPlayer } from './HackAudioPlayer'
import './GlassPanel.css'

type Props = {
  activeId: string | null
  zapping?: boolean
  direction?: 'up' | 'down'
  items?: TimelineItem[]
}

const KIND_LABEL: Record<TimelineItem['kind'], string> = {
  identity: 'PROFILE',
  education: 'EDUCATION',
  experience: 'EXPERIENCE',
  project: 'PROJECTS',
  skills: 'SKILLS',
  leadership: 'LEADERSHIP',
  contact: 'UPLINK',
}

function displayBullets(item: TimelineItem): string[] {
  if (!item.bullets?.length) return []
  if (item.kind === 'skills') return item.bullets
  const max = item.kind === 'experience' || item.kind === 'project' ? 3 : 4
  return item.bullets.slice(0, max)
}

/** Glass dossier panel — full resume detail on the right */
export function GlassPanel({
  activeId,
  zapping = false,
  direction = 'down',
  items = timeline,
}: Props) {
  const active = items.find((t) => t.id === activeId) ?? items[0]
  if (!active) return null

  const bullets = displayBullets(active)
  const isSkills = active.kind === 'skills'

  return (
    <div className="glass-panel" aria-label="Dossier panel">
      <div className="glass-panel__chrome" aria-hidden="true">
        <span className="glass-panel__corner glass-panel__corner--tl" />
        <span className="glass-panel__corner glass-panel__corner--tr" />
        <span className="glass-panel__corner glass-panel__corner--bl" />
        <span className="glass-panel__corner glass-panel__corner--br" />
        <div className="glass-panel__scanline" />
      </div>

      <div
        className={`glass-panel__viewport${zapping ? ` glass-panel__viewport--zap glass-panel__viewport--${direction}` : ''}`}
      >
        {zapping && <div className="glass-panel__sweep" aria-hidden="true" />}
        <article
          key={active.id}
          className={`glass-panel__body glass-panel__body--${active.kind}`}
        >
          <div className="glass-panel__glow" aria-hidden="true" />

          <header className="glass-panel__head">
            <p className="glass-panel__kind">{KIND_LABEL[active.kind]}</p>
            <p className="glass-panel__date">{active.dateLabel}</p>
          </header>

          <h2 className="glass-panel__title">{active.title}</h2>
          <p className="glass-panel__org">{active.org}</p>
          {active.period && <p className="glass-panel__period">{active.period}</p>}

          {active.detail && !bullets.length && (
            <p className="glass-panel__detail">{active.detail}</p>
          )}

          {bullets.length > 0 && !isSkills && (
            <ul className="glass-panel__bullets">
              {bullets.map((line) => (
                <li key={line.slice(0, 40)}>{line}</li>
              ))}
            </ul>
          )}

          {isSkills && bullets.length > 0 && (
            <ul className="glass-panel__skill-grid">
              {bullets.map((line) => (
                <li key={line.slice(0, 20)}>{line}</li>
              ))}
            </ul>
          )}

          {active.tags && active.tags.length > 0 && (
            <ul className="glass-panel__tags">
              {active.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}

          {active.links && active.links.length > 0 && (
            <div className="glass-panel__links">
              {active.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={link.primary ? 'glass-panel__link--primary' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {active.kind === 'identity' && <HackAudioPlayer />}
        </article>
      </div>
    </div>
  )
}
