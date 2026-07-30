import { useEffect, useMemo, useRef, useState } from 'react'
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
  selectedSchoolId: string | null
  onSelectSchool: (school: SelectedSchool | null) => void
}

export function SchoolBrowseList({
  schoolData,
  searchQuery,
  selectedSchoolId,
  onSelectSchool,
}: Props) {
  const [open, setOpen] = useState(false)
  const selectedRef = useRef<HTMLButtonElement | null>(null)
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

  useEffect(() => {
    if (!selectedSchoolId || !open) return
    selectedRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedSchoolId, open, visible])

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
        Select a school here, from search, or on the map.
      </p>
      <ul
        className="school-browse-list"
        aria-describedby="school-browse-help"
      >
        {visible.map((school) => {
          const isSelected = school.id === selectedSchoolId
          return (
            <li key={school.id}>
              <button
                type="button"
                ref={isSelected ? selectedRef : undefined}
                className={
                  isSelected
                    ? 'school-browse-item is-selected'
                    : 'school-browse-item'
                }
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => pick(school)}
              >
                <span className="school-browse-name">{school.name}</span>
                {school.schoolType ? (
                  <span className="school-browse-meta">{school.schoolType}</span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
