import type { FeatureCollection, Point } from 'geojson'

/** One CSV row: header keys → cell values (all strings after parsing). */
export type CsvRow = Record<string, string>

/** GeoJSON points only — swap the configured GeoJSON file without changing app code. */
export type SchoolFeatureCollection = FeatureCollection<Point>

export type JoinedDataset = {
  /** GeoJSON with CSV columns merged into each feature’s `properties`. */
  geojson: SchoolFeatureCollection
  /** Rows that did not match any feature (helpful when cleaning data). */
  unmatchedCsvIds: string[]
}
