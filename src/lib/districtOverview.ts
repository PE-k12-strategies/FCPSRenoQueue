import type { SchoolFeatureCollection } from '../types/data'
import {
  capacityUtilizationProperty,
  type CapacityUtilizationRating,
} from './capacityUtilization'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityRating,
} from './facilitySuitability'

export const facilitySuitabilityRatings: FacilitySuitabilityRating[] = [
  'Low Priority',
  'Medium High Priority',
  'High Priority',
  'Critical Priority',
]

export const capacityUtilizationRatings: CapacityUtilizationRating[] = [
  'Overutilized',
  'Optimally Utilized',
  'Fairly Utilized',
  'Under Utilized',
]

export type CategoryBreakdownRow<T extends string = string> = {
  rating: T
  count: number
  percent: number
}

export type CategorySummary<T extends string = string> = {
  ratedCount: number
  totalSchools: number
  rows: CategoryBreakdownRow<T>[]
}

export type SuitabilityBreakdownRow =
  CategoryBreakdownRow<FacilitySuitabilityRating>
export type FacilitySuitabilitySummary =
  CategorySummary<FacilitySuitabilityRating>
export type CapacityUtilizationSummary =
  CategorySummary<CapacityUtilizationRating>

function summarizeCategory<T extends string>(
  collection: SchoolFeatureCollection | null,
  ratings: readonly T[],
  property: string,
  isRating: (value: unknown) => value is T,
): CategorySummary<T> {
  const counts = Object.fromEntries(ratings.map((r) => [r, 0])) as Record<
    T,
    number
  >

  const features = collection?.features ?? []
  let ratedCount = 0

  for (const feature of features) {
    const rating = feature.properties?.[property]
    if (isRating(rating)) {
      counts[rating] += 1
      ratedCount += 1
    }
  }

  const rows = ratings.map((rating) => ({
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

function isFacilitySuitabilityRating(
  value: unknown,
): value is FacilitySuitabilityRating {
  return (
    value === 'Low Priority' ||
    value === 'Medium High Priority' ||
    value === 'High Priority' ||
    value === 'Critical Priority'
  )
}

function isCapacityUtilizationRating(
  value: unknown,
): value is CapacityUtilizationRating {
  return (
    value === 'Overutilized' ||
    value === 'Optimally Utilized' ||
    value === 'Fairly Utilized' ||
    value === 'Under Utilized'
  )
}

export function summarizeFacilitySuitability(
  collection: SchoolFeatureCollection | null,
): FacilitySuitabilitySummary {
  return summarizeCategory(
    collection,
    facilitySuitabilityRatings,
    facilitySuitabilityProperty,
    isFacilitySuitabilityRating,
  )
}

export function summarizeCapacityUtilization(
  collection: SchoolFeatureCollection | null,
): CapacityUtilizationSummary {
  return summarizeCategory(
    collection,
    capacityUtilizationRatings,
    capacityUtilizationProperty,
    isCapacityUtilizationRating,
  )
}
