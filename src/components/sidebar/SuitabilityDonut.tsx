import { useMemo } from 'react'
import { facilitySuitabilityColors } from '../../config/legend'
import type { SuitabilityBreakdownRow } from '../../lib/districtOverview'
import './SuitabilityDonut.css'

type Props = {
  rows: SuitabilityBreakdownRow[]
  ratedCount: number
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

function donutSlice(
  startAngle: number,
  endAngle: number,
): string {
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

export function SuitabilityDonut({ rows, ratedCount }: Props) {
  const slices = useMemo(() => {
    const active = rows.filter((row) => row.count > 0)
    if (active.length === 0) return []

    let angle = 0
    return active.map((row) => {
      const sweep = (row.count / ratedCount) * 360
      // Full circle as a single path breaks arc flags; nudge near-360 slices.
      const end = angle + Math.min(sweep, 359.999)
      const path = donutSlice(angle, end)
      const start = angle
      angle = end
      return { row, path, start, end }
    })
  }, [rows, ratedCount])

  if (slices.length === 0 || ratedCount === 0) {
    return (
      <div className="suitability-donut suitability-donut--empty">
        No rated schools yet.
      </div>
    )
  }

  return (
    <div className="suitability-donut">
      <div className="suitability-donut-chart">
        <svg
          className="suitability-donut-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Facilities Suitability donut chart by school count"
        >
          {slices.map(({ row, path }) => (
            <path
              key={row.rating}
              d={path}
              fill={facilitySuitabilityColors[row.rating]}
            >
              <title>
                {`${row.rating}: ${row.count} schools (${row.percent}%)`}
              </title>
            </path>
          ))}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            className="suitability-donut-center-value"
          >
            {ratedCount}
          </text>
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            className="suitability-donut-center-label"
          >
            schools
          </text>
        </svg>
      </div>

      <ul className="suitability-donut-legend">
        {rows.map((row) => (
          <li key={row.rating} className="suitability-donut-legend-row">
            <span
              className="suitability-donut-swatch"
              style={{ background: facilitySuitabilityColors[row.rating] }}
              aria-hidden
            />
            <span className="suitability-donut-legend-name">{row.rating}</span>
            <span className="suitability-donut-legend-count">{row.count}</span>
            <span className="suitability-donut-legend-pct">{row.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
