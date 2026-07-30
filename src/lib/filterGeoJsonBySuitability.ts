import type { FeatureCollection, Point } from 'geojson'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityRating,
} from './facilitySuitability'

/** Keeps features whose facility_suitability matches the given rating. */
export function filterGeoJsonBySuitability(
  collection: FeatureCollection<Point>,
  rating: FacilitySuitabilityRating | null,
): FeatureCollection<Point> {
  if (!rating) return collection

  return {
    type: 'FeatureCollection',
    features: collection.features.filter(
      (f) => f.properties?.[facilitySuitabilityProperty] === rating,
    ),
  }
}
