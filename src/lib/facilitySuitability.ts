import type { SchoolFeatureCollection } from '../types/data'

/** Column T in `FCPS_FS_Data.csv`. */
export const fsScoreField = 'FS_Score' as const

/** Derived category written onto each feature for legend / map paint. */
export const facilitySuitabilityProperty = 'facility_suitability' as const

export type FacilitySuitabilityRating =
  | 'Excellent'
  | 'Good'
  | 'Fair'
  | 'Poor'
  | 'Deficient'

/**
 * Rubric for Facility Suitability (FS_Score):
 * >0.9 Excellent · >0.75 Good · >0.6 Fair · >0.4 Poor · <0.4 Deficient
 */
export function scoreToFacilitySuitability(
  score: number,
): FacilitySuitabilityRating {
  if (score > 0.9) return 'Excellent'
  if (score > 0.75) return 'Good'
  if (score > 0.6) return 'Fair'
  if (score > 0.4) return 'Poor'
  return 'Deficient'
}

export function parseFsScore(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : Number(String(value).trim())
  if (!Number.isFinite(n)) return null
  return n
}

/** Assigns `facility_suitability` from joined `FS_Score` on each feature. */
export function assignFacilitySuitability(
  collection: SchoolFeatureCollection,
): SchoolFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: collection.features.map((f) => {
      const score = parseFsScore(f.properties?.[fsScoreField])
      const rating =
        score == null ? undefined : scoreToFacilitySuitability(score)
      return {
        ...f,
        properties: {
          ...(f.properties ?? {}),
          ...(rating ? { [facilitySuitabilityProperty]: rating } : {}),
        },
      }
    }),
  }
}
