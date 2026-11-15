import type { SchoolFeatureCollection } from '../types/data'

/** Program capacity utilization from Adopted CIP FY2027–31. */
export const programCapacityUtilizationField =
  'SY25-26 Program Capacity Utilization' as const

/** Derived category for map paint / dashboard. */
export const capacityUtilizationProperty = 'capacity_utilization' as const

export type CapacityUtilizationRating =
  | 'Overutilized'
  | 'Optimally Utilized'
  | 'Fairly Utilized'
  | 'Under Utilized'

/**
 * Normalize CSV utilization to a 0–100+ percent.
 * Values ≤1.5 are treated as ratios (0.77 → 77).
 */
export function utilizationToPercent(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : Number(String(value).trim())
  if (!Number.isFinite(n)) return null
  return n <= 1.5 ? n * 100 : n
}

/**
 * Rubric (program capacity utilization %):
 * >100 Overutilized · >80 Optimally Utilized · >60 Fairly Utilized · ≤60 Under Utilized
 */
export function scoreToCapacityUtilization(
  percent: number,
): CapacityUtilizationRating {
  if (percent > 100) return 'Overutilized'
  if (percent > 80) return 'Optimally Utilized'
  if (percent > 60) return 'Fairly Utilized'
  return 'Under Utilized'
}

export function parseCapacityUtilization(
  value: unknown,
): CapacityUtilizationRating | null {
  const percent = utilizationToPercent(value)
  if (percent == null) return null
  return scoreToCapacityUtilization(percent)
}

/** Assigns `capacity_utilization` from program capacity utilization on each feature. */
export function assignCapacityUtilization(
  collection: SchoolFeatureCollection,
): SchoolFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: collection.features.map((f) => {
      const rating = parseCapacityUtilization(
        f.properties?.[programCapacityUtilizationField],
      )
      return {
        ...f,
        properties: {
          ...(f.properties ?? {}),
          ...(rating ? { [capacityUtilizationProperty]: rating } : {}),
        },
      }
    }),
  }
}
