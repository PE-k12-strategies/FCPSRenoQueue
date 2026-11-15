import {
  capacityUtilizationColors,
  facilitySuitabilityColors,
} from '../../config/legend'
import type {
  CapacityUtilizationSummary,
  FacilitySuitabilitySummary,
} from '../../lib/districtOverview'
import type { CapacityUtilizationRating } from '../../lib/capacityUtilization'
import type { FacilitySuitabilityRating } from '../../lib/facilitySuitability'
import { SuitabilityDonut } from './SuitabilityDonut'
import './DistrictOverview.css'

type Props = {
  suitability: FacilitySuitabilitySummary
  selectedSuitability: FacilitySuitabilityRating | null
  onSelectSuitability: (rating: FacilitySuitabilityRating | null) => void
  capacity: CapacityUtilizationSummary
  selectedCapacity: CapacityUtilizationRating | null
  onSelectCapacity: (rating: CapacityUtilizationRating | null) => void
}

export function DistrictOverview({
  suitability,
  selectedSuitability,
  onSelectSuitability,
  capacity,
  selectedCapacity,
  onSelectCapacity,
}: Props) {
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
        <p className="district-overview-note" role="status" aria-live="polite">
          {suitability.ratedCount > 0
            ? `${suitability.ratedCount} of ${suitability.totalSchools} schools rated`
            : 'Loading suitability ratings…'}
        </p>
        <SuitabilityDonut
          rows={suitability.rows}
          ratedCount={suitability.ratedCount}
          selectedRating={selectedSuitability}
          onSelectRating={onSelectSuitability}
          colors={facilitySuitabilityColors}
          chartTitle="Facilities Suitability by school count"
          groupAriaLabel="Filter map by facility suitability. Activate a segment or legend row to filter."
          legendAriaLabel="Suitability breakdown"
        />
      </div>

      <div className="district-overview-block">
        <h3 className="district-overview-subtitle">Capacity Utilization</h3>
        <p className="district-overview-note" role="status" aria-live="polite">
          {capacity.ratedCount > 0
            ? `${capacity.ratedCount} of ${capacity.totalSchools} schools rated`
            : 'Loading capacity utilization…'}
        </p>
        <SuitabilityDonut
          rows={capacity.rows}
          ratedCount={capacity.ratedCount}
          selectedRating={selectedCapacity}
          onSelectRating={onSelectCapacity}
          colors={capacityUtilizationColors}
          chartTitle="Capacity Utilization by school count"
          groupAriaLabel="Filter map by capacity utilization. Activate a segment or legend row to filter."
          legendAriaLabel="Capacity utilization breakdown"
        />
      </div>
    </section>
  )
}
