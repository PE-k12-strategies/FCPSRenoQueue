import type { ExpressionSpecification } from 'mapbox-gl'
import {
  capacityUtilizationColorExpression,
  capacityUtilizationColors,
  capacityUtilizationLegendItems,
  circleColorExpression,
  facilitySuitabilityColors,
  facilitySuitabilityLegendItems,
} from './legend'

/** Metrics that can drive map point coloring. */
export type MapMetricId = 'facilitySuitability' | 'capacityUtilization'

export type MapMetricLegendItem = {
  id: string
  label: string
  color: string
}

export type MapMetricDefinition = {
  id: MapMetricId
  label: string
  /** Mapbox paint expression for circle fill. */
  colorExpression: ExpressionSpecification
  legendItems: MapMetricLegendItem[]
}

export const mapMetrics: MapMetricDefinition[] = [
  {
    id: 'facilitySuitability',
    label: 'Facility Suitability',
    colorExpression: circleColorExpression,
    legendItems: facilitySuitabilityLegendItems.map(({ rating, label }) => ({
      id: rating,
      label,
      color: facilitySuitabilityColors[rating],
    })),
  },
  {
    id: 'capacityUtilization',
    label: 'Capacity Utilization',
    colorExpression: capacityUtilizationColorExpression,
    legendItems: capacityUtilizationLegendItems.map(({ rating, label }) => ({
      id: rating,
      label,
      color: capacityUtilizationColors[rating],
    })),
  },
]

export const defaultMapMetricId: MapMetricId = 'facilitySuitability'

export function getMapMetric(id: MapMetricId): MapMetricDefinition {
  return mapMetrics.find((m) => m.id === id) ?? mapMetrics[0]
}
