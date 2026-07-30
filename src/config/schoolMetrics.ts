/**
 * Metric sections shown in the school detail popup when a map point is selected.
 */
export type SchoolMetricSection = {
  id: string
  title: string
  body: string
  /** Property keys to surface as rows when present on the school feature. */
  propertyKeys?: string[]
  /** Static fallback rows when no property keys / values are available. */
  fallbackItems?: string[]
}

export const schoolMetricSections: SchoolMetricSection[] = [
  {
    id: 'facility-suitability',
    title: 'Facility Suitability',
    body: 'Rating derived from FS_Score (Column T) using the project rubric.',
    propertyKeys: ['facility_suitability', 'FS_Score'],
    fallbackItems: [
      'Excellent — score > 0.9',
      'Good — score > 0.75',
      'Fair — score > 0.6',
      'Poor — score > 0.4',
      'Deficient — score < 0.4',
    ],
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
  { key: 'NCES Street Address', label: 'NCES Street Address' },
  { key: 'NCES City', label: 'City' },
  { key: 'Region', label: 'Region' },
] as const
