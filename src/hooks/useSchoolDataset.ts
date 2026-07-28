import { useEffect, useMemo, useState } from 'react'
import { dataConfig } from '../config/dataConfig'
import { fetchText } from '../lib/fetchText'
import { joinGeoJsonWithCsv } from '../lib/joinGeoJsonWithCsv'
import { parseCsv } from '../lib/parseCsv'
import type { CsvRow, JoinedDataset, SchoolFeatureCollection } from '../types/data'

type LoadState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; data: JoinedDataset }
  | { status: 'error'; message: string }

function parseGeoJson(raw: string): SchoolFeatureCollection {
  const data = JSON.parse(raw) as unknown
  if (
    !data ||
    typeof data !== 'object' ||
    (data as SchoolFeatureCollection).type !== 'FeatureCollection' ||
    !Array.isArray((data as SchoolFeatureCollection).features)
  ) {
    throw new Error('GeoJSON must be a FeatureCollection')
  }
  return data as SchoolFeatureCollection
}

/** Loads GeoJSON + all configured CSVs, merges rows by id, returns enriched GeoJSON for the map. */
export function useSchoolDataset(): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'idle' })

  const deps = useMemo(
    () =>
      [
        dataConfig.geojsonUrl,
        ...dataConfig.csvSources.map((s) => s.url),
      ].join('|'),
    [],
  )

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    async function run() {
      try {
        const geoRaw = await fetchText(dataConfig.geojsonUrl)
        const collection = parseGeoJson(geoRaw)

        const mergedRows: CsvRow[] = []
        for (const src of dataConfig.csvSources) {
          const csvRaw = await fetchText(src.url)
          mergedRows.push(...parseCsv(csvRaw))
        }

        const joined = joinGeoJsonWithCsv(
          collection,
          mergedRows,
          dataConfig.geoJsonIdField,
          dataConfig.csvIdField,
        )

        if (!cancelled) {
          setState({ status: 'ready', data: joined })
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: e instanceof Error ? e.message : 'Unknown load error',
          })
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [deps])

  return state
}
