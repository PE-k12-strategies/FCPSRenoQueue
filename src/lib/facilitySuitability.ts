import type { SchoolFeatureCollection } from '../types/data'

/** Overall Facility Suitability label field from Supabase `Facility_Suitability`. */
export const fsScoreField = 'FS_Score' as const

/** Derived category written onto each feature for legend / map paint. */
export const facilitySuitabilityProperty = 'facility_suitability' as const

/**
 * Overall Facility Suitability priorities from Supabase `FS_Score`
 * (pre-labeled in source data).
 */
export type FacilitySuitabilityRating =
  | 'Lowest Priority'
  | 'Low Priority'
  | 'Medium Priority'
  | 'High Priority'
  | 'Highest Priority'

/** Design Features / Program Adjacency / Space Sufficiency score bands. */
export type FacilitySuitabilityBand = 'Good' | 'Fair' | 'Poor' | 'Deficient'

const facilitySuitabilityRatings = [
  'Lowest Priority',
  'Low Priority',
  'Medium Priority',
  'High Priority',
  'Highest Priority',
] as const satisfies readonly FacilitySuitabilityRating[]

/**
 * Shared score breakpoints for subcategory bands:
 * >0.8 · >0.7 · >0.6 · ≤0.6
 */
function scoreBandIndex(score: number): 0 | 1 | 2 | 3 {
  if (score > 0.8) return 0
  if (score > 0.7) return 1
  if (score > 0.6) return 2
  return 3
}

export function isFacilitySuitabilityRating(
  value: unknown,
): value is FacilitySuitabilityRating {
  return (
    typeof value === 'string' &&
    (facilitySuitabilityRatings as readonly string[]).includes(value)
  )
}

export function parseFacilitySuitabilityRating(
  value: unknown,
): FacilitySuitabilityRating | null {
  if (value == null || value === '') return null
  const s = String(value).trim()
  return isFacilitySuitabilityRating(s) ? s : null
}

/**
 * Fallback numeric → priority mapping (only if FS_Score is still numeric).
 * Prefer labeled FS_Score values from Supabase when present.
 */
export function scoreToFacilitySuitability(
  score: number,
): FacilitySuitabilityRating {
  const bands: FacilitySuitabilityRating[] = [
    'Lowest Priority',
    'Low Priority',
    'Medium Priority',
    'High Priority',
  ]
  // Map 4 numeric bands onto the first four labels; worst numeric → Highest.
  if (score <= 0.6) return 'Highest Priority'
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

/** Assigns `facility_suitability` from labeled or numeric `FS_Score`. */
export function assignFacilitySuitability(
  collection: SchoolFeatureCollection,
): SchoolFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: collection.features.map((f) => {
      const raw = f.properties?.[fsScoreField]
      const labeled = parseFacilitySuitabilityRating(raw)
      const numeric = labeled == null ? parseFsScore(raw) : null
      const rating =
        labeled ??
        (numeric == null ? undefined : scoreToFacilitySuitability(numeric))
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
