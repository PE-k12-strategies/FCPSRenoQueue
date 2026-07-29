import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Map, {
  Layer,
  NavigationControl,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { circleColorExpression } from '../../config/legend'
import { boundsFromPoints } from '../../lib/geoBounds'
import { filterGeoJsonBySearch } from '../../lib/filterGeoJsonBySearch'
import type { SchoolFeatureCollection } from '../../types/data'
import { MapLegend, type BasemapMode } from './MapLegend'
import { SchoolPopup, type SelectedSchool } from './SchoolPopup'
import './SchoolMap.css'

const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11'
const MAP_STYLE_SATELLITE = 'mapbox://styles/mapbox/satellite-streets-v12'
const SCHOOL_LAYER_ID = 'school-sites-circle'

/** Same stack as `:root --font` in `index.html` / `index.css` (Mapbox glyph override). */
const MAP_LABEL_FONT_FAMILY =
  "'Plus Jakarta Sans', system-ui, 'Segoe UI', Roboto, sans-serif"

type Props = {
  /** Enriched GeoJSON (already merged with CSV columns). */
  data: SchoolFeatureCollection | null
  searchQuery: string
  selectedSchool: SelectedSchool | null
  onSelectSchool: (school: SelectedSchool | null) => void
}

function schoolIdFromProps(props: Record<string, unknown> | null | undefined) {
  if (!props) return ''
  const id = props['FCPS_School ID']
  return id == null ? '' : String(id)
}

export function SchoolMap({
  data,
  searchQuery,
  selectedSchool,
  onSelectSchool,
}: Props) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const mapRef = useRef<MapRef>(null)
  const mapStageRef = useRef<HTMLDivElement>(null)
  const [basemap, setBasemap] = useState<BasemapMode>('light')
  const [cursor, setCursor] = useState<'default' | 'pointer'>('default')
  const mapStyle =
    basemap === 'satellite' ? MAP_STYLE_SATELLITE : MAP_STYLE_LIGHT

  const displayData = useMemo(
    () => (data ? filterGeoJsonBySearch(data, searchQuery) : null),
    [data, searchQuery],
  )

  const selectedId = selectedSchool?.id ?? ''

  const initialViewState = useMemo(() => {
    if (!displayData) {
      return {
        longitude: -77.3,
        latitude: 38.85,
        zoom: 9,
      }
    }
    const b = boundsFromPoints(displayData)
    if (!b) {
      return { longitude: -77.3, latitude: 38.85, zoom: 9 }
    }
    return {
      bounds: b as [[number, number], [number, number]],
      fitBoundsOptions: { padding: 56, maxZoom: 14 },
    }
  }, [displayData])

  const resizeMap = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !map.loaded()) return
    const el = mapStageRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    if (width < 16 || height < 16) return
    map.resize()
    map.triggerRepaint()
  }, [])

  useEffect(() => {
    if (!token?.trim() || !displayData) return
    const el = mapStageRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    let rafId = 0
    const flush = () => {
      rafId = 0
      resizeMap()
    }

    const schedule = () => {
      if (rafId !== 0) return
      rafId = requestAnimationFrame(flush)
    }

    const ro = new ResizeObserver(schedule)
    ro.observe(el)

    const onVvResize = () => {
      schedule()
    }
    window.visualViewport?.addEventListener('resize', onVvResize)

    queueMicrotask(schedule)

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      ro.disconnect()
      window.visualViewport?.removeEventListener('resize', onVvResize)
    }
  }, [displayData, token, resizeMap])

  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    setCursor(e.features && e.features.length > 0 ? 'pointer' : 'default')
  }, [])

  const onClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      if (!feature?.properties) {
        onSelectSchool(null)
        return
      }
      const props = feature.properties as Record<string, unknown>
      const id = schoolIdFromProps(props)
      if (!id) {
        onSelectSchool(null)
        return
      }
      onSelectSchool({ id, properties: props })
    },
    [onSelectSchool],
  )

  if (!token || !token.trim()) {
    return (
      <div className="map-placeholder map-placeholder--error">
        <p className="map-placeholder-title">Mapbox token missing</p>
        <p className="map-placeholder-body">
          Create a <code>.env</code> file next to{' '}
          <code>package.json</code> and set{' '}
          <code>VITE_MAPBOX_TOKEN</code>. See <code>.env.example</code>.
        </p>
      </div>
    )
  }

  if (!displayData) {
    return (
      <div className="map-placeholder">
        <p>Loading map data…</p>
      </div>
    )
  }

  return (
    <div className="school-map-wrap">
      <div ref={mapStageRef} className="school-map-stage">
        <Map
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          mapboxAccessToken={token}
          mapStyle={mapStyle}
          initialViewState={initialViewState}
          reuseMaps
          attributionControl
          localFontFamily={MAP_LABEL_FONT_FAMILY}
          trackResize={false}
          preserveDrawingBuffer
          fadeDuration={0}
          cursor={cursor}
          interactiveLayerIds={[SCHOOL_LAYER_ID]}
          onMouseMove={onMouseMove}
          onClick={onClick}
          onLoad={() => {
            queueMicrotask(resizeMap)
          }}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <Source id="school-sites" type="geojson" data={displayData}>
            <Layer
              id={SCHOOL_LAYER_ID}
              type="circle"
              paint={{
                'circle-radius': [
                  'case',
                  ['==', ['to-string', ['get', 'FCPS_School ID']], selectedId],
                  12,
                  9,
                ],
                'circle-color': circleColorExpression,
                'circle-stroke-width': [
                  'case',
                  ['==', ['to-string', ['get', 'FCPS_School ID']], selectedId],
                  3,
                  2,
                ],
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.92,
              }}
            />
          </Source>
        </Map>
      </div>
      <MapLegend basemap={basemap} onBasemapChange={setBasemap} />
      {selectedSchool ? (
        <SchoolPopup
          school={selectedSchool}
          onClose={() => onSelectSchool(null)}
        />
      ) : null}
    </div>
  )
}
