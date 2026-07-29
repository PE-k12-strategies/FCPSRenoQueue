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

export type QueueMetricRow = {
  id: QueueMetricId
  label: string
  subMetrics?: { id: QueueSubMetricId; label: string }[]
}

export const queueMetricRows: QueueMetricRow[] = [
  { id: 'campusAge', label: 'Campus Age' },
  {
    id: 'facilitiesCondition',
    label: 'Facilities Condition',
    subMetrics: [
      { id: 'mechanical', label: 'Mechanical' },
      { id: 'electrical', label: 'Electrical' },
      { id: 'plumbing', label: 'Plumbing' },
      { id: 'hvac', label: 'HVAC' },
    ],
  },
  {
    id: 'facilitiesSuitability',
    label: 'Facilities Suitability',
    subMetrics: [
      { id: 'designFeatures', label: 'Design Features' },
      { id: 'spaceSufficiency', label: 'Space Sufficiency' },
      { id: 'programAdjacency', label: 'Program Adjacency' },
    ],
  },
  { id: 'energyUse', label: 'Energy Use' },
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
