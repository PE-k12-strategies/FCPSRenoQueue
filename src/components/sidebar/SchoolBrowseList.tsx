import { useMemo, useState } from 'react'
import {
  filterSchoolNameSuggestions,
  listSchoolNames,
  type SchoolNameSuggestion,
} from '../../lib/schoolNameSuggestions'
import type { SchoolFeatureCollection } from '../../types/data'
import type { SelectedSchool } from '../map/SchoolPopup'
import './SchoolBrowseList.css'

type Props = {
  schoolData: SchoolFeatureCollection | null
  searchQuery: string
  onSelectSchool: (school: SelectedSchool) => void
}

export function SchoolBrowseList({
  schoolData,
  searchQuery,
  onSelectSchool,
}: Props) {
  const [open, setOpen] = useState(false)
  const schools = useMemo(() => listSchoolNames(schoolData), [schoolData])

  const visible = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return schools
    const matches = filterSchoolNameSuggestions(schools, q, 50)
    const exact = schools.find(
      (s) => s.name.toLowerCase() === q.toLowerCase(),
    )
    if (exact && !matches.some((m) => m.id === exact.id)) {
      return [exact, ...matches]
    }
    return matches.length > 0 ? matches : schools
  }, [schools, searchQuery])

  const pick = (suggestion: SchoolNameSuggestion) => {
    onSelectSchool({
      id: suggestion.id,
      properties: suggestion.properties,
    })
  }

  if (schools.length === 0) return null

  return (
    <details
      className="school-browse"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="school-browse-summary">
        Browse schools
        <span className="school-browse-count">
          {visible.length} of {schools.length}
        </span>
      </summary>
      <p className="school-browse-help" id="school-browse-help">
        Keyboard alternative to selecting a school on the map.
      </p>
      <ul
        className="school-browse-list"
        aria-describedby="school-browse-help"
      >
        {visible.map((school) => (
          <li key={school.id}>
            <button
              type="button"
              className="school-browse-item"
              onClick={() => pick(school)}
            >
              <span className="school-browse-name">{school.name}</span>
              {school.schoolType ? (
                <span className="school-browse-meta">{school.schoolType}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}
