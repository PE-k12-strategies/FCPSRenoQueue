import { useState } from 'react'
import {
  queueMetricRows,
  type QueueMetricId,
  type QueueMetricWeights,
  type QueueSubMetricId,
  type QueueSubMetricWeights,
} from '../../config/queueMetrics'
import './MetricWeightsTable.css'

type Props = {
  weights: QueueMetricWeights
  subWeights: QueueSubMetricWeights
  onChange: (id: QueueMetricId, value: number) => void
  onSubChange: (
    parent: 'facilitiesCondition' | 'facilitiesSuitability',
    id: QueueSubMetricId,
    value: number,
  ) => void
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

function PercentControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="metric-weights-control" title="Adjustable weight">
      <span className="visually-hidden">{label} weight percent</span>
      <button
        type="button"
        className="metric-weights-step"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(clampPercent(value - 1))}
      >
        −
      </button>
      <input
        className="metric-weights-input"
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={`${label} weight percent`}
        onChange={(e) => onChange(clampPercent(Number(e.target.value)))}
      />
      <span className="metric-weights-suffix" aria-hidden>
        %
      </span>
      <button
        type="button"
        className="metric-weights-step"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(clampPercent(value + 1))}
      >
        +
      </button>
    </div>
  )
}

export function MetricWeightsTable({
  weights,
  subWeights,
  onChange,
  onSubChange,
}: Props) {
  const [openSubs, setOpenSubs] = useState<Partial<Record<QueueMetricId, boolean>>>(
    {},
  )

  const total = queueMetricRows.reduce((sum, row) => sum + weights[row.id], 0)
  const totalOk = Math.round(total) === 100

  const toggleSub = (id: QueueMetricId) => {
    setOpenSubs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="metric-weights">
      <table className="metric-weights-table">
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Weight</th>
          </tr>
        </thead>
        <tbody>
          {queueMetricRows.map((row) => {
            const hasSubs = Boolean(row.subMetrics?.length)
            const isOpen = Boolean(openSubs[row.id])
            const parentKey =
              row.id === 'facilitiesCondition' ||
              row.id === 'facilitiesSuitability'
                ? row.id
                : null
            const subTotal =
              parentKey && row.subMetrics
                ? row.subMetrics.reduce(
                    (sum, sub) => sum + subWeights[parentKey][sub.id as never],
                    0,
                  )
                : 0
            const subTotalOk = Math.round(subTotal) === 100

            return (
              <tr key={row.id} className="metric-weights-block">
                <td colSpan={2} className="metric-weights-block-cell">
                  <div className="metric-weights-row">
                    {hasSubs ? (
                      <button
                        type="button"
                        className="metric-weights-expand"
                        aria-expanded={isOpen}
                        onClick={() => toggleSub(row.id)}
                      >
                        <span className="metric-weights-label">{row.label}</span>
                        <span
                          className={`metric-weights-chevron${isOpen ? ' is-open' : ''}`}
                          aria-hidden
                        >
                          ▸
                        </span>
                      </button>
                    ) : (
                      <span className="metric-weights-label">{row.label}</span>
                    )}
                    <PercentControl
                      label={row.label}
                      value={weights[row.id]}
                      onChange={(value) => onChange(row.id, value)}
                    />
                  </div>

                  {hasSubs && isOpen && parentKey && row.subMetrics ? (
                    <div className="metric-weights-subs">
                      {row.subMetrics.map((sub) => (
                        <div key={sub.id} className="metric-weights-row is-sub">
                          <span className="metric-weights-label">
                            {sub.label}
                          </span>
                          <PercentControl
                            label={`${row.label} ${sub.label}`}
                            value={subWeights[parentKey][sub.id as never]}
                            onChange={(value) =>
                              onSubChange(parentKey, sub.id, value)
                            }
                          />
                        </div>
                      ))}
                      <div className="metric-weights-subtotal">
                        <span>Subtotal</span>
                        <span
                          className={`metric-weights-total${subTotalOk ? '' : ' is-invalid'}`}
                        >
                          {Math.round(subTotal)}%
                        </span>
                      </div>
                      {!subTotalOk ? (
                        <p className="metric-weights-hint" role="status">
                          Submetrics should total 100%.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>
              <span
                className={`metric-weights-total${totalOk ? '' : ' is-invalid'}`}
              >
                {Math.round(total)}%
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
      {!totalOk ? (
        <p className="metric-weights-hint" role="status">
          Top-level weights should total 100%.
        </p>
      ) : null}
    </div>
  )
}
