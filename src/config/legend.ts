import type { ExpressionSpecification } from 'mapbox-gl'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityRating,
} from '../lib/facilitySuitability'

export type { FacilitySuitabilityRating }

export const facilitySuitabilityColors: Record<
  FacilitySuitabilityRating,
  string
> = {
  Excellent: '#15803d',
  Good: '#65a30d',
  Fair: '#eab308',
  Poor: '#f97316',
  Deficient: '#e11d48',
}

export const facilitySuitabilityLegendItems: {
  rating: FacilitySuitabilityRating
  label: string
}[] = [
  { rating: 'Excellent', label: 'Excellent' },
  { rating: 'Good', label: 'Good' },
  { rating: 'Fair', label: 'Fair' },
  { rating: 'Poor', label: 'Poor' },
  { rating: 'Deficient', label: 'Deficient' },
]

/** Mapbox expression for circle fill color from Facility Suitability. */
export const circleColorExpression: ExpressionSpecification = [
  'match',
  ['get', facilitySuitabilityProperty],
  'Excellent',
  facilitySuitabilityColors.Excellent,
  'Good',
  facilitySuitabilityColors.Good,
  'Fair',
  facilitySuitabilityColors.Fair,
  'Poor',
  facilitySuitabilityColors.Poor,
  'Deficient',
  facilitySuitabilityColors.Deficient,
  '#94a3b8',
]
