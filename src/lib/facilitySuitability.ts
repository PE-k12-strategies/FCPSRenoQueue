import type { SchoolFeatureCollection } from '../types/data'

/** Column T in `FCPS_FS_Data.csv`. */
export const fsScoreField = 'FS_Score' as const

/** Derived category written onto each feature for legend / map paint. */
export const facilitySuitabilityProperty = 'facility_suitability' as const

/** Overall Facility Suitability priority (from FS_Score). */
export type FacilitySuitabilityRating =
  | 'Low Priority'
  | 'Medium High Priority'
  | 'High Priority'
  | 'Critical Priority'

/** Design Features / Program Adjacency / Space Sufficiency score bands. */
export type FacilitySuitabilityBand = 'Good' | 'Fair' | 'Poor' | 'Deficient'

/**
 * Shared score breakpoints:
 * >0.8 · >0.7 · >0.6 · ≤0.6
 */
function scoreBandIndex(score: number): 0 | 1 | 2 | 3 {
  if (score > 0.8) return 0
  if (score > 0.7) return 1
  if (score > 0.6) return 2
  return 3
}

/**
 * Overall Facility Suitability (FS_Score):
 * >0.8 Low Priority · >0.7 Medium High Priority · >0.6 High Priority · ≤0.6 Critical Priority
 */
export function scoreToFacilitySuitability(
  score: number,
): FacilitySuitabilityRating {
  const bands: FacilitySuitabilityRating[] = [
    'Low Priority',
    'Medium High Priority',
    'High Priority',
    'Critical Priority',
  ]
  return bands[scoreBandIndex(score)]
}

/**
 * Subcategory scores (Design Features, Program Adjacency, Space Sufficiency, leaves):
 * >0.8 Good · >0.7 Fair · >0.6 Poor · ≤0.6 Deficient
 */
export function scoreToFacilitySuitabilityBand(
  score: number,
): FacilitySuitabilityBand {
  const bands: FacilitySuitabilityBand[] = [
    'Good',
    'Fair',
    'Poor',
    'Deficient',
  ]
  return bands[scoreBandIndex(score)]
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
