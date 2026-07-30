import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { appConfig } from '../../config/appConfig'
import {
  defaultQueueMetricWeights,
  defaultQueueSubMetricWeights,
  type QueueMetricId,
  type QueueMetricWeights,
  type QueueSubMetricId,
  type QueueSubMetricWeights,
} from '../../config/queueMetrics'
import { summarizeFacilitySuitability } from '../../lib/districtOverview'
import type { FacilitySuitabilityRating } from '../../lib/facilitySuitability'
import {
  filterSchoolNameSuggestions,
  listSchoolNames,
  type SchoolNameSuggestion,
} from '../../lib/schoolNameSuggestions'
import type { SchoolFeatureCollection } from '../../types/data'
import type { SelectedSchool } from '../map/SchoolPopup'
import footerBrandLogo from '../../assets/branding/perkins-eastman-logo.png'
import { DistrictOverview } from './DistrictOverview'
import { MetricWeightsTable } from './MetricWeightsTable'
import { SchoolBrowseList } from './SchoolBrowseList'
import './Sidebar.css'

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectSchool: (school: SelectedSchool) => void
  schoolData: SchoolFeatureCollection | null
  suitabilityFilter: FacilitySuitabilityRating | null
  onSuitabilityFilterChange: (
    rating: FacilitySuitabilityRating | null,
  ) => void
}

export function Sidebar({
  searchQuery,
  onSearchChange,
  onSelectSchool,
  schoolData,
  suitabilityFilter,
  onSuitabilityFilterChange,
}: Props) {
  const [weights, setWeights] = useState<QueueMetricWeights>(
    defaultQueueMetricWeights,
  )
  const [subWeights, setSubWeights] = useState<QueueSubMetricWeights>(
    defaultQueueSubMetricWeights,
  )
  const [listOpen, setListOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchWrapRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const allSchools = useMemo(() => listSchoolNames(schoolData), [schoolData])
  const suggestions = useMemo(
    () => filterSchoolNameSuggestions(allSchools, searchQuery),
    [allSchools, searchQuery],
  )
  const showSuggestions = listOpen && suggestions.length > 0

  const suitability = useMemo(
    () => summarizeFacilitySuitability(schoolData),
    [schoolData],
  )

  const resultsStatus =
    searchQuery.trim().length === 0
      ? ''
      : suggestions.length === 0
        ? 'No matching school names.'
        : `${suggestions.length} school suggestion${suggestions.length === 1 ? '' : 's'} available.`

  useEffect(() => {
    setActiveIndex(-1)
  }, [searchQuery])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node)) {
        setListOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const pickSuggestion = (suggestion: SchoolNameSuggestion) => {
    onSelectSchool({
      id: suggestion.id,
      properties: suggestion.properties,
    })
    setListOpen(false)
    setActiveIndex(-1)
  }

  const onWeightChange = (id: QueueMetricId, value: number) => {
    setWeights((prev) => ({ ...prev, [id]: value }))
  }

  const onSubChange = (
    parent: 'facilitiesCondition' | 'facilitiesSuitability',
    id: QueueSubMetricId,
    value: number,
  ) => {
    setSubWeights((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [id]: value,
      },
    }))
  }

  return (
    <aside className="sidebar" aria-label="Project criteria">
      <div className="sidebar-inner">
        <header className="sidebar-header">
          <div className="sidebar-header-top">
            <img
              className="sidebar-logo"
              src={appConfig.logoUrl}
              alt={appConfig.logoAlt}
              decoding="async"
            />
            <div className="sidebar-title-wrap">
              <h1 className="sidebar-title">{appConfig.title}</h1>
            </div>
          </div>
          <p className="sidebar-intro">{appConfig.intro}</p>
        </header>

        <div className="sidebar-search-label" ref={searchWrapRef}>
          <label htmlFor="sidebar-school-search">
            <span className="visually-hidden">
              Search schools by name, address, or notes
            </span>
          </label>
          <div className="sidebar-search-wrap">
            <svg
              className="sidebar-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.2-4.2" />
            </svg>
            <input
              id="sidebar-school-search"
              className="sidebar-search"
              type="search"
              placeholder="Search schools, address, notes…"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value)
                setListOpen(true)
              }}
              onFocus={() => setListOpen(true)}
              onKeyDown={(e) => {
                if (!showSuggestions && e.key !== 'Escape') {
                  if (e.key === 'ArrowDown' && suggestions.length > 0) {
                    e.preventDefault()
                    setListOpen(true)
                    setActiveIndex(0)
                  }
                  return
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setListOpen(true)
                  setActiveIndex((i) =>
                    Math.min(i + 1, suggestions.length - 1),
                  )
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.max(i - 1, 0))
                } else if (e.key === 'Enter' && activeIndex >= 0) {
                  e.preventDefault()
                  pickSuggestion(suggestions[activeIndex])
                } else if (e.key === 'Escape') {
                  setListOpen(false)
                  setActiveIndex(-1)
                }
              }}
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls={listboxId}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
            />
            {showSuggestions ? (
              <ul
                id={listboxId}
                className="sidebar-search-suggestions"
                role="listbox"
                aria-label="Matching school names"
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={
                      index === activeIndex
                        ? 'sidebar-search-suggestion is-active'
                        : 'sidebar-search-suggestion'
                    }
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      pickSuggestion(suggestion)
                    }}
                  >
                    <span className="sidebar-search-suggestion-name">
                      {suggestion.name}
                    </span>
                    {suggestion.schoolType ? (
                      <span className="sidebar-search-suggestion-meta">
                        {suggestion.schoolType}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="visually-hidden" role="status" aria-live="polite">
            {listOpen ? resultsStatus : ''}
          </div>
        </div>

        <SchoolBrowseList
          schoolData={schoolData}
          searchQuery={searchQuery}
          onSelectSchool={onSelectSchool}
        />

        <div className="sidebar-body">
          <h2 className="sidebar-section-title" id="queue-metric-title">
            Renovation Queue Metric
          </h2>
          <p className="sidebar-section-copy">
            Adjust how each metric contributes to the renovation queue. Expand a
            metric to set its submetric weights.
          </p>
          <MetricWeightsTable
            weights={weights}
            subWeights={subWeights}
            onChange={onWeightChange}
            onSubChange={onSubChange}
          />

          <DistrictOverview
            suitability={suitability}
            selectedRating={suitabilityFilter}
            onSelectRating={onSuitabilityFilterChange}
          />
        </div>

        <footer className="sidebar-footer">
          <img
            className="sidebar-footer-logo"
            src={footerBrandLogo}
            alt={appConfig.footerLogoAlt}
            decoding="async"
          />
        </footer>
      </div>
    </aside>
  )
}
