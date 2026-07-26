import type { ExpressionSpecification } from 'mapbox-gl'

/** Map paint uses `queue_tier` on merged feature properties (from CSV). */
export const queueTierProperty = 'queue_tier' as const

export type QueueTier = 'High' | 'Medium' | 'Fair' | 'Low'

export const queueTierColors: Record<QueueTier, string> = {
  High: '#e11d48',
  Medium: '#f97316',
  Fair: '#8b5cf6',
  Low: '#0ea5e9',
}

export const queueLegendItems: { tier: QueueTier; label: string }[] = [
  { tier: 'High', label: 'High priority' },
  { tier: 'Medium', label: 'Medium priority' },
  { tier: 'Fair', label: 'Fair' },
  { tier: 'Low', label: 'Low priority' },
]

/** Mapbox expression for circle fill color from `queue_tier`. */
export const circleColorExpression: ExpressionSpecification = [
  'match',
  ['get', queueTierProperty],
  'High',
  queueTierColors.High,
  'Medium',
  queueTierColors.Medium,
  'Fair',
  queueTierColors.Fair,
  'Low',
  queueTierColors.Low,
  '#94a3b8',
]
