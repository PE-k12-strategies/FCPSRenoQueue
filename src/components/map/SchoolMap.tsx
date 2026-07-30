import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ExpressionSpecification } from 'mapbox-gl'
import Map, {
  Layer,
  NavigationControl,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  defaultMapMetricId,
  getMapMetric,
  type MapMetricId,
} from '../../config/mapMetrics'
import { boundsFromPoints } from '../../lib/geoBounds'
import { filterGeoJsonBySearch } from '../../lib/filterGeoJsonBySearch'
import { filterGeoJsonBySuitability } from '../../lib/filterGeoJsonBySuitability'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityRating,
} from '../../lib/facilitySuitability'
import type { SchoolFeatureCollection } from '../../types/data'
import { MapLegend, type BasemapMode, type ViewMode } from './MapLegend'
import { SchoolPopup, type SelectedSchool } from './SchoolPopup'
import { SchoolView } from './SchoolView'
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
  suitabilityFilter: FacilitySuitabilityRating | null
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
  suitabilityFilter,
  selectedSchool,
  onSelectSchool,
}: Props) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const mapRef = useRef<MapRef>(null)
  const mapStageRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [basemap, setBasemap] = useState<BasemapMode>('light')
  const [mapMetric, setMapMetric] = useState<MapMetricId>(defaultMapMetricId)
  const [cursor, setCursor] = useState<'default' | 'pointer'>('default')
  const mapStyle =
    basemap === 'satellite' ? MAP_STYLE_SATELLITE : MAP_STYLE_LIGHT
  const activeMetric = getMapMetric(mapMetric)

  // Keep all sites when a school is selected so others can be dimmed (not removed).
  // Search still filters the map only while typing / before a selection.
  const displayData = useMemo(() => {
    if (!data) return null
    if (selectedSchool) return data
    return filterGeoJsonBySearch(data, searchQuery)
  }, [data, searchQuery, selectedSchool])

  /** Matching schools for fitBounds when a suitability filter is active. */
  const focusData = useMemo(
    () =>
      displayData
        ? filterGeoJsonBySuitability(displayData, suitabilityFilter)
        : null,
    [displayData, suitabilityFilter],
  )

  const selectedId = selectedSchool?.id ?? ''

  const circleOpacity = useMemo((): number | ExpressionSpecification => {
    // Dim non-matches like the donut filter: keep the selected school (and/or
    // suitability matches) bright; fade everything else.
    if (!suitabilityFilter && !selectedId) return 0.92

    const isSelected: ExpressionSpecification = [
      '==',
      ['to-string', ['get', 'FCPS_School ID']],
      selectedId,
    ]

    if (suitabilityFilter && selectedId) {
      return [
        'case',
        isSelected,
        0.95,
        ['==', ['get', facilitySuitabilityProperty], suitabilityFilter],
        0.92,
        0.18,
      ]
    }

    if (selectedId) {
      return ['case', isSelected, 0.95, 0.18]
    }

    return [
      'case',
      ['==', ['get', facilitySuitabilityProperty], suitabilityFilter!],
      0.92,
      0.18,
    ]
  }, [suitabilityFilter, selectedId])

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

  // Refit when search or suitability highlight set changes.
  useEffect(() => {
    if (!focusData) return
    // Prefer flying to a single selected school over refitting the whole set.
    if (selectedSchool) return
    const map = mapRef.current?.getMap()
    if (!map || !map.loaded()) return
    const b = boundsFromPoints(focusData)
    if (!b) return
    map.fitBounds(b as [[number, number], [number, number]], {
      padding: 56,
      maxZoom: 14,
      duration: 450,
    })
  }, [focusData, selectedSchool])

  // Ease to the selected school (search, browse, or map).
  useEffect(() => {
    if (!selectedSchool || viewMode !== 'map') return
    const map = mapRef.current?.getMap()
    if (!map || !map.loaded()) return

    const props = selectedSchool.properties
    let lng =
      typeof props.Longitude === 'number'
        ? props.Longitude
        : Number(props.Longitude)
    let lat =
      typeof props.Latitude === 'number'
        ? props.Latitude
        : Number(props.Latitude)

    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      const feature = data?.features.find(
        (f) => schoolIdFromProps(f.properties as Record<string, unknown>) === selectedSchool.id,
      )
      const coords = feature?.geometry?.coordinates
      if (!coords) return
      lng = coords[0]
      lat = coords[1]
    }

    map.easeTo({
      center: [lng, lat],
      zoom: Math.max(map.getZoom(), 12),
      duration: 600,
    })
  }, [selectedSchool, data, viewMode])

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
      const clickedProps = feature.properties as Record<string, unknown>
      const id = schoolIdFromProps(clickedProps)
      if (!id) {
        onSelectSchool(null)
        return
      }
      // Prefer full joined feature props (Mapbox may stringify/truncate).
      const fromData = data?.features.find(
        (f) =>
          schoolIdFromProps(f.properties as Record<string, unknown>) === id,
      )
      onSelectSchool({
        id,
        properties:
          (fromData?.properties as Record<string, unknown> | null) ??
          clickedProps,
      })
    },
    [onSelectSchool, data],
  )

  const legend = (
    <MapLegend
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      basemap={basemap}
      onBasemapChange={setBasemap}
      mapMetric={mapMetric}
      onMapMetricChange={setMapMetric}
    />
  )

  // School View replaces the map entirely; left pane stays for school selection.
  if (viewMode === 'school') {
    return (
      <div className="school-map-wrap school-map-wrap--dashboard">
        <SchoolView school={selectedSchool} />
        {legend}
      </div>
    )
  }

  if (!token || !token.trim()) {
    return (
      <div className="school-map-wrap">
        <div
          className="map-placeholder map-placeholder--error"
          role="alert"
        >
          <p className="map-placeholder-title">Mapbox token missing</p>
          <p className="map-placeholder-body">
            Create a <code>.env</code> file next to{' '}
            <code>package.json</code> and set{' '}
            <code>VITE_MAPBOX_TOKEN</code>. See <code>.env.example</code>.
          </p>
        </div>
        {legend}
      </div>
    )
  }

  if (!displayData) {
    return (
      <div className="school-map-wrap">
        <div className="map-placeholder" role="status" aria-live="polite">
          <p>Loading map data…</p>
        </div>
        {legend}
      </div>
    )
  }

  const schoolCount = displayData.features.length

  return (
    <div className="school-map-wrap">
      <p className="visually-hidden" id="map-instructions">
        Interactive map of school sites colored by facility suitability. Use
        search or Browse schools in the sidebar to select a school with the
        keyboard. Map zoom controls are available after the map canvas.
      </p>
      <div
        ref={mapStageRef}
        className="school-map-stage"
        role="region"
        aria-label={`School sites map, ${schoolCount} school${schoolCount === 1 ? '' : 's'} shown`}
        aria-describedby="map-instructions"
      >
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
          <NavigationControl position="bottom-right" showCompass={false} />
          <Source id="school-sites" type="geojson" data={displayData}>
            <Layer
              id={SCHOOL_LAYER_ID}
              type="circle"
              paint={{
                'circle-radius': [
                  'case',
                  ['==', ['to-string', ['get', 'FCPS_School ID']], selectedId],
                  7,
                  5,
                ],
                'circle-color': activeMetric.colorExpression,
                'circle-stroke-width': [
                  'case',
                  ['==', ['to-string', ['get', 'FCPS_School ID']], selectedId],
                  2,
                  1.5,
                ],
                'circle-stroke-color': '#ffffff',
                'circle-opacity': circleOpacity,
                'circle-stroke-opacity': circleOpacity,
              }}
            />
          </Source>
        </Map>
      </div>

      {legend}

      {selectedSchool ? (
        <SchoolPopup
          school={selectedSchool}
          onClose={() => onSelectSchool(null)}
        />
      ) : null}
    </div>
  )
}
