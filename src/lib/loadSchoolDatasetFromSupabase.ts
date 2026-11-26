import { dataConfig } from '../config/dataConfig'
import type { JoinedDataset, SchoolFeatureCollection } from '../types/data'
import { assignCapacityUtilization } from './capacityUtilization'
import { assignFacilitySuitability } from './facilitySuitability'
import { joinGeoJsonWithCsv } from './joinGeoJsonWithCsv'
import {
  mapCapacityRows,
  mapFacilityListRows,
  mapFacilitySuitabilityRows,
} from './mapSupabaseRows'
import {
  getSupabase,
  publicStorageUrl,
  supabaseStorage,
} from './supabaseClient'

async function fetchAllRows(
  table: string,
): Promise<Record<string, unknown>[]> {
  const supabase = getSupabase()
  const pageSize = 1000
  const rows: Record<string, unknown>[] = []
  let from = 0

  for (;;) {
    const to = from + pageSize - 1
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, to)
    if (error) {
      throw new Error(`${table}: ${error.message}`)
    }
    const batch = (data ?? []) as Record<string, unknown>[]
    rows.push(...batch)
    if (batch.length < pageSize) break
    from += pageSize
  }

  return rows
}

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

/** Loads sites GeoJSON + Supabase tables, joins by school id, assigns derived ratings. */
export async function loadSchoolDatasetFromSupabase(): Promise<JoinedDataset> {
  const sitesUrl = publicStorageUrl(supabaseStorage.sitesObject)
  const geoRes = await fetch(sitesUrl)
  if (!geoRes.ok) {
    throw new Error(
      `Failed to load sites GeoJSON from Supabase Storage (${geoRes.status})`,
    )
  }
  const collection = parseGeoJson(await geoRes.text())

  const [facilityList, facilitySuitability, capacity] = await Promise.all([
    fetchAllRows('Facility_List'),
    fetchAllRows('Facility_Suitability'),
    fetchAllRows('CIP_Capacity'),
  ])

  const mergedRows = [
    ...mapFacilityListRows(facilityList),
    ...mapFacilitySuitabilityRows(facilitySuitability),
    ...mapCapacityRows(capacity),
  ]

  const joined = joinGeoJsonWithCsv(
    collection,
    mergedRows,
    dataConfig.geoJsonIdField,
    dataConfig.csvIdField,
  )

  return {
    ...joined,
    geojson: assignCapacityUtilization(
      assignFacilitySuitability(joined.geojson),
    ),
  }
}

export function schoolRegionsGeoJsonUrl(): string {
  return publicStorageUrl(supabaseStorage.regionsObject)
}
