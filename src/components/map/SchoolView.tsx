import { FacilitySuitabilityTable } from './FacilitySuitabilityTable'
import type { SelectedSchool } from './SchoolPopup'
import './SchoolView.css'

type Props = {
  school: SelectedSchool | null
}

function schoolName(school: SelectedSchool): string {
  const name =
    school.properties.School ?? school.properties['NCES School Name']
  return name == null ? 'Selected school' : String(name)
}

/**
 * School View data dashboard — replaces the map when toggled on.
 * Selection comes from the left pane.
 */
export function SchoolView({ school }: Props) {
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
          <FacilitySuitabilityTable properties={school.properties} />
        ) : (
          <div className="school-view-empty" role="status">
            No school selected.
          </div>
        )}
      </div>
    </div>
  )
}
