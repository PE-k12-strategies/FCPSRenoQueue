import type { FeatureCollection, Point } from 'geojson'

/** Returns SW and NE corners for `fitBounds`, or null if there are no points. */
export function boundsFromPoints(
  collection: FeatureCollection<Point>,
): [[number, number], [number, number]] | null {
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const f of collection.features) {
    const [lng, lat] = f.geometry.coordinates
    minLng = Math.min(minLng, lng)
    minLat = Math.min(minLat, lat)
    maxLng = Math.max(maxLng, lng)
    maxLat = Math.max(maxLat, lat)
  }

  if (!Number.isFinite(minLng)) return null
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}
