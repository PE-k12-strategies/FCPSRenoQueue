import {
  facilitySuitabilityColors,
  facilitySuitabilityLegendItems,
} from '../../config/legend'
import './MapLegend.css'

export type BasemapMode = 'light' | 'satellite'

type Props = {
  basemap: BasemapMode
  onBasemapChange: (mode: BasemapMode) => void
}

export function MapLegend({ basemap, onBasemapChange }: Props) {
  return (
    <section className="map-legend" aria-label="Map legend and basemap">
      <p className="map-legend-title" id="facility-suitability-legend">
        Facility Suitability
      </p>
      <ul
        className="map-legend-list"
        aria-labelledby="facility-suitability-legend"
      >
        {facilitySuitabilityLegendItems.map(({ rating, label }) => (
          <li key={rating} className="map-legend-row">
            <span
              className="map-legend-swatch"
              style={{ background: facilitySuitabilityColors[rating] }}
              aria-hidden
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <div className="map-legend-basemap">
        <p className="map-legend-title" id="basemap-legend">
          Basemap
        </p>
        <div
          className="map-legend-toggle"
          role="group"
          aria-labelledby="basemap-legend"
        >
          <button
            type="button"
            className="map-legend-toggle-btn"
            aria-pressed={basemap === 'light'}
            onClick={() => onBasemapChange('light')}
          >
            Light Grey
          </button>
          <button
            type="button"
            className="map-legend-toggle-btn"
            aria-pressed={basemap === 'satellite'}
            onClick={() => onBasemapChange('satellite')}
          >
            Satellite
          </button>
        </div>
      </div>
    </section>
  )
}
