/**
 * Hierarchical Facility Suitability metrics for School View.
 * Field keys match `FCPS_FS_Data.csv` columns; values are shown as categories
 * using the same breakpoints as overall Facility Suitability.
 */
export type SuitabilityMetricNode = {
  id: string
  label: string
  /** CSV / joined property key. */
  field: string
  /** Short helper text shown under the metric name. */
  description: string
  children?: SuitabilityMetricNode[]
}

export const facilitySuitabilityTree: SuitabilityMetricNode = {
  id: 'facility-suitability',
  label: 'Facility Suitability',
  field: 'FS_Score',
  description:
    'Overall suitability of the school facility for educational programs.',
  children: [
    {
      id: 'design-features',
      label: 'Design Features',
      field: 'DF_Score',
      description:
        'How well classroom and shared spaces support teaching and learning.',
      children: [
        {
          id: 'classroom',
          label: 'Classroom',
          field: 'Overall Classroom Score',
          description: 'Quality and adequacy of classroom learning environments.',
        },
        {
          id: 'presence',
          label: 'Presence',
          field: 'Presence Weighted',
          description: 'Visibility, arrival experience, and school identity.',
        },
        {
          id: 'assembly',
          label: 'Assembly',
          field: 'Assembly Score Weighted',
          description: 'Capacity and quality of gathering / assembly spaces.',
        },
        {
          id: 'extended-learning',
          label: 'Extended Learning',
          field: 'Extended Learning Score Weighted',
          description: 'Spaces that support learning beyond the classroom.',
        },
        {
          id: 'environmental-scores',
          label: 'Environmental Scores',
          field: 'Community Score Weighted',
          description:
            'Community and environmental quality factors tied to design features.',
        },
      ],
    },
    {
      id: 'program-adjacency',
      label: 'Program Adjacency',
      field: 'PA_Score',
      description:
        'How effectively related program areas are located near each other.',
      children: [
        {
          id: 'student-support',
          label: 'Student Support',
          field: 'Student Support Score',
          description: 'Access and adjacency of student support services.',
        },
        {
          id: 'curriculum-support',
          label: 'Curriculum Support',
          field: 'Curriculum Support',
          description: 'Adjacency of spaces that support curriculum delivery.',
        },
      ],
    },
    {
      id: 'space-sufficiency',
      label: 'Space Sufficiency',
      field: 'SS_Score',
      description: 'Whether available space meets program needs by area type.',
      children: [
        {
          id: 'overall-building',
          label: 'Overall Building',
          // CSV score kept as `Building SF Score` when GeoJSON owns `Building SF`.
          field: 'Building SF Score',
          description: 'Overall building area sufficiency relative to need.',
        },
        {
          id: 'administration',
          label: 'Administration',
          field: 'Admin',
          description: 'Administrative space sufficiency.',
        },
        {
          id: 'ss-classroom',
          label: 'Classroom',
          field: 'Avg Class SF',
          description: 'Typical classroom size sufficiency.',
        },
        {
          id: 'gymnasium',
          label: 'Gymnasium',
          field: 'Gym',
          description: 'Gymnasium / physical education space sufficiency.',
        },
        {
          id: 'support-spaces',
          label: 'Support Spaces',
          field: 'Support',
          description: 'Core support space sufficiency.',
        },
        {
          id: 'supplemental-spaces',
          label: 'Supplemental Spaces',
          field: 'Suppl',
          description: 'Supplemental program space sufficiency.',
        },
      ],
    },
  ],
}
