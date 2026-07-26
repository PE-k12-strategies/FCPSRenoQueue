import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Map, {
  Layer,
  NavigationControl,
  Source,
  type MapRef,
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { circleColorExpression } from '../../config/legend'
import { boundsFromPoints } from '../../lib/geoBounds'
import { filterGeoJsonBySearch } from '../../lib/filterGeoJsonBySearch'
import type { SchoolFeatureCollection } from '../../types/data'
import { MapLegend, type BasemapMode } from './MapLegend'
import './SchoolMap.css'

const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11'
const MAP_STYLE_SATELLITE = 'mapbox://styles/mapbox/satellite-streets-v12'

/** Same stack as `:root --font` in `index.html` / `index.css` (Mapbox glyph override). */
const MAP_LABEL_FONT_FAMILY =
  "'Plus Jakarta Sans', system-ui, 'Segoe UI', Roboto, sans-serif"

type Props = {
  /** Enriched GeoJSON (already merged with CSV columns). */
  data: SchoolFeatureCollection | null
  searchQuery: string
}

export function SchoolMap({ data, searchQuery }: Props) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const mapRef = useRef<MapRef>(null)
  const mapStageRef = useRef<HTMLDivElement>(null)
  const [basemap, setBasemap] = useState<BasemapMode>('light')
  const mapStyle =
    basemap === 'satellite' ? MAP_STYLE_SATELLITE : MAP_STYLE_LIGHT

  const displayData = useMemo(
    () => (data ? filterGeoJsonBySearch(data, searchQuery) : null),
    [data, searchQuery],
  )

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
    /* Nudge an immediate paint after buffer resize (reduces one-frame gaps). */
    map.triggerRepaint()
  }, [])

  /**
   * Mapbox only matches the WebGL canvas to the container when `resize()` runs.
   * During split/window drags the container size changes every frame; we coalesce
   * ResizeObserver bursts to at most one `resize()` per animation frame so the map
   * tracks the panel live without grey gutters, without calling `resize()` hundreds
   * of times per second.
   */
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
          /* Avoid double `resize()` vs our ResizeObserver (window + observer = 2× repaint flash). */
          trackResize={false}
          /* Keeps last frame during buffer swaps; slight GPU cost, reduces white clears. */
          preserveDrawingBuffer
          fadeDuration={0}
          onLoad={() => {
            queueMicrotask(resizeMap)
          }}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <Source id="school-sites" type="geojson" data={displayData}>
            <Layer
              id="school-sites-circle"
              type="circle"
              paint={{
                'circle-radius': 9,
                'circle-color': circleColorExpression,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.92,
              }}
            />
          </Source>
        </Map>
      </div>
      <MapLegend basemap={basemap} onBasemapChange={setBasemap} />
    </div>
  )
}
