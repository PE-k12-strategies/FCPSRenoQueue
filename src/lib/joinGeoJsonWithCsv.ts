import type { Feature, FeatureCollection, Point } from 'geojson'
import type { CsvRow, JoinedDataset, SchoolFeatureCollection } from '../types/data'

function featureId(f: Feature<Point>, geoJsonIdField: string): string {
  const fromProps = f.properties?.[geoJsonIdField]
  if (fromProps != null && String(fromProps).trim() !== '') {
    return String(fromProps).trim()
  }
  if (f.id != null) return String(f.id).trim()
  return ''
}

/**
 * Merges every CSV row that shares `csvIdField` onto the GeoJSON feature whose
 * `geoJsonIdField` matches. Duplicate column names from later tables overwrite earlier ones.
 */
export function joinGeoJsonWithCsv(
  collection: SchoolFeatureCollection,
  csvRows: CsvRow[],
  geoJsonIdField: string,
  csvIdField: string,
): JoinedDataset {
  const byCsvId = new Map<string, CsvRow>()
  for (const row of csvRows) {
    const id = row[csvIdField]?.trim()
    if (!id) continue
    const prev = byCsvId.get(id) ?? {}
    byCsvId.set(id, { ...prev, ...row })
  }

  /** Site fields that must stay from GeoJSON even when CSV has the same column name. */
  const geoPreferredKeys = ['Building SF'] as const

  const featureIds = new Set<string>()
  const features: Feature<Point>[] = collection.features.map((f) => {
    const id = featureId(f, geoJsonIdField)
    const merged = id ? byCsvId.get(id) : undefined
    if (id) featureIds.add(id)
    const geoProps =
      f.properties && typeof f.properties === 'object' ? f.properties : null
    const props: Record<string, unknown> = {
      ...(geoProps ?? {}),
      ...(merged ?? {}),
    }

    // Keep GeoJSON Building SF (and similar site attributes) for popup display.
    if (geoProps) {
      for (const key of geoPreferredKeys) {
        const geoValue = geoProps[key]
        if (geoValue != null && String(geoValue).trim() !== '') {
          props[key] = geoValue
        }
      }
    }

    return {
      ...f,
      properties: props,
    }
  })

  const unmatchedCsvIds = [...byCsvId.keys()].filter((id) => !featureIds.has(id))

  return {
    geojson: {
      type: 'FeatureCollection',
      features,
    } satisfies FeatureCollection<Point>,
    unmatchedCsvIds,
  }
}
