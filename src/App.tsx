import { useCallback, useMemo, useState } from 'react'
import { PasswordGate } from './components/auth/PasswordGate'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { SchoolMap } from './components/map/SchoolMap'
import type { SelectedSchool } from './components/map/SchoolPopup'
import { Sidebar } from './components/sidebar/Sidebar'
import { useSchoolDataset } from './hooks/useSchoolDataset'
import {
  facilitySuitabilityProperty,
  type FacilitySuitabilityRating,
} from './lib/facilitySuitability'

function schoolDisplayName(school: SelectedSchool): string {
  const name =
    school.properties.School ?? school.properties['NCES School Name']
  return name == null ? 'Selected school' : String(name)
}

function queryMatchesSelected(query: string, school: SelectedSchool): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return false
  return schoolDisplayName(school).toLowerCase().includes(q)
}

function AppContent() {
  const dataset = useSchoolDataset()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<SelectedSchool | null>(
    null,
  )
  const [suitabilityFilter, setSuitabilityFilter] =
    useState<FacilitySuitabilityRating | null>(null)

  const geojson = dataset.status === 'ready' ? dataset.data.geojson : null

  const selectSchool = useCallback((school: SelectedSchool | null) => {
    setSelectedSchool(school)
    setSearchQuery(school ? schoolDisplayName(school) : '')
  }, [])

  const statusMessage = useMemo(() => {
    if (dataset.status === 'idle' || dataset.status === 'loading') {
      return 'Loading school site data…'
    }
    if (dataset.status === 'error') return `Data error. ${dataset.message}`
    if (selectedSchool) {
      return `Selected school: ${schoolDisplayName(selectedSchool)}`
    }
    if (suitabilityFilter) {
      return `Highlighting ${suitabilityFilter} facility suitability on the map.`
    }
    if (dataset.status === 'ready') {
      return `Loaded ${dataset.data.geojson.features.length} school sites.`
    }
    return 'Loading school site data…'
  }, [dataset, selectedSchool, suitabilityFilter])

  const onSearchChange = (q: string) => {
    setSearchQuery(q)
    setSelectedSchool((prev) => {
      if (!prev) return null
      return queryMatchesSelected(q, prev) ? prev : null
    })
  }

  const onSuitabilityFilterChange = (
    rating: FacilitySuitabilityRating | null,
  ) => {
    setSuitabilityFilter(rating)
    if (
      selectedSchool &&
      rating &&
      selectedSchool.properties[facilitySuitabilityProperty] !== rating
    ) {
      selectSchool(null)
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="visually-hidden" role="status" aria-live="polite">
        {statusMessage}
      </div>
      <DashboardLayout
        sidebar={
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedSchool={selectedSchool}
            onSelectSchool={selectSchool}
            schoolData={geojson}
            suitabilityFilter={suitabilityFilter}
            onSuitabilityFilterChange={onSuitabilityFilterChange}
          />
        }
        map={
          <>
            {dataset.status === 'error' ? (
              <div className="app-error-banner" role="alert">
                <strong>Data error.</strong> {dataset.message}
              </div>
            ) : null}
            <SchoolMap
              data={geojson}
              searchQuery={searchQuery}
              suitabilityFilter={suitabilityFilter}
              selectedSchool={selectedSchool}
              onSelectSchool={selectSchool}
            />
          </>
        }
      />
    </>
  )
}

function App() {
  return (
    <PasswordGate>
      <AppContent />
    </PasswordGate>
  )
}

export default App
