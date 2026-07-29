import type { SchoolFeatureCollection } from '../types/data'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityRating,
} from './facilitySuitability'

export const facilitySuitabilityRatings: FacilitySuitabilityRating[] = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
  'Deficient',
]

export type SuitabilityBreakdownRow = {
  rating: FacilitySuitabilityRating
  count: number
  percent: number
}

export type FacilitySuitabilitySummary = {
  ratedCount: number
  totalSchools: number
  rows: SuitabilityBreakdownRow[]
}

export function summarizeFacilitySuitability(
  collection: SchoolFeatureCollection | null,
): FacilitySuitabilitySummary {
  const counts: Record<FacilitySuitabilityRating, number> = {
    Excellent: 0,
    Good: 0,
    Fair: 0,
    Poor: 0,
    Deficient: 0,
  }

  const features = collection?.features ?? []
  let ratedCount = 0

  for (const feature of features) {
    const rating = feature.properties?.[facilitySuitabilityProperty]
    if (
      rating === 'Excellent' ||
      rating === 'Good' ||
      rating === 'Fair' ||
      rating === 'Poor' ||
      rating === 'Deficient'
    ) {
      counts[rating] += 1
      ratedCount += 1
    }
  }

  const rows = facilitySuitabilityRatings.map((rating) => ({
    rating,
    count: counts[rating],
    percent:
      ratedCount === 0
        ? 0
        : Math.round((counts[rating] / ratedCount) * 1000) / 10,
  }))

  return {
    ratedCount,
    totalSchools: features.length,
    rows,
  }
}
