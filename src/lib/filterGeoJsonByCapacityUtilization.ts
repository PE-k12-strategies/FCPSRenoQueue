import type { FeatureCollection, Point } from 'geojson'
import {
  capacityUtilizationProperty,
  type CapacityUtilizationRating,
} from './capacityUtilization'

/** Keeps features whose capacity_utilization matches the given rating. */
export function filterGeoJsonByCapacityUtilization(
  collection: FeatureCollection<Point>,
  rating: CapacityUtilizationRating | null,
): FeatureCollection<Point> {
  if (!rating) return collection

  return {
    type: 'FeatureCollection',
    features: collection.features.filter(
      (f) => f.properties?.[capacityUtilizationProperty] === rating,
    ),
  }
}
