import { useEffect, useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { SchoolMap } from './components/map/SchoolMap'
import type { SelectedSchool } from './components/map/SchoolPopup'
import { Sidebar } from './components/sidebar/Sidebar'
import { useSchoolDataset } from './hooks/useSchoolDataset'

function App() {
  const dataset = useSchoolDataset()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<SelectedSchool | null>(
    null,
  )

  const geojson =
    dataset.status === 'ready' ? dataset.data.geojson : null

  useEffect(() => {
    setSelectedSchool(null)
  }, [searchQuery])

  return (
    <DashboardLayout
      sidebar={
        <Sidebar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
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
            selectedSchool={selectedSchool}
            onSelectSchool={setSelectedSchool}
          />
        </>
      }
    />
  )
}

export default App
