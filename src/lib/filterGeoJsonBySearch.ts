import type { FeatureCollection, Point } from 'geojson'

/** Keeps features when any string property contains the query (case-insensitive). */
export function filterGeoJsonBySearch(
  collection: FeatureCollection<Point>,
  query: string,
): FeatureCollection<Point> {
  const q = query.trim().toLowerCase()
  if (!q) return collection

  return {
    type: 'FeatureCollection',
    features: collection.features.filter((f) => {
      const props = f.properties
      if (!props || typeof props !== 'object') return false
      return Object.values(props).some((v) =>
        String(v).toLowerCase().includes(q),
      )
    }),
  }
}
