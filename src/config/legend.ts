import type { ExpressionSpecification } from 'mapbox-gl'
import {
  capacityUtilizationProperty,
  type CapacityUtilizationRating,
} from '../lib/capacityUtilization'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityBand,
  type FacilitySuitabilityRating,
} from '../lib/facilitySuitability'

export type {
  CapacityUtilizationRating,
  FacilitySuitabilityBand,
  FacilitySuitabilityRating,
}

/** Shared palette: priority labels and Good–Deficient bands use the same colors. */
const scoreBandColors = {
  high: '#65a30d',
  midHigh: '#eab308',
  mid: '#f97316',
  low: '#e11d48',
} as const

export type SuitabilityColorKey =
  | FacilitySuitabilityRating
  | FacilitySuitabilityBand

export const facilitySuitabilityColors: Record<SuitabilityColorKey, string> = {
  'Low Priority': scoreBandColors.high,
  'Medium High Priority': scoreBandColors.midHigh,
  'High Priority': scoreBandColors.mid,
  'Critical Priority': scoreBandColors.low,
  Good: scoreBandColors.high,
  Fair: scoreBandColors.midHigh,
  Poor: scoreBandColors.mid,
  Deficient: scoreBandColors.low,
}

export const facilitySuitabilityLegendItems: {
  rating: FacilitySuitabilityRating
  label: string
}[] = [
  { rating: 'Low Priority', label: 'Low Priority' },
  { rating: 'Medium High Priority', label: 'Medium High Priority' },
  { rating: 'High Priority', label: 'High Priority' },
  { rating: 'Critical Priority', label: 'Critical Priority' },
]

/** Mapbox expression for circle fill color from Facility Suitability. */
export const circleColorExpression: ExpressionSpecification = [
  'match',
  ['get', facilitySuitabilityProperty],
  'Low Priority',
  facilitySuitabilityColors['Low Priority'],
  'Medium High Priority',
  facilitySuitabilityColors['Medium High Priority'],
  'High Priority',
  facilitySuitabilityColors['High Priority'],
  'Critical Priority',
  facilitySuitabilityColors['Critical Priority'],
  '#94a3b8',
]

export const capacityUtilizationColors: Record<
  CapacityUtilizationRating,
  string
> = {
  Overutilized: '#e11d48',
  'Optimally Utilized': '#65a30d',
  'Fairly Utilized': '#eab308',
  'Under Utilized': '#3b82f6',
}

export const capacityUtilizationLegendItems: {
  rating: CapacityUtilizationRating
  label: string
}[] = [
  { rating: 'Overutilized', label: 'Overutilized' },
  { rating: 'Optimally Utilized', label: 'Optimally Utilized' },
  { rating: 'Fairly Utilized', label: 'Fairly Utilized' },
  { rating: 'Under Utilized', label: 'Under Utilized' },
]

/** Mapbox expression for circle fill from program capacity utilization. */
export const capacityUtilizationColorExpression: ExpressionSpecification = [
  'match',
  ['get', capacityUtilizationProperty],
  'Overutilized',
  capacityUtilizationColors.Overutilized,
  'Optimally Utilized',
  capacityUtilizationColors['Optimally Utilized'],
  'Fairly Utilized',
  capacityUtilizationColors['Fairly Utilized'],
  'Under Utilized',
  capacityUtilizationColors['Under Utilized'],
  '#94a3b8',
]
