/** Top-level weighted metrics that drive the renovation queue score. */
export type QueueMetricId =
  | 'campusAge'
  | 'facilitiesCondition'
  | 'facilitiesSuitability'
  | 'energyUse'

export type FacilitiesConditionSubId =
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'hvac'

export type FacilitiesSuitabilitySubId =
  | 'designFeatures'
  | 'spaceSufficiency'
  | 'programAdjacency'

export type QueueSubMetricId =
  | FacilitiesConditionSubId
  | FacilitiesSuitabilitySubId

export type QueueMetricWeights = Record<QueueMetricId, number>
export type FacilitiesConditionWeights = Record<FacilitiesConditionSubId, number>
export type FacilitiesSuitabilityWeights = Record<
  FacilitiesSuitabilitySubId,
  number
>

export type QueueSubMetricWeights = {
  facilitiesCondition: FacilitiesConditionWeights
  facilitiesSuitability: FacilitiesSuitabilityWeights
}

export type QueueSubMetricRow = {
  id: QueueSubMetricId
  label: string
  description: string
}

export type QueueMetricRow = {
  id: QueueMetricId
  label: string
  description: string
  subMetrics?: QueueSubMetricRow[]
}

export const queueMetricRows: QueueMetricRow[] = [
  {
    id: 'campusAge',
    label: 'Campus Age',
    description:
      'How old the campus and its major buildings are, relative to expected service life.',
  },
  {
    id: 'facilitiesCondition',
    label: 'Facilities Condition',
    description:
      'Physical condition of major building systems that affect reliability and maintenance need.',
    subMetrics: [
      {
        id: 'mechanical',
        label: 'Mechanical',
        description: 'Condition of mechanical systems beyond dedicated HVAC equipment.',
      },
      {
        id: 'electrical',
        label: 'Electrical',
        description: 'Condition of electrical distribution, panels, and related infrastructure.',
      },
      {
        id: 'plumbing',
        label: 'Plumbing',
        description: 'Condition of plumbing systems that support school operations.',
      },
      {
        id: 'hvac',
        label: 'HVAC',
        description: 'Condition of heating, ventilation, and air-conditioning systems.',
      },
    ],
  },
  {
    id: 'facilitiesSuitability',
    label: 'Facilities Suitability',
    description:
      'How well the facility supports educational programs through design, space, and adjacency.',
    subMetrics: [
      {
        id: 'designFeatures',
        label: 'Design Features',
        description:
          'How well classroom and shared spaces support teaching and learning.',
      },
      {
        id: 'spaceSufficiency',
        label: 'Space Sufficiency',
        description: 'Whether available space meets program needs by area type.',
      },
      {
        id: 'programAdjacency',
        label: 'Program Adjacency',
        description:
          'How effectively related program areas are located near each other.',
      },
    ],
  },
  {
    id: 'energyUse',
    label: 'Energy Use',
    description:
      'How efficiently the campus uses energy relative to peer facilities and performance targets.',
  },
]

/** Equal starting weights (sum = 100). */
export const defaultQueueMetricWeights: QueueMetricWeights = {
  campusAge: 25,
  facilitiesCondition: 25,
  facilitiesSuitability: 25,
  energyUse: 25,
}

export const defaultQueueSubMetricWeights: QueueSubMetricWeights = {
  facilitiesCondition: {
    mechanical: 25,
    electrical: 25,
    plumbing: 25,
    hvac: 25,
  },
  facilitiesSuitability: {
    designFeatures: 34,
    spaceSufficiency: 33,
    programAdjacency: 33,
  },
}
