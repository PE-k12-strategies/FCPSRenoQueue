import { schoolDisplayFields } from '../../config/schoolMetrics'
import { FacilitySuitabilityTable } from './FacilitySuitabilityTable'
import type { SelectedSchool } from './SchoolPopup'
import './SchoolView.css'

type Props = {
  school: SelectedSchool | null
}

/** Fields shown in School View above the metrics (no Building SF). */
const schoolViewDetailFields = schoolDisplayFields.filter(
  (field) => field.key !== 'Building SF',
)

function schoolName(school: SelectedSchool): string {
  const name =
    school.properties.School ?? school.properties['NCES School Name']
  return name == null ? 'Selected school' : String(name)
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

/**
 * School View data dashboard — replaces the map when toggled on.
 * Selection comes from the left pane.
 */
export function SchoolView({ school }: Props) {
  const detailRows = school
    ? schoolViewDetailFields.flatMap(({ key, label }) => {
        const value = propString(school.properties, key)
        if (value == null) return []
        return [{ key, label, value }]
      })
    : []

  return (
    <div className="school-view" role="region" aria-label="School data dashboard">
      <div className="school-view-dashboard">
        <header className="school-view-header">
          <p className="school-view-kicker">School View</p>
          {school ? (
            <h2 className="school-view-title">{schoolName(school)}</h2>
          ) : (
            <h2 className="school-view-title">Select a school</h2>
          )}
          <p className="school-view-body">
            {school
              ? 'Facility suitability metrics for the selected school.'
              : 'Use search or Browse schools in the left pane to choose a school.'}
          </p>
        </header>

        {school ? (
          <>
            {detailRows.length > 0 ? (
              <dl className="school-view-details" aria-label="School details">
                {detailRows.map(({ key, label, value }) => (
                  <div key={key} className="school-view-details-item">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <FacilitySuitabilityTable properties={school.properties} />
          </>
        ) : (
          <div className="school-view-empty" role="status">
            No school selected.
          </div>
        )}
      </div>
    </div>
  )
}
