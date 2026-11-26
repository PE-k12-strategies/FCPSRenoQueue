/**
 * Join keys shared by GeoJSON feature properties and Supabase-mapped rows.
 * Attribute tables and GeoJSON files are loaded from the Supabase project.
 */
export const dataConfig = {
  /** Property on each GeoJSON feature used to match table rows (1:1). */
  geoJsonIdField: 'FCPS_School ID' as const,
  /** Column / property name used after Supabase row mapping. */
  csvIdField: 'FCPS_School ID' as const,
} as const
