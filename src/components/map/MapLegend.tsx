import {
  defaultMapMetricId,
  getMapMetric,
  mapMetrics,
  type MapMetricId,
} from '../../config/mapMetrics'
import './MapLegend.css'

export type BasemapMode = 'light' | 'satellite'
export type ViewMode = 'map' | 'school'

type Props = {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  basemap: BasemapMode
  onBasemapChange: (mode: BasemapMode) => void
  mapMetric: MapMetricId
  onMapMetricChange: (metric: MapMetricId) => void
}

export function MapLegend({
  viewMode,
  onViewModeChange,
  basemap,
  onBasemapChange,
  mapMetric = defaultMapMetricId,
  onMapMetricChange,
}: Props) {
  const metric = getMapMetric(mapMetric)
  const showMapControls = viewMode === 'map'

  return (
    <section className="map-legend" aria-label="Map legend and view controls">
      <div className="map-legend-view">
        <p className="map-legend-title" id="view-mode-legend">
          View
        </p>
        <div
          className="map-legend-toggle map-legend-toggle--view"
          role="group"
          aria-labelledby="view-mode-legend"
        >
          <button
            type="button"
            className="map-legend-toggle-btn"
            aria-pressed={viewMode === 'map'}
            onClick={() => onViewModeChange('map')}
          >
            Map View
          </button>
          <button
            type="button"
            className="map-legend-toggle-btn"
            aria-pressed={viewMode === 'school'}
            onClick={() => onViewModeChange('school')}
          >
            School View
          </button>
        </div>
      </div>

      {showMapControls ? (
        <>
          <div className="map-legend-metric">
            <label className="map-legend-title" htmlFor="map-metric-select">
              Metric
            </label>
            <select
              id="map-metric-select"
              className="map-legend-select"
              value={mapMetric}
              onChange={(e) =>
                onMapMetricChange(e.target.value as MapMetricId)
              }
            >
              {mapMetrics.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="map-legend-list" aria-label={`${metric.label} legend`}>
            {metric.legendItems.map(({ id, label, color }) => (
              <li key={id} className="map-legend-row">
                <span
                  className="map-legend-swatch"
                  style={{ background: color }}
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
        </>
      ) : (
        <p className="map-legend-school-note">
          School View controls will appear here.
        </p>
      )}
    </section>
  )
}
