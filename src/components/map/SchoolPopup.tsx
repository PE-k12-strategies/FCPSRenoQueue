import { useCallback, useId, useLayoutEffect, useState } from 'react'
import { facilitySuitabilityColors } from '../../config/legend'
import {
  schoolDisplayFields,
  schoolMetricSections,
} from '../../config/schoolMetrics'
import {
  parseFsScore,
  scoreToFacilitySuitability,
  type FacilitySuitabilityRating,
} from '../../lib/facilitySuitability'
import { useDialogFocus } from '../../hooks/useDialogFocus'
import { AccordionSection } from '../sidebar/AccordionSection'
import type { SidebarSection } from '../../config/sidebarSections'
import './SchoolPopup.css'

function ratingColor(rating: string | undefined): string | undefined {
  if (!rating) return undefined
  if (rating in facilitySuitabilityColors) {
    return facilitySuitabilityColors[rating as FacilitySuitabilityRating]
  }
  return undefined
}

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
  if (v == null) return undefined
  const s = String(v).trim()
  if (s === '' || s === '---') return undefined
  return s
}

function buildMetricSection(
  section: (typeof schoolMetricSections)[number],
  props: Record<string, unknown>,
): SidebarSection {
  const rows: SidebarSection['subItems'] = []

  if (section.scoredCategoryKeys) {
    for (const { key, label } of section.scoredCategoryKeys) {
      const score = parseFsScore(props[key])
      if (score == null) continue
      const category = scoreToFacilitySuitability(score)
      rows.push({
        label,
        value: category,
        color: ratingColor(category),
      })
    }
  }

  if (section.propertyKeys) {
    for (const key of section.propertyKeys) {
      const value = propString(props, key)
      if (value != null) {
        rows.push({ label: `${key}: ${value}` })
      }
    }
  }

  if (rows.length === 0 && section.fallbackItems) {
    for (const item of section.fallbackItems) {
      rows.push({ label: item })
    }
  }

  const statusTag =
    section.id === 'facility-suitability'
      ? propString(props, 'facility_suitability')
      : undefined

  return {
    id: section.id,
    title: section.title,
    statusTag,
    statusTagColor: ratingColor(statusTag),
    body: section.body,
    subItems: rows,
  }
}

export function SchoolPopup({ school, onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>('facility-suitability')
  const titleId = useId()
  const handleClose = useCallback(() => onClose(), [onClose])
  const dialogRef = useDialogFocus(true, handleClose)

  const name =
    propString(school.properties, 'School') ??
    propString(school.properties, 'NCES School Name') ??
    'Selected school'

  const metrics = schoolMetricSections.map((s) =>
    buildMetricSection(s, school.properties),
  )

  return (
    <div
      ref={dialogRef}
      className="school-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <header className="school-popup-header">
        <div className="school-popup-heading">
          <p className="school-popup-kicker">School details</p>
          <h2 id={titleId} className="school-popup-title">
            {name}
          </h2>
        </div>
        <button
          type="button"
          className="school-popup-close"
          onClick={handleClose}
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

        <div className="school-popup-metrics">
          <p className="school-popup-metrics-label" id="school-metrics-heading">
            School metrics
          </p>
          <div
            className="school-popup-metrics-list"
            role="region"
            aria-labelledby="school-metrics-heading"
          >
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
    </div>
  )
}

type RegionPopupProps = {
  name: string
  x: number
  y: number
  onClose: () => void
}

export function RegionPopup({ name, x, y, onClose }: RegionPopupProps) {
  const titleId = useId()
  const handleClose = useCallback(() => onClose(), [onClose])
  const dialogRef = useDialogFocus(true, handleClose)
  const [anchor, setAnchor] = useState({ left: x, top: y })

  useLayoutEffect(() => {
    const el = dialogRef.current
    const parent = el?.offsetParent
    if (!(el instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
      setAnchor({ left: x, top: y })
      return
    }

    const pad = 10
    const gap = 12
    const w = el.offsetWidth
    const h = el.offsetHeight
    const pw = parent.clientWidth
    const ph = parent.clientHeight

    // Prefer above the click; flip below if there isn’t room.
    let top = y - gap
    let placeBelow = false
    if (top - h < pad) {
      top = y + gap
      placeBelow = true
    }
    if (!placeBelow && top > ph - pad) top = ph - pad
    if (placeBelow && top + h > ph - pad) top = Math.max(pad + h, ph - pad)

    let left = x
    const half = w / 2
    if (left - half < pad) left = pad + half
    if (left + half > pw - pad) left = pw - pad - half

    el.dataset.placement = placeBelow ? 'below' : 'above'
    setAnchor({ left, top })
  }, [dialogRef, x, y, name])

  return (
    <div
      ref={dialogRef}
      className="school-popup school-popup--region"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      style={{ left: anchor.left, top: anchor.top }}
    >
      <header className="school-popup-header school-popup-header--region">
        <h2 id={titleId} className="school-popup-title school-popup-title--region">
          {name}
        </h2>
        <button
          type="button"
          className="school-popup-close"
          onClick={handleClose}
          aria-label="Close region details"
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
    </div>
  )
}
