import { useMemo, useState } from 'react'
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

function App() {
  const dataset = useSchoolDataset()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<SelectedSchool | null>(
    null,
  )
  const [suitabilityFilter, setSuitabilityFilter] =
    useState<FacilitySuitabilityRating | null>(null)

  const geojson = dataset.status === 'ready' ? dataset.data.geojson : null

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
    return `Loaded ${dataset.data.geojson.features.length} school sites.`
  }, [dataset, selectedSchool, suitabilityFilter])

  const onSearchChange = (q: string) => {
    setSearchQuery(q)
    setSelectedSchool(null)
  }

  const onSelectSchoolFromSearch = (school: SelectedSchool) => {
    setSearchQuery(schoolDisplayName(school))
    setSelectedSchool(school)
  }

  const onSuitabilityFilterChange = (
    rating: FacilitySuitabilityRating | null,
  ) => {
    setSuitabilityFilter(rating)
    setSelectedSchool((prev) => {
      if (!prev || !rating) return prev
      return prev.properties[facilitySuitabilityProperty] === rating
        ? prev
        : null
    })
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to map
      </a>
      <div className="visually-hidden" role="status" aria-live="polite">
        {statusMessage}
      </div>
      <DashboardLayout
        sidebar={
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSelectSchool={onSelectSchoolFromSearch}
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
              onSelectSchool={setSelectedSchool}
            />
          </>
        }
      />
    </>
  )
}

export default App
