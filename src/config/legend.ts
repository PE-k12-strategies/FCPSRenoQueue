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

/** Shared palette for priority labels and Good–Deficient bands. */
const scoreBandColors = {
  lowest: '#15803d',
  low: '#65a30d',
  medium: '#eab308',
  high: '#f97316',
  highest: '#e11d48',
} as const

export type SuitabilityColorKey =
  | FacilitySuitabilityRating
  | FacilitySuitabilityBand

export const facilitySuitabilityColors: Record<SuitabilityColorKey, string> = {
  'Lowest Priority': scoreBandColors.lowest,
  'Low Priority': scoreBandColors.low,
  'Medium Priority': scoreBandColors.medium,
  'High Priority': scoreBandColors.high,
  'Highest Priority': scoreBandColors.highest,
  Good: scoreBandColors.low,
  Fair: scoreBandColors.medium,
  Poor: scoreBandColors.high,
  Deficient: scoreBandColors.highest,
}

export const facilitySuitabilityLegendItems: {
  rating: FacilitySuitabilityRating
  label: string
}[] = [
  { rating: 'Lowest Priority', label: 'Lowest Priority' },
  { rating: 'Low Priority', label: 'Low Priority' },
  { rating: 'Medium Priority', label: 'Medium Priority' },
  { rating: 'High Priority', label: 'High Priority' },
  { rating: 'Highest Priority', label: 'Highest Priority' },
]

/** Mapbox expression for circle fill color from Facility Suitability. */
export const circleColorExpression: ExpressionSpecification = [
  'match',
  ['get', facilitySuitabilityProperty],
  'Lowest Priority',
  facilitySuitabilityColors['Lowest Priority'],
  'Low Priority',
  facilitySuitabilityColors['Low Priority'],
  'Medium Priority',
  facilitySuitabilityColors['Medium Priority'],
  'High Priority',
  facilitySuitabilityColors['High Priority'],
  'Highest Priority',
  facilitySuitabilityColors['Highest Priority'],
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
