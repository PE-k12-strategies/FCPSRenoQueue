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
    <div className="map-legend">
      <p className="map-legend-title">Facility Suitability</p>
      <ul className="map-legend-list">
        {facilitySuitabilityLegendItems.map(({ rating, label }) => (
          <li key={rating} className="map-legend-row">
            <span
              className="map-legend-swatch"
              style={{ background: facilitySuitabilityColors[rating] }}
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <div className="map-legend-basemap">
        <p className="map-legend-title">Basemap</p>
        <div
          className="map-legend-toggle"
          role="group"
          aria-label="Basemap style"
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
    </div>
  )
}
