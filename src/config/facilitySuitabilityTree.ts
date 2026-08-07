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
        'How the amenities and design of spaces in a school support teaching and learning.',
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
          description:
            'Quality and adequacy of gathering and assembly spaces like cafeterias or gymnasiums.',
        },
        {
          id: 'extended-learning',
          label: 'Extended Learning',
          field: 'Extended Learning Score Weighted',
          description:
            'Quality and adequacy of spaces used for instruction beyond the classroom.',
        },
        {
          id: 'community',
          label: 'Community',
          // Column G in the published FS CSV.
          field: 'Community Score Weighted',
          description:
            'How well spaces in the school support a sense of community and create a safe secure environment.',
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
          description:
            'Adjacency of spaces used by students and staff throughout the school day for non-classroom activities — such as the cafeteria, gymnasium, and wellness or counseling spaces — ensuring these shared spaces are easily and safely accessible during transitions, meals, and breaks.',
        },
        {
          id: 'curriculum-support',
          label: 'Curriculum Support',
          field: 'Curriculum Support',
          description:
            'Adjacency of spaces used for direct instruction and the spaces that support it — such as classrooms, labs, resource rooms, so that teaching and its supporting functions are located close enough to work together efficiently.',
        },
      ],
    },
    {
      id: 'space-sufficiency',
      label: 'Space Sufficiency',
      field: 'SS_Score',
      description:
        'Whether a school has sufficient space to support the students and staff.',
      children: [
        {
          id: 'overall-building',
          label: 'Overall Building',
          // CSV score kept as `Building SF Score` when GeoJSON owns `Building SF`.
          field: 'Building SF Score',
          description: 'Overall size of the school building.',
        },
        {
          id: 'administration',
          label: 'Administration',
          field: 'Admin',
          description:
            'Includes spaces like the main office, teachers work room, health space.',
        },
        {
          id: 'ss-classroom',
          label: 'Classroom',
          field: 'Avg Class SF',
          description: 'Typical size of classroom.',
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
          description:
            'Includes spaces like cafeterias, library, school aged child care.',
        },
        {
          id: 'supplemental-spaces',
          label: 'Supplemental Spaces',
          field: 'Suppl',
          description:
            'Includes spaces like science labs, music rooms, art room.',
        },
      ],
    },
  ],
}
