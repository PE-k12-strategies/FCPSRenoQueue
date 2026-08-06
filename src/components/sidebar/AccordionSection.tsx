import { facilitySuitabilityColors } from '../../config/legend'
import type { SidebarSection } from '../../config/sidebarSections'
import { SubDataGrid } from './SubDataGrid'
import './AccordionSection.css'

type Props = {
  section: SidebarSection
  expanded: boolean
  onToggle: () => void
}

function statusLabelColor(fill: string): string {
  return fill === facilitySuitabilityColors.Fair ? '#422006' : '#ffffff'
}

export function AccordionSection({ section, expanded, onToggle }: Props) {
  const titleId = `acc-${section.id}-title`
  const panelId = `acc-${section.id}-panel`

  return (
    <section className="accordion-card">
      <button
        type="button"
        className="accordion-trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        id={titleId}
        onClick={onToggle}
      >
        <span className="accordion-trigger-text">
          <span className="accordion-title">{section.title}</span>
          {section.statusTag ? (
            <span
              className="accordion-status"
              style={
                section.statusTagColor
                  ? {
                      background: section.statusTagColor,
                      color: statusLabelColor(section.statusTagColor),
                    }
                  : undefined
              }
            >
              {section.statusTag}
            </span>
          ) : null}
          {!expanded && section.collapsedHint ? (
            <span className="accordion-hint"> · {section.collapsedHint}</span>
          ) : null}
        </span>
        <span
          className={`accordion-chevron${expanded ? ' is-open' : ''}`}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {expanded ? (
        <div
          className="accordion-panel"
          id={panelId}
          role="region"
          aria-labelledby={titleId}
        >
          <p className="accordion-body">{section.body}</p>
          <SubDataGrid items={section.subItems} />
        </div>
      ) : null}
    </section>
  )
}
