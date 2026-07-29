import { useState } from 'react'
import {
  schoolDisplayFields,
  schoolMetricSections,
} from '../../config/schoolMetrics'
import { AccordionSection } from '../sidebar/AccordionSection'
import type { SidebarSection } from '../../config/sidebarSections'
import './SchoolPopup.css'

export type SelectedSchool = {
  id: string
  properties: Record<string, unknown>
}

type Props = {
  school: SelectedSchool
  onClose: () => void
}

function propString(
  props: Record<string, unknown>,
  key: string,
): string | undefined {
  const v = props[key]
  if (v == null || v === '') return undefined
  return String(v)
}

function buildMetricSection(
  section: (typeof schoolMetricSections)[number],
  props: Record<string, unknown>,
): SidebarSection {
  const rows: string[] = []
  if (section.propertyKeys) {
    for (const key of section.propertyKeys) {
      const value = propString(props, key)
      if (value != null) {
        const label =
          key === 'facility_suitability'
            ? 'Rating'
            : key === 'FS_Score'
              ? 'FS Score'
              : key
        rows.push(`${label}: ${value}`)
      }
    }
  }
  if (rows.length === 0 && section.fallbackItems) {
    rows.push(...section.fallbackItems)
  }

  const statusTag =
    section.id === 'facility-suitability'
      ? propString(props, 'facility_suitability')
      : undefined

  return {
    id: section.id,
    title: section.title,
    statusTag,
    body: section.body,
    subItems: rows,
  }
}

export function SchoolPopup({ school, onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>('facility-suitability')
  const name =
    propString(school.properties, 'School') ??
    propString(school.properties, 'NCES School Name') ??
    'Selected school'

  const metrics = schoolMetricSections.map((s) =>
    buildMetricSection(s, school.properties),
  )

  return (
    <div className="school-popup" role="dialog" aria-label={name}>
      <header className="school-popup-header">
        <div className="school-popup-heading">
          <p className="school-popup-kicker">School details</p>
          <h2 className="school-popup-title">{name}</h2>
        </div>
        <button
          type="button"
          className="school-popup-close"
          onClick={onClose}
          aria-label="Close school details"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <div className="school-popup-scroll">
        <dl className="school-popup-meta">
          {schoolDisplayFields.map(({ key, label }) => {
            const value = propString(school.properties, key)
            if (value == null) return null
            return (
              <div key={key} className="school-popup-meta-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            )
          })}
        </dl>

        <div className="school-popup-metrics" role="list">
          <p className="school-popup-metrics-label">School metrics</p>
          {metrics.map((section) => (
            <AccordionSection
              key={section.id}
              section={section}
              expanded={openId === section.id}
              onToggle={() =>
                setOpenId((prev) => (prev === section.id ? null : section.id))
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
