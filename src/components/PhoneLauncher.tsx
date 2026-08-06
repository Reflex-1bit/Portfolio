import { profile } from '../data/content'
import { timeline, type TimelineItem } from '../data/content'
import './PhoneLauncher.css'

export type PhoneAppId = 'readme' | 'exp' | 'proj' | 'others'

export const PHONE_APPS: {
  id: PhoneAppId
  label: string
  kinds: TimelineItem['kind'][]
  /** Single glass panel — no tile stack */
  single?: boolean
}[] = [
  { id: 'readme', label: 'read.me', kinds: ['identity'], single: true },
  { id: 'exp', label: 'EXP', kinds: ['experience'] },
  { id: 'proj', label: 'PROJ', kinds: ['project'] },
  { id: 'others', label: 'others', kinds: ['skills', 'leadership'] },
]

export function appForItem(item: TimelineItem): PhoneAppId {
  const match = PHONE_APPS.find((app) => app.kinds.includes(item.kind))
  return match?.id ?? 'readme'
}

export function itemsForApp(app: PhoneAppId): TimelineItem[] {
  const def = PHONE_APPS.find((entry) => entry.id === app)
  if (!def) return []
  return timeline.filter((item) => def.kinds.includes(item.kind))
}

export function appIsSingle(app: PhoneAppId): boolean {
  return Boolean(PHONE_APPS.find((entry) => entry.id === app)?.single)
}

export function firstIndexForApp(app: PhoneAppId): number {
  const def = PHONE_APPS.find((entry) => entry.id === app)
  if (!def) return 0
  return timeline.findIndex((item) => def.kinds.includes(item.kind))
}

type Props = {
  activeApp: PhoneAppId
  activeIndex: number
  total: number
  zapping?: boolean
  onAppSelect: (app: PhoneAppId) => void
  onPrev: () => void
  onNext: () => void
}

export function PhoneLauncher({
  activeApp,
  activeIndex,
  total,
  zapping = false,
  onAppSelect,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="phone-device" aria-label="ctOS smartphone">
      <span className="phone-device__btn phone-device__btn--vol-up" aria-hidden="true" />
      <span className="phone-device__btn phone-device__btn--vol-down" aria-hidden="true" />
      <span className="phone-device__btn phone-device__btn--power" aria-hidden="true" />

      <div className="phone-device__body">
        <div className="phone-device__bezel-top">
          <span className="phone-device__speaker" aria-hidden="true" />
          <span className="phone-device__cam" aria-hidden="true" />
          <span className="phone-device__cam phone-device__cam--2" aria-hidden="true" />
        </div>

        <div className="phone-device__screen">
          <div className="phone-device__status">
            <span className="phone-device__time">ctOS</span>
            <span className="phone-device__status-icons">
              <span className="phone-device__signal" aria-hidden="true">
                <i /><i /><i /><i />
              </span>
              <span className="phone-device__wifi" aria-hidden="true">⌁</span>
              <span className="phone-device__battery" aria-hidden="true">100%</span>
            </span>
          </div>

          <div className={`phone-launcher__home${zapping ? ' phone-launcher__home--zap' : ''}`}>
            <nav className="phone-launcher__grid" aria-label="Apps">
              {PHONE_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className={`phone-launcher__app phone-launcher__app--${app.id}${activeApp === app.id ? ' phone-launcher__app--on' : ''}`}
                  onClick={() => onAppSelect(app.id)}
                  aria-current={activeApp === app.id ? 'true' : undefined}
                >
                  <span className="phone-launcher__app-icon" aria-hidden="true" />
                  <span className="phone-launcher__app-label">{app.label}</span>
                </button>
              ))}
            </nav>

            {activeApp === 'readme' ? (
              <div className="phone-launcher__readme">
                <div className="phone-launcher__preview phone-launcher__preview--readme">
                  <p className="phone-launcher__name">{profile.name}</p>
                  <p className="phone-launcher__uni">{profile.university}</p>
                  <p className="phone-launcher__year">{profile.year} · {profile.program}</p>
                  <p className="phone-launcher__tag">{profile.tagline}</p>

                  <div className="phone-launcher__social">
                    <a
                      className="phone-launcher__social-btn"
                      href={profile.links.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                    <a
                      className="phone-launcher__social-btn"
                      href={profile.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="phone-launcher__app-hint">
                <p className="phone-launcher__hint-label">OPEN DOSSIER</p>
                <p className="phone-launcher__hint-text">
                  Select a glass window on the right to view full details.
                </p>
              </div>
            )}
          </div>

          <div className="phone-device__nav">
            <button
              type="button"
              className="phone-device__nav-btn"
              onClick={onPrev}
              disabled={activeIndex === 0}
            >
              B
            </button>
            <span className="phone-device__nav-mid">{activeIndex + 1}/{total}</span>
            <button
              type="button"
              className="phone-device__nav-btn"
              onClick={onNext}
              disabled={activeIndex === total - 1}
            >
              A
            </button>
          </div>
        </div>

        <div className="phone-device__bezel-bottom">
          <span className="phone-device__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
