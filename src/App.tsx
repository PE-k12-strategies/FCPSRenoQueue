import { useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { SchoolMap } from './components/map/SchoolMap'
import { Sidebar } from './components/sidebar/Sidebar'
import { useSchoolDataset } from './hooks/useSchoolDataset'

function App() {
  const dataset = useSchoolDataset()
  const [searchQuery, setSearchQuery] = useState('')

  const geojson =
    dataset.status === 'ready' ? dataset.data.geojson : null

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
          <SchoolMap data={geojson} searchQuery={searchQuery} />
        </>
      }
    />
  )
}

export default App
