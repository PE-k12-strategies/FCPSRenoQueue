import type { SchoolFeatureCollection } from '../types/data'

export type SchoolNameSuggestion = {
  id: string
  name: string
  schoolType?: string
  properties: Record<string, unknown>
}

function schoolName(props: Record<string, unknown>): string | undefined {
  const school = props.School
  if (school != null && String(school).trim()) return String(school).trim()
  const nces = props['NCES School Name']
  if (nces != null && String(nces).trim()) return String(nces).trim()
  return undefined
}

/** Unique school names from loaded GeoJSON, sorted alphabetically. */
export function listSchoolNames(
  data: SchoolFeatureCollection | null,
): SchoolNameSuggestion[] {
  if (!data) return []

  const byId = new Map<string, SchoolNameSuggestion>()
  for (const feature of data.features) {
    const props = (feature.properties ?? {}) as Record<string, unknown>
    const name = schoolName(props)
    if (!name) continue
    const id = props['FCPS_School ID']
    if (id == null) continue
    const key = String(id)
    if (byId.has(key)) continue
    const schoolType = props['School Type']
    byId.set(key, {
      id: key,
      name,
      schoolType:
        schoolType != null && String(schoolType).trim()
          ? String(schoolType).trim()
          : undefined,
      properties: props,
    })
  }

  return [...byId.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  )
}

/** Case-insensitive name match; exact query match is excluded from the list. */
export function filterSchoolNameSuggestions(
  schools: SchoolNameSuggestion[],
  query: string,
  limit = 8,
): SchoolNameSuggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const matches = schools.filter((s) => s.name.toLowerCase().includes(q))
  const exact = matches.find((s) => s.name.toLowerCase() === q)
  const rest = matches.filter((s) => s !== exact)
  return rest.slice(0, limit)
}
