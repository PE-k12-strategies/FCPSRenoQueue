/**
 * Static accordion structure — edit titles, blurbs, and sub-lines here.
 * Map/search colors still come from CSV (`queue_tier`); this file is only for card copy.
 */
export type SidebarSection = {
  id: string
  title: string
  /** Shown next to the title in accent color (like “Fair” in the mock). */
  statusTag?: string
  /** Visible when the section is collapsed (optional one-liner). */
  collapsedHint?: string
  /** Longer text shown when expanded. */
  body: string
  /** Short list rows when expanded; becomes multi-column when the sidebar is wide. */
  subItems: string[]
}

export const sidebarSections: SidebarSection[] = [
  {
    id: 'data-1',
    title: 'Data 1',
    statusTag: 'Fair',
    collapsedHint: 'Enrollment pressure vs. capacity',
    body: 'Placeholder narrative for the first criterion group. Replace with language from your briefing deck.',
    subItems: [
      'SubData 1: Fair — utilization index',
      'SubData 1: Fair — trailer reliance',
      'SubData 1: Fair — projected five-year headcount',
    ],
  },
  {
    id: 'data-2',
    title: 'Data 2',
    statusTag: 'Fair',
    body: 'Second grouping covers facility condition scores pulled from your assessment workbook.',
    subItems: ['SubData 2: Fair — roof', 'SubData 2: Fair — envelope', 'SubData 2: Fair — MEP'],
  },
  {
    id: 'data-3',
    title: 'Data 3',
    statusTag: 'Fair',
    body: 'Expanded example from the reference UI. Duplicate this block in the array to add more accordion cards.',
    subItems: [
      'SubData 3: Fair — accessibility',
      'SubData 3: Fair — life safety',
      'SubData 3: Fair — IT readiness',
      'SubData 3: Fair — sustainability',
    ],
  },
  {
    id: 'data-4',
    title: 'Data 4',
    statusTag: 'Fair',
    body: 'Attach CSV-driven copy later by mapping section ids to derived metrics in `useSchoolDataset`.',
    subItems: ['SubData 4: Fair — funding window', 'SubData 4: Fair — phasing risk'],
  },
]
