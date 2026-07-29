import type { FacilitySuitabilitySummary } from '../../lib/districtOverview'
import { SuitabilityDonut } from './SuitabilityDonut'
import './DistrictOverview.css'

type Props = {
  suitability: FacilitySuitabilitySummary
}

export function DistrictOverview({ suitability }: Props) {
  return (
    <section className="district-overview" aria-labelledby="district-overview-title">
      <h2 id="district-overview-title" className="sidebar-section-title">
        District Overview
      </h2>

      <dl className="district-overview-stat">
        <div className="district-overview-stat-row">
          <dt>Total deficiency cost</dt>
          <dd>TBD</dd>
        </div>
      </dl>

      <div className="district-overview-block">
        <h3 className="district-overview-subtitle">Facilities Suitability</h3>
        <p className="district-overview-note">
          {suitability.ratedCount > 0
            ? `${suitability.ratedCount} of ${suitability.totalSchools} schools rated`
            : 'Loading suitability ratings…'}
        </p>
        <SuitabilityDonut
          rows={suitability.rows}
          ratedCount={suitability.ratedCount}
        />
      </div>
    </section>
  )
}
