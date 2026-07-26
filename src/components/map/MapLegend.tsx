import { queueLegendItems, queueTierColors } from '../../config/legend'

import './MapLegend.css'



export type BasemapMode = 'light' | 'satellite'



type Props = {

  basemap: BasemapMode

  onBasemapChange: (mode: BasemapMode) => void

}



export function MapLegend({ basemap, onBasemapChange }: Props) {

  return (

    <div className="map-legend">

      <p className="map-legend-title">Queue tier</p>

      <ul className="map-legend-list">

        {queueLegendItems.map(({ tier, label }) => (

          <li key={tier} className="map-legend-row">

            <span

              className="map-legend-swatch"

              style={{ background: queueTierColors[tier] }}

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

