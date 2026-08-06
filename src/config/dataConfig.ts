/**
 * Central place to wire your real files. Every CSV must share the same id column.
 * GeoJSON features should expose that id on `properties` (see `geoJsonIdField`).
 */
export const dataConfig = {
  /** Property on each GeoJSON feature used to match CSV rows (1:1). */
  geoJsonIdField: 'FCPS_School ID' as const,
  /** Column name that appears in every CSV file. */
  csvIdField: 'FCPS_School ID' as const,

  geojsonUrl: '/data/FCPS_Sites.geojson',

  /** Load any number of CSVs; they are merged per id (later files overwrite duplicate column names). */
  csvSources: [
    {
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRoJ6plKFDrlLPEzBFzY32k2YokTNMhzq1DU6hVJHx5VC37LRQlHtyx3xX4YKwsHTsBt0wz25Srnrqp/pub?gid=1730185827&single=true&output=csv',
      key: 'fsData',
    },
  ] as const,
} as const
