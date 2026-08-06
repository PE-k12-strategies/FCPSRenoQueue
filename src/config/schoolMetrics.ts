import { facilitySuitabilityTree } from './facilitySuitabilityTree'

/**
 * Metric sections shown in the school detail popup when a map point is selected.
 */
export type SchoolMetricSection = {
  id: string
  title: string
  body: string
  /** Property keys to surface as rows when present on the school feature. */
  propertyKeys?: string[]
  /**
   * Numeric score fields shown as Facility Suitability categories
   * (same breakpoints as FS_Score), not raw values.
   */
  scoredCategoryKeys?: { key: string; label: string }[]
  /** Static fallback rows when no property keys / values are available. */
  fallbackItems?: string[]
}

/** FS submetrics: Column I (DF), Column S (SS), Column L (PA). */
export const facilitySuitabilitySubScores = [
  { key: 'DF_Score', label: 'Design Features' },
  { key: 'SS_Score', label: 'Space Sufficiency' },
  { key: 'PA_Score', label: 'Program Adjacency' },
] as const

export const schoolMetricSections: SchoolMetricSection[] = [
  {
    id: 'facility-suitability',
    title: facilitySuitabilityTree.label,
    body: facilitySuitabilityTree.description,
    scoredCategoryKeys: [...facilitySuitabilitySubScores],
  },
  {
    id: 'data-1',
    title: 'Data 1',
    body: 'Placeholder narrative for the first criterion group.',
    fallbackItems: [
      'SubData 1: utilization index',
      'SubData 1: trailer reliance',
      'SubData 1: projected five-year headcount',
    ],
  },
  {
    id: 'data-3',
    title: 'Data 3',
    body: 'Placeholder criterion group for accessibility and readiness metrics.',
    fallbackItems: [
      'SubData 3: accessibility',
      'SubData 3: life safety',
      'SubData 3: IT readiness',
      'SubData 3: sustainability',
    ],
  },
  {
    id: 'data-4',
    title: 'Data 4',
    body: 'Placeholder criterion group for funding and phasing.',
    fallbackItems: [
      'SubData 4: funding window',
      'SubData 4: phasing risk',
    ],
  },
]

export const schoolDisplayFields = [
  { key: 'School Type', label: 'School Type' },
  { key: 'Year Opened', label: 'Year Opened' },
  { key: 'Building SF', label: 'Building SF' },
  { key: 'NCES Street Address', label: 'Address' },
  { key: 'NCES City', label: 'City' },
  { key: 'Region', label: 'Region' },
] as const
