import { useMemo } from 'react'
import { facilitySuitabilityColors } from '../../config/legend'
import type { SuitabilityBreakdownRow } from '../../lib/districtOverview'
import type { FacilitySuitabilityRating } from '../../lib/facilitySuitability'
import './SuitabilityDonut.css'

type Props = {
  rows: SuitabilityBreakdownRow[]
  ratedCount: number
  selectedRating: FacilitySuitabilityRating | null
  onSelectRating: (rating: FacilitySuitabilityRating | null) => void
}

const SIZE = 180
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER = 78
const INNER = 48

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function donutSlice(startAngle: number, endAngle: number): string {
  const large = endAngle - startAngle > 180 ? 1 : 0
  const sOuter = polar(CX, CY, OUTER, startAngle)
  const eOuter = polar(CX, CY, OUTER, endAngle)
  const sInner = polar(CX, CY, INNER, endAngle)
  const eInner = polar(CX, CY, INNER, startAngle)

  return [
    `M ${sOuter.x} ${sOuter.y}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${eOuter.x} ${eOuter.y}`,
    `L ${sInner.x} ${sInner.y}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${eInner.x} ${eInner.y}`,
    'Z',
  ].join(' ')
}

export function SuitabilityDonut({
  rows,
  ratedCount,
  selectedRating,
  onSelectRating,
}: Props) {
  const slices = useMemo(() => {
    const active = rows.filter((row) => row.count > 0)
    if (active.length === 0) return []

    let angle = 0
    return active.map((row) => {
      const sweep = (row.count / ratedCount) * 360
      const end = angle + Math.min(sweep, 359.999)
      const path = donutSlice(angle, end)
      const start = angle
      angle = end
      return { row, path, start, end }
    })
  }, [rows, ratedCount])

  const toggleRating = (rating: FacilitySuitabilityRating) => {
    onSelectRating(selectedRating === rating ? null : rating)
  }

  if (slices.length === 0 || ratedCount === 0) {
    return (
      <div className="suitability-donut suitability-donut--empty">
        No rated schools yet.
      </div>
    )
  }

  const selectedRow = selectedRating
    ? rows.find((row) => row.rating === selectedRating)
    : null
  const centerCount = selectedRow?.count ?? ratedCount
  const centerLabel = selectedRating ? selectedRating : 'schools'

  const chartSummary = rows
    .filter((row) => row.count > 0)
    .map((row) => `${row.rating}: ${row.count} (${row.percent}%)`)
    .join('; ')

  return (
    <div className="suitability-donut">
      <div
        className="suitability-donut-chart"
        role="group"
        aria-label="Filter map by facility suitability. Activate a segment or legend row to filter."
      >
        <svg
          className="suitability-donut-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden
        >
          <title>Facilities Suitability by school count</title>
          <desc>{chartSummary}</desc>
          {slices.map(({ row, path }) => {
            const isSelected = selectedRating === row.rating
            const isDimmed = selectedRating != null && !isSelected
            return (
              <path
                key={row.rating}
                d={path}
                fill={facilitySuitabilityColors[row.rating]}
                className={
                  isDimmed
                    ? 'suitability-donut-slice is-dimmed'
                    : isSelected
                      ? 'suitability-donut-slice is-selected'
                      : 'suitability-donut-slice'
                }
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Filter map to ${row.rating}: ${row.count} schools (${row.percent}%)`}
                onClick={() => toggleRating(row.rating)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleRating(row.rating)
                  }
                }}
              />
            )
          })}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            className="suitability-donut-center-value"
          >
            {centerCount}
          </text>
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            className="suitability-donut-center-label"
          >
            {centerLabel}
          </text>
        </svg>
      </div>

      {selectedRating ? (
        <div className="suitability-donut-filter-bar">
          <p className="suitability-donut-filter-note" role="status">
            Highlighting {selectedRating}
            {selectedRow ? ` (${selectedRow.count})` : ''}
          </p>
          <button
            type="button"
            className="suitability-donut-clear"
            onClick={() => onSelectRating(null)}
          >
            Clear filter
          </button>
        </div>
      ) : (
        <p className="suitability-donut-hint">
          Click a segment or row to filter the map.
        </p>
      )}

      <ul className="suitability-donut-legend" aria-label="Suitability breakdown">
        {rows.map((row) => {
          const isSelected = selectedRating === row.rating
          const isDimmed = selectedRating != null && !isSelected
          return (
            <li key={row.rating}>
              <button
                type="button"
                className={
                  isDimmed
                    ? 'suitability-donut-legend-row is-dimmed'
                    : isSelected
                      ? 'suitability-donut-legend-row is-selected'
                      : 'suitability-donut-legend-row'
                }
                aria-pressed={isSelected}
                disabled={row.count === 0}
                onClick={() => toggleRating(row.rating)}
              >
                <span
                  className="suitability-donut-swatch"
                  style={{ background: facilitySuitabilityColors[row.rating] }}
                  aria-hidden
                />
                <span className="suitability-donut-legend-name">
                  {row.rating}
                </span>
                <span className="suitability-donut-legend-count">
                  {row.count}
                </span>
                <span className="suitability-donut-legend-pct">
                  {row.percent}%
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
